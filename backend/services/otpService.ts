import crypto from "crypto";
import redisClient from "../config/redis";
import dotenv from "dotenv";

dotenv.config();

// TTLs in seconds
const OTP_TTL = Number(process.env.OTP_TTL_SECONDS ?? 300);       // OTP expiry
const OTP_RESEND_TTL = Number(process.env.OTP_RESEND_TTL ?? 60); // Resend cooldown

const keyOtp = (email: string) => `otp:${email.toLowerCase()}`;
const keyResend = (email: string) => `otp-resend:${email.toLowerCase()}`;

// Generate a 6-digit OTP as string
export const generateOtp = (): string => crypto.randomInt(100000, 999999).toString();

// Check if user can resend OTP
export const canResend = async (email: string): Promise<boolean> => {
  const v = await redisClient.get(keyResend(email));
  return !v; // if no value, resend is allowed
};

// Save OTP and resend flag
export const saveOtp = async (email: string, otp: string): Promise<void> => {
  await redisClient.set(keyOtp(email), String(otp), { ex: OTP_TTL });       // store OTP
  await redisClient.set(keyResend(email), "1", { ex: OTP_RESEND_TTL });    // set resend lock
};

// Get OTP for verification
export const getStoredOtp = async (email: string): Promise<string | null> => {
  const stored = await redisClient.get(keyOtp(email));
  return stored ? String(stored) : null;  // always return string or null
};

// Clear OTP and resend lock
export const clearOtp = async (email: string): Promise<void> => {
  await redisClient.del(keyOtp(email));
  await redisClient.del(keyResend(email));
};
