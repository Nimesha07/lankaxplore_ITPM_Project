const mongoose = require('mongoose');
const Package = require('../models/Package');

const packages = [
  {
    name: "Nuwara Eliya Tea Country Tour",
    description: "Explore the beautiful tea plantations of Nuwara Eliya, visit a tea factory, and enjoy the cool climate of this hill station. Experience the colonial charm and natural beauty of 'Little England'.",
    price: 160,
    perPersonPrice: 80,
    duration: "2 Days",
    location: "Nuwara Eliya",
    distance: "180 km from Colombo",
    vehicleType: "Air-conditioned van",
    maxPeople: 6,
    includes: [
      "Transportation",
      "Accommodation",
      "Meals",
      "Tea factory tour",
      "Entrance fees",
      "Guide"
    ],
    activities: [
      "Tea plantation visit",
      "Tea factory tour",
      "Waterfall visit",
      "Botanical garden tour",
      "City tour"
    ],
    facilities: [
      "Air-conditioned vehicle",
      "Professional guide",
      "Hotel pickup/dropoff",
      "Bottled water",
      "First aid kit"
    ],
    images: [
      "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    ],
    rating: 4.5,
    reviews: []
  },
  {
    name: "Galle Fort & Southern Beaches",
    description: "Discover the historic Galle Fort, a UNESCO World Heritage Site, and relax on the beautiful southern beaches. Experience the perfect blend of history and coastal beauty.",
    price: 180,
    perPersonPrice: 90,
    duration: "2 Days",
    location: "Galle",
    distance: "120 km from Colombo",
    vehicleType: "Air-conditioned car",
    maxPeople: 4,
    includes: [
      "Transportation",
      "Accommodation",
      "Meals",
      "Fort tour",
      "Beach access",
      "Guide"
    ],
    activities: [
      "Galle Fort tour",
      "Beach visit",
      "Lighthouse visit",
      "Shopping",
      "Sunset viewing"
    ],
    facilities: [
      "Air-conditioned vehicle",
      "Professional guide",
      "Hotel pickup/dropoff",
      "Beach equipment",
      "First aid kit"
    ],
    images: [
      "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    ],
    rating: 4.7,
    reviews: []
  },
  {
    name: "Kandy Cultural Experience",
    description: "Immerse yourself in Sri Lankan culture with visits to the Temple of the Sacred Tooth Relic, Royal Botanical Gardens, and traditional cultural shows.",
    price: 120,
    perPersonPrice: 60,
    duration: "1 Day",
    location: "Kandy",
    distance: "115 km from Colombo",
    vehicleType: "Air-conditioned van",
    maxPeople: 8,
    includes: [
      "Transportation",
      "Meals",
      "Entrance fees",
      "Cultural show",
      "Guide"
    ],
    activities: [
      "Temple of the Tooth visit",
      "Botanical garden tour",
      "Cultural show",
      "City tour",
      "Market visit"
    ],
    facilities: [
      "Air-conditioned vehicle",
      "Professional guide",
      "Hotel pickup/dropoff",
      "Bottled water",
      "First aid kit"
    ],
    images: [
      "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    ],
    rating: 4.3,
    reviews: []
  },
  {
    name: "Sigiriya & Dambulla Day Tour",
    description: "Explore the ancient rock fortress of Sigiriya and the famous Dambulla Cave Temple. Experience the rich history and architectural marvels of ancient Sri Lanka.",
    price: 150,
    perPersonPrice: 75,
    duration: "1 Day",
    location: "Sigiriya, Dambulla",
    distance: "170 km from Colombo",
    vehicleType: "Air-conditioned van",
    maxPeople: 6,
    includes: [
      "Transportation",
      "Meals",
      "Entrance fees",
      "Guide"
    ],
    activities: [
      "Sigiriya Rock climb",
      "Dambulla Cave Temple visit",
      "Ancient frescoes viewing",
      "Gardens tour",
      "Museum visit"
    ],
    facilities: [
      "Air-conditioned vehicle",
      "Professional guide",
      "Hotel pickup/dropoff",
      "Bottled water",
      "First aid kit"
    ],
    images: [
      "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    ],
    rating: 4.6,
    reviews: []
  },
  {
    name: "Yala National Park Safari",
    description: "Experience the thrill of spotting leopards, elephants, and other wildlife in their natural habitat. Enjoy an unforgettable safari adventure in Sri Lanka's most famous national park.",
    price: 200,
    perPersonPrice: 100,
    duration: "2 Days",
    location: "Yala",
    distance: "300 km from Colombo",
    vehicleType: "Safari jeep",
    maxPeople: 6,
    includes: [
      "Transportation",
      "Accommodation",
      "Meals",
      "Safari tours",
      "Park entrance",
      "Guide"
    ],
    activities: [
      "Wildlife safari",
      "Bird watching",
      "Beach visit",
      "Camping",
      "Photography"
    ],
    facilities: [
      "Safari jeep",
      "Professional guide",
      "Hotel pickup/dropoff",
      "Binoculars",
      "First aid kit"
    ],
    images: [
      "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    ],
    rating: 4.8,
    reviews: []
  }
];

const seedPackages = async () => {
  try {
    // Clear existing packages
    await Package.deleteMany({});
    
    // Insert new packages
    await Package.insertMany(packages);
    
    console.log('Packages seeded successfully');
  } catch (error) {
    console.error('Error seeding packages:', error);
  }
};

module.exports = seedPackages; 