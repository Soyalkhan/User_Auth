const User = require('../models/userModel');

// add user's name and username
exports.addName = async (req, res) => {
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
            return res.status(404).json({ success: false, message: 'User not found'});
        }

        res.status(200).json({ success: true, message: 'Name and Username has been added', user: updatedUser});
    } catch (err) {
        res.status(500).json({ success: false, message: 'An error occurred while updating the name. Please try again later.' });
    }
};
   

exports.updateName = async ( req, res) =>{

    const {name} = req.body;
    
        if(!name){
            res.status(400).json({success: false, message: 'Please provide name to upate.'})
        }

        try{

            const user = await User.findById(req.user.id);

            if(!user){
                return res.status(404).json({ success: false , message: 'user not found.'});
            }
            //update only name
            user.name = name;
             await user.save();

             res.status(200).json({success: true, message: 'Your name has been updated.', name:name})
        }
        catch(err){
            res.status(500).json({success: false, message: 'Name updation failed sever error.'})
        }
}