const express = require('express');
const router = express.Router();
const bookingController = require('../src/controllers/booking.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { body } = require('express-validator');

// Validation middleware
const bookingValidation = [
  body('packageId').notEmpty().withMessage('Package ID is required'),
  body('packageName').notEmpty().withMessage('Package name is required'),
  body('packagePrice').isNumeric().withMessage('Package price must be a number'),
  body('duration').notEmpty().withMessage('Duration is required'),
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').notEmpty().withMessage('Phone number is required'),
  body('guests').isInt({ min: 1 }).withMessage('Number of guests must be at least 1'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('paymentMethod').notEmpty().withMessage('Payment method is required')
];

// Create a new booking
router.post('/', authMiddleware, bookingValidation, bookingController.createBooking);

// Get all bookings (admin only)
router.get('/', authMiddleware, bookingController.getBookings);

// Get a specific booking
router.get('/:id', authMiddleware, bookingController.getBookingById);

// Get user's bookings
router.get('/user/bookings', authMiddleware, bookingController.getUserBookings);

// Update a booking
router.put('/:id', authMiddleware, bookingValidation, bookingController.updateBooking);

// Delete a booking
router.delete('/:id', authMiddleware, bookingController.deleteBooking);

// Update booking status
router.patch('/:id/status', authMiddleware, 
  body('status').isIn(['pending', 'confirmed', 'cancelled']).withMessage('Invalid status'),
  bookingController.updateBookingStatus
);

module.exports = router; 