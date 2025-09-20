import { Response } from "express";
import httpStatus from "http-status-codes";

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

export const sendResponse = <T>({
  res,
  data,
  message,
  statusCode = httpStatus.OK,
  meta,
}: ISendResponse<T>) => {
  const response: any = {
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
