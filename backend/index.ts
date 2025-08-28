import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser'
import authRoutes from './routes/auth.routes'

dotenv.config();

const app: Application = express();
const PORT : number = Number(process.env.port) || 8000;

app.use(express.json());
app.use(bodyParser());

app.get('/health', (_req: Request, res: Response) => {
  res.status(200)
    .json({
        message: 'Success',
        string: 'Finternet is future',
        timestamp: new Date().toISOString(),
    })
})

app.use("api/auth", authRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});