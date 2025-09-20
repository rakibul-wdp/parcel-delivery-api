import { Types } from "mongoose";
export declare enum ParcelStatus {
    REQUESTED = "requested",
    APPROVED = "approved",
    PICKED = "picked",
    IN_TRANSIT = "in_transit",
    DELIVERED = "delivered",
    CANCELLED = "cancelled"
}
export interface IStatusLog {
    status: ParcelStatus;
    timestamp: Date;
    updatedBy: Types.ObjectId;
    note?: string;
    location?: string;
}
export interface IParcel {
    _id?: Types.ObjectId;
    trackingId: string;
    sender: Types.ObjectId;
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
    status: ParcelStatus;
    statusLog: IStatusLog[];
    fee: number;
    estimatedDelivery: Date;
    actualDelivery?: Date;
    notes?: string;
    isBlocked: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
//# sourceMappingURL=parcel.interface.d.ts.map