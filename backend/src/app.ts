import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { config } from './config';
import router from './routes';
import authRouter from './routes/authRoutes';
import memberRouter from './modules/member/member.routes';
import bookRouter from './modules/book/book.routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Security Headers Setup
app.use(helmet());

// Cross-Origin Resource Sharing
app.use(cors({ origin: config.corsOrigin }));

// API Rate Limiting (Prevents brute force attacks)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.'
  }
});
app.use('/auth/login', apiLimiter);

// HTTP Logging Middleware
if (config.nodeEnv !== 'test') {
  app.use(morgan(config.nodeEnv === 'development' ? 'dev' : 'combined'));
}

// JSON Request Parsers (Limits size to prevent DOS payloads)
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Mount REST Routers
app.use('/auth', authRouter);
app.use('/members', memberRouter);
app.use('/books', bookRouter);
app.use('/', router);

// Catch-all for undefined route targets
app.all('*', (req, _res, next) => {
  const err = new Error(`Path ${req.originalUrl} not found on this server.`) as any;
  err.statusCode = 404;
  next(err);
});

// Centralized error middleware
app.use(errorHandler);

// Server bootup sequence
if (config.nodeEnv !== 'test') {
  app.listen(config.port, () => {
    console.log(`🚀 Server running on port ${config.port} in ${config.nodeEnv} mode`);
  });
}

export default app;
