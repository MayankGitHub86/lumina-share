const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settings.controller');
const { authenticate } = require('../middleware/auth');

// All settings routes require authentication
router.use(authenticate);

// Get settings
router.get('/', settingsController.getSettings);

// Update profile
router.put('/profile', settingsController.updateProfile);

// Update email
router.put('/email', settingsController.updateEmail);

// Update password
router.put('/password', settingsController.updatePassword);

// Update notifications
router.put('/notifications', settingsController.updateNotifications);

// Upload avatar
router.post('/avatar', settingsController.uploadAvatar);

// Delete account
router.delete('/account', settingsController.deleteAccount);

module.exports = router;
