const nodemailer = require('nodemailer');
const {generateOTP} = require('../utils/otpGenerator.js');
const User = require('../models/userModel.js');
const { text } = require('body-parser');

//generate and send email to customer email
exports.sendResetPasswordOTP = async ( req, res) =>{

    try{
        const {email} = req.body;
        //find user by email
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({success: false, message: 'Email does not exist.'});
        }

        const resetOTP = generateOTP(); // generate OTP

        user.otp = resetOTP;
        user.otpExpiry = Date.now() + 10 * 60 * 1000; // valid for 10 min
        await user.save();

        // send OPT users to email via nodemailer
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth:{
                user: process.env.COMPANY_EMAIL,
                pass: process.env.COMPANY_EMAIL_PASSWORD
            }
        });

        const mailOptions = {
            from: process.env.COMPANY_EMAIL,
            to: user.email,
            subject: `Hey ${user.name} your OTP to reset your password!`,
            text: `Your OTP for password reset is: ${resetOTP}`

        }

        await transporter.sendMail(mailOptions);

        res.status(200).json({success: true, message: `OPT sent to your registered email : ${user.email}`})
    }
    catch(err){

        console.log(err);
        res.status(500).json({ success: false, message: 'An error occurred while sending reset password otp'});
    }
}

//to reset password
exports.resetPassword = async ( req, res)=>{

    try{
        const {email, otp, newPassword} = req.body;

        //find user email
        const user = await User.findOne({ email});
        
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

         // Check if OTP matches and is not expired
        if(user.otp !== otp || user.otpExpiry < Date.now()) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
        }

        user.password = newPassword;
        user.otp = ""; // clear otp
        user.otpExpiry = ""; // clear expiry

        await user.save();

        res.status(200).json({ success: true, message: 'Password reset successfully.'});
        
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'An error occurred while resetting password.' });
    }
}