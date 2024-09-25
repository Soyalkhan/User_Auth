const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/userModel'); 
console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
console.log("GOOGLE_CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET);

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://user-auth-new-with-link.vercel.app/api/auth/google/callback"

    
  },
  

  
  async (accessToken, refreshToken, profile, done) => {
    console.log("Google Profile: ", profile); // Log the profile object
    try {
      // Check if user already exists in the database
      let user = await User.findOne({ email: profile.emails[0].value });

      if (!user) {
        // If the user doesn't exist, create a new one
        user = new User({
          name: profile.displayName,
          email: profile.emails[0].value,
          profileImage: profile.photos[0].value
        });
        await user.save();
      }
      return done(null, user);
    } catch (err) {
      return done(err, false);
    }
  }
));

// Serialize user to manage sessions
passport.serializeUser((user, done) => {
  done(null, user.id);
});


// Deserialize user to retrieve user from the session
passport.deserializeUser(async (id, done) => {
  try {
      const user = await User.findById(id); // Use await instead of callback
      done(null, user);
  } catch (err) {
      done(err, null); // Handle error properly
  }
});
