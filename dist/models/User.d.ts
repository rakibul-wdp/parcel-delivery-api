import mongoose, { Document } from "mongoose";
export interface IUserDocument extends Document {
    name: string;
    email: string;
    password: string;
    phone: string;
    address: string;
    role: "admin" | "sender" | "receiver";
    isBlocked: boolean;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}
export declare const User: mongoose.Model<IUserDocument, {}, {}, {}, mongoose.Document<unknown, {}, IUserDocument> & IUserDocument & {
    _id: mongoose.Types.ObjectId;
}, any>;
//# sourceMappingURL=User.d.ts.map