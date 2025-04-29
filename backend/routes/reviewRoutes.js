const express = require("express");
const router = express.Router();
const ReviewController = require("../controllers/reviewController");
const { verifyToken } = require("../middleware/authMiddleware");

// Public routes
router.get("/", ReviewController.getAllReviews); // Get all reviews
router.get("/analytics/:packageId", ReviewController.getReviewAnalytics);

// Protected routes - require authentication
router.post("/", verifyToken, ReviewController.addReview); // Add a new review
router.put("/:id", verifyToken, ReviewController.editReview); // Edit a review by ID
router.delete("/:id", verifyToken, ReviewController.deleteReview); // Delete a review by ID

module.exports = router; 