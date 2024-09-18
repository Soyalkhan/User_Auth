const User = require('../models/userModel');
const { json } = require('body-parser');

//addSocial only

exports.AddSocialLink = async (req, res) => {

    try {

        const user = await User.findById(req.user.id);

        if (!user) {
            res.status(404).json({ success: false, message: 'user not found' });
        }


        const { SocialLinks } = req.body;
        if (!SocialLinks || typeof SocialLinks !== 'object') {
            return res.status(400).json({ success: false, message: 'Please provide social URLs.' });
        }

        // user.SocialURLs = Object.assign(user.SocialURLs, SocialLinks); this was for adding in map form
        
        // Merge the new social links into the existing SocialURLs
        Object.keys(SocialLinks).forEach(key => {
            user.SocialURLs.set(key, SocialLinks[key]);
        });

        await user.save();

        res.status(200).json({ success: true, message: 'Social link added.', user: user });
    }
    catch (err) {
        res.status(500).json({ success: false, message: 'Ann error occurred while adding social links' });
    }

};