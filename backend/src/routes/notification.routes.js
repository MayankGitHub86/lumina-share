const { Router } = require('express');
const { notifications } = require('../services/notification.service');

const router = Router();

// Public SSE stream; allows optional userId query to target notifications
router.get('/stream', (req, res) => {
  const userId = typeof req.query.userId === 'string' ? req.query.userId : undefined;
  notifications.subscribe(req, res, userId);
});

module.exports = router;
