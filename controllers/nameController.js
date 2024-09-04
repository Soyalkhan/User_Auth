const User = require('../models/userModel');

// Update user's name
exports.updateName = async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ success: false, message: 'Please provide a name' });
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { name }, // Only updating the name field
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
