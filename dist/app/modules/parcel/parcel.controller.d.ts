import { NextFunction, Request, Response } from "express";
export declare const ParcelController: {
    createParcel: (req: Request, res: Response, next: NextFunction) => void;
    getAllParcels: (req: Request, res: Response, next: NextFunction) => void;
    getParcelsBySender: (req: Request, res: Response, next: NextFunction) => void;
    getIncomingParcels: (req: Request, res: Response, next: NextFunction) => void;
    getSingleParcel: (req: Request, res: Response, next: NextFunction) => void;
    updateParcelStatus: (req: Request, res: Response, next: NextFunction) => void;
    cancelParcel: (req: Request, res: Response, next: NextFunction) => void;
    confirmDelivery: (req: Request, res: Response, next: NextFunction) => void;
    getParcelByTrackingId: (req: Request, res: Response, next: NextFunction) => void;
};
//# sourceMappingURL=parcel.controller.d.ts.map