import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        passwordHash: {
            type: String,
            required: true,
        },
        avatarUrl: String,
        refreshTokens: { 
            type: [String], 
            default: [], 
        }
    },{
        timestamps: true
    }
);

export default mongoose.model('UserModel', UserSchema);