import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import jwt, { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";
import { User } from "../modules/user/user.model";

declare global {
  namespace Express {
    interface Request {
      user: {
        _id: string;
        email: string;
        role: string;
        isBlocked: boolean;
        name: string;
        phone: string;
        address: string;
        [key: string]: any;
      };
    }
  }
}

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

    const userObject = user.toObject();

    req.user = {
      _id: userObject._id.toString(),
      email: userObject.email,
      role: userObject.role,
      isBlocked: userObject.isBlocked,
      name: userObject.name,
      phone: userObject.phone,
      address: userObject.address,
    };

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
