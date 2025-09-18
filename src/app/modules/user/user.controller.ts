import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { UserService } from "./user.service";
import { generateToken } from "../../utils/jwt";

const createUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.createUser(req.body);

  const token = generateToken({
    userId: result._id,
    email: result.email,
    role: result.role,
  });

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "User created successfully",
    data: {
      user: {
        id: result._id,
        name: result.name,
        email: result.email,
        role: result.role,
        phone: result.phone,
        address: result.address,
      },
      token,
    },
  });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await UserService.loginUser(email, password);

  const token = generateToken({
    userId: result._id,
    email: result.email,
    role: result.role,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "User logged in successfully",
    data: {
      user: {
        id: result._id,
        name: result.name,
        email: result.email,
        role: result.role,
        phone: result.phone,
        address: result.address,
      },
      token,
    },
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getAllUsers(req.query, req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Users retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getSingleUser(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "User retrieved successfully",
    data: result,
  });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.updateUser(req.params.id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "User updated successfully",
    data: result,
  });
});

const getProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getProfile(req.user._id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Profile retrieved successfully",
    data: result,
  });
});

export const UserController = {
  createUser,
  loginUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  getProfile,
};
