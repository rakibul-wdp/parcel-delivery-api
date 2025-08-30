"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Parcel_1 = require("../models/Parcel");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const zod_1 = require("zod");
const router = express_1.default.Router();
const createParcelSchema = zod_1.z.object({
    body: zod_1.z.object({
        receiver: zod_1.z.object({
            name: zod_1.z.string().min(2),
            email: zod_1.z.string().email(),
            phone: zod_1.z.string().min(10),
            address: zod_1.z.string().min(5),
        }),
        type: zod_1.z.string().min(2),
        weight: zod_1.z.number().positive(),
        dimensions: zod_1.z.object({
            length: zod_1.z.number().positive(),
            width: zod_1.z.number().positive(),
            height: zod_1.z.number().positive(),
        }),
        estimatedDelivery: zod_1.z.string().datetime(),
        notes: zod_1.z.string().optional(),
    }),
});
const updateStatusSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum([
            "approved",
            "picked",
            "in_transit",
            "delivered",
            "cancelled",
        ]),
        note: zod_1.z.string().optional(),
        location: zod_1.z.string().optional(),
    }),
});
// Create parcel (Sender only)
router.post("/", auth_1.authenticate, (0, auth_1.authorize)("sender"), (0, validation_1.validate)(createParcelSchema), async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
    }
    try {
        const { receiver, type, weight, dimensions, estimatedDelivery, notes } = req.body;
        // Calculate fee based on weight and dimensions
        const baseFee = 50;
        const weightFee = weight * 10;
        const volume = dimensions.length * dimensions.width * dimensions.height;
        const volumeFee = volume * 0.01;
        const totalFee = baseFee + weightFee + volumeFee;
        const parcel = new Parcel_1.Parcel({
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
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
// Get all parcels for sender
router.get("/my-parcels", auth_1.authenticate, (0, auth_1.authorize)("sender"), async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
    }
    try {
        const parcels = await Parcel_1.Parcel.find({ sender: req.user._id })
            .populate("sender", "name email phone")
            .sort({ createdAt: -1 });
        res.json(parcels);
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
// Get incoming parcels for receiver
router.get("/incoming", auth_1.authenticate, (0, auth_1.authorize)("receiver"), async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
    }
    try {
        const parcels = await Parcel_1.Parcel.find({
            "receiver.email": req.user.email,
            status: { $ne: "delivered" },
        })
            .populate("sender", "name email phone")
            .sort({ createdAt: -1 });
        res.json(parcels);
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
// Get parcel by ID
router.get("/:id", auth_1.authenticate, async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
    }
    try {
        const parcel = await Parcel_1.Parcel.findById(req.params.id)
            .populate("sender", "name email phone address")
            .populate("statusLog.updatedBy", "name role");
        if (!parcel) {
            return res.status(404).json({ message: "Parcel not found" });
        }
        // Check authorization
        if (req.user.role === "sender" &&
            parcel.sender._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Access denied" });
        }
        if (req.user.role === "receiver" &&
            parcel.receiver.email !== req.user.email) {
            return res.status(403).json({ message: "Access denied" });
        }
        res.json(parcel);
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
// Cancel parcel (Sender only)
router.patch("/:id/cancel", auth_1.authenticate, (0, auth_1.authorize)("sender"), async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
    }
    try {
        const parcel = await Parcel_1.Parcel.findById(req.params.id);
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
            timestamp: new Date(),
            updatedBy: req.user._id,
            note: "Parcel cancelled by sender",
        });
        await parcel.save();
        res.json(parcel);
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
// Confirm delivery (Receiver only)
router.patch("/:id/deliver", auth_1.authenticate, (0, auth_1.authorize)("receiver"), async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
    }
    try {
        const parcel = await Parcel_1.Parcel.findById(req.params.id);
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
            timestamp: new Date(),
            updatedBy: req.user._id,
            note: "Parcel delivered and confirmed by receiver",
        });
        await parcel.save();
        res.json(parcel);
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
// Update parcel status (Admin only)
router.patch("/:id/status", auth_1.authenticate, (0, auth_1.authorize)("admin"), (0, validation_1.validate)(updateStatusSchema), async (req, res) => {
    try {
        const { status, note, location } = req.body;
        const parcel = await Parcel_1.Parcel.findById(req.params.id);
        if (!parcel) {
            return res.status(404).json({ message: "Parcel not found" });
        }
        parcel.status = status;
        parcel.statusLog.push({
            status,
            timestamp: new Date(),
            updatedBy: req.user._id,
            note,
            location,
        });
        await parcel.save();
        res.json(parcel);
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
// Get all parcels (Admin only)
router.get("/", auth_1.authenticate, (0, auth_1.authorize)("admin"), async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        const filter = {};
        if (status)
            filter.status = status;
        const parcels = await Parcel_1.Parcel.find(filter)
            .populate("sender", "name email phone")
            .sort({ createdAt: -1 })
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit));
        const total = await Parcel_1.Parcel.countDocuments(filter);
        res.json({
            parcels,
            totalPages: Math.ceil(total / Number(limit)),
            currentPage: Number(page),
            total,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
exports.default = router;
//# sourceMappingURL=parcels.js.map