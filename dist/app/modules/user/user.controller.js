"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const user_service_1 = require("./user.service");
const jwt_1 = require("../../utils/jwt");
const createUser = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await user_service_1.UserService.createUser(req.body);
    const token = (0, jwt_1.generateToken)({
        userId: result._id,
        email: result.email,
        role: result.role,
    });
    (0, sendResponse_1.sendResponse)({
        res,
        statusCode: http_status_codes_1.default.CREATED,
        message: "User created successfully",
        data: {
            user: {
                id: result._id,
                name: result.name,
                email: result.email,
                role: result.role,
                phone: result.phone,
                address: result.address,
            },
            token,
        },
    });
});
const loginUser = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { email, password } = req.body;
    const result = await user_service_1.UserService.loginUser(email, password);
    const token = (0, jwt_1.generateToken)({
        userId: result._id,
        email: result.email,
        role: result.role,
    });
    (0, sendResponse_1.sendResponse)({
        res,
        statusCode: http_status_codes_1.default.OK,
        message: "User logged in successfully",
        data: {
            user: {
                id: result._id,
                name: result.name,
                email: result.email,
                role: result.role,
                phone: result.phone,
                address: result.address,
            },
            token,
        },
    });
});
const getAllUsers = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await user_service_1.UserService.getAllUsers(req.query, req.query);
    (0, sendResponse_1.sendResponse)({
        res,
        statusCode: http_status_codes_1.default.OK,
        message: "Users retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
});
const getSingleUser = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await user_service_1.UserService.getSingleUser(req.params.id);
    (0, sendResponse_1.sendResponse)({
        res,
        statusCode: http_status_codes_1.default.OK,
        message: "User retrieved successfully",
        data: result,
    });
});
const updateUser = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await user_service_1.UserService.updateUser(req.params.id, req.body);
    (0, sendResponse_1.sendResponse)({
        res,
        statusCode: http_status_codes_1.default.OK,
        message: "User updated successfully",
        data: result,
    });
});
const getProfile = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await user_service_1.UserService.getProfile(req.user._id);
    (0, sendResponse_1.sendResponse)({
        res,
        statusCode: http_status_codes_1.default.OK,
        message: "Profile retrieved successfully",
        data: result,
    });
});
exports.UserController = {
    createUser,
    loginUser,
    getAllUsers,
    getSingleUser,
    updateUser,
    getProfile,
};
//# sourceMappingURL=user.controller.js.map