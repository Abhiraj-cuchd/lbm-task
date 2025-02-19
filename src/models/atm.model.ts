const mongoose = require('mongoose');

const atmSchema = new mongoose.Schema({
    denominations: {
        "50": {
            type: Number,
            default: 0,
            min: 0
        },
        "100": {
            type: Number,
            default: 0,
            min: 0
        },
        "200": {
            type: Number,
            default: 0,
            min: 0
        },
        "500": {
            type: Number,
            default: 0,
            min: 0
        },
        "2000": {
            type: Number,
            default: 0,
            min: 0
        }
    },
    balance: {
        type: Number,
        default: 0,
        min: 0
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const ATM = mongoose.model('ATM', atmSchema);
