import app from "./index";
import dotenv from "dotenv";

dotenv.config();

// Local dev
if (process.env.VERCEL !== "1") {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// For Vercel
export default function handler(req: any, res: any) {
  return app(req, res);
}
