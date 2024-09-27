const express = require('express');
const passport = require('passport');
const router = express.Router();

// Route to start Google authentication
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback route for Google to redirect to after successful authentication
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication
    const user = req.user; // Extract user data from req.user populated by Passport
    res.send(` User registred via google account email : ${user.email}`)
    if (user) {
      // Sending a message on the webpage as well as sending the JSON response
      res.status(200).json({
        success: true,
        message: `User registered by Google account with this email: ${user.email}`,
        data: {
          name: user.name,
          email: user.email,
          profileImage: user.profileImage,
          createdAt: user.createdAt
        }
      });
    } else {
      res.status(400).json({ success: false, message: 'Google authentication failed' });
    }
  }
);

module.exports = router;
