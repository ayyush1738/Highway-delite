# Notes App

This is the **frontend** of a Notes App built with **React**, **TypeScript**, **Vite**, and **Tailwind CSS**.  
It provides user authentication via OTP (Sign Up / Sign In) and a dashboard for creating, viewing, and deleting notes.

---

## Features

- Sign Up with OTP verification
- Sign In with OTP verification
- Option to **“Keep me logged in”**
- Create, view, and delete notes
- Protected dashboard route
- Responsive UI using Tailwind CSS

---

## Frontend Routes

| Path           | Component   | Description                      |
|----------------|------------|----------------------------------|
| `/`            | `Home`     | Landing page with Sign In / Up   |
| `/dashboard`   | `Dashboard`| Protected page to view/add notes |

---

## API Routes (Backend)

| Method | Endpoint                        | Description                            |
|--------|---------------------------------|----------------------------------------|
| POST   | `/api/auth/signup/send-otp`     | Send OTP to email for Sign Up          |
| POST   | `/api/auth/signup/verify-otp`   | Verify OTP and create new user         |
| POST   | `/api/auth/signin/send-otp`     | Send OTP to email for Sign In          |
| POST   | `/api/auth/signin/verify-otp`   | Verify OTP and login                   |
| GET    | `/api/users/me`                 | Get current user details               |
| GET    | `/api/notes`                    | Fetch all notes for the logged-in user |
| POST   | `/api/notes/create-notes`       | Create a new note                      |
| POST   | `/api/notes/delete-notes`       | Delete a note by ID                    |

---

## Database Tables

```sql
-- Required extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    dob DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notes Table
CREATE TABLE IF NOT EXISTS notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
