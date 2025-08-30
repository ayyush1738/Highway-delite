import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser'
import authRoutes from './routes/auth.routes'
import noteRoutes from './routes/notes.routes'
import cors from 'cors'

dotenv.config();

const app: Application = express();

app.use(cors({ origin: "*", credentials: true }));


app.use(express.json());
app.use(bodyParser.json());

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

export default app;