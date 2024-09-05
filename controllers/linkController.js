const User = require('../models/userModel');


exports.addLink = async (req, res) => {
    try {
        const { name, url } = req.body;
        const userId = req.user.id; // Get user ID from auth middleware

        const newLink = { name, url };

        // Find the user and update their links
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        user.links.push(newLink);
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Link added.',
            user: {
                // id: user._id,
                // name: user.name,
                // email: user.email,
                links: user.links
            }
        });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};


exports.getLinks = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        res.status(200).json({ links: user.links });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};
