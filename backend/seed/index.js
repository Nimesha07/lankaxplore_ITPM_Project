const mongoose = require('mongoose');
const Destination = require('../models/Destination');
const Package = require('../models/Package');
const Review = require('../models/Review');
const User = require('../models/User');
require('dotenv').config();

const destinations = [
  {
    name: 'Sigiriya',
    description: 'Ancient rock fortress with stunning frescoes and gardens',
    location: 'Matale District',
    image: 'https://images.unsplash.com/photo-1566136191353-3a1f3b5b5b5b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    user: '65f1a1b1b1b1b1b1b1b1b1b1' // Default user ID
  },
  {
    name: 'Kandy',
    description: 'Cultural capital with the Temple of the Sacred Tooth Relic',
    location: 'Central Province',
    image: 'https://images.unsplash.com/photo-1566136191353-3a1f3b5b5b5b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    user: '65f1a1b1b1b1b1b1b1b1b1b1' // Default user ID
  },
  {
    name: 'Galle',
    description: 'Historic coastal city with Dutch colonial architecture',
    location: 'Southern Province',
    image: 'https://images.unsplash.com/photo-1566136191353-3a1f3b5b5b5b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    user: '65f1a1b1b1b1b1b1b1b1b1b1' // Default user ID
  }
];

const packages = [
  {
    name: 'Cultural Heritage Tour',
    description: 'Explore Sri Lanka\'s rich cultural heritage',
    destination: null, // Will be set after destinations are created
    price: 299.99,
    duration: 7,
    maxPeople: 10,
    includes: ['Accommodation', 'Transportation', 'Meals', 'Guide'],
    excludes: ['Airfare', 'Personal expenses'],
    images: ['https://images.unsplash.com/photo-1566136191353-3a1f3b5b5b5b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'],
    rating: 4.5,
    reviews: [],
    vehicleType: 'Luxury Van',
    distance: '500 km',
    location: 'Cultural Triangle',
    perPersonPrice: 299.99
  }
];

const reviews = [
  {
    user: '65f1a1b1b1b1b1b1b1b1b1b1', // Default user ID
    package: null, // Will be set after packages are created
    rating: 5,
    comment: 'Amazing experience! The tour was well organized and the guide was knowledgeable.',
    images: ['https://images.unsplash.com/photo-1566136191353-3a1f3b5b5b5b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'],
    likes: [] // Empty array of ObjectIds
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB Atlas');

    // Create a default user if it doesn't exist
    let defaultUser = await User.findOne({ email: 'admin@example.com' });
    if (!defaultUser) {
      defaultUser = await User.create({
        username: 'admin',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin'
      });
    }

    // Update user IDs in seed data
    const userId = defaultUser._id;
    destinations.forEach(dest => dest.user = userId);
    reviews.forEach(rev => rev.user = userId);

    // Clear existing data
    await Destination.deleteMany({});
    await Package.deleteMany({});
    await Review.deleteMany({});

    // Seed destinations
    const createdDestinations = await Destination.insertMany(destinations);
    console.log('Destinations seeded successfully');

    // Update package destination IDs
    packages.forEach(pkg => {
      pkg.destination = createdDestinations[0]._id;
    });

    // Seed packages
    const createdPackages = await Package.insertMany(packages);
    console.log('Packages seeded successfully');

    // Update review package IDs
    reviews.forEach(review => {
      review.package = createdPackages[0]._id;
    });

    // Seed reviews
    await Review.insertMany(reviews);
    console.log('Reviews seeded successfully');

    // Update package reviews
    const createdReviews = await Review.find({ package: createdPackages[0]._id });
    await Package.findByIdAndUpdate(createdPackages[0]._id, {
      reviews: createdReviews.map(review => review._id)
    });

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();