import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { authenticate, authorize } from "../../middlewares/auth";
import { ParcelController } from "./parcel.controller";
import {
  createParcelValidation,
  updateParcelStatusValidation,
  parcelFilterValidation,
} from "./parcel.validation";
import { ParcelStatus } from "./parcel.interface";
import { UserRole } from "../user/user.interface";

const router = Router();

// Public route for tracking
router.get("/track/:trackingId", ParcelController.getParcelByTrackingId);

// Sender routes
router.post(
  "/",
  authenticate,
  authorize(UserRole.SENDER),
  validateRequest(createParcelValidation),
  ParcelController.createParcel
);

router.get(
  "/my-parcels",
  authenticate,
  authorize(UserRole.SENDER),
  validateRequest(parcelFilterValidation),
  ParcelController.getParcelsBySender
);

router.patch(
  "/:id/cancel",
  authenticate,
  authorize(UserRole.SENDER),
  ParcelController.cancelParcel
);

// Receiver routes
router.get(
  "/incoming",
  authenticate,
  authorize(UserRole.RECEIVER),
  validateRequest(parcelFilterValidation),
  ParcelController.getIncomingParcels
);

router.patch(
  "/:id/deliver",
  authenticate,
  authorize(UserRole.RECEIVER),
  ParcelController.confirmDelivery
);

// Admin routes
router.get(
  "/",
  authenticate,
  authorize(UserRole.ADMIN),
  validateRequest(parcelFilterValidation),
  ParcelController.getAllParcels
);

router.get("/:id", authenticate, ParcelController.getSingleParcel);

router.patch(
  "/:id/status",
  authenticate,
  authorize(UserRole.ADMIN),
  validateRequest(updateParcelStatusValidation),
  ParcelController.updateParcelStatus
);

export const ParcelRoutes = router;
