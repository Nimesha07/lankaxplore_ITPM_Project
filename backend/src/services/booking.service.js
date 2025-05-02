const Booking = require('../../models/booking.model');

class BookingService {
  async createBooking(bookingData) {
    const booking = new Booking(bookingData);
    return await booking.save();
  }

  async getBookings() {
    return await Booking.find()
      .populate('packageId', 'name price duration')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
  }

  async getBookingById(id) {
    return await Booking.findById(id)
      .populate('packageId', 'name price duration')
      .populate('userId', 'name email');
  }

  async getBookingsByUserId(userId) {
    return await Booking.find({ userId })
      .populate('packageId', 'name price duration')
      .sort({ createdAt: -1 });
  }

  async updateBooking(id, updateData) {
    return await Booking.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    ).populate('packageId', 'name price duration')
     .populate('userId', 'name email');
  }

  async deleteBooking(id) {
    return await Booking.findByIdAndDelete(id);
  }

  async updateBookingStatus(id, status) {
    return await Booking.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true }
    );
  }
}

module.exports = new BookingService(); 