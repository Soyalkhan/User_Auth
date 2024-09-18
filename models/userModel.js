const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        default: ''  //default empty string
    },
    username: {
        type: String,
        default: '',  // Set to an empty string initially
        // unique: true,
        sparse: true  // Ensures uniqueness only for non-empty strings
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    profileImage: {
        type: String, // URL of the profile image
        default: ''  // Default to empty string if no image is uploaded
    },
    phone: {
        type: String,
        required: [true, 'Please add a phone number'],
        unique: true,
        match: [
            /^\d{10}$/,
            'Please add a valid 10-digit phone number'
        ]
    },
    bio: {
        type: String,
        default: '',  // default empty string if bio is not provided
        maxlength: [100, 'Bio cannot be more than 100 characters'],  // set maximum length to 100 characters
        trim: true  // removes leading or trailing spaces
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    isVerified: { 
        type: Boolean, 
        default: false }, // New field for phone verification
    otp: String, // Stores OTP
    otpExpiry: Date, // Stores OTP expiration
    // SocialURLs: {
    //     Facebook: { type: String, default: '' }, // Default to an empty string
    //     X: { type: String, default: '' },
    //     Instagram: { type: String, default: '' },
    //     Youtube: { type: String, default: '' }
    // },

    SocialURLs: {
        type: Map,
        of: String,
        default: {
            Facebook: '',
            X: '',
            Instagram: '',
            Youtube: ''
        }
    },
    links: [
        {   
            name: { type: String, required: true },
            url: { type: String, required: true },
        },
    ],
});

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

module.exports = mongoose.model('User', UserSchema);
