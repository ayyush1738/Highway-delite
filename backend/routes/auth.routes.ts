import { Router } from 'express';
import {
  requestSignupOtp,
  verifySignupOtp,
  requestSigninOtp,
  verifySigninOtp
} from "../controllers/authController.js";
const router = Router();

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyAndLogin);

export default router;
