"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidation = exports.updateUserValidation = exports.createUserValidation = void 0;
const zod_1 = require("zod");
const user_interface_1 = require("./user.interface");
exports.createUserValidation = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2).max(50),
        email: zod_1.z.string().email(),
        password: zod_1.z.string().min(6),
        phone: zod_1.z.string().min(10).max(15),
        address: zod_1.z.string().min(5).max(200),
        role: zod_1.z.nativeEnum(user_interface_1.UserRole).optional(),
    }),
});
exports.updateUserValidation = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2).max(50).optional(),
        phone: zod_1.z.string().min(10).max(15).optional(),
        address: zod_1.z.string().min(5).max(200).optional(),
        isBlocked: zod_1.z.boolean().optional(),
    }),
});
exports.loginValidation = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email(),
        password: zod_1.z.string().min(6),
    }),
});
//# sourceMappingURL=user.validation.js.map