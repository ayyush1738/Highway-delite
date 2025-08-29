import app from './index';
import { connectRedis } from "./config/redis";
import pool from "./config/db.js";
import dotenv from "dotenv";
dotenv.config();


const PORT : number = Number(process.env.port) || 8000;


const start = async () => {
  try {
    await connectRedis();
    await pool.query("SELECT 1");
    app.listen(Number(PORT), () => console.log(`Server listening on ${PORT}`));
  } catch (err) {
    console.error("Startup error", err);
    process.exit(1);
  }
};

start();