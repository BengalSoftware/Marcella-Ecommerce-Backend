const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
require("dotenv").config();

const {
    oAuthLoginDataSaveUserModel,
} = require("../controllers/auth.controller");

// check it later

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.CALLBACK_URL,
            scope: ["profile", "email"]
            // passReqToCallback: true,
        },
        async function (accessToken, refreshToken, profile, done) {
            // user to store on database
            try {
                const user = {
                    email: profile.emails[0].value,
                    verified: profile.emails[0].verified,
                    name: profile.displayName,
                    photoUrl: profile?.photos[0]?.value,
                    googleId: profile.id,
                    password: profile.id,
                };
                await oAuthLoginDataSaveUserModel(user);
               return done(null, profile);
            } catch (error) {
               return done(error, null)
            }
        }
    )
);

passport.serializeUser((user, done) => {
    return done(null, user);
});

passport.deserializeUser((user, done) => {
    return done(null, user);
});
