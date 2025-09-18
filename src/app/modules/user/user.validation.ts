import { z } from "zod";
import { UserRole } from "./user.interface";

export const createUserValidation = z.object({
  body: z.object({
    name: z.string().min(2).max(50),
    email: z.string().email(),
    password: z.string().min(6),
    phone: z.string().min(10).max(15),
    address: z.string().min(5).max(200),
    role: z.nativeEnum(UserRole).optional(),
  }),
});

export const updateUserValidation = z.object({
  body: z.object({
    name: z.string().min(2).max(50).optional(),
    phone: z.string().min(10).max(15).optional(),
    address: z.string().min(5).max(200).optional(),
    isBlocked: z.boolean().optional(),
  }),
});

export const loginValidation = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
  }),
});
