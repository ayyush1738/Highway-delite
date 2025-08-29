import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const initDb = async () => {
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
  } catch (err: unknown) {
    // Type assertion to handle unknown error
    if (err instanceof Error) {
      console.error('❌ Database initialization error:', err.stack);
    } else {
      console.error('❌ Database initialization error:', err);
    }
  }
};

initDb();

export default pool;
