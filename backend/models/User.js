const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },

  phone: { type: String },
  address: { type: String },
  country: { type: String },
  profileImage: { type: String }, // URL to profile image

  preferredDestinations: [{ type: String }], // List of destinations user likes
  recentBookings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Booking" }], // User's bookings

}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
