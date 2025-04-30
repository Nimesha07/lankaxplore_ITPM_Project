const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['Adventure', 'History', 'Nature', 'Beach', 'Cultural', 'Wildlife'],
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    bestTimeToVisit: {
        type: String,
        default: ''
    },
    weather: {
        type: String,
        default: ''
    },
    transportation: {
        type: String,
        default: ''
    },
    locationDetails: {
        type: String,
        default: ''
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }],
    images: [{
        type: String
    }],
    highlights: [{
        type: String
    }],
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Destination', destinationSchema); 