import dotenv from 'dotenv'
dotenv.config()

import express, { type Request, type Response } from 'express';
import cors from 'cors'; 
import { CommentRoutes } from './routes/comments.routes.js';
import { AuthRoutes } from './routes/auth.routes.js';

const app = express();
const PORT = Number(process.env.PORT)
const FRONTEND_URL=process.env.CLIENT_URL
app.use(cors());
app.use(express.json()); 

app.get('/', (req: Request, res: Response) => {
  res.json({ message: "Hello from the backend!" });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    message: 'Server is healthy' 
  });
});

app.use('/api/comments', CommentRoutes)
app.use('/api/auth', AuthRoutes)

app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});