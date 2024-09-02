const User = require('../models/userModel');

// Update user's name
exports.updateName = async (req, res) => {
    const { name,username} = req.body;
    console.log("name adding proccess start");
    

    if (!name || !username) {
        return res.status(400).json({ success: false, message: 'Please provide a name of username' });
    }

    try {

        //check username is already taken or not 
        const existingUser = await User.findOne({username});
        if(existingUser){
            return res.status(400).json({success:false,message: "username already taken"})
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { name, username}, 
            { new: true, runValidators: true }
            
        );

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, data: updatedUser });
    console.log("name and username added");

    } catch (err) {
        res.status(500).json({ success: false, message: 'An error occurred while updating the name. Please try again later.' });
    }
};
