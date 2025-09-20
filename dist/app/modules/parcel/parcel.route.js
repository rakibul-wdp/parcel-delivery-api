"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParcelRoutes = void 0;
const express_1 = require("express");
const validateRequest_1 = require("../../middlewares/validateRequest");
const auth_1 = require("../../middlewares/auth");
const parcel_controller_1 = require("./parcel.controller");
const parcel_validation_1 = require("./parcel.validation");
const user_interface_1 = require("../user/user.interface");
const router = (0, express_1.Router)();
// Public route for tracking
router.get("/track/:trackingId", parcel_controller_1.ParcelController.getParcelByTrackingId);
// Sender routes
router.post("/", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.SENDER), (0, validateRequest_1.validateRequest)(parcel_validation_1.createParcelValidation), parcel_controller_1.ParcelController.createParcel);
router.get("/my-parcels", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.SENDER), (0, validateRequest_1.validateRequest)(parcel_validation_1.parcelFilterValidation), parcel_controller_1.ParcelController.getParcelsBySender);
router.patch("/:id/cancel", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.SENDER), parcel_controller_1.ParcelController.cancelParcel);
// Receiver routes
router.get("/incoming", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.RECEIVER), (0, validateRequest_1.validateRequest)(parcel_validation_1.parcelFilterValidation), parcel_controller_1.ParcelController.getIncomingParcels);
router.patch("/:id/deliver", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.RECEIVER), parcel_controller_1.ParcelController.confirmDelivery);
// Admin routes
router.get("/", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.ADMIN), (0, validateRequest_1.validateRequest)(parcel_validation_1.parcelFilterValidation), parcel_controller_1.ParcelController.getAllParcels);
router.get("/:id", auth_1.authenticate, parcel_controller_1.ParcelController.getSingleParcel);
router.patch("/:id/status", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.ADMIN), (0, validateRequest_1.validateRequest)(parcel_validation_1.updateParcelStatusValidation), parcel_controller_1.ParcelController.updateParcelStatus);
exports.ParcelRoutes = router;
//# sourceMappingURL=parcel.route.js.map