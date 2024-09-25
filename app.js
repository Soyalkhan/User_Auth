const express = require('express');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' }); // Load environment variables
const cookieParser = require('cookie-parser');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');

const connectDB = require('./config/db');
require('./config/passport'); // Ensure this line is added

const googleAuthRoutes = require('./routes/googleAuthRoutes'); // Import Google Auth routes

// Connect to the database
connectDB();

const app = express();

// Enable CORS for all routes
app.use(cors());

// app.use(cors({
//     origin: ['http://localhost:5000', 'http://127.0.0.1:5500'],
//     credentials: true // Allow cookies to be sent
// }));

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Initialize session middleware for Passport
app.use(session({
    secret: process.env.SESSION_SECRET || 'your_secret', // Use the secret from .env
    resave: false,
    saveUninitialized: true
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Mount routers
app.use('/api/auth', require('./routes/authRoutes')); //auth
app.use('/api/links', require('./routes/linkRoutes')); //link
app.use('/api/name', require('./routes/nameRoutes')); //name
app.use('/api/profileImage', require('./routes/profileImageRoutes')); // image upload
app.use('/api/public', require('./routes/GenrateProfileLinkRoutes')); // Public profile
app.use('/api', require('./routes/AddSocialLinkRoutes')); // Social links
app.use('/api', require('./routes/resetPasswordRoutes')); // Reset password

// Mount Google OAuth routes
app.use('/api/auth', googleAuthRoutes); // Google Auth

module.exports = app;
