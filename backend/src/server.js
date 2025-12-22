const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const config = require('./config');
const logger = require('./utils/logger');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const requestLogger = require('./middleware/requestLogger');

// Import routes
const authRoutes = require('./routes/auth.routes');
const oauthRoutes = require('./routes/oauth.routes');
const userRoutes = require('./routes/user.routes');
const questionRoutes = require('./routes/question.routes');
const answerRoutes = require('./routes/answer.routes');
const tagRoutes = require('./routes/tag.routes');
const notificationRoutes = require('./routes/notification.routes');
const voteRoutes = require('./routes/vote.routes');
const commentRoutes = require('./routes/comment.routes');
const settingsRoutes = require('./routes/settings.routes');
const searchRoutes = require('./routes/search.routes');
const collectionRoutes = require('./routes/collection.routes');

// Initialize Express app
const app = express();

// Trust proxy (for rate limiting, etc.)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable for development
  crossOriginEmbedderPolicy: false,
}));

// CORS configuration
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (config.allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Compression middleware
app.use(compression());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
if (config.nodeEnv === 'development') {
  app.use(requestLogger);
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'SolveHub API is running',
    environment: config.nodeEnv,
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/auth', oauthRoutes);
app.use('/api/users', userRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/answers', answerRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/votes', voteRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/collections', collectionRoutes);

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

// Unhandled rejection handler
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', { promise, reason });
});

// Uncaught exception handler
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', { error: error.message, stack: error.stack });
  process.exit(1);
});

// Start server (only if not in serverless environment)
let server;
if (process.env.VERCEL !== '1') {
  server = app.listen(config.port, () => {
    logger.success(`Server is running on http://localhost:${config.port}`);
    logger.info(`Environment: ${config.nodeEnv}`);
    logger.info(`Database: ${config.databaseUrl ? 'Connected' : 'Not configured'}`);
  });
}

module.exports = app;
