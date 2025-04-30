const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/destination/:destinationId', activityController.getDestinationActivities);
router.get('/:id', activityController.getActivity);
router.get('/', activityController.getActivitiesByFilters);

// Protected routes (admin only)
router.post('/destination/:destinationId', protect, authorize('admin'), activityController.createActivity);
router.put('/:id', protect, authorize('admin'), activityController.updateActivity);
router.delete('/:id', protect, authorize('admin'), activityController.deleteActivity);

module.exports = router; 