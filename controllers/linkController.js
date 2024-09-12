const { json } = require('body-parser');
const User = require('../models/userModel');
const { link } = require('../routes/authRoutes');


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


exports.updateLink = async ( req, res) =>{

    const {linkId, name, url} = req.body;

    if(!linkId || !name || !url){
        return res.status(400).json({success: false, message: 'Please provide new name and url to update'});
    }

    try{

        // user by id 

        const user = await User.findById(req.user.id);

        if(!user){
            return res.status(404).json({ success: false , message: 'user not found'});
        }

        const newLink = user.links.id(linkId);

        if(!link){
            return res.status(404).json({success: false, message: 'link not found'});

        }

        //update link in db by link id and for the desired user
        newLink.name = name;
        newLink.url = url;

        await user.save();

        res.status(200).json({success: true, message: 'link updated', links: newLink});


    }
    catch(err){
            console.log(err);
            res.status(500).json({success: false, message: 'An error occurred while updating link.'});
    }
}


exports.deleteLink = async  ( req, res) =>{

    const {linkId} = req.body;

    if(!linkId){
        return res.status(400).json({success: false, message: 'please provide linkId'});
    }

    try{
            const user = await User.findById(req.user.id);

            if(!user){
                return res.status(404).json({ success: false , message: 'user not found'});
            }

        const link = user.links.id(linkId);

            link.deleteOne(); // delete only link for user
            
            await user.save();
            res.status(200).json({ success: true, message: 'Link deleted successfully', links: user.links });

    }
    catch(err){
        console.log(err);
        
        res.status(500).json({success: false, message: 'An error occurred while deleting link.'})
    }

}