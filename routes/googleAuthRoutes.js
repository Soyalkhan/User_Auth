const express = require('express');
const passport = require('passport');

const router = express.Router();

// Route to start Google authentication
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback route for Google to redirect to after successful authentication
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, redirect to profile or dashboard
    res.redirect('/dashboard');  // Change this route as per your front-end setup
  }
);

module.exports = router;
