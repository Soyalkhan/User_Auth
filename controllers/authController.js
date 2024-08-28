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

        sendTokenResponse(user, 200, res, "User registered successfully");
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
            return res.status(400).json({ success: false, error: 'User not found' });
        }

        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(400).json({ success: false, error: 'Invalid credentials' });
        }

        sendTokenResponse(user, 200, res ,"User logged in successfully");
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
const sendTokenResponse = (user, statusCode, res,message) => {
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true,
    };

    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        token,
        Message: message
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


// Update user's name
exports.updateName = async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ success: false, message: 'Please provide a name' });
    }

    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Custom MongoDB update to reorder fields
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { 
                $set: { 
                    name, 
                    email: user.email, 
                    phone: user.phone,
                    password: user.password, 
                    createdAt: user.createdAt,
                    links: user.links 
                } 
            },
            { new: true, runValidators: true }
        );

        res.status(200).json({ success: true, data: updatedUser });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
