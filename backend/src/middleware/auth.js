const { Request, Response, NextFunction } = require('express');
const jwt = require('jsonwebtoken');
const { AppError } = require('./errorHandler');

export interface AuthRequest extends Request {
  userId?: string;
}

const authenticate = async (
  req,
  res,
  next
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new AppError('Authentication token is required', 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId };
    req.userId = decoded.userId;
    next();
  } catch (error) {
    next(new AppError('Invalid or expired token', 401));
  }
};
