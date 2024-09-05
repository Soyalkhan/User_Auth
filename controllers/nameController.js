const User = require('../models/userModel');

// Update user's name and username
exports.updateName = async (req, res) => {
    const { name, username } = req.body;

    if (!name || !username) {
        return res.status(400).json({ success: false, message: 'Please provide both name and username' });
    }

    try {
        // Check if the username is already taken by another user
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Username already taken' });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { name, username },  // Update both name and username
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, data: updatedUser });
    } catch (err) {
        res.status(500).json({ success: false, message: 'An error occurred while updating the name. Please try again later.' });
    }
};
  