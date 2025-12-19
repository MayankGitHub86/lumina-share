const { Router } = require('express');
const { body } = require('express-validator');
const { authenticate } = require('../middleware/auth');
const commentController = require('../controllers/comment.controller');

const router = Router();

router.post(
  '/',
  authenticate,
  [
    body('content').notEmpty().withMessage('Content is required')
  ],
  commentController.createComment
);
router.put('/:id', authenticate, commentController.updateComment);
router.delete('/:id', authenticate, commentController.deleteComment);

module.exports = router;
