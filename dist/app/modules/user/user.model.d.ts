import { IUser, IUserMethods } from "./user.interface";
export declare const User: import("mongoose").Model<IUser, {}, IUserMethods, {}, import("mongoose").Document<unknown, {}, IUser, {}, {}> & Omit<IUser & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, "comparePassword"> & IUserMethods, any>;
//# sourceMappingURL=user.model.d.ts.map