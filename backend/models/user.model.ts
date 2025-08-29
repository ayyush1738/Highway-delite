import pool from "../config/db";

export type UserRow = {
  id: string;
  email: string;
  name?: string | null;
  dob?: string | null;
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
}) : Promise<UserRow> => {
  const res = await pool.query(
    `INSERT INTO users(email, name, dob) VALUES($1,$2,$3) RETURNING *`,
    [payload.email.toLowerCase(), payload.name ?? null, payload.dob ?? null]
  );
  return res.rows[0];
};

