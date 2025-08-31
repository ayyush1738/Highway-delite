import { Router } from 'express';
import {
  requestSignupOtp,
  verifySignupOtp,
  requestSigninOtp,
  verifySigninOtp
} from "../controllers/auth.controller";
import rateLimit from "express-rate-limit";

const otpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: "Too many OTP requests from this IP, please try again later"
});

const router = Router();

router.post("/signup/send-otp", otpLimiter, requestSignupOtp);
router.post("/signup/verify-otp", otpLimiter, verifySignupOtp);

router.post("/signin/send-otp", otpLimiter, requestSigninOtp);        
router.post("/signin/verify-otp", otpLimiter, verifySigninOtp);


export default router;
