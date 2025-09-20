import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";
export declare const validateRequest: (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=validateRequest.d.ts.map