const express = require('express');
const router = express.Router();
const destinationController = require('../controllers/destinationController');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const Destination = require('../models/Destination');
const Package = require('../models/Package');
const Review = require('../models/Review');
const mongoose = require('mongoose');

// Public routes
router.get('/', destinationController.getAllDestinations);
router.get('/:id', destinationController.getDestination);

// Protected routes
router.post('/', 
  protect, 
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'additionalImages', maxCount: 5 }
  ]),
  destinationController.createDestination
);
router.patch('/:id', 
  protect, 
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'additionalImages', maxCount: 5 }
  ]),
  destinationController.updateDestination
);
router.delete('/:id', protect, destinationController.deleteDestination);

// Get user's destinations (protected route)
router.get('/user/destinations', protect, async (req, res) => {
    try {
        const destinations = await Destination.find({ user: req.user._id });
        res.json(destinations);
    } catch (error) {
        console.error('Error fetching user destinations:', error);
        res.status(500).json({ message: error.message });
    }
});

// Get packages for a specific destination
router.get('/:id/packages', async (req, res) => {
    try {
        const destination = await Destination.findById(req.params.id);
        if (!destination) {
            return res.status(404).json({ message: 'Destination not found' });
        }

        const packages = await Package.find({ destination: req.params.id })
            .populate('destination', 'name location');
        
        res.json(packages);
    } catch (error) {
        console.error('Error fetching destination packages:', error);
        res.status(500).json({ message: 'Error fetching packages' });
    }
});

// Get reviews for a specific destination
router.get('/:id/reviews', async (req, res) => {
    try {
        const destination = await Destination.findById(req.params.id);
        if (!destination) {
            return res.status(404).json({ message: 'Destination not found' });
        }

        const reviews = await Review.find({ destination: req.params.id })
            .populate('user', 'username profileImage')
            .sort({ createdAt: -1 });

        // Calculate average rating
        const totalReviews = reviews.length;
        const averageRating = totalReviews > 0 
            ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
            : 0;

        res.json({
            reviews,
            totalReviews,
            averageRating
        });
    } catch (error) {
        console.error('Error fetching destination reviews:', error);
        res.status(500).json({ message: 'Error fetching reviews' });
    }
});

// Add a review to a destination
router.post('/:id/reviews', protect, async (req, res) => {
    try {
        const destination = await Destination.findById(req.params.id);
        if (!destination) {
            return res.status(404).json({ message: 'Destination not found' });
        }

        // Check if user has already reviewed this destination
        const existingReview = await Review.findOne({
            user: req.user._id,
            destination: req.params.id
        });

        if (existingReview) {
            return res.status(400).json({ 
                message: 'You have already reviewed this destination. You can edit your existing review instead.' 
            });
        }

        const review = new Review({
            rating: req.body.rating,
            comment: req.body.comment,
            destination: req.params.id,
            user: req.user._id
        });

        const savedReview = await review.save();
        
        // Update destination's average rating
        const reviews = await Review.find({ destination: req.params.id });
        const totalReviews = reviews.length;
        const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;
        
        await Destination.findByIdAndUpdate(req.params.id, {
            averageRating,
            totalReviews
        });

        const populatedReview = await Review.findById(savedReview._id)
            .populate('user', 'username profileImage');

        res.status(201).json(populatedReview);
    } catch (error) {
        console.error('Error adding review:', error);
        if (error.code === 11000) { // Duplicate key error
            return res.status(400).json({ 
                message: 'You have already reviewed this destination. You can edit your existing review instead.' 
            });
        }
        res.status(500).json({ message: 'Error adding review', error: error.message });
    }
});

module.exports = router; 