const express = require('express');
const router = express.Router();
const collectionController = require('../controllers/collection.controller');
const { authenticate } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// Collection CRUD
router.get('/', collectionController.getUserCollections);
router.post('/', collectionController.createCollection);
router.put('/:id', collectionController.updateCollection);
router.delete('/:id', collectionController.deleteCollection);

// Collection questions
router.get('/:id/questions', collectionController.getCollectionQuestions);
router.post('/:id/questions', collectionController.addQuestionToCollection);
router.delete('/:id/questions/:questionId', collectionController.removeQuestionFromCollection);

module.exports = router;
