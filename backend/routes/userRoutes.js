const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const User = require('../models/User');
const Destination = require('../models/Destination');
const Booking = require('../models/Booking');

// Get user profile
router.get('/profile', verifyToken, async (req, res) => {
    try {
        console.log("Fetching profile for user:", req.user._id);
        const user = await User.findById(req.user._id)
            .select('-password')
            .populate('recentBookings');
            
        if (!user) {
            console.log("User not found for ID:", req.user._id);
            return res.status(404).json({ message: 'User not found' });
        }
        
        console.log("Found user:", user);
        res.json({ 
            data: user,
            message: 'User profile fetched successfully'
        });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Error fetching user profile', error: error.message });
    }
});

// Update user profile
router.put('/profile', verifyToken, async (req, res) => {
    try {
        console.log("Updating profile for user:", req.user._id);
        const { name, email, phone, address, country, profileImage } = req.body;
        const user = await User.findById(req.user._id);
        
        if (!user) {
            console.log("User not found for ID:", req.user._id);
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user fields
        if (name) user.name = name;
        if (email) user.email = email;
        if (phone) user.phone = phone;
        if (address) user.address = address;
        if (country) user.country = country;
        if (profileImage) user.profileImage = profileImage;

        await user.save();
        console.log("Profile updated successfully for user:", user._id);
        
        res.json({ 
            data: user,
            message: 'Profile updated successfully'
        });
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
});

// Get user's destinations
router.get('/destinations', verifyToken, async (req, res) => {
    try {
        const destinations = await Destination.find({ user: req.user._id })
            .populate('reviews')
            .sort({ createdAt: -1 });
            
        res.status(200).json({
            status: 'success',
            data: destinations
        });
    } catch (error) {
        console.error('Error fetching user destinations:', error);
        res.status(500).json({ 
            status: 'error',
            message: 'Error fetching destinations',
            error: error.message 
        });
    }
});

// Get user's bookings
router.get('/bookings', verifyToken, async (req, res) => {
    try {
        // Check if Booking model exists
        if (!Booking) {
            return res.json([]);
        }

        const bookings = await Booking.find({ user: req.user._id })
            .populate('package')
            .populate('package.destination');
        res.json(bookings);
    } catch (error) {
        console.error('Error fetching user bookings:', error);
        res.status(500).json({ message: 'Error fetching bookings' });
    }
});

module.exports = router; 