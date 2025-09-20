"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParcelController = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const parcel_service_1 = require("./parcel.service");
const createParcel = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await parcel_service_1.ParcelService.createParcel(req.body, req.user._id);
    (0, sendResponse_1.sendResponse)({
        res,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Parcel created successfully",
        data: result,
    });
});
const getAllParcels = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await parcel_service_1.ParcelService.getAllParcels(req.query, req.query);
    (0, sendResponse_1.sendResponse)({
        res,
        statusCode: http_status_codes_1.default.OK,
        message: "Parcels retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
});
const getParcelsBySender = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await parcel_service_1.ParcelService.getParcelsBySender(req.user._id, req.query, req.query);
    (0, sendResponse_1.sendResponse)({
        res,
        statusCode: http_status_codes_1.default.OK,
        message: "Your parcels retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
});
const getIncomingParcels = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await parcel_service_1.ParcelService.getIncomingParcels(req.user.email, req.query, req.query);
    (0, sendResponse_1.sendResponse)({
        res,
        statusCode: http_status_codes_1.default.OK,
        message: "Incoming parcels retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
});
const getSingleParcel = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await parcel_service_1.ParcelService.getSingleParcel(req.params.id);
    (0, sendResponse_1.sendResponse)({
        res,
        statusCode: http_status_codes_1.default.OK,
        message: "Parcel retrieved successfully",
        data: result,
    });
});
const updateParcelStatus = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { status, note, location } = req.body;
    const result = await parcel_service_1.ParcelService.updateParcelStatus(req.params.id, status, note, location, req.user._id);
    (0, sendResponse_1.sendResponse)({
        res,
        statusCode: http_status_codes_1.default.OK,
        message: "Parcel status updated successfully",
        data: result,
    });
});
const cancelParcel = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await parcel_service_1.ParcelService.cancelParcel(req.params.id, req.user._id);
    (0, sendResponse_1.sendResponse)({
        res,
        statusCode: http_status_codes_1.default.OK,
        message: "Parcel cancelled successfully",
        data: result,
    });
});
const confirmDelivery = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await parcel_service_1.ParcelService.confirmDelivery(req.params.id, req.user.email);
    (0, sendResponse_1.sendResponse)({
        res,
        statusCode: http_status_codes_1.default.OK,
        message: "Delivery confirmed successfully",
        data: result,
    });
});
const getParcelByTrackingId = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await parcel_service_1.ParcelService.getParcelByTrackingId(req.params.trackingId);
    (0, sendResponse_1.sendResponse)({
        res,
        statusCode: http_status_codes_1.default.OK,
        message: "Parcel retrieved successfully",
        data: result,
    });
});
exports.ParcelController = {
    createParcel,
    getAllParcels,
    getParcelsBySender,
    getIncomingParcels,
    getSingleParcel,
    updateParcelStatus,
    cancelParcel,
    confirmDelivery,
    getParcelByTrackingId,
};
//# sourceMappingURL=parcel.controller.js.map