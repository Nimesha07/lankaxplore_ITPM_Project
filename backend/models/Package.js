const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    destination: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Destination",
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    perPersonPrice: {
      type: Number,
      required: true
    },
    duration: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    distance: {
      type: String,
      required: true
    },
    vehicleType: {
      type: String,
      required: true
    },
    maxPeople: {
      type: Number,
      required: true
    },
    includes: [{
      type: String
    }],
    activities: [{
      type: String
    }],
    facilities: [{
      type: String
    }],
    excludes: [{ type: String }],
    images: [{
      type: String
    }],
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Package", packageSchema); 