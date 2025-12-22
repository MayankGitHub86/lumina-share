const jwt = require('jsonwebtoken');
const config = require('../config');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Authentication middleware
 * Verifies JWT token and attaches user ID to request
 */
const authenticate = asyncHandler(async (req, res, next) => {
  // Get token from header
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw ApiError.unauthorized('Authentication token is required');
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    throw ApiError.unauthorized('Authentication token is required');
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret);
    
    // Attach user ID to request
    req.userId = decoded.userId;
    req.user = decoded; // Attach full decoded token if needed
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw ApiError.unauthorized('Token has expired');
    }
    if (error.name === 'JsonWebTokenError') {
      throw ApiError.unauthorized('Invalid token');
    }
    throw ApiError.unauthorized('Authentication failed');
  }
});

/**
 * Optional authentication middleware
 * Attaches user ID if token is present, but doesn't require it
 */
const optionalAuth = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    
    try {
      const decoded = jwt.verify(token, config.jwtSecret);
      req.userId = decoded.userId;
      req.user = decoded;
    } catch (error) {
      // Silently fail for optional auth
    }
  }
  
  next();
});

module.exports = {
  authenticate,
  optionalAuth,
};
