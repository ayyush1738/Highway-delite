import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes'
import noteRoutes from './routes/notes.routes'
import userRoutes from "./routes/user.routes";
import helmet from "helmet";

import cors from 'cors'

dotenv.config();

const app: Application = express();

app.use(cors({
  origin: ["https://notesappq4.vercel.app", "http://localhost:5173"],
  credentials: true
}));


app.use(express.json());
app.use(helmet());


app.get('/health', (_req: Request, res: Response) => {
  res.status(200)
    .json({
        message: 'Success',
        string: 'Finternet is future',
        timestamp: new Date().toISOString(),
    })
})

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/users", userRoutes);

export default app;