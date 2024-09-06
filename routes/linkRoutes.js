const express = require('express');
const router = express.Router();
const { addLink, getLinks } = require('../controllers/linkController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/', protect, addLink);
router.get('/', protect, getLinks);

module.exports = router;
