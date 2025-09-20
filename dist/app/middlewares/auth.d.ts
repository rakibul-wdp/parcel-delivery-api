import { NextFunction, Request, Response } from "express";
declare global {
    namespace Express {
        interface Request {
            user: {
                _id: string;
                email: string;
                role: string;
                isBlocked: boolean;
                name: string;
                phone: string;
                address: string;
                [key: string]: any;
            };
        }
    }
}
export declare const authenticate: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const authorize: (...requiredRoles: string[]) => (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.d.ts.map