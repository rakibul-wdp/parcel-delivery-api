import { Response } from "express";

interface ISendResponse<T> {
  res: Response;
  data: T;
  message: string;
  statusCode: number;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
}

export const sendResponse = <T>({
  res,
  data,
  message,
  statusCode,
  meta,
}: ISendResponse<T>) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
    meta,
  });
};
