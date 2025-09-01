import crypto from "crypto";
import redisClient from "../config/redis";
import dotenv from "dotenv";

dotenv.config();

const OTP_TTL = Number(process.env.OTP_TTL_SECONDS ?? 300);
const OTP_RESEND_TTL = Number(process.env.OTP_RESEND_TTL ?? 60);

const keyOtp = (email: string) => `otp:${email.toLowerCase()}`;
const keyResend = (email: string) => `otp-resend:${email.toLowerCase()}`;

export const generateOtp = () => crypto.randomInt(100000, 999999).toString();

export const canResend = async (email: string) => {
  const v = await redisClient.get(keyResend(email));
  return !v; // if no value, resend allowed
};

export const saveOtp = async (email: string, otp: string) => {
  await redisClient.set(keyOtp(email), otp, { ex: OTP_TTL });
  await redisClient.set(keyResend(email), "1", { ex: OTP_RESEND_TTL });
};

export const getStoredOtp = async (email: string) => {
  return await redisClient.get(keyOtp(email));
};

export const clearOtp = async (email: string) => {
  await redisClient.del(keyOtp(email));
  await redisClient.del(keyResend(email));
};
