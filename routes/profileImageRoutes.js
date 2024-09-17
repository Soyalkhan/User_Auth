const express = require('express');
const multer = require('multer');
const { protect } = require('../middlewares/authMiddleware');
const {uploadImage , deleteImage, editImage } = require('../controllers/profileImageController');

const router = express.Router();



const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
//apply middleware to protect routes
router.use(protect);

router.put('/uploadImage',  upload.single('profileImage'), uploadImage); // with multi part 
router.put('/editProfileImage' , upload.single('profileImage'), editImage) // replace image by deleteing older from db and s3 aws
// router.put('/deleteImage', protect, deleteImage );

module.exports = router;