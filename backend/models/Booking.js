const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true,
        min: 0
    },
    guests: {
        type: String,
    },
    date: {
        type: String,
    },
    specialRequests: {
        type: String,
    },
    paymentMethod: {
        type: String
    },
    packageId: {
        type: String,
        required: true
    },
    packageName: {
        type: String,
        required: true
    },
    packagePrice: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    createdAt: {
        type: String,
        required: true
    },
    
    
    

}, {
    timestamps: true
});
module.exports = mongoose.model('Booking', bookingSchema); 