"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.authenticate = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
const user_model_1 = require("../modules/user/user.model");
const authenticate = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "Authentication required");
        }
        const decoded = jsonwebtoken_1.default.verify(token, env_1.envVars.JWT_SECRET);
        const user = await user_model_1.User.findById(decoded.userId).select("-password");
        if (!user || user.isBlocked) {
            throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "User not found or blocked");
        }
        const userObject = user.toObject();
        req.user = {
            _id: userObject._id.toString(),
            email: userObject.email,
            role: userObject.role,
            isBlocked: userObject.isBlocked,
            name: userObject.name,
            phone: userObject.phone,
            address: userObject.address,
        };
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.authenticate = authenticate;
const authorize = (...requiredRoles) => {
    return (req, res, next) => {
        if (!req.user || !requiredRoles.includes(req.user.role)) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, `Access denied. Required roles: ${requiredRoles.join(", ")}`);
        }
        next();
    };
};
exports.authorize = authorize;
//# sourceMappingURL=auth.js.map