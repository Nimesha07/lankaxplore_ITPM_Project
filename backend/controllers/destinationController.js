const Destination = require('../models/Destination');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

// Get all destinations
exports.getAllDestinations = catchAsync(async (req, res) => {
  const destinations = await Destination.find();
  res.status(200).json({
    status: 'success',
    results: destinations.length,
    data: destinations
  });
});

// Get single destination
exports.getDestination = catchAsync(async (req, res, next) => {
  const destination = await Destination.findById(req.params.id);
  
  if (!destination) {
    return next(new AppError('No destination found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: destination
  });
});

// Create new destination
exports.createDestination = catchAsync(async (req, res) => {
  try {
    // Log the request body for debugging
    console.log('Request body:', req.body);
    console.log('Request files:', req.files);

    // Add user to request body
    req.body.user = req.user._id;
    
    // Handle image upload
    if (req.files && req.files.image && req.files.image[0]) {
      req.body.image = req.files.image[0].path;
    } else {
      throw new Error('Main image is required');
    }

    // Handle additional images
    if (req.files && req.files.additionalImages) {
      req.body.images = req.files.additionalImages.map(file => file.path);
    }
    
    const destination = await Destination.create(req.body);
    
    res.status(201).json({
      status: 'success',
      data: destination
    });
  } catch (error) {
    console.error('Error creating destination:', error);
    res.status(500).json({
      status: 'error',
      message: error.message,
      error: error
    });
  }
});

// Update destination
exports.updateDestination = catchAsync(async (req, res, next) => {
  try {
    // Log the request body and files for debugging
    console.log('Update Request body:', req.body);
    console.log('Update Request files:', req.files);
    console.log('User ID:', req.user._id);

    const destination = await Destination.findById(req.params.id);

    if (!destination) {
      return next(new AppError('No destination found with that ID', 404));
    }

    // Log destination user ID after fetching
    console.log('Destination user ID:', destination.user);

    // Check if user owns this destination or is admin
    if (destination.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return next(new AppError('You do not have permission to update this destination', 403));
    }

    // Handle image upload
    if (req.files && req.files.image && req.files.image[0]) {
      req.body.image = req.files.image[0].path;
    }

    // Handle additional images
    if (req.files && req.files.additionalImages) {
      req.body.images = req.files.additionalImages.map(file => file.path);
    }

    const updatedDestination = await Destination.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      status: 'success',
      data: updatedDestination
    });
  } catch (error) {
    console.error('Error updating destination:', error);
    res.status(500).json({
      status: 'error',
      message: error.message,
      error: error
    });
  }
});

// Delete destination
exports.deleteDestination = catchAsync(async (req, res, next) => {
  const destination = await Destination.findById(req.params.id);

  if (!destination) {
    return next(new AppError('No destination found with that ID', 404));
  }

  // Check if user owns this destination or is admin
  if (destination.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('You do not have permission to delete this destination', 403));
  }

  await Destination.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: 'success',
    data: null
  });
}); 