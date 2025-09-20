import { z } from "zod";
import { ParcelStatus } from "./parcel.interface";
export declare const createParcelValidation: z.ZodObject<{
    body: z.ZodObject<{
        receiver: z.ZodObject<{
            name: z.ZodString;
            email: z.ZodString;
            phone: z.ZodString;
            address: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            name: string;
            email: string;
            phone: string;
            address: string;
        }, {
            name: string;
            email: string;
            phone: string;
            address: string;
        }>;
        type: z.ZodString;
        weight: z.ZodNumber;
        dimensions: z.ZodObject<{
            length: z.ZodNumber;
            width: z.ZodNumber;
            height: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            length: number;
            width: number;
            height: number;
        }, {
            length: number;
            width: number;
            height: number;
        }>;
        estimatedDelivery: z.ZodString;
        notes: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        type: string;
        receiver: {
            name: string;
            email: string;
            phone: string;
            address: string;
        };
        weight: number;
        dimensions: {
            length: number;
            width: number;
            height: number;
        };
        estimatedDelivery: string;
        notes?: string | undefined;
    }, {
        type: string;
        receiver: {
            name: string;
            email: string;
            phone: string;
            address: string;
        };
        weight: number;
        dimensions: {
            length: number;
            width: number;
            height: number;
        };
        estimatedDelivery: string;
        notes?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        type: string;
        receiver: {
            name: string;
            email: string;
            phone: string;
            address: string;
        };
        weight: number;
        dimensions: {
            length: number;
            width: number;
            height: number;
        };
        estimatedDelivery: string;
        notes?: string | undefined;
    };
}, {
    body: {
        type: string;
        receiver: {
            name: string;
            email: string;
            phone: string;
            address: string;
        };
        weight: number;
        dimensions: {
            length: number;
            width: number;
            height: number;
        };
        estimatedDelivery: string;
        notes?: string | undefined;
    };
}>;
export declare const updateParcelStatusValidation: z.ZodObject<{
    body: z.ZodObject<{
        status: z.ZodNativeEnum<typeof ParcelStatus>;
        note: z.ZodOptional<z.ZodString>;
        location: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        status: ParcelStatus;
        note?: string | undefined;
        location?: string | undefined;
    }, {
        status: ParcelStatus;
        note?: string | undefined;
        location?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        status: ParcelStatus;
        note?: string | undefined;
        location?: string | undefined;
    };
}, {
    body: {
        status: ParcelStatus;
        note?: string | undefined;
        location?: string | undefined;
    };
}>;
export declare const parcelFilterValidation: z.ZodObject<{
    query: z.ZodObject<{
        status: z.ZodOptional<z.ZodNativeEnum<typeof ParcelStatus>>;
        startDate: z.ZodOptional<z.ZodString>;
        endDate: z.ZodOptional<z.ZodString>;
        search: z.ZodOptional<z.ZodString>;
        page: z.ZodOptional<z.ZodString>;
        limit: z.ZodOptional<z.ZodString>;
        sortBy: z.ZodOptional<z.ZodString>;
        sortOrder: z.ZodOptional<z.ZodEnum<["asc", "desc"]>>;
    }, "strip", z.ZodTypeAny, {
        status?: ParcelStatus | undefined;
        limit?: string | undefined;
        search?: string | undefined;
        page?: string | undefined;
        sortBy?: string | undefined;
        sortOrder?: "asc" | "desc" | undefined;
        startDate?: string | undefined;
        endDate?: string | undefined;
    }, {
        status?: ParcelStatus | undefined;
        limit?: string | undefined;
        search?: string | undefined;
        page?: string | undefined;
        sortBy?: string | undefined;
        sortOrder?: "asc" | "desc" | undefined;
        startDate?: string | undefined;
        endDate?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        status?: ParcelStatus | undefined;
        limit?: string | undefined;
        search?: string | undefined;
        page?: string | undefined;
        sortBy?: string | undefined;
        sortOrder?: "asc" | "desc" | undefined;
        startDate?: string | undefined;
        endDate?: string | undefined;
    };
}, {
    query: {
        status?: ParcelStatus | undefined;
        limit?: string | undefined;
        search?: string | undefined;
        page?: string | undefined;
        sortBy?: string | undefined;
        sortOrder?: "asc" | "desc" | undefined;
        startDate?: string | undefined;
        endDate?: string | undefined;
    };
}>;
//# sourceMappingURL=parcel.validation.d.ts.map