const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  packageName: {
    type: String,
    required: true,
    trim: true
  },
  startingPrice: {
    type: Number,
    required: true,
    min: 0
  },
  groupSize: {
    type: Number,
    required: true,
    min: 1
  },
  days: [{
    description: {
      type: String,
      required: true
    },
    packageImages: {
      type: [],
      required: true
    },
    activities: {
      type: String,
      required: true
    },
    highlights: {
      type:[],
      required: true
    },
    image2Url: {
      type: String,
      
    },
    place: {
      type: String,
      
    },
    accommodation: {
      type: String,
      required: true
    },
    mealPlan: {
      type: String,
      required: true
    },
    travelTime: {
      type: String,
      required: true
    },
    transferMode: {
      type: String,
      required: true
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Package', packageSchema); 