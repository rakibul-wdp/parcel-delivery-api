"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const paginationHelpers_1 = require("../../utils/paginationHelpers");
const user_constant_1 = require("./user.constant");
const user_model_1 = require("./user.model");
const createUser = async (payload) => {
    const existingUser = await user_model_1.User.findOne({ email: payload.email });
    if (existingUser) {
        throw new AppError_1.default(http_status_codes_1.default.CONFLICT, "User already exists");
    }
    return await user_model_1.User.create(payload);
};
const loginUser = async (email, password) => {
    const user = await user_model_1.User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "Invalid credentials");
    }
    if (user.isBlocked) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "Your account has been blocked");
    }
    return user;
};
const getAllUsers = async (filters, paginationOptions) => {
    const { search, ...filterData } = filters;
    const andConditions = [];
    if (search) {
        andConditions.push({
            $or: user_constant_1.userSearchableFields.map((field) => ({
                [field]: { $regex: search, $options: "i" },
            })),
        });
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
    const whereConditions = andConditions.length ? { $and: andConditions } : {};
    const result = await user_model_1.User.find(whereConditions)
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const total = await user_model_1.User.countDocuments(whereConditions);
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
};
const getSingleUser = async (id) => {
    return await user_model_1.User.findById(id);
};
const updateUser = async (id, payload) => {
    return await user_model_1.User.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
};
const getProfile = async (userId) => {
    return await user_model_1.User.findById(userId);
};
exports.UserService = {
    createUser,
    loginUser,
    getAllUsers,
    getSingleUser,
    updateUser,
    getProfile,
};
//# sourceMappingURL=user.service.js.map