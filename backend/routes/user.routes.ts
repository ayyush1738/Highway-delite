import { Router } from "express";
import { authenticateToken } from "../middlewares/auth.middleware";
import { getProfile } from "../controllers/user.controller";

const router = Router();

router.get("/me", authenticateToken, getProfile);

export default router;
