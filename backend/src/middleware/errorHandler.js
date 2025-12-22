const logger = require('../utils/logger');
const ApiError = require('../utils/ApiError');

/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  let error = err;

  // Handle Prisma errors
  if (err.code === 'P2002') {
    error = ApiError.conflict('A record with this value already exists');
  } else if (err.code === 'P2025') {
    error = ApiError.notFound('Record not found');
  } else if (err.code?.startsWith('P')) {
    error = ApiError.badRequest('Database operation failed');
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    error = ApiError.unprocessableEntity('Validation failed', errors);
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = ApiError.unauthorized('Invalid token');
  } else if (err.name === 'TokenExpiredError') {
    error = ApiError.unauthorized('Token expired');
  }

  // Default to 500 if not an ApiError
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  // Log error
  if (statusCode >= 500) {
    logger.error(message, {
      statusCode,
      stack: error.stack,
      url: req.originalUrl,
      method: req.method,
    });
  } else {
    logger.warn(message, {
      statusCode,
      url: req.originalUrl,
      method: req.method,
    });
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors: error.errors || [],
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  });
};

/**
 * 404 Not Found handler
 */
const notFoundHandler = (req, res, next) => {
  const error = ApiError.notFound(`Route ${req.originalUrl} not found`);
  next(error);
};

module.exports = {
  errorHandler,
  notFoundHandler,
  AppError: ApiError, // For backward compatibility
};
