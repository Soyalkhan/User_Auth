const express = require('express');
const { getPublicProfile } = require('../controllers/GenerateProfileLink');

const router = express.Router();
// Route to get public profile by username
router.get('/profile/:username' , getPublicProfile);

module.exports = router;