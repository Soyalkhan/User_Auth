const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

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
        return res.status(400).json({ success: false, error: 'Passwords do not match' });
    }

    try {
        const user = await User.create({
            email,
            phone,
            password
        });

        sendTokenResponse(user, 200, res);
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// Login user
exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, error: 'Please provide an email and password' });
    }

    try {
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(400).json({ success: false, error: 'Invalid credentials' });
        }

        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(400).json({ success: false, error: 'Invalid credentials' });
        }

        sendTokenResponse(user, 200, res);
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// Get current logged in user
exports.getMe = async (req, res) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        data: user
    });
};

// Function to generate token and send response
const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true,
    };

    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        token,
    });
};
