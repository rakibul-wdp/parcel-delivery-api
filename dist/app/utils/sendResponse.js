"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponse = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const sendResponse = ({ res, data, message, statusCode = http_status_codes_1.default.OK, meta, }) => {
    const response = {
        success: true,
        message,
    };
    if (data !== undefined) {
        response.data = data;
    }
    if (meta !== undefined) {
        response.meta = meta;
    }
    res.status(statusCode).json(response);
};
exports.sendResponse = sendResponse;
//# sourceMappingURL=sendResponse.js.map