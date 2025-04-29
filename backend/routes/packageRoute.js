const express = require("express");
const router = express.Router();
const PackageController = require("../controllers/packageController"); // Path to PackageController

// Package routes
router.get("/", PackageController.getAllPackages); // Get all packages
router.get("/:id", PackageController.getPackageById); // Get one package by ID
router.get("/:id/reviews", PackageController.getPackageReviews);

module.exports = router; 