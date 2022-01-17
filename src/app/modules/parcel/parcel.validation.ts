import { z } from "zod";
import { ParcelStatus } from "./parcel.interface";

export const createParcelValidation = z.object({
  body: z.object({
    receiver: z.object({
      name: z.string().min(2).max(50),
      email: z.string().email(),
      phone: z.string().min(10).max(15),
      address: z.string().min(5).max(200),
    }),
    type: z.string().min(2).max(50),
    weight: z.number().positive(),
    dimensions: z.object({
      length: z.number().positive(),
      width: z.number().positive(),
      height: z.number().positive(),
    }),
    estimatedDelivery: z.string().datetime(),
    notes: z.string().optional(),
  }),
});

export const updateParcelStatusValidation = z.object({
  body: z.object({
    status: z.nativeEnum(ParcelStatus),
    note: z.string().optional(),
    location: z.string().optional(),
  }),
});

export const parcelFilterValidation = z.object({
  query: z.object({
    status: z.nativeEnum(ParcelStatus).optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    search: z.string().optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
  }),
});
