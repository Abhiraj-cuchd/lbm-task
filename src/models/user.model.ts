import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    pin: {
        type: String,
        required: true,
        length: 4
    },
    balance: {
        type: Number,
        default: 0
    },
    transactions: [{
        type: {
            type: String,
            enum: ['deposit', 'withdrawal'],
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    lastLogin: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
export const User = mongoose.model('User', userSchema);