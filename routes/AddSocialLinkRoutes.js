const express = require('express');
const router = express.Router();
const { AddSocialLink } = require('../controllers/AddSocialLinkController');
const { protect } = require('../middlewares/authMiddleware');


//declear routes to add Social Only

router.put('/AddSocialLink' , protect, AddSocialLink);

module.exports = router;
