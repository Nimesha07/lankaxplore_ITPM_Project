const bookingService = require('../src/services/booking.service');
const { validationResult } = require('express-validator');

class BookingController {
  async createBooking(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const bookingData = {
        ...req.body,
        userId: req.user.id
      };

      const booking = await bookingService.createBooking(bookingData);
      res.status(201).json(booking);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getBookings(req, res) {
    try {
      const bookings = await bookingService.getBookings();
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getBookingById(req, res) {
    try {
      const booking = await bookingService.getBookingById(req.params.id);
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
      res.json(booking);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getUserBookings(req, res) {
    try {
      const bookings = await bookingService.getBookingsByUserId(req.user.id);
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateBooking(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const booking = await bookingService.updateBooking(req.params.id, req.body);
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
      res.json(booking);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteBooking(req, res) {
    try {
      const booking = await bookingService.deleteBooking(req.params.id);
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
      res.json({ message: 'Booking deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateBookingStatus(req, res) {
    try {
      const { status } = req.body;
      const booking = await bookingService.updateBookingStatus(req.params.id, status);
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
      res.json(booking);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new BookingController(); 