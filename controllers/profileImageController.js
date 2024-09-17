    require('dotenv').config();
    const multer = require('multer');
    const AWS = require('aws-sdk');
    const uuid = require('uuid').v4;
    const User = require('../models/userModel');
    const { json } = require('body-parser');


    // Configure AWS S3
    const s3 = new AWS.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION
    });

    const storage = multer.memoryStorage();
    const upload = multer({ storage:storage });

    exports.uploadImage = async (req, res) =>{

        const file = req.file;

        if(!file){
                return res.status(400).json({success: false, message: 'provide an image.'});

        }

        //generate file name

        const fileName = `${uuid()}-${file.originalname}`;

        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: fileName,
            Body: file.buffer,
            ContentType: file.mimetype,
           // ACL: 'public-read' // public accessible 
        }

        try{

            // Upload the file to S3
            const data = await s3.upload(params).promise();
              // Save the image URL to the user's profile

              const user = await User.findById(req.user.id);

              if(!user){
                return res.status(404).json({success: false, message: 'User not found.'});
              }

              user.profileImage = data.Location; // save url of s3

              await user.save();
            res.status(200).json({success: true, message: 'Profile picture uploaded successfully.', imageUrl: data.Location});

        }
        catch(err){
            
            console.error('Error uploading file:', err);
            return res.status(500).json({success: false, message: 'Internal server error while uploading image.'});
        }
    }



    exports.editImage  = async (req, res) => {
        const file = req.file;

        if(!file){
            return res.status(400),json({success: false, message: 'Please provide image to replace profile picture.'});
        
        }

        try{
            //find user
            const user = await User.findById(req.user.id);

            if(!user){
                return res.status(404).json({success: false, message: 'User not found'});
            }

            //if user has the profile in s3 aws delete the old profile from s3
            if(user.profileImage){
                const oldImageKey = user.profileImage.split('/').pop(); // extract key from the s3 url
                console.log('Deleting old image with key:', oldImageKey);
                const deleteParams = {
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: oldImageKey
                };

                await s3.deleteObject(deleteParams).promise(); // delete old image 
            }

            //genrate a new file name and uploaod new image
            const fileName = `${uuid()}-${file.originalname}`;

            const params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: fileName,
                Body: file.buffer,
                ContentType: file.mimetype,
               // ACL: 'public-read' // public accessible 
            }

            const data = await s3.upload(params).promise();

            user.profileImage = data.Location;
            await user.save();

            res.status(200).json({ success: true, message: 'Profile image updated successfully.', imageUrl: data.Location});
        }
        catch(err){

            console.log('Error while replacing image' + err);
            return res.status(500).json({success: true, message: 'An error while replacing profile image.'});
        }
    }