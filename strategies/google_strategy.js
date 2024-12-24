import dotenv from 'dotenv';
dotenv.config();
import passport from "passport";
import {Strategy as googleStrategy} from "passport-google-oauth20";

passport.use(new googleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/google/callback'
},
(accessToken, refreshToken, profile, done) => {
    // console.log(profile);
    return done(null, profile);
}));

passport.serializeUser((user, done) => done(null,user));
passport.deserializeUser((user, done) => done(null,user));

export default passport;
