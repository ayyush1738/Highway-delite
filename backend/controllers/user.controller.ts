import { Request, Response } from "express";
import { findByEmail } from "../models/user.model";

export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user; 
    const dbUser = await findByEmail(user.email);
    if (!dbUser) return res.status(404).json({ error: "User not found" });

    return res.json({
      id: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
      dob: dbUser.dob,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch profile" });
  }
};
