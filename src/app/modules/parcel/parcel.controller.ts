import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { ParcelService } from "./parcel.service";
import { ParcelStatus } from "./parcel.interface";

const createParcel = catchAsync(async (req: Request, res: Response) => {
  const result = await ParcelService.createParcel(req.body, req.user._id);

  sendResponse({
    res,
    statusCode: httpStatus.CREATED,
    message: "Parcel created successfully",
    data: result,
  });
});

const getAllParcels = catchAsync(async (req: Request, res: Response) => {
  const result = await ParcelService.getAllParcels(req.query, req.query);

  sendResponse({
    res,
    statusCode: httpStatus.OK,
    message: "Parcels retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getParcelsBySender = catchAsync(async (req: Request, res: Response) => {
  const result = await ParcelService.getParcelsBySender(
    req.user._id,
    req.query,
    req.query
  );

  sendResponse({
    res,
    statusCode: httpStatus.OK,
    message: "Your parcels retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getIncomingParcels = catchAsync(async (req: Request, res: Response) => {
  const result = await ParcelService.getIncomingParcels(
    req.user.email,
    req.query,
    req.query
  );

  sendResponse({
    res,
    statusCode: httpStatus.OK,
    message: "Incoming parcels retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getSingleParcel = catchAsync(async (req: Request, res: Response) => {
  const result = await ParcelService.getSingleParcel(req.params.id);

  sendResponse({
    res,
    statusCode: httpStatus.OK,
    message: "Parcel retrieved successfully",
    data: result,
  });
});

const updateParcelStatus = catchAsync(async (req: Request, res: Response) => {
  const { status, note, location } = req.body;
  const result = await ParcelService.updateParcelStatus(
    req.params.id,
    status,
    note,
    location,
    req.user._id
  );

  sendResponse({
    res,
    statusCode: httpStatus.OK,
    message: "Parcel status updated successfully",
    data: result,
  });
});

const cancelParcel = catchAsync(async (req: Request, res: Response) => {
  const result = await ParcelService.cancelParcel(req.params.id, req.user._id);

  sendResponse({
    res,
    statusCode: httpStatus.OK,
    message: "Parcel cancelled successfully",
    data: result,
  });
});

const confirmDelivery = catchAsync(async (req: Request, res: Response) => {
  const result = await ParcelService.confirmDelivery(
    req.params.id,
    req.user.email
  );

  sendResponse({
    res,
    statusCode: httpStatus.OK,
    message: "Delivery confirmed successfully",
    data: result,
  });
});

const getParcelByTrackingId = catchAsync(
  async (req: Request, res: Response) => {
    const result = await ParcelService.getParcelByTrackingId(
      req.params.trackingId
    );

    sendResponse({
      res,
      statusCode: httpStatus.OK,
      message: "Parcel retrieved successfully",
      data: result,
    });
  }
);

export const ParcelController = {
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
