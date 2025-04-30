const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const Booking = require('../models/Booking');

// Get all bookings for a user
router.get('/', verifyToken, async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id })
            .populate('destination')
            .populate('activities.activity');
        res.json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ message: 'Error fetching bookings', error: error.message });
    }
});

// Get a specific booking
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('destination')
            .populate('activities.activity');
        
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Check if the booking belongs to the user
        if (booking.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to view this booking' });
        }

        res.json(booking);
    } catch (error) {
        console.error('Error fetching booking:', error);
        res.status(500).json({ message: 'Error fetching booking', error: error.message });
    }
});

// Create a new booking
router.post('/', verifyToken, async (req, res) => {
    try {
        const { destination, activities, totalAmount, paymentMethod, notes } = req.body;
        
        const booking = new Booking({
            user: req.user._id,
            destination,
            activities,
            totalAmount,
            paymentMethod,
            notes,
            status: 'pending',
            paymentStatus: 'pending'
        });

        await booking.save();
        res.status(201).json(booking);
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ message: 'Error creating booking', error: error.message });
    }
});

// Update a booking
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const { status, paymentStatus, notes } = req.body;
        
        const booking = await Booking.findById(req.params.id);
        
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Check if the booking belongs to the user
        if (booking.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this booking' });
        }

        if (status) booking.status = status;
        if (paymentStatus) booking.paymentStatus = paymentStatus;
        if (notes) booking.notes = notes;

        await booking.save();
        res.json(booking);
    } catch (error) {
        console.error('Error updating booking:', error);
        res.status(500).json({ message: 'Error updating booking', error: error.message });
    }
});

// Cancel a booking
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Check if the booking belongs to the user
        if (booking.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to cancel this booking' });
        }

        // Instead of deleting, mark as cancelled
        booking.status = 'cancelled';
        await booking.save();
        
        res.json({ message: 'Booking cancelled successfully' });
    } catch (error) {
        console.error('Error cancelling booking:', error);
        res.status(500).json({ message: 'Error cancelling booking', error: error.message });
    }
});

module.exports = router; 