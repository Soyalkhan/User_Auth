const User = require('../models/userModel.js');
const { generateOTP } = require('../utils/otpGenerator');
const { sendOTP } = require('../utils/twilioService');


exports.sendResetPasswordByPhone = async (req, res) => {

    try {
        const { phone } = req.body;

        // find user by number

        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(404).json({ success: false, message: 'Mobile Number does not exist.' });
        }

        const resetOTP = generateOTP();

        user.otp = resetOTP;
        user.otpExpiry = Date.now() + 10 * 60 * 1000;
        await user.save();

        // send otp by twilio on user number 
        await sendOTP(phone, resetOTP);

        res.status(200).json({ success: true, message: `OPT sent to your registered phone : ${user.phone}` });

    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'An error occurred while sending reset password otp' });
    }

}

//to reset password by phone
exports.resetPasswordByPhone = async ( req, res)=>{

    try{
        const {phone, otp, newPassword} = req.body;

        //find user email
        const user = await User.findOne({ phone});
        
        if (!user) {
            return res.status(404).json({ success: false, message: 'Given number does not exists' });
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
