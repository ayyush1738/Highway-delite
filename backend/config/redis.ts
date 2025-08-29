import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config();

const client = createClient({ url: process.env.REDIS_URL });
client.on("error", (err) => console.error("Redis error", err));

export const connectRedis = async () => {
  if (!client.isOpen) await client.connect();
  console.log("Redis connected");
};

export default client;
