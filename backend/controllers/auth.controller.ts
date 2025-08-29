import { Request, Response } from "express";
import {
  generateOtp,
  saveOtp,
  getStoredOtp,
  canResend,
  clearOtp,
} from "../services/otpService";
import { sendOtpEmail } from "../utils/emailService.js";
import { findByEmail, createUser } from "../models/user.model.js";
import { generateToken } from "../services/tokenService";


export const requestSignupOtp = async (req: Request, res: Response) => {
  try {
    const { email, name, dob } = req.body;
    if (!email || !name || !dob) return res.status(400).json({ error: "email, name, dob required" });
    const otp = generateOtp();
    await saveOtp(email, otp);
    await sendOtpEmail(email, otp);
    return res.json({ ok: true, message: "OTP sent to email" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to send OTP" });
  }
};

export const verifySignupOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp, name, dob } = req.body;
    if (!email || !otp || !name || !dob) return res.status(400).json({ error: "email, otp, name, dob required" });

    const stored = await getStoredOtp(email);
    if (!stored) return res.status(400).json({ error: "OTP expired or not requested" });
    if (stored !== otp) return res.status(400).json({ error: "Invalid OTP" });

    let user = await findByEmail(email);
    if (!user) {
      user = await createUser({ email, name, dob }); 
    }
    await clearOtp(email);

    const token = generateToken({ id: user.id, email: user.email });
    return res.json({ token, user: { id: user.id, email: user.email, name: user.name, dob: user.dob } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Verification failed" });
  }
};


export const requestSigninOtp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "email required" });

    // you may throttle/resend guard
    const allowed = await canResend(email);
    if (!allowed) return res.status(429).json({ error: "Please wait before resending OTP" });

    const otp = generateOtp();
    await saveOtp(email, otp);
    await sendOtpEmail(email, otp);
    return res.json({ ok: true, message: "OTP sent" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to send OTP" });
  }
};

export const verifySigninOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ error: "email and otp required" });

    const stored = await getStoredOtp(email);
    if (!stored) return res.status(400).json({ error: "OTP expired or not requested" });
    if (stored !== otp) return res.status(400).json({ error: "Invalid OTP" });

    // find or reject
    let user = await findByEmail(email);
    if (!user) return res.status(404).json({ error: "No user found. Please sign up first." });

    await clearOtp(email);
    const token = generateToken({ id: user.id, email: user.email });
    return res.json({ token, user: { id: user.id, email: user.email, name: user.name, dob: user.dob } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Verification failed" });
  }
};
