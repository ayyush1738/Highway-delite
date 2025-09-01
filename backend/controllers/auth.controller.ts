import { Request, Response } from "express";
import {
  generateOtp,
  saveOtp,
  getStoredOtp,
  canResend,
  clearOtp,
} from "../services/otpService";
import { sendOtpEmail } from "../utils/emailService";
import { findByEmail, createUser } from "../models/user.model";
import { generateToken } from "../services/tokenService";

/**
 * Request OTP for signup
 */
export const requestSignupOtp = async (req: Request, res: Response) => {
  try {
    const { email, name, dob } = req.body;
    if (!email || !name || !dob) 
      return res.status(400).json({ error: "email, name, dob required" });

    const otp = generateOtp();
    await saveOtp(email, otp);
    await sendOtpEmail(email, otp);

    return res.json({ ok: true, message: "OTP sent to email" });
  } catch (err) {
    console.error("requestSignupOtp error:", err);
    return res.status(500).json({ error: "Failed to send OTP" });
  }
};

/**
 * Verify OTP for signup
 */
export const verifySignupOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp, name, dob } = req.body;
    if (!email || !otp || !name || !dob) 
      return res.status(400).json({ error: "email, otp, name, dob required" });

    const stored = await getStoredOtp(email);
    console.log("Stored OTP:", stored, "Incoming OTP:", otp);

    if (!stored) return res.status(400).json({ error: "OTP expired or not requested" });
    if (String(stored) !== String(otp)) return res.status(400).json({ error: "Invalid OTP" });

    // Find or create user
    let user = await findByEmail(email);
    if (!user) {
      user = await createUser({ email, name, dob });
    }

    await clearOtp(email); // Clear OTP after successful verification

    const token = generateToken({ id: user.id, email: user.email });
    return res.json({ token, user: { id: user.id, email: user.email, name: user.name, dob: user.dob } });
  } catch (err) {
    console.error("verifySignupOtp error:", err);
    return res.status(500).json({ error: "Verification failed" });
  }
};

/**
 * Request OTP for signin
 */
export const requestSigninOtp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "email required" });

    const allowed = await canResend(email);
    if (!allowed) return res.status(429).json({ error: "Please wait before resending OTP" });

    const otp = generateOtp();
    await saveOtp(email, otp);
    await sendOtpEmail(email, otp);

    return res.json({ ok: true, message: "OTP sent" });
  } catch (err) {
    console.error("requestSigninOtp error:", err);
    return res.status(500).json({ error: "Failed to send OTP" });
  }
};

/**
 * Verify OTP for signin
 */
export const verifySigninOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ error: "email and otp required" });

    const stored = await getStoredOtp(email);
    console.log("Stored OTP:", stored, "Incoming OTP:", otp);

    if (!stored) return res.status(400).json({ error: "OTP expired or not requested" });
    if (String(stored) !== String(otp)) return res.status(400).json({ error: "Invalid OTP" });

    const user = await findByEmail(email);
    if (!user) return res.status(404).json({ error: "No user found. Please sign up first." });

    await clearOtp(email); // Clear OTP after verification

    const token = generateToken({ id: user.id, email: user.email });
    return res.json({ token, user: { id: user.id, email: user.email, name: user.name, dob: user.dob } });
  } catch (err) {
    console.error("verifySigninOtp error:", err);
    return res.status(500).json({ error: "Verification failed" });
  }
};
