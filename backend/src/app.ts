import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config';
import router from './routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Security Middleware
app.use(helmet());

// Cross-Origin Resource Sharing
app.use(cors({ origin: config.corsOrigin }));

// HTTP Request Logger
if (config.nodeEnv !== 'test') {
  app.use(morgan(config.nodeEnv === 'development' ? 'dev' : 'combined'));
}

// Body Parsers
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// API Routes
app.use('/', router);

// Catch-all for undefined routes
app.all('*', (req, _res, next) => {
  const err = new Error(`Path ${req.originalUrl} not found on this server.`) as any;
  err.statusCode = 404;
  next(err);
});

// Global Error Handler
app.use(errorHandler);

// Server startup
if (config.nodeEnv !== 'test') {
  app.listen(config.port, () => {
    console.log(`🚀 Server running on port ${config.port} in ${config.nodeEnv} mode`);
  });
}

export default app;
