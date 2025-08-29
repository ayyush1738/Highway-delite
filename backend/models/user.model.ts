import pool from "../config/db.js";

export type UserRow = {
  id: string;
  email: string;
  name?: string | null;
  dob?: string | null;
  google_id?: string | null;
  created_at: string;
};

export const findByEmail = async (email: string): Promise<UserRow | null> => {
  const res = await pool.query("SELECT * FROM users WHERE email = $1", [email.toLowerCase()]);
  return res.rows[0] ?? null;
};

export const createUser = async (payload: {
  email: string;
  name?: string | null;
  dob?: string | null;
  google_id?: string | null;
}) : Promise<UserRow> => {
  const res = await pool.query(
    `INSERT INTO users(email, name, dob, google_id) VALUES($1,$2,$3,$4) RETURNING *`,
    [payload.email.toLowerCase(), payload.name ?? null, payload.dob ?? null, payload.google_id ?? null]
  );
  return res.rows[0];
};

