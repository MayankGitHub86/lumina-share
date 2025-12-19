const { Router } = require('express');
const tagController = require('../controllers/tag.controller');

const router = Router();

router.get('/', tagController.getAllTags);
router.get('/popular', tagController.getPopularTags);
router.get('/:id/questions', tagController.getQuestionsByTag);

module.exports = router;
