const { Router } = require('express');
const { body } = require('express-validator');
const { authenticate } = require('../middleware/auth');
const questionController = require('../controllers/question.controller');

const router = Router();

router.get('/', questionController.getAllQuestions);
router.get('/trending', questionController.getTrendingQuestions);
router.get('/:id', questionController.getQuestionById);
router.post(
  '/',
  authenticate,
  [
    body('title').isLength({ min }).withMessage('Title must be at least 10 characters'),
    body('content').notEmpty().withMessage('Content is required'),
    body('tags').isArray().withMessage('Tags must be an array')
  ],
  questionController.createQuestion
);
router.put('/:id', authenticate, questionController.updateQuestion);
router.delete('/:id', authenticate, questionController.deleteQuestion);
router.post('/:id/save', authenticate, questionController.saveQuestion);
router.delete('/:id/save', authenticate, questionController.unsaveQuestion);

module.exports = router;
