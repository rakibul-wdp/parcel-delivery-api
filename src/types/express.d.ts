import { Types } from "mongoose";

declare global {
  namespace Express {
    interface Request {
      user: {
        _id: string;
        email: string;
        role: string;
        isBlocked: boolean;
        [key: string]: any;
      };
    }
  }
}
