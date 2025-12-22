const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

/**
 * Validation middleware to check express-validator results
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => ({
      field: err.path || err.param,
      message: err.msg,
    }));
    
    throw ApiError.unprocessableEntity('Validation failed', errorMessages);
  }
  
  next();
};

module.exports = validate;
