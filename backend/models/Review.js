const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the User schema
    package: { type: mongoose.Schema.Types.ObjectId, ref: "Package", required: true }, // Reference to the Package schema
    rating: { type: Number, required: true, min: 1, max: 5 }, // Rating out of 5
    comment: { type: String, required: true }, // Optional text comment
    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

// Method to check if a review is editable (within 24 hours)
ReviewSchema.methods.isEditable = function(userId) {
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

module.exports = mongoose.model("Review", ReviewSchema); 