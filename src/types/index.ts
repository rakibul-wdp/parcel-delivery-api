import mongoose from "mongoose";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  role: "admin" | "sender" | "receiver";
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IParcel {
  _id: string;
  trackingId: string;
  sender: mongoose.Types.ObjectId;
  receiver: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  type: string;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  status:
    | "requested"
    | "approved"
    | "picked"
    | "in_transit"
    | "delivered"
    | "cancelled";
  statusLog: IStatusLog[];
  fee: number;
  estimatedDelivery: Date;
  actualDelivery?: Date;
  notes?: string;
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IStatusLog {
  status: string;
  timestamp: Date;
  updatedBy: mongoose.Types.ObjectId;
  note?: string;
  location?: string;
}

export interface JwtPayload {
  userId: string;
  role: string;
}
