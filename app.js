const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const cors = require("cors");
const nameRoutes = require('./routes/nameRoutes'); 
// Load environment variablesnpm
dotenv.config({ path: './.env' });

// Connect to database
connectDB();

const app = express();
// Enable CORS for all routes
app.use(cors());


// Body parser
app.use(express.json());


// Cookie parser
app.use(cookieParser());

// Mount routers
app.use('/api/auth', require('./routes/authRoutes')); //auth
app.use('/api/links', require('./routes/linkRoutes')); //link
app.use('/api/name', require('./routes/nameRoutes')); //name

module.exports = app;  // Export the app instance
