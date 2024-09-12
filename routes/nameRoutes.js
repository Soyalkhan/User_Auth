const express = require('express');
const { addName, updateName } = require('../controllers/nameController');
const { protect } = require('../middlewares/authMiddleware'); // Ensure user is authenticated

const router = express.Router();

// Apply middleware to protect the routes
router.use(protect);

// Route to update user's name
router.put('/', addName);
router.put('/updateName', protect, updateName)
module.exports = router;
