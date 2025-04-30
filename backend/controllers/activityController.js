const Activity = require('../models/Activity');
const Destination = require('../models/Destination');

// Create a new activity
exports.createActivity = async (req, res) => {
    try {
        const { destinationId } = req.params;
        const activity = new Activity({
            ...req.body,
            destination: destinationId
        });

        await activity.save();

        // Add activity to destination's activities array
        await Destination.findByIdAndUpdate(
            destinationId,
            { $push: { activities: activity._id } }
        );

        res.status(201).json(activity);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all activities for a destination
exports.getDestinationActivities = async (req, res) => {
    try {
        const { destinationId } = req.params;
        const activities = await Activity.find({ destination: destinationId });
        res.json(activities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single activity
exports.getActivity = async (req, res) => {
    try {
        const activity = await Activity.findById(req.params.id);
        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }
        res.json(activity);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update an activity
exports.updateActivity = async (req, res) => {
    try {
        const activity = await Activity.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }
        res.json(activity);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete an activity
exports.deleteActivity = async (req, res) => {
    try {
        const activity = await Activity.findByIdAndDelete(req.params.id);
        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }

        // Remove activity from destination's activities array
        await Destination.findByIdAndUpdate(
            activity.destination,
            { $pull: { activities: activity._id } }
        );

        res.json({ message: 'Activity deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get activities by filters
exports.getActivitiesByFilters = async (req, res) => {
    try {
        const { difficulty, minPrice, maxPrice, availability } = req.query;
        const filter = {};

        if (difficulty) filter.difficulty = difficulty;
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }
        if (availability) filter.availability = availability;

        const activities = await Activity.find(filter);
        res.json(activities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 