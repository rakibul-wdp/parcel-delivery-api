import httpStatus from "http-status-codes";
import { FilterQuery } from "mongoose";
import AppError from "../../errorHelpers/AppError";
import { paginationHelpers } from "../../utils/paginationHelpers";
import { IGenericResponse } from "../../interfaces/common";
import { Parcel } from "./parcel.model";
import { IParcel, ParcelStatus } from "./parcel.interface";
import { parcelSearchableFields } from "./parcel.constant";

const calculateFee = (weight: number, volume: number): number => {
  const baseFee = 50;
  const weightFee = weight * 10;
  const volumeFee = volume * 0.01;
  return baseFee + weightFee + volumeFee;
};

const createParcel = async (payload: any, userId: string): Promise<IParcel> => {
  const { weight, dimensions } = payload;
  const volume = dimensions.length * dimensions.width * dimensions.height;
  const fee = calculateFee(weight, volume);

  const parcelData = {
    ...payload,
    sender: userId,
    fee,
    estimatedDelivery: new Date(payload.estimatedDelivery),
  };

  return await Parcel.create(parcelData);
};

const getAllParcels = async (
  filters: any,
  paginationOptions: any
): Promise<IGenericResponse<IParcel[]>> => {
  const { search, status, startDate, endDate, ...filterData } = filters;
  const andConditions: FilterQuery<IParcel> = [];

  if (search) {
    andConditions.push({
      $or: parcelSearchableFields.map((field) => {
        if (field.startsWith("receiver.")) {
          const receiverField = field.split(".")[1];
          return {
            [`receiver.${receiverField}`]: { $regex: search, $options: "i" },
          };
        }
        return { [field]: { $regex: search, $options: "i" } };
      }),
    });
  }

  if (status) {
    andConditions.push({ status });
  }

  if (startDate || endDate) {
    const dateFilter: any = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);
    andConditions.push({ createdAt: dateFilter });
  }

  if (Object.keys(filterData).length) {
    andConditions.push({
      $and: Object.entries(filterData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const sortConditions: any = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  } else {
    sortConditions.createdAt = -1;
  }

  const whereConditions = andConditions.length ? { $and: andConditions } : {};

  const result = await Parcel.find(whereConditions)
    .populate("sender", "name email phone")
    .populate("statusLog.updatedBy", "name role")
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Parcel.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getParcelsBySender = async (
  userId: string,
  filters: any,
  paginationOptions: any
): Promise<IGenericResponse<IParcel[]>> => {
  const andConditions: FilterQuery<IParcel> = [{ sender: userId }];

  const { search, status } = filters;

  if (search) {
    andConditions.push({
      $or: parcelSearchableFields.map((field) => {
        if (field.startsWith("receiver.")) {
          const receiverField = field.split(".")[1];
          return {
            [`receiver.${receiverField}`]: { $regex: search, $options: "i" },
          };
        }
        return { [field]: { $regex: search, $options: "i" } };
      }),
    });
  }

  if (status) {
    andConditions.push({ status });
  }

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const sortConditions: any = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  } else {
    sortConditions.createdAt = -1;
  }

  const whereConditions = andConditions.length ? { $and: andConditions } : {};

  const result = await Parcel.find(whereConditions)
    .populate("sender", "name email phone")
    .populate("statusLog.updatedBy", "name role")
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Parcel.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getIncomingParcels = async (
  email: string,
  filters: any,
  paginationOptions: any
): Promise<IGenericResponse<IParcel[]>> => {
  const andConditions: FilterQuery<IParcel> = [
    { "receiver.email": email },
    { status: { $ne: ParcelStatus.DELIVERED } },
  ];

  const { search, status } = filters;

  if (search) {
    andConditions.push({
      $or: parcelSearchableFields.map((field) => {
        if (field.startsWith("receiver.")) {
          const receiverField = field.split(".")[1];
          return {
            [`receiver.${receiverField}`]: { $regex: search, $options: "i" },
          };
        }
        return { [field]: { $regex: search, $options: "i" } };
      }),
    });
  }

  if (status) {
    andConditions.push({ status });
  }

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const sortConditions: any = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  } else {
    sortConditions.createdAt = -1;
  }

  const whereConditions = andConditions.length ? { $and: andConditions } : {};

  const result = await Parcel.find(whereConditions)
    .populate("sender", "name email phone")
    .populate("statusLog.updatedBy", "name role")
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Parcel.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleParcel = async (id: string): Promise<IParcel | null> => {
  return await Parcel.findById(id)
    .populate("sender", "name email phone address")
    .populate("statusLog.updatedBy", "name role");
};

const updateParcelStatus = async (
  id: string,
  status: ParcelStatus,
  note: string | undefined,
  location: string | undefined,
  updatedBy: string
): Promise<IParcel | null> => {
  const parcel = await Parcel.findById(id);
  if (!parcel) {
    throw new AppError(httpStatus.NOT_FOUND, "Parcel not found");
  }

  // Validate status transition
  const validTransitions: Record<ParcelStatus, ParcelStatus[]> = {
    [ParcelStatus.REQUESTED]: [ParcelStatus.APPROVED, ParcelStatus.CANCELLED],
    [ParcelStatus.APPROVED]: [ParcelStatus.PICKED, ParcelStatus.CANCELLED],
    [ParcelStatus.PICKED]: [ParcelStatus.IN_TRANSIT, ParcelStatus.CANCELLED],
    [ParcelStatus.IN_TRANSIT]: [ParcelStatus.DELIVERED],
    [ParcelStatus.DELIVERED]: [],
    [ParcelStatus.CANCELLED]: [],
  };

  if (!validTransitions[parcel.status].includes(status)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Invalid status transition from ${parcel.status} to ${status}`
    );
  }

  const statusLogEntry = {
    status,
    timestamp: new Date(),
    updatedBy,
    note,
    location,
  };

  const updateData: any = {
    status,
    $push: { statusLog: statusLogEntry },
  };

  if (status === ParcelStatus.DELIVERED) {
    updateData.actualDelivery = new Date();
  }

  return await Parcel.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  })
    .populate("sender", "name email phone")
    .populate("statusLog.updatedBy", "name role");
};

const cancelParcel = async (
  id: string,
  userId: string
): Promise<IParcel | null> => {
  const parcel = await Parcel.findById(id);
  if (!parcel) {
    throw new AppError(httpStatus.NOT_FOUND, "Parcel not found");
  }

  if (parcel.sender.toString() !== userId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Not authorized to cancel this parcel"
    );
  }

  if (parcel.status !== ParcelStatus.REQUESTED) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Can only cancel parcels with requested status"
    );
  }

  const statusLogEntry = {
    status: ParcelStatus.CANCELLED,
    timestamp: new Date(),
    updatedBy: userId,
    note: "Parcel cancelled by sender",
  };

  return await Parcel.findByIdAndUpdate(
    id,
    {
      status: ParcelStatus.CANCELLED,
      $push: { statusLog: statusLogEntry },
    },
    {
      new: true,
      runValidators: true,
    }
  )
    .populate("sender", "name email phone")
    .populate("statusLog.updatedBy", "name role");
};

const confirmDelivery = async (
  id: string,
  email: string
): Promise<IParcel | null> => {
  const parcel = await Parcel.findById(id);
  if (!parcel) {
    throw new AppError(httpStatus.NOT_FOUND, "Parcel not found");
  }

  if (parcel.receiver.email !== email) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Not authorized to confirm delivery"
    );
  }

  if (parcel.status !== ParcelStatus.IN_TRANSIT) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Can only confirm delivery for parcels in transit"
    );
  }

  const statusLogEntry = {
    status: ParcelStatus.DELIVERED,
    timestamp: new Date(),
    updatedBy: parcel.receiver.email,
    note: "Delivery confirmed by receiver",
  };

  return await Parcel.findByIdAndUpdate(
    id,
    {
      status: ParcelStatus.DELIVERED,
      actualDelivery: new Date(),
      $push: { statusLog: statusLogEntry },
    },
    {
      new: true,
      runValidators: true,
    }
  )
    .populate("sender", "name email phone")
    .populate("statusLog.updatedBy", "name role");
};

const getParcelByTrackingId = async (
  trackingId: string
): Promise<IParcel | null> => {
  return await Parcel.findOne({ trackingId })
    .populate("sender", "name email phone")
    .populate("statusLog.updatedBy", "name role");
};

export const ParcelService = {
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
