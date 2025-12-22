const { Router } = require('express');
const { body } = require('express-validator');
const { authenticate } = require('../middleware/auth');
const validate = require('../middleware/validate');
const voteController = require('../controllers/vote.controller');

const router = Router();

// Vote on question or answer
router.post(
  '/',
  authenticate,
  [
    body('value').isIn([1, -1]).withMessage('Vote value must be 1 or -1'),
    body('questionId').optional().isString(),
    body('answerId').optional().isString(),
  ],
  validate,
  voteController.vote
);

// Get user's vote
router.get('/user', authenticate, voteController.getUserVote);

// Get vote statistics
router.get('/stats', voteController.getVoteStats);

module.exports = router;
