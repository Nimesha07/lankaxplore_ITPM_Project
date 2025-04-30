const Review = require("../models/Review"); // Path to the Review model
const Destination = require("../models/Destination");
const mongoose = require("mongoose");

const ReviewController = {
  // Get all reviews
  async getAllReviews(req, res) {
    try {
      const reviews = await Review.find()
        .populate("user", "username profileImage") // Populate user details
        .populate("destination", "name location"); // Optional: Populate destination details
      res.status(200).json(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error.message);
      res.status(500).json({ error: "Failed to fetch reviews" });
    }
  },

  // Get one review by ID
  async getOneReview(req, res) {
    const { id } = req.params; // Review ID
    try {
      const review = await Review.findById(id)
        .populate("user", "username profileImage")
        .populate("destination", "name location");
      if (!review) {
        return res.status(404).json({ error: "Review not found" });
      }
      res.status(200).json(review);
    } catch (error) {
      console.error("Error fetching review:", error.message);
      res.status(500).json({ error: "Failed to fetch review" });
    }
  },

  // Edit a review by ID
  async editReview(req, res) {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user?._id; // Assuming user ID is available in req.user

    try {
      const review = await Review.findById(id);
      if (!review) {
        return res.status(404).json({ error: "Review not found" });
      }

      // Check if review is editable
      if (!review.isEditable(userId)) {
        return res.status(403).json({ 
          error: "You can only edit your reviews within 24 hours of posting" 
        });
      }

      const updatedReview = await Review.findByIdAndUpdate(
        id,
        { rating, comment },
        { new: true, runValidators: true }
      ).populate("user", "username profileImage")
       .populate("destination", "name location");

      res.status(200).json(updatedReview);
    } catch (error) {
      console.error("Error editing review:", error.message);
      res.status(500).json({ error: "Failed to edit review" });
    }
  },

  // Delete a review by ID
  async deleteReview(req, res) {
    const { id } = req.params;
    const userId = req.user?._id; // Assuming user ID is available in req.user

    try {
      const review = await Review.findById(id);
      if (!review) {
        return res.status(404).json({ error: "Review not found" });
      }

      // Check if review is editable
      if (!review.isEditable(userId)) {
        return res.status(403).json({ 
          error: "You can only delete your reviews within 24 hours of posting" 
        });
      }

      // Remove review from destination
      await Destination.findByIdAndUpdate(
        review.destination,
        { $pull: { reviews: id } }
      );

      await Review.findByIdAndDelete(id);
      res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
      console.error("Error deleting review:", error.message);
      res.status(500).json({ error: "Failed to delete review" });
    }
  },

  async addReview(req, res) {
    const { rating, comment, destination: destinationId } = req.body;
    const userId = req.user._id; // Get user ID from authenticated user
  
    // Validate required fields
    if (!destinationId || !rating) {
      return res.status(400).json({ error: "Destination and Rating are required." });
    }

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(destinationId)) {
      return res.status(400).json({ error: "Invalid Destination ID." });
    }
  
    try {
      // Check if destination exists
      const destination = await Destination.findById(destinationId);
      if (!destination) {
        return res.status(404).json({ error: "Destination not found." });
      }

      // Create a new review instance
      const newReview = new Review({
        user: userId, // Use the authenticated user's ID
        rating,
        comment,
        destination: destinationId,
      });
  
      // Save the review to the database
      const savedReview = await newReview.save();

      // Update the destination with the new review
      destination.reviews.push(savedReview._id);
      await destination.save();
  
      // Return the newly created review with populated fields
      const populatedReview = await Review.findById(savedReview._id)
        .populate("user", "username profileImage")
        .populate("destination", "name location");
  
      res.status(201).json(populatedReview);
    } catch (error) {
      console.error("Error adding review:", error.message);
      if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: "Failed to add review" });
    }
  },

  // Get review analytics for a destination
  async getReviewAnalytics(req, res) {
    const { destinationId } = req.params;

    try {
      // Get all reviews for the destination
      const reviews = await Review.find({ destination: destinationId })
        .populate('user', 'username profileImage')
        .sort({ createdAt: -1 });

      // Calculate analytics
      const totalReviews = reviews.length;
      const averageRating = totalReviews > 0 
        ? reviews.reduce((acc, review) => acc + review.rating, 0) / totalReviews 
        : 0;

      // Calculate rating distribution
      const ratingDistribution = reviews.reduce((acc, review) => {
        acc[review.rating] = (acc[review.rating] || 0) + 1;
        return acc;
      }, {});

      // Get recent reviews (last 5)
      const recentReviews = reviews.slice(0, 5);

      res.json({
        totalReviews,
        averageRating,
        ratingDistribution,
        recentReviews
      });
    } catch (error) {
      console.error('Error getting review analytics:', error);
      res.status(500).json({ error: 'Failed to get review analytics' });
    }
  }
};

module.exports = ReviewController; 