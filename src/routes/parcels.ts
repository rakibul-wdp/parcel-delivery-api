import express from "express";
import { Parcel } from "../models/Parcel";
import { authenticate, authorize } from "../middleware/auth";
import { validate } from "../middleware/validation";
import { z } from "zod";

const router = express.Router();

const createParcelSchema = z.object({
  body: z.object({
    receiver: z.object({
      name: z.string().min(2),
      email: z.string().email(),
      phone: z.string().min(10),
      address: z.string().min(5),
    }),
    type: z.string().min(2),
    weight: z.number().positive(),
    dimensions: z.object({
      length: z.number().positive(),
      width: z.number().positive(),
      height: z.number().positive(),
    }),
    estimatedDelivery: z.string().datetime(),
    notes: z.string().optional(),
  }),
});

const updateStatusSchema = z.object({
  body: z.object({
    status: z.enum([
      "approved",
      "picked",
      "in_transit",
      "delivered",
      "cancelled",
    ]),
    note: z.string().optional(),
    location: z.string().optional(),
  }),
});

// Create parcel (Sender only)
router.post(
  "/",
  authenticate,
  authorize("sender"),
  validate(createParcelSchema),
  async (req, res) => {
    try {
      const { receiver, type, weight, dimensions, estimatedDelivery, notes } =
        req.body;

      // Calculate fee based on weight and dimensions
      const baseFee = 50;
      const weightFee = weight * 10;
      const volume = dimensions.length * dimensions.width * dimensions.height;
      const volumeFee = volume * 0.01;
      const totalFee = baseFee + weightFee + volumeFee;

      const parcel = new Parcel({
        sender: req.user._id,
        receiver,
        type,
        weight,
        dimensions,
        fee: totalFee,
        estimatedDelivery: new Date(estimatedDelivery),
        notes,
        statusLog: [
          {
            status: "requested",
            updatedBy: req.user._id,
            note: "Parcel creation requested",
          },
        ],
      });

      await parcel.save();
      await parcel.populate("sender", "name email phone");

      res.status(201).json(parcel);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }
);

// Get all parcels for sender
router.get(
  "/my-parcels",
  authenticate,
  authorize("sender"),
  async (req, res) => {
    try {
      const parcels = await Parcel.find({ sender: req.user._id })
        .populate("sender", "name email phone")
        .sort({ createdAt: -1 });

      res.json(parcels);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }
);

// Get incoming parcels for receiver
router.get(
  "/incoming",
  authenticate,
  authorize("receiver"),
  async (req, res) => {
    try {
      const parcels = await Parcel.find({
        "receiver.email": req.user.email,
        status: { $ne: "delivered" },
      })
        .populate("sender", "name email phone")
        .sort({ createdAt: -1 });

      res.json(parcels);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }
);

// Get parcel by ID
router.get("/:id", authenticate, async (req, res) => {
  try {
    const parcel = await Parcel.findById(req.params.id)
      .populate("sender", "name email phone address")
      .populate("statusLog.updatedBy", "name role");

    if (!parcel) {
      return res.status(404).json({ message: "Parcel not found" });
    }

    // Check authorization
    if (
      req.user.role === "sender" &&
      parcel.sender._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (
      req.user.role === "receiver" &&
      parcel.receiver.email !== req.user.email
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(parcel);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Cancel parcel (Sender only)
router.patch(
  "/:id/cancel",
  authenticate,
  authorize("sender"),
  async (req, res) => {
    try {
      const parcel = await Parcel.findById(req.params.id);

      if (!parcel) {
        return res.status(404).json({ message: "Parcel not found" });
      }

      if (parcel.sender.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Access denied" });
      }

      if (parcel.status !== "requested") {
        return res
          .status(400)
          .json({ message: "Cannot cancel parcel after it has been approved" });
      }

      parcel.status = "cancelled";
      parcel.statusLog.push({
        status: "cancelled",
        updatedBy: req.user._id,
        note: "Parcel cancelled by sender",
      });

      await parcel.save();
      res.json(parcel);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }
);

// Confirm delivery (Receiver only)
router.patch(
  "/:id/deliver",
  authenticate,
  authorize("receiver"),
  async (req, res) => {
    try {
      const parcel = await Parcel.findById(req.params.id);

      if (!parcel) {
        return res.status(404).json({ message: "Parcel not found" });
      }

      if (parcel.receiver.email !== req.user.email) {
        return res.status(403).json({ message: "Access denied" });
      }

      if (parcel.status !== "in_transit") {
        return res
          .status(400)
          .json({ message: "Parcel must be in transit to be delivered" });
      }

      parcel.status = "delivered";
      parcel.actualDelivery = new Date();
      parcel.statusLog.push({
        status: "delivered",
        updatedBy: req.user._id,
        note: "Parcel delivered and confirmed by receiver",
      });

      await parcel.save();
      res.json(parcel);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }
);

// Update parcel status (Admin only)
router.patch(
  "/:id/status",
  authenticate,
  authorize("admin"),
  validate(updateStatusSchema),
  async (req, res) => {
    try {
      const { status, note, location } = req.body;
      const parcel = await Parcel.findById(req.params.id);

      if (!parcel) {
        return res.status(404).json({ message: "Parcel not found" });
      }

      parcel.status = status;
      parcel.statusLog.push({
        status,
        updatedBy: req.user._id,
        note,
        location,
      });

      await parcel.save();
      res.json(parcel);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }
);

// Get all parcels (Admin only)
router.get("/", authenticate, authorize("admin"), async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const filter: any = {};

    if (status) filter.status = status;

    const parcels = await Parcel.find(filter)
      .populate("sender", "name email phone")
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Parcel.countDocuments(filter);

    res.json({
      parcels,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;
