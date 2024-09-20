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
        // if (!SocialLinks || typeof SocialLinks !== 'object') {
        //     return res.status(400).json({ success: false, message: 'Please provide social URLs.' });
        // }

        // // user.SocialURLs = Object.assign(user.SocialURLs, SocialLinks); this was for adding in map form
        
        // // Merge the new social links into the existing SocialURLs
        // Object.keys(SocialLinks).forEach(key => {
        //     user.SocialURLs.set(key, SocialLinks[key]);
        // });


        if (!SocialLinks || !Array.isArray(SocialLinks)) {
            return res.status(400).json({ success: false, message: 'Please provide social links as an array.' });
        }

      // Loop through each social link in the request body and update the corresponding entry
      SocialLinks.forEach(newLink => {
        // Find the matching social link in user's SocialURLs by name
        const existingLink = user.SocialURLs.find(link => link.name === newLink.name);

        if (existingLink) {
            // Explicitly update the URL even if it's an empty string
            existingLink.url = newLink.url !== undefined ? newLink.url : existingLink.url;
        }
    });



        await user.save();

        res.status(200).json({ success: true, message: 'Social link added.', user: user });
    }
    catch (err) {
        res.status(500).json({ success: false, message: 'Ann error occurred while adding social links' });
    }

};