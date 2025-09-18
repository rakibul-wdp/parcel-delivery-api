import { Types } from "mongoose";

export enum UserRole {
  ADMIN = "admin",
  SENDER = "sender",
  RECEIVER = "receiver",
}

export enum UserStatus {
  ACTIVE = "active",
  BLOCKED = "blocked",
  INACTIVE = "inactive",
}

export interface IUser {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  role: UserRole;
  isBlocked: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export type UserModel = import("mongoose").Model<IUser, {}, IUserMethods>;
