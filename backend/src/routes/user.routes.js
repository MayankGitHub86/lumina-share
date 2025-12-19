const { Router } = require('express');
const { authenticate } = require('../middleware/auth');
const userController = require('../controllers/user.controller');

const router = Router();

router.get('/', userController.getAllUsers);
router.get('/leaderboard', userController.getLeaderboard);
router.get('/:id', userController.getUserById);
router.get('/:id/stats', userController.getUserStats);
router.put('/:id', authenticate, userController.updateUser);

module.exports = router;
