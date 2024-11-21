import config from 'config';
import passport from "passport";
import {Strategy as GoogleStrategy} from 'passport-google-oauth20';
import UserModel from '../models/User.js';
import {Strategy as FacebookStrategy} from 'passport-facebook';
import {Strategy as TwitterStrategy} from 'passport-twitter';

const GOOGLE_CLIENT_ID = config.get('GOOGLE_CLIENT_ID');
const GOOGLE_CLIENT_SECRET = config.get('GOOGLE_CLIENT_SECRET');
const GOOGLE_CALLBACK_URL = config.get('GOOGLE_CALLBACK_URL');
const FACEBOOK_CLIENT_ID = config.get('FACEBOOK_CLIENT_ID');
const FACEBOOK_CLIENT_SECRET = config.get('FACEBOOK_CLIENT_SECRET');
const FACEBOOK_CALLBACK_URL = config.get('FACEBOOK_CALLBACK_URL');
const TWITTER_CALLBACK_URL = config.get('TWITTER_CALLBACK_URL');
const TWITTER_API_KEY = config.get('TWITTER_API_KEY');
const TWITTER_API_KEY_SECRET = config.get('TWITTER_API_KEY_SECRET');


export default () => {
    passport.use(new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: GOOGLE_CALLBACK_URL,
        userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
    },
        function(accessToken, refreshToken, profile, cb) {
            const newUser = {
                googleId: profile.id,
                username: profile.displayName || '', 
                email: profile.emails[0].value, 
                avatarUrl: profile.photos[0].value, 
                passwordHash: 'HJdsahbhhsab51dbjhJ2f',
            };
            UserModel.findOrCreate({ googleId: profile.id }, newUser, function (err, user) {
                if (err) {
                    console.error("Error in findOrCreate:", err);
                    return cb(err, null);
                }
                user.accessToken = accessToken;
                return cb(err, user);
            });
        }
    ));

    
    passport.use(new FacebookStrategy({
        clientID: FACEBOOK_CLIENT_ID,
        clientSecret: FACEBOOK_CLIENT_SECRET,
        callbackURL: FACEBOOK_CALLBACK_URL,
        profileFields: ["email", "name"]
    },
        function(accessToken, refreshToken, profile, cb) {
            const newUser = {
                facebookId: profile.id,
                username: profile.displayName || '', 
                email: profile.emails[0].value, 
                avatarUrl: profile.photos[0].value, 
                passwordHash: 'HJdsahbhhsab51dbjhJ2f',
            };
            UserModel.findOrCreate({ facebookId: profile.id }, newUser, function (err, user) {
                if (err) {
                    console.error("Error in findOrCreate:", err);
                    return cb(err, null);
                }
                user.accessToken = accessToken;
                return cb(err, user);
            });
        }
    ));

    passport.use(new TwitterStrategy({
        consumerKey: TWITTER_API_KEY,
        consumerSecret: TWITTER_API_KEY_SECRET,
        callbackURL: TWITTER_CALLBACK_URL,
        includeEmail: true
      },
      function(accessToken, refreshToken, profile, cb) {
        console.log(profile);
        const newUser = {
            twitterId: profile.id,
            username: profile.displayName || '', 
            email: profile.emails[0].value, 
            avatarUrl: profile.photos[0].value,
            passwordHash: 'HJdsahbhhsab51dbjhJ2f',
        };
        UserModel.findOrCreate({ twitterId: profile.id }, newUser, function (err, user) {
            if (err) {
                console.error("Error in findOrCreate:", err);
                return cb(err, null);
            }
            user.accessToken = accessToken;
            user.accessTokenSecret = refreshToken;
            return cb(err, user);
        });
      }
    ));

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    passport.deserializeUser(function(id, done) {
        UserModel.findById(id, function(err, user) {
            done(err, user);
        });
    });
}