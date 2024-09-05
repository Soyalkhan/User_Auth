const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const { generateOTP } = require('../utils/otpGenerator');
const { sendOTP } = require('../utils/twilioService');


// Register a new user
exports.register = async (req, res) => {
    const { email, phone, password, confirmPassword } = req.body;


       // Check if the email or phone number is already registered
       const existingUser = await User.findOne({ $or: [{ email: email }, { phone: phone }] });

       if (existingUser) {
           return res.status(400).json({
               success: false,
               message: 'Email or Phone number is already registered'
           });
       }

    if (password !== confirmPassword) {
        return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }

    try {
        const user = await User.create({
            email,
            phone,
            password,
            isVerified: false // Initially set as false
        });

        

        // Generate OTP
        const otp = generateOTP();

        // Store OTP and expiration in the user document
        user.otp = otp;
        user.otpExpiry = Date.now() + 10 * 60 * 1000; // Expires in 10 mins
        await user.save();

        // Send OTP to the user's phone number via Twilio
        await sendOTP(phone, otp);


        sendTokenResponse(user, 200, res, "User registered successfully, Please verify phone number.");
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// Login user
exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Please provide an email and password' });
    }

    try {
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(400).json({ success: false, message: 'User not found' });
        }

        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        sendTokenResponse(user, 200, res, "User logged in successfully");
    } catch (err) {
        // You can log the actual error for debugging purposes if needed
        console.error(err);

        // Return a user-friendly error message
        res.status(500).json({ success: false, message: 'An error occurred while trying to log in. Please try again later.' });
    }
};


// Get current logged in user
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        
        // Reorder fields for presentation
        const orderedUser = {
            _id: user._id,
            name: user.name,  // Name comes first
            email: user.email,
            phone: user.phone,
            password: user.password,
            isVerified: user.isVerified,
            createdAt: user.createdAt,
            links: user.links
        };

        res.status(200).json({
            success: true,
            data: orderedUser
        });
        console.log(orderedUser);
        
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Function to generate token and send response
const sendTokenResponse = (user, statusCode, res,message) => {
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true,
    };

    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        token,
        message: message,
        user: user.toJSON()
        });
};


// Logout user and clear cookie
exports.logout = (req, res) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: 'Logged out successfully',
    });
};


//verify otp 
exports.verifyOTP = async (req, res) => {
    const { phone, otp } = req.body;

    try {
        // Find the user based on the phone number
        const user = await User.findOne({ phone });

        if (!user) return res.status(400).json({ message: 'User not found' });

        // Check if OTP is valid and not expired
        if (otp !== user.otp || Date.now() > user.otpExpiry) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // Mark the user as verified
        user.isVerified = true;
        user.otp = undefined; // Clear OTP
        user.otpExpiry = undefined; // Clear OTP expiry
        await user.save();

        res.status(200).json({ message: 'OTP verified successfully. Phone number is now verified.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error during OTP verification.' });
    }
};

