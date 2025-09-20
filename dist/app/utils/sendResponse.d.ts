import { Response } from "express";
interface ISendResponse<T> {
    res: Response;
    data?: T;
    message: string;
    statusCode?: number;
    meta?: {
        page: number;
        limit: number;
        total: number;
    };
}
export declare const sendResponse: <T>({ res, data, message, statusCode, meta, }: ISendResponse<T>) => void;
export {};
//# sourceMappingURL=sendResponse.d.ts.map