const express = require('express');
const router = express.Router();
const {
  createPackage,
  getAllPackages,
  getPackageById,
  updatePackage,
  deletePackage
} = require('../controllers/packageController');

// Create a new package
router.post('/', createPackage);

// Get all packages
router.get('/', getAllPackages);

// Get a single package by ID
router.get('/:id', getPackageById);

// Update a package
router.put('/:id', updatePackage);

// Delete a package
router.delete('/:id', deletePackage);

module.exports = router; 