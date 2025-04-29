const Package = require("../models/Package"); // Path to the Package model

const PackageController = {
  // Get all packages
  async getAllPackages(req, res) {
    try {
      const packages = await Package.find();
      res.status(200).json(packages);
    } catch (error) {
      console.error("Error fetching packages:", error.message);
      res.status(500).json({ error: "Failed to fetch packages" });
    }
  },

  // Get one package by ID
  async getPackageById(req, res) {
    const { id } = req.params; // Package ID
    try {
      const packageData = await Package.findById(id).populate({
        path: "reviews",
        populate: { path: "user", select: "username profileImage" }, // Populate user details in reviews
      });
      if (!packageData) {
        return res.status(404).json({ error: "Package not found" });
      }
      res.status(200).json(packageData);
    } catch (error) {
      console.error("Error fetching package:", error.message);
      res.status(500).json({ error: "Failed to fetch package" });
    }
  },

  async getPackageReviews(req, res) {
    const { id } = req.params; // Package ID
    try {
      const packageData = await Package.findById(id).populate({
        path: "reviews",
        populate: { path: "user", select: "username profileImage" },
      });
  
      if (!packageData) {
        return res.status(404).json({ error: "Package not found" });
      }
  
      const reviews = packageData.reviews || []; // Default to an empty array if reviews are undefined
  
      // Calculate rating stats
      const totalReviews = reviews.length;
      const ratingStats = reviews.reduce((acc, review) => {
        acc[review.rating] = (acc[review.rating] || 0) + 1;
        return acc;
      }, {});
  
      const averageRating =
        totalReviews > 0
          ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
          : 0;
  
      res.status(200).json({
        reviews,
        ratingStats,
        averageRating,
        totalReviews,
      });
    } catch (error) {
      console.error("Error fetching reviews:", error.message);
      res.status(500).json({ error: "Failed to fetch reviews" });
    }
  }
};

module.exports = PackageController; 