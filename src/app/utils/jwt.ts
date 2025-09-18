import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { envVars } from "../config/env";

export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, envVars.JWT_SECRET, {
    expiresIn: envVars.JWT_EXPIRES_IN,
  } as SignOptions);
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, envVars.JWT_SECRET) as JwtPayload;
};
