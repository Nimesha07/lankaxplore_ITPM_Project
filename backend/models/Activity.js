const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    destination: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Destination',
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    duration: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        enum: ['easy', 'moderate', 'challenging'],
        required: true
    },
    images: [{
        type: String
    }],
    availability: {
        type: Boolean,
        default: true
    },
    maxParticipants: {
        type: Number,
        required: true,
        min: 1
    },
    requirements: [{
        type: String
    }]
}, {
    timestamps: true
});

// Add indexes for faster queries
activitySchema.index({ destination: 1 });
activitySchema.index({ name: 1 });

module.exports = mongoose.model('Activity', activitySchema); 