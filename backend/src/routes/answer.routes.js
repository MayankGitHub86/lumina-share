const { Router } = require('express');
const { body } = require('express-validator');
const { authenticate } = require('../middleware/auth');
const answerController = require('../controllers/answer.controller');

const router = Router();

router.get('/question/:questionId', answerController.getAnswersByQuestionId);
router.post(
  '/',
  authenticate,
  [
    body('content').notEmpty().withMessage('Content is required'),
    body('questionId').notEmpty().withMessage('Question ID is required')
  ],
  answerController.createAnswer
);
router.put('/:id', authenticate, answerController.updateAnswer);
router.delete('/:id', authenticate, answerController.deleteAnswer);
router.post('/:id/accept', authenticate, answerController.acceptAnswer);

module.exports = router;
