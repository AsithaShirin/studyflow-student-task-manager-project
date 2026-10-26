import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { env } from './config/env.js';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import { errorHandler, notFound } from './middleware/errors.js';

export const app = express();
const allowedOrigins = new Set([
  env.CLIENT_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
]);

app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json({ limit: '20kb' }));
app.use(cookieParser());
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: 'draft-8', legacyHeaders: false });
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/tasks', taskRoutes);
app.use(notFound);
app.use(errorHandler);
