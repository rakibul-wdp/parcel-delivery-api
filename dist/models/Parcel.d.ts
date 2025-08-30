import mongoose, { Document } from "mongoose";
export interface IStatusLog {
    status: string;
    timestamp: Date;
    updatedBy: mongoose.Types.ObjectId;
    note?: string;
    location?: string;
}
export interface IParcelDocument extends Document {
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
    status: "requested" | "approved" | "picked" | "in_transit" | "delivered" | "cancelled";
    statusLog: IStatusLog[];
    fee: number;
    estimatedDelivery: Date;
    actualDelivery?: Date;
    notes?: string;
    isBlocked: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Parcel: mongoose.Model<IParcelDocument, {}, {}, {}, mongoose.Document<unknown, {}, IParcelDocument> & IParcelDocument & {
    _id: mongoose.Types.ObjectId;
}, any>;
//# sourceMappingURL=Parcel.d.ts.map