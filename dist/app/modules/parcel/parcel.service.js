"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParcelService = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const mongoose_1 = require("mongoose");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const paginationHelpers_1 = require("../../utils/paginationHelpers");
const parcel_constant_1 = require("./parcel.constant");
const parcel_interface_1 = require("./parcel.interface");
const parcel_model_1 = require("./parcel.model");
const calculateFee = (weight, volume) => {
    const baseFee = 50;
    const weightFee = weight * 10;
    const volumeFee = volume * 0.01;
    return baseFee + weightFee + volumeFee;
};
const createParcel = async (payload, userId) => {
    const { weight, dimensions } = payload;
    const volume = dimensions.length * dimensions.width * dimensions.height;
    const fee = calculateFee(weight, volume);
    const parcelData = {
        ...payload,
        sender: userId,
        fee,
        estimatedDelivery: new Date(payload.estimatedDelivery),
    };
    return await parcel_model_1.Parcel.create(parcelData);
};
const getAllParcels = async (filters, paginationOptions) => {
    const { search, status, startDate, endDate, ...filterData } = filters;
    const andConditions = [];
    if (search) {
        andConditions.push({
            $or: parcel_constant_1.parcelSearchableFields.map((field) => {
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
        const dateFilter = {};
        if (startDate)
            dateFilter.$gte = new Date(startDate);
        if (endDate)
            dateFilter.$lte = new Date(endDate);
        andConditions.push({ createdAt: dateFilter });
    }
    if (Object.keys(filterData).length) {
        const filterConditions = Object.entries(filterData).map(([field, value]) => {
            if (value === "true")
                return { [field]: true };
            if (value === "false")
                return { [field]: false };
            return { [field]: value };
        });
        andConditions.push(...filterConditions);
    }
    const { page, limit, skip, sortBy, sortOrder } = paginationHelpers_1.paginationHelpers.calculatePagination(paginationOptions);
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    else {
        sortConditions.createdAt = -1;
    }
    const whereConditions = andConditions.length ? { $and: andConditions } : {};
    const result = await parcel_model_1.Parcel.find(whereConditions)
        .populate("sender", "name email phone")
        .populate("statusLog.updatedBy", "name role")
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const total = await parcel_model_1.Parcel.countDocuments(whereConditions);
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
};
const getParcelsBySender = async (userId, filters, paginationOptions) => {
    const andConditions = [{ sender: new mongoose_1.Types.ObjectId(userId) }];
    const { search, status } = filters;
    if (search) {
        andConditions.push({
            $or: parcel_constant_1.parcelSearchableFields.map((field) => {
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
    const { page, limit, skip, sortBy, sortOrder } = paginationHelpers_1.paginationHelpers.calculatePagination(paginationOptions);
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    else {
        sortConditions.createdAt = -1;
    }
    const whereConditions = andConditions.length ? { $and: andConditions } : {};
    const result = await parcel_model_1.Parcel.find(whereConditions)
        .populate("sender", "name email phone")
        .populate("statusLog.updatedBy", "name role")
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const total = await parcel_model_1.Parcel.countDocuments(whereConditions);
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
};
const getIncomingParcels = async (email, filters, paginationOptions) => {
    const andConditions = [
        { "receiver.email": email },
        { status: { $ne: parcel_interface_1.ParcelStatus.DELIVERED } },
    ];
    const { search, status } = filters;
    if (search) {
        andConditions.push({
            $or: parcel_constant_1.parcelSearchableFields.map((field) => {
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
    const { page, limit, skip, sortBy, sortOrder } = paginationHelpers_1.paginationHelpers.calculatePagination(paginationOptions);
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    else {
        sortConditions.createdAt = -1;
    }
    const whereConditions = andConditions.length ? { $and: andConditions } : {};
    const result = await parcel_model_1.Parcel.find(whereConditions)
        .populate("sender", "name email phone")
        .populate("statusLog.updatedBy", "name role")
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const total = await parcel_model_1.Parcel.countDocuments(whereConditions);
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
};
const getSingleParcel = async (id) => {
    return await parcel_model_1.Parcel.findById(id)
        .populate("sender", "name email phone address")
        .populate("statusLog.updatedBy", "name role");
};
const updateParcelStatus = async (id, status, note, location, updatedBy) => {
    const parcel = await parcel_model_1.Parcel.findById(id);
    if (!parcel) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Parcel not found");
    }
    // Validate status transition
    const validTransitions = {
        [parcel_interface_1.ParcelStatus.REQUESTED]: [parcel_interface_1.ParcelStatus.APPROVED, parcel_interface_1.ParcelStatus.CANCELLED],
        [parcel_interface_1.ParcelStatus.APPROVED]: [parcel_interface_1.ParcelStatus.PICKED, parcel_interface_1.ParcelStatus.CANCELLED],
        [parcel_interface_1.ParcelStatus.PICKED]: [parcel_interface_1.ParcelStatus.IN_TRANSIT, parcel_interface_1.ParcelStatus.CANCELLED],
        [parcel_interface_1.ParcelStatus.IN_TRANSIT]: [parcel_interface_1.ParcelStatus.DELIVERED],
        [parcel_interface_1.ParcelStatus.DELIVERED]: [],
        [parcel_interface_1.ParcelStatus.CANCELLED]: [],
    };
    if (!validTransitions[parcel.status].includes(status)) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `Invalid status transition from ${parcel.status} to ${status}`);
    }
    const statusLogEntry = {
        status,
        timestamp: new Date(),
        updatedBy,
        note,
        location,
    };
    const updateData = {
        status,
        $push: { statusLog: statusLogEntry },
    };
    if (status === parcel_interface_1.ParcelStatus.DELIVERED) {
        updateData.actualDelivery = new Date();
    }
    return await parcel_model_1.Parcel.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
    })
        .populate("sender", "name email phone")
        .populate("statusLog.updatedBy", "name role");
};
const cancelParcel = async (id, userId) => {
    const parcel = await parcel_model_1.Parcel.findById(id);
    if (!parcel) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Parcel not found");
    }
    if (parcel.sender.toString() !== userId) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "Not authorized to cancel this parcel");
    }
    if (parcel.status !== parcel_interface_1.ParcelStatus.REQUESTED) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Can only cancel parcels with requested status");
    }
    const statusLogEntry = {
        status: parcel_interface_1.ParcelStatus.CANCELLED,
        timestamp: new Date(),
        updatedBy: userId,
        note: "Parcel cancelled by sender",
    };
    return await parcel_model_1.Parcel.findByIdAndUpdate(id, {
        status: parcel_interface_1.ParcelStatus.CANCELLED,
        $push: { statusLog: statusLogEntry },
    }, {
        new: true,
        runValidators: true,
    })
        .populate("sender", "name email phone")
        .populate("statusLog.updatedBy", "name role");
};
const confirmDelivery = async (id, email) => {
    const parcel = await parcel_model_1.Parcel.findById(id);
    if (!parcel) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Parcel not found");
    }
    if (parcel.receiver.email !== email) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "Not authorized to confirm delivery");
    }
    if (parcel.status !== parcel_interface_1.ParcelStatus.IN_TRANSIT) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Can only confirm delivery for parcels in transit");
    }
    const statusLogEntry = {
        status: parcel_interface_1.ParcelStatus.DELIVERED,
        timestamp: new Date(),
        updatedBy: parcel.receiver.email,
        note: "Delivery confirmed by receiver",
    };
    return await parcel_model_1.Parcel.findByIdAndUpdate(id, {
        status: parcel_interface_1.ParcelStatus.DELIVERED,
        actualDelivery: new Date(),
        $push: { statusLog: statusLogEntry },
    }, {
        new: true,
        runValidators: true,
    })
        .populate("sender", "name email phone")
        .populate("statusLog.updatedBy", "name role");
};
const getParcelByTrackingId = async (trackingId) => {
    return await parcel_model_1.Parcel.findOne({ trackingId })
        .populate("sender", "name email phone")
        .populate("statusLog.updatedBy", "name role");
};
exports.ParcelService = {
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
//# sourceMappingURL=parcel.service.js.map