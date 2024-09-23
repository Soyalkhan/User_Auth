const { json } = require('body-parser');
const User = require('../models/userModel');


// generate user pofile link

exports.getPublicProfile = async (req, res) => {

    try {

        const { username } = req.params;
        
        if (!username) {
            return res.status(400).json({ success: false, message: 'Please provide a username' });
        }
        
        const user = await User.findOne({ username }).select(' name username bio links SocialURLs profileImage');

        if (!user) {
            res.status(404).json({ success: false, message: 'user not found or add username first.' });
        }

        res.status(200).json({ success: true, message: 'user profile data fetched.', user: user });
    }
    catch (err) {
        console.log(err);
        
        res.status(500).json({ success: false, message: 'An error occurred while retrieving the profile.' });
    }
}
