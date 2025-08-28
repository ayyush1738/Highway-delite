import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes'

dotenv.config();

const app: Application = express();
const PORT : number = Number(process.env.port) || 8000;

app.use(express.json());

app.use("/auth", authRoutes);

app.get('/health', (_req: Request, res: Response) => {
  res.status(200)
    .json({
        message: 'Success',
        string: 'Finternet is future',
        timestamp: new Date().toISOString(),
    })
})

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});