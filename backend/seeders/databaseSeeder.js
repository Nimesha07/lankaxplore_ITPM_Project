const mongoose = require('mongoose');
const Destination = require('../models/Destination');
const Package = require('../models/Package');
const Review = require('../models/Review');
const Booking = require('../models/Booking');

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://Prashan:manjula123@cluster0.mssn6ma.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

// Sample destinations data
const destinations = [
    {
        name: 'Sigiriya',
        description: 'Ancient rock fortress and palace ruins',
        location: 'Matale District',
        image: 'sigiriya.jpg',
        category: 'History',
        bestTimeToVisit: 'January to April',
        weather: 'Tropical',
        transportation: 'Bus, Car, Tuk-tuk',
        locationDetails: {
            coordinates: {
                latitude: 7.9570,
                longitude: 80.7603
            },
            address: 'Sigiriya, Matale District, Central Province'
        }
    },
    {
        name: 'Adam\'s Peak',
        description: 'Sacred mountain with a footprint-shaped mark',
        location: 'Ratnapura District',
        image: 'adams-peak.jpg',
        category: 'Adventure',
        bestTimeToVisit: 'December to May',
        weather: 'Cool and misty',
        transportation: 'Bus, Car, Hiking',
        locationDetails: {
            coordinates: {
                latitude: 6.8096,
                longitude: 80.4992
            },
            address: 'Adam\'s Peak, Ratnapura District, Sabaragamuwa Province'
        }
    },
    {
        name: 'Sinharaja Forest',
        description: 'UNESCO World Heritage rainforest',
        location: 'Ratnapura District',
        image: 'sinharaja.jpg',
        category: 'Nature',
        bestTimeToVisit: 'January to April',
        weather: 'Rainy and humid',
        transportation: 'Bus, Car, Guided tours',
        locationDetails: {
            coordinates: {
                latitude: 6.4267,
                longitude: 80.4897
            },
            address: 'Sinharaja Forest Reserve, Ratnapura District'
        }
    }
];

// Sample packages data
const packages = [
    {
        name: 'Sigiriya Heritage Tour',
        description: 'Explore the ancient rock fortress with expert guides',
        price: 75.00,
        duration: '1 day',
        maxGroupSize: 15,
        difficulty: 'Moderate',
        rating: 4.5,
        images: ['sigiriya-tour-1.jpg', 'sigiriya-tour-2.jpg'],
        included: [
            'Professional guide',
            'Entrance fees',
            'Lunch',
            'Transportation'
        ],
        excluded: [
            'Personal expenses',
            'Tips'
        ]
    },
    {
        name: 'Adam\'s Peak Sunrise Trek',
        description: 'Experience the magical sunrise from the sacred peak',
        price: 60.00,
        duration: '1 day',
        maxGroupSize: 10,
        difficulty: 'Challenging',
        rating: 4.8,
        images: ['adams-peak-1.jpg', 'adams-peak-2.jpg'],
        included: [
            'Guide',
            'Snacks',
            'Transportation',
            'Headlamps'
        ],
        excluded: [
            'Personal expenses',
            'Tips'
        ]
    },
    {
        name: 'Sinharaja Rainforest Adventure',
        description: 'Discover the rich biodiversity of Sinharaja',
        price: 85.00,
        duration: '1 day',
        maxGroupSize: 8,
        difficulty: 'Moderate',
        rating: 4.7,
        images: ['sinharaja-1.jpg', 'sinharaja-2.jpg'],
        included: [
            'Expert naturalist guide',
            'Equipment',
            'Lunch',
            'Transportation'
        ],
        excluded: [
            'Personal expenses',
            'Tips'
        ]
    }
];

// Sample reviews data
const reviews = [
    {
        rating: 5,
        comment: 'Amazing experience! The guide was very knowledgeable.',
        user: '65f2d5e8c261b6001234abcd', // Replace with actual user ID
        package: null // Will be set after package creation
    },
    {
        rating: 4,
        comment: 'Great tour, but a bit crowded.',
        user: '65f2d5e8c261b6001234abcd', // Replace with actual user ID
        package: null // Will be set after package creation
    },
    {
        rating: 5,
        comment: 'Unforgettable experience!',
        user: '65f2d5e8c261b6001234abcd', // Replace with actual user ID
        package: null // Will be set after package creation
    }
];

// Function to seed the database
const seedDatabase = async () => {
    try {
        // Clear existing data
        await Destination.deleteMany({});
        await Package.deleteMany({});
        await Review.deleteMany({});
        await Booking.deleteMany({});

        console.log('Cleared existing data');

        // Insert destinations
        const createdDestinations = await Destination.insertMany(destinations);
        console.log('Inserted destinations');

        // Insert packages with destination references
        const packagesWithDestinations = packages.map((pkg, index) => ({
            ...pkg,
            destination: createdDestinations[index]._id
        }));
        const createdPackages = await Package.insertMany(packagesWithDestinations);
        console.log('Inserted packages');

        // Insert reviews with package references
        const reviewsWithPackages = reviews.map((review, index) => ({
            ...review,
            package: createdPackages[index]._id
        }));
        await Review.insertMany(reviewsWithPackages);
        console.log('Inserted reviews');

        console.log('Database seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

// Run the seeder
seedDatabase(); 