import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import jwt, { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";
import { User } from "../modules/user/user.model";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Authentication required");
    }

    const decoded = jwt.verify(token, envVars.JWT_SECRET) as JwtPayload;
    const user = await User.findById(decoded.userId).select("-password");

    if (!user || user.isBlocked) {
      throw new AppError(httpStatus.UNAUTHORIZED, "User not found or blocked");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export const authorize = (...requiredRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !requiredRoles.includes(req.user.role)) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        `Access denied. Required roles: ${requiredRoles.join(", ")}`
      );
    }
    next();
  };
};
