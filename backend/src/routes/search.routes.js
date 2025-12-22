const { Router } = require('express');
const searchController = require('../controllers/search.controller');

const router = Router();

// Advanced search
router.get('/', searchController.advancedSearch);

// Search suggestions (autocomplete)
router.get('/suggestions', searchController.getSearchSuggestions);

// Popular searches
router.get('/popular', searchController.getPopularSearches);

module.exports = router;
