const express = require('express');
const { register, login,logout, getMe , verifyOTP , bio } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');


const router = express.Router();

router.post('/register', register);
router.post('/verify', verifyOTP);
router.post('/login', login);
router.get('/getUserData', protect, getMe);
router.get('/logout', logout); 
router.put('/addBio', protect, bio)

module.exports = router;
