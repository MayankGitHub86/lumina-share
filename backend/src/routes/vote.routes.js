const { Router } = require('express');
const { body } = require('express-validator');
const { authenticate } = require('../middleware/auth');
const voteController = require('../controllers/vote.controller');

const router = Router();

router.post(
  '/',
  authenticate,
  [
    body('value').isIn([1, -1]).withMessage('Vote value must be 1 or -1')
  ],
  voteController.vote
);

module.exports = router;
