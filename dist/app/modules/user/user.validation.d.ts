import { z } from "zod";
import { UserRole } from "./user.interface";
export declare const createUserValidation: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodString;
        email: z.ZodString;
        password: z.ZodString;
        phone: z.ZodString;
        address: z.ZodString;
        role: z.ZodOptional<z.ZodNativeEnum<typeof UserRole>>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        email: string;
        password: string;
        phone: string;
        address: string;
        role?: UserRole | undefined;
    }, {
        name: string;
        email: string;
        password: string;
        phone: string;
        address: string;
        role?: UserRole | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        name: string;
        email: string;
        password: string;
        phone: string;
        address: string;
        role?: UserRole | undefined;
    };
}, {
    body: {
        name: string;
        email: string;
        password: string;
        phone: string;
        address: string;
        role?: UserRole | undefined;
    };
}>;
export declare const updateUserValidation: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        phone: z.ZodOptional<z.ZodString>;
        address: z.ZodOptional<z.ZodString>;
        isBlocked: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        name?: string | undefined;
        phone?: string | undefined;
        address?: string | undefined;
        isBlocked?: boolean | undefined;
    }, {
        name?: string | undefined;
        phone?: string | undefined;
        address?: string | undefined;
        isBlocked?: boolean | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        name?: string | undefined;
        phone?: string | undefined;
        address?: string | undefined;
        isBlocked?: boolean | undefined;
    };
}, {
    body: {
        name?: string | undefined;
        phone?: string | undefined;
        address?: string | undefined;
        isBlocked?: boolean | undefined;
    };
}>;
export declare const loginValidation: z.ZodObject<{
    body: z.ZodObject<{
        email: z.ZodString;
        password: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        email: string;
        password: string;
    }, {
        email: string;
        password: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        email: string;
        password: string;
    };
}, {
    body: {
        email: string;
        password: string;
    };
}>;
//# sourceMappingURL=user.validation.d.ts.map