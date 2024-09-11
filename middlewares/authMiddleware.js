const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Protect routes
exports.protect = async (req, res, next) => {
    let token;

        // key : Authorization
        // value : Bearer "token"

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    console.log("Header with Token val : " + req.headers.authorization );
    

    
    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized to access this route 1' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: 'Not authorized to access this route 2' });
    }
};
