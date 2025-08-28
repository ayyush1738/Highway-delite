import { Router } from 'express';
import {
  requestSignupOtp,
  verifySignupOtp,
  requestSigninOtp,
  verifySigninOtp
} from "../controllers/auth.controller.js";

const router = Router();

router.post("signup/send-otp", requestSignupOtp);
router.post("signup/verify-otp", verifySignupOtp);

router.post("/signin/send-otp", requestSigninOtp);        
router.post("/signin/send-otp", verifySigninOtp);


export default router;
