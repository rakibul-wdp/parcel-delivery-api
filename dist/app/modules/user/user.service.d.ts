import { IGenericResponse } from "../../interfaces/common";
import { IUser } from "./user.interface";
export declare const UserService: {
    createUser: (payload: IUser) => Promise<IUser>;
    loginUser: (email: string, password: string) => Promise<IUser>;
    getAllUsers: (filters: any, paginationOptions: any) => Promise<IGenericResponse<IUser[]>>;
    getSingleUser: (id: string) => Promise<IUser | null>;
    updateUser: (id: string, payload: Partial<IUser>) => Promise<IUser | null>;
    getProfile: (userId: string) => Promise<IUser | null>;
};
//# sourceMappingURL=user.service.d.ts.map