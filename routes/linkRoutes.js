const express = require('express');
const router = express.Router();
const { addLink, getLinks, updateLink } = require('../controllers/linkController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/', protect, addLink);
router.get('/', protect, getLinks);
router.put('/updateLink', protect, updateLink )

module.exports = router;
