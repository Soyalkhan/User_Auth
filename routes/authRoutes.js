const express = require('express');
const { register, login,logout, getMe } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/logout', logout); // Add this line
router.put('/name', protect, updateName); // Add this line

module.exports = router;
