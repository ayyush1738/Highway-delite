import jwt, { Secret, SignOptions } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const generateToken = (payload: object): string => {
  const secret = process.env.JWT_SECRET as Secret;

  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"]) ?? "7d",
  };

  return jwt.sign(payload, secret, options);
};
