import { IUserDocument } from "../models/User";

declare global {
  namespace Express {
    interface Request {
      user?: IUserDocument;
    }
  }
}
