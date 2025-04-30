const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the User schema
    destination: { type: mongoose.Schema.Types.ObjectId, ref: "Destination", required: true }, // Reference to the Destination schema
    rating: { type: Number, required: true, min: 1, max: 5 }, // Rating out of 5
    comment: { type: String, required: true }, // Optional text comment
    images: [{ type: String }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    isVerified: { type: Boolean, default: false }
  },
  { timestamps: true }
);

// Prevent duplicate reviews from the same user for the same destination
reviewSchema.index({ user: 1, destination: 1 }, { unique: true });

// Method to check if a review is editable (within 24 hours)
reviewSchema.methods.isEditable = function(userId) {
  // Check if the user is the owner of the review
  if (this.user.toString() !== userId.toString()) {
    return false;
  }

  // Check if the review is within 24 hours of creation
  const now = new Date();
  const reviewAge = now - this.createdAt;
  const hours24 = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  return reviewAge <= hours24;
};

module.exports = mongoose.model("Review", reviewSchema); 