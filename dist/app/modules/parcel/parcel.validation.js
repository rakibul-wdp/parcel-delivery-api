"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parcelFilterValidation = exports.updateParcelStatusValidation = exports.createParcelValidation = void 0;
const zod_1 = require("zod");
const parcel_interface_1 = require("./parcel.interface");
exports.createParcelValidation = zod_1.z.object({
    body: zod_1.z.object({
        receiver: zod_1.z.object({
            name: zod_1.z.string().min(2).max(50),
            email: zod_1.z.string().email(),
            phone: zod_1.z.string().min(10).max(15),
            address: zod_1.z.string().min(5).max(200),
        }),
        type: zod_1.z.string().min(2).max(50),
        weight: zod_1.z.number().positive(),
        dimensions: zod_1.z.object({
            length: zod_1.z.number().positive(),
            width: zod_1.z.number().positive(),
            height: zod_1.z.number().positive(),
        }),
        estimatedDelivery: zod_1.z.string().datetime(),
        notes: zod_1.z.string().optional(),
    }),
});
exports.updateParcelStatusValidation = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.nativeEnum(parcel_interface_1.ParcelStatus),
        note: zod_1.z.string().optional(),
        location: zod_1.z.string().optional(),
    }),
});
exports.parcelFilterValidation = zod_1.z.object({
    query: zod_1.z.object({
        status: zod_1.z.nativeEnum(parcel_interface_1.ParcelStatus).optional(),
        startDate: zod_1.z.string().datetime().optional(),
        endDate: zod_1.z.string().datetime().optional(),
        search: zod_1.z.string().optional(),
        page: zod_1.z.string().optional(),
        limit: zod_1.z.string().optional(),
        sortBy: zod_1.z.string().optional(),
        sortOrder: zod_1.z.enum(["asc", "desc"]).optional(),
    }),
});
//# sourceMappingURL=parcel.validation.js.map