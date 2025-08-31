import app from "./index";
import { connectRedis } from "./config/redis";
import dotenv from "dotenv";

dotenv.config();

let redisConnected = false;

async function initRedis() {
  if (!redisConnected) {
    await connectRedis();
    redisConnected = true;
  }
}

// For local dev
if (process.env.VERCEL !== "1") {
  const PORT = process.env.PORT || 8000;
  initRedis().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  });
}

// For Vercel
export default async function handler(req: any, res: any) {
  try {
    await initRedis();
    return app(req, res);
  } catch (err) {
    console.error("Handler error:", err);
    res.status(500).send("Internal Server Error");
  }
}
