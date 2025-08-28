import { Request, Response } from 'express';
import { generateOtp, saveOtp, getStoredOtp, canResend, clearOtp } from "../services/otpService.js";
import { sendOtpEmail } from "../utils/emailService.js";
import { findByEmail, createUser } from "../models/userModel.js";
import { generateToken } from "../services/tokenService.js";
import passport from "../config/passport.js"; 

export const requestSignupOtp = async (req: Request, res: Response) => {
    try{
        const { email, name, dob } = req.body;
        if(!email || !name || !dob) return res.status(400).json({error: "*email, *name & *dob required"})
    }
}