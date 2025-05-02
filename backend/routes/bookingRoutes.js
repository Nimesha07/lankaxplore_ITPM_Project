const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const Booking = require('../models/Booking');

// Get all bookings for a user
router.get('/user/:id', async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.params.id })
            
        res.json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ message: 'Error fetching bookings', error: error.message });
    }
});

// Get a specific booking
router.get('/:id', async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            
        
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
router.post('/', async (req, res) => {
    try {
        const { name, email, phone, guests, date, specialRequests, paymentMethod,packageId, packageName, packagePrice, status, createdAt } = req.body;
        
        const booking = new Booking({
            name,
            email,
            phone,
            guests,
            date,
            specialRequests,
            paymentMethod,
            packageId,
            packageName,
            packagePrice,
            status,
            user:'681018ba20f36aa516f83851',
            createdAt
        });

        await booking.save();
        res.status(201).json(booking);
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ message: 'Error creating booking', error: error.message });
    }
});

// Update a booking
router.put('/:id', async (req, res) => {
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
router.delete('/:id', async (req, res) => {
    try {
        console.log(req.params.id)
        const deletebooking = await Booking.findByIdAndDelete(req.params.id);
    if (!deletebooking) {
      return res.status(404).json({ message: 'Package not found' });
    }
    console.log(deletebooking)
    res.status(200).json({ message: 'Package deleted successfully' });
    } catch (error) {
        console.error('Error cancelling booking:', error);
        res.status(500).json({ message: 'Error cancelling booking', error: error.message });
    }
});

module.exports = router; 