const express  = require('express');
const {  sendResetPasswordOTP, resetPassword } =  require('../controllers/resetPasswordByEmail');
const { sendResetPasswordByPhone, resetPasswordByPhone } = require('../controllers/resetPasswordByPhone')

const router = express.Router();

router.post('/sendResetPasswordOTP' , sendResetPasswordOTP); // by email
router.put('/resetPassword' , resetPassword); // by email

router.post('/sendResetOTPByPhone', sendResetPasswordByPhone); // by phone
router.put('/resetPasswordByPhone' , resetPasswordByPhone) // by phone


module.exports = router;