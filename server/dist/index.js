import dotenv from 'dotenv';
dotenv.config();
import express, {} from 'express';
import cors from 'cors';
import { CommentRoutes } from './routes/comments.routes.js';
import { AuthRoutes } from './routes/auth.routes.js';
const app = express();
const PORT = Number(process.env.PORT) || 5000;
const FRONTEND_URL = process.env.CLIENT_URL;
app.use(cors({
    origin: FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.get('/', (req, res) => {
    res.json({ message: "Hello from the backend!" });
});
app.use('/api/comments', CommentRoutes);
app.use('/api/auth', AuthRoutes);
app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map