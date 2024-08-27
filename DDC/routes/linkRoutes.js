const express = require('express');
const router = express.Router();
const { addLink, getLinks } = require('../controllers/linkController');
const { protect } = require('../middlewares/authMiddleware');
// @route   POST /api/links
// @desc    Add a new link
// @access  Private
router.post('/', protect, addLink);

// @route   GET /api/links
// @desc    Get all links for the current user
// @access  Private
router.get('/', protect, getLinks);

module.exports = router;
