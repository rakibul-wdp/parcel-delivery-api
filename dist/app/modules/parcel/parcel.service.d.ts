import { IGenericResponse } from "../../interfaces/common";
import { IParcel, ParcelStatus } from "./parcel.interface";
export declare const ParcelService: {
    createParcel: (payload: any, userId: string) => Promise<IParcel>;
    getAllParcels: (filters: any, paginationOptions: any) => Promise<IGenericResponse<IParcel[]>>;
    getParcelsBySender: (userId: string, filters: any, paginationOptions: any) => Promise<IGenericResponse<IParcel[]>>;
    getIncomingParcels: (email: string, filters: any, paginationOptions: any) => Promise<IGenericResponse<IParcel[]>>;
    getSingleParcel: (id: string) => Promise<IParcel | null>;
    updateParcelStatus: (id: string, status: ParcelStatus, note: string | undefined, location: string | undefined, updatedBy: string) => Promise<IParcel | null>;
    cancelParcel: (id: string, userId: string) => Promise<IParcel | null>;
    confirmDelivery: (id: string, email: string) => Promise<IParcel | null>;
    getParcelByTrackingId: (trackingId: string) => Promise<IParcel | null>;
};
//# sourceMappingURL=parcel.service.d.ts.map