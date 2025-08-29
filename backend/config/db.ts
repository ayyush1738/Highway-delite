import pkg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pkg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
pool.on("error", (err) => console.error("PG pool error", err));

export const initDb = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ Connected to the PostgreSQL database.');

    const createTables = `
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255),
        dob DATE,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;
    await client.query(createTables);
    client.release();
    console.log('✅ Tables ensured.');
  } catch (err) {
    console.error("Error creating users table", err);
  }
};

export default pool;
