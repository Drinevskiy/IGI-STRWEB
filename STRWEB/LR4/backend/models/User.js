import mongoose from "mongoose";
import findOrCreate from 'mongoose-findorcreate';

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            default: ''
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        passwordHash: {
            type: String,
            required: true,
            default: ''
        },
        avatarUrl: String,
        refreshTokens: { 
            type: [String], 
            default: [], 
        },
        googleId: {
            type: String,
            required: false,
            default: ''
        },
        facebookId: {
            type: String,
            required: false,
            default: ''
        },
        twitterId: {
            type: String,
            required: false,
            default: ''
        }
    },{
        timestamps: true
    }
);

UserSchema.plugin(findOrCreate);

export default mongoose.model('UserModel', UserSchema);