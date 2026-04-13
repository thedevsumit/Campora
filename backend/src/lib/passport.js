const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user.model");

const isProd = process.env.NODE_ENV === "production";
const GOOGLE_CALLBACK_URL = isProd
  ? process.env.GOOGLE_CALLBACK_URL_PRODUCTION
  : process.env.GOOGLE_CALLBACK_URL_DEVELOPMENT;

const initializePassport = (passport) => {
  passport.use(
    "google",
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: GOOGLE_CALLBACK_URL,
        scope: ["profile", "email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails && profile.emails[0] && profile.emails[0].value;
          if (!email) return done(new Error("No email found in Google profile"), null);

          let user = await User.findOne({ email });
          if (user) {
            if (!user.googleId) { user.googleId = profile.id; await user.save(); }
            return done(null, user);
          }

          user = await User.create({
            fullName: profile.displayName,
            email,
            googleId: profile.id,
            password: `google_${profile.id}_${Date.now()}`,
            profilePic: (profile.photos && profile.photos[0]) ? profile.photos[0].value : "",
            dept: "",
            year: "",
          });
          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );

  passport.serializeUser((user, done) => { done(null, user._id.toString()); });
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) { done(err, null); }
  });
};

module.exports = { initializePassport };
