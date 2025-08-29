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
  const k = keyResend(email);
  const v = await redisClient.get(k);
  return !v;
};

export const saveOtp = async (email: string, otp: string) => {
  await redisClient.setEx(keyOtp(email), OTP_TTL, otp);
  await redisClient.setEx(keyResend(email), OTP_RESEND_TTL, "1");
};

export const getStoredOtp = async (email: string) => {
  return await redisClient.get(keyOtp(email));
};

export const clearOtp = async (email: string) => {
  await redisClient.del(keyOtp(email));
  await redisClient.del(keyResend(email));
};
