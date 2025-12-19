const { Request, Response, NextFunction } = require('express');

const errorHandler = (
  err,
  req,
  res,
  next
) => {
  console.error(err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success,
    error: {
      message,
      ...(process.env.NODE_ENV === 'development' && { stack.stack })
    }
  });
};

class AppError extends Error {
  statusCode;

  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}
