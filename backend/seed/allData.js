const mongoose = require('mongoose');
const Destination = require('../models/Destination');
const Package = require('../models/Package');
const Review = require('../models/Review');
const Booking = require('../models/Booking');

// Existing user IDs
const USERS = {
    MANJULA: "681018ba20f36aa516f83851",
    NILUMINDHA: "68101e5d87f1aa3157b017f8",
    ADMIN: "68113c2afc01e4e6589e77ee",
    ADMIN2: "681156a328a5a0e80ae49c95"
};

// Destination seed data
const destinations = [
    {
        name: "Sigiriya",
        description: "Ancient rock fortress and palace complex with stunning frescoes",
        location: "Matale District",
        image: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800&auto=format&fit=crop&q=60",
        category: "History",
        user: USERS.ADMIN,
        bestTimeToVisit: "January to April",
        weather: "Tropical",
        transportation: "Bus, Car, Tuk-tuk",
        locationDetails: "3 hours from Colombo",
        rating: 4.8,
        highlights: ["Lion's Gate", "Mirror Wall", "Water Gardens"]
    },
    {
        name: "Yala National Park",
        description: "Largest wildlife sanctuary famous for leopards",
        location: "Southern Province",
        image: "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&auto=format&fit=crop&q=60",
        category: "Wildlife",
        user: USERS.ADMIN,
        bestTimeToVisit: "February to July",
        weather: "Hot and Dry",
        transportation: "Safari Jeep",
        locationDetails: "5 hours from Colombo",
        rating: 4.7,
        highlights: ["Leopard Watching", "Bird Watching", "Elephant Herds"]
    },
    {
        name: "Ella",
        description: "Scenic mountain village with hiking trails",
        location: "Uva Province",
        image: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800&auto=format&fit=crop&q=60",
        category: "Nature",
        user: USERS.ADMIN,
        bestTimeToVisit: "March to May",
        weather: "Cool and Pleasant",
        transportation: "Train, Bus",
        locationDetails: "6 hours from Colombo",
        rating: 4.6,
        highlights: ["Nine Arch Bridge", "Little Adam's Peak", "Ella Rock"]
    },
    {
        name: "Galle Fort",
        description: "Historic Dutch fort with colonial architecture",
        location: "Southern Province",
        image: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800&auto=format&fit=crop&q=60",
        category: "History",
        user: USERS.ADMIN,
        bestTimeToVisit: "December to March",
        weather: "Tropical",
        transportation: "Bus, Car, Tuk-tuk",
        locationDetails: "2 hours from Colombo",
        rating: 4.5,
        highlights: ["Dutch Fort", "Lighthouse", "Beach"]
    },
    {
        name: "Kandy",
        description: "Cultural capital with Temple of the Sacred Tooth Relic",
        location: "Central Province",
        image: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800&auto=format&fit=crop&q=60",
        category: "Cultural",
        user: USERS.ADMIN,
        bestTimeToVisit: "January to April",
        weather: "Cool and Pleasant",
        transportation: "Train, Bus, Car",
        locationDetails: "4 hours from Colombo",
        rating: 4.7,
        highlights: ["Temple of the Tooth", "Botanical Gardens", "Kandy Lake"]
    },
    {
        name: "Mirissa",
        description: "Popular beach destination for whale watching",
        location: "Southern Province",
        image: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800&auto=format&fit=crop&q=60",
        category: "Beach",
        user: USERS.ADMIN,
        bestTimeToVisit: "December to April",
        weather: "Tropical",
        transportation: "Bus, Car",
        locationDetails: "3 hours from Colombo",
        rating: 4.6,
        highlights: ["Whale Watching", "Beach", "Surfing"]
    },
    {
        name: "Nuwara Eliya",
        description: "Hill station known as 'Little England'",
        location: "Central Province",
        image: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800&auto=format&fit=crop&q=60",
        category: "Nature",
        user: USERS.ADMIN,
        bestTimeToVisit: "March to May",
        weather: "Cool and Misty",
        transportation: "Train, Bus, Car",
        locationDetails: "6 hours from Colombo",
        rating: 4.5,
        highlights: ["Tea Plantations", "Horton Plains", "Waterfalls"]
    },
    {
        name: "Anuradhapura",
        description: "Ancient capital with sacred Buddhist sites",
        location: "North Central Province",
        image: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800&auto=format&fit=crop&q=60",
        category: "History",
        user: USERS.ADMIN,
        bestTimeToVisit: "January to April",
        weather: "Hot and Dry",
        transportation: "Bus, Car",
        locationDetails: "4 hours from Colombo",
        rating: 4.6,
        highlights: ["Sacred Bodhi Tree", "Ruwanwelisaya", "Jetavanaramaya"]
    },
    {
        name: "Polonnaruwa",
        description: "Medieval capital with well-preserved ruins",
        location: "North Central Province",
        image: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800&auto=format&fit=crop&q=60",
        category: "History",
        user: USERS.ADMIN,
        bestTimeToVisit: "January to April",
        weather: "Hot and Dry",
        transportation: "Bus, Car",
        locationDetails: "5 hours from Colombo",
        rating: 4.5,
        highlights: ["Ancient Ruins", "Gal Vihara", "Parakrama Samudra"]
    },
    {
        name: "Sinharaja Forest",
        description: "UNESCO World Heritage rainforest",
        location: "Sabaragamuwa Province",
        image: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800&auto=format&fit=crop&q=60",
        category: "Nature",
        user: USERS.ADMIN,
        bestTimeToVisit: "January to April",
        weather: "Rainy and Humid",
        transportation: "Bus, Car",
        locationDetails: "4 hours from Colombo",
        rating: 4.7,
        highlights: ["Bird Watching", "Hiking", "Waterfalls"]
    },
    {
        name: "Kitulgala",
        description: "Adventure hub for white water rafting and jungle trekking",
        location: "Sabaragamuwa Province",
        image: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800&auto=format&fit=crop&q=60",
        category: "Adventure",
        user: USERS.ADMIN,
        bestTimeToVisit: "December to April",
        weather: "Tropical",
        transportation: "Bus, Car",
        locationDetails: "3 hours from Colombo",
        rating: 4.8,
        highlights: ["White Water Rafting", "Jungle Trekking", "Waterfall Abseiling"]
    },
    {
        name: "Horton Plains",
        description: "High-altitude plateau with stunning hiking trails",
        location: "Central Province",
        image: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800&auto=format&fit=crop&q=60",
        category: "Adventure",
        user: USERS.ADMIN,
        bestTimeToVisit: "March to May",
        weather: "Cool and Misty",
        transportation: "Car, Jeep",
        locationDetails: "7 hours from Colombo",
        rating: 4.7,
        highlights: ["World's End", "Baker's Falls", "Nature Trails"]
    },
    {
        name: "Arugam Bay",
        description: "Famous surf spot with perfect waves",
        location: "Eastern Province",
        image: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800&auto=format&fit=crop&q=60",
        category: "Adventure",
        user: USERS.ADMIN,
        bestTimeToVisit: "April to October",
        weather: "Hot and Dry",
        transportation: "Bus, Car",
        locationDetails: "8 hours from Colombo",
        rating: 4.6,
        highlights: ["Surfing", "Lagoon Safari", "Bird Watching"]
    }
];

// Package seed data (to be filled with destination IDs after creation)
const createPackages = (destinationIds) => ([
    {
        name: "Sigiriya Heritage Tour",
        description: "Explore the ancient rock fortress with expert guides",
        destination: destinationIds[0],
        price: 150,
        perPersonPrice: 75,
        duration: "1 Day",
        location: "Matale District",
        distance: "169 km from Colombo",
        vehicleType: "Air Conditioned Car",
        maxPeople: 4,
        includes: ["Professional Guide", "Entrance Fees", "Lunch", "Water"],
        activities: ["Rock Climbing", "Photography", "Historical Tour"],
        facilities: ["Parking", "Rest Areas", "Souvenir Shop"],
        excludes: ["Personal Expenses", "Insurance"],
        images: ["https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800&auto=format&fit=crop&q=60"],
        rating: 4.8
    },
    {
        name: "Yala Safari Adventure",
        description: "Full-day safari experience in Yala National Park",
        destination: destinationIds[1],
        price: 200,
        perPersonPrice: 100,
        duration: "1 Day",
        location: "Southern Province",
        distance: "305 km from Colombo",
        vehicleType: "4x4 Safari Jeep",
        maxPeople: 6,
        includes: ["Safari Guide", "Park Entrance", "Breakfast", "Water"],
        activities: ["Wildlife Safari", "Bird Watching", "Photography"],
        facilities: ["Comfortable Seating", "First Aid Kit"],
        excludes: ["Personal Expenses", "Insurance"],
        images: ["https://images.unsplash.com/photo-1548013146-72479768bada?w=800&auto=format&fit=crop&q=60"],
        rating: 4.7
    },
    {
        name: "Ella Hiking Experience",
        description: "Guided hiking tour in Ella",
        destination: destinationIds[2],
        price: 120,
        perPersonPrice: 60,
        duration: "1 Day",
        location: "Ella",
        distance: "200 km from Colombo",
        vehicleType: "Mini Van",
        maxPeople: 8,
        includes: ["Hiking Guide", "Packed Lunch", "Water", "First Aid"],
        activities: ["Hiking", "Photography", "Tea Plantation Visit"],
        facilities: ["Rest Stops", "Picnic Areas"],
        excludes: ["Personal Expenses", "Insurance"],
        images: ["https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800&auto=format&fit=crop&q=60"],
        rating: 4.6
    },
    {
        name: "Galle Fort Heritage Walk",
        description: "Explore the historic Dutch fort",
        destination: destinationIds[3],
        price: 80,
        perPersonPrice: 40,
        duration: "1 Day",
        location: "Galle",
        distance: "120 km from Colombo",
        vehicleType: "Air Conditioned Car",
        maxPeople: 6,
        includes: ["Guide", "Entrance Fees", "Refreshments"],
        activities: ["Fort Tour", "Shopping", "Beach Visit"],
        facilities: ["Rest Areas", "Souvenir Shops"],
        excludes: ["Personal Expenses", "Lunch"],
        images: ["https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800&auto=format&fit=crop&q=60"],
        rating: 4.5
    },
    {
        name: "Kandy Cultural Experience",
        description: "Immerse in Kandy's rich culture",
        destination: destinationIds[4],
        price: 180,
        perPersonPrice: 90,
        duration: "1 Day",
        location: "Kandy",
        distance: "115 km from Colombo",
        vehicleType: "Air Conditioned Car",
        maxPeople: 4,
        includes: ["Guide", "Temple Entry", "Cultural Show", "Lunch"],
        activities: ["Temple Visit", "Botanical Gardens", "Cultural Show"],
        facilities: ["Rest Areas", "Souvenir Shops"],
        excludes: ["Personal Expenses", "Insurance"],
        images: ["https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800&auto=format&fit=crop&q=60"],
        rating: 4.7
    },
    {
        name: "Mirissa Whale Watching",
        description: "Experience whale watching in Mirissa",
        destination: destinationIds[5],
        price: 150,
        perPersonPrice: 75,
        duration: "1 Day",
        location: "Mirissa",
        distance: "150 km from Colombo",
        vehicleType: "Boat",
        maxPeople: 20,
        includes: ["Boat Trip", "Breakfast", "Guide"],
        activities: ["Whale Watching", "Dolphin Spotting", "Beach Time"],
        facilities: ["Life Jackets", "Rest Areas"],
        excludes: ["Personal Expenses", "Insurance"],
        images: ["https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800&auto=format&fit=crop&q=60"],
        rating: 4.6
    },
    {
        name: "Nuwara Eliya Tea Trail",
        description: "Explore tea plantations and waterfalls",
        destination: destinationIds[6],
        price: 160,
        perPersonPrice: 80,
        duration: "1 Day",
        location: "Nuwara Eliya",
        distance: "180 km from Colombo",
        vehicleType: "Air Conditioned Car",
        maxPeople: 6,
        includes: ["Guide", "Tea Factory Tour", "Lunch"],
        activities: ["Tea Tasting", "Waterfall Visit", "Hiking"],
        facilities: ["Rest Areas", "Tea Shop"],
        excludes: ["Personal Expenses", "Insurance"],
        images: ["https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800&auto=format&fit=crop&q=60"],
        rating: 4.5
    },
    {
        name: "Anuradhapura Heritage Tour",
        description: "Discover ancient Buddhist sites",
        destination: destinationIds[7],
        price: 170,
        perPersonPrice: 85,
        duration: "1 Day",
        location: "Anuradhapura",
        distance: "205 km from Colombo",
        vehicleType: "Air Conditioned Car",
        maxPeople: 4,
        includes: ["Guide", "Entrance Fees", "Lunch"],
        activities: ["Temple Visits", "Museum Tour", "Cycling"],
        facilities: ["Rest Areas", "Souvenir Shops"],
        excludes: ["Personal Expenses", "Insurance"],
        images: ["https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800&auto=format&fit=crop&q=60"],
        rating: 4.6
    },
    {
        name: "Polonnaruwa Ancient City Tour",
        description: "Explore medieval ruins and temples",
        destination: destinationIds[8],
        price: 165,
        perPersonPrice: 82,
        duration: "1 Day",
        location: "Polonnaruwa",
        distance: "215 km from Colombo",
        vehicleType: "Air Conditioned Car",
        maxPeople: 4,
        includes: ["Guide", "Entrance Fees", "Lunch"],
        activities: ["Ruins Tour", "Museum Visit", "Cycling"],
        facilities: ["Rest Areas", "Souvenir Shops"],
        excludes: ["Personal Expenses", "Insurance"],
        images: ["https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800&auto=format&fit=crop&q=60"],
        rating: 4.5
    },
    {
        name: "Sinharaja Rainforest Adventure",
        description: "Experience the rich biodiversity",
        destination: destinationIds[9],
        price: 140,
        perPersonPrice: 70,
        duration: "1 Day",
        location: "Sinharaja",
        distance: "160 km from Colombo",
        vehicleType: "4x4 Vehicle",
        maxPeople: 8,
        includes: ["Guide", "Entrance Fees", "Lunch"],
        activities: ["Bird Watching", "Hiking", "Waterfall Visit"],
        facilities: ["Rest Areas", "First Aid Kit"],
        excludes: ["Personal Expenses", "Insurance"],
        images: ["https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800&auto=format&fit=crop&q=60"],
        rating: 4.7
    }
]);

// Review seed data (to be filled with destination IDs after creation)
const createReviews = (destinationIds) => ([
    {
        user: USERS.MANJULA,
        destination: destinationIds[0], // Sigiriya
        rating: 5,
        comment: "Breathtaking views from the top of the rock fortress! The ancient frescoes were well-preserved and the guide was very knowledgeable about the history.",
        images: ["https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800&auto=format&fit=crop&q=60"],
        isVerified: true
    },
    {
        user: USERS.NILUMINDHA,
        destination: destinationIds[1], // Yala National Park
        rating: 4,
        comment: "Amazing wildlife experience! We saw leopards, elephants, and many birds. The safari jeep was comfortable and the guide was excellent at spotting animals.",
        images: ["https://images.unsplash.com/photo-1548013146-72479768bada?w=800&auto=format&fit=crop&q=60"],
        isVerified: true
    },
    {
        user: USERS.MANJULA,
        destination: destinationIds[2], // Ella
        rating: 5,
        comment: "The Nine Arch Bridge and Little Adam's Peak were absolutely stunning! The hiking trails were well-maintained and the views were worth every step.",
        images: ["https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800&auto=format&fit=crop&q=60"],
        isVerified: true
    },
    {
        user: USERS.NILUMINDHA,
        destination: destinationIds[3], // Galle Fort
        rating: 4,
        comment: "Beautiful colonial architecture and a charming atmosphere. The lighthouse and the old Dutch buildings were fascinating. Great place for photography!",
        images: ["https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800&auto=format&fit=crop&q=60"],
        isVerified: true
    },
    {
        user: USERS.MANJULA,
        destination: destinationIds[4], // Kandy
        rating: 5,
        comment: "The Temple of the Tooth was a spiritual experience. The botanical gardens were beautiful and the cultural show was mesmerizing. A must-visit destination!",
        images: ["https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800&auto=format&fit=crop&q=60"],
        isVerified: true
    },
    {
        user: USERS.NILUMINDHA,
        destination: destinationIds[5], // Mirissa
        rating: 5,
        comment: "Whale watching was an unforgettable experience! The beach was pristine and the sunset was magical. Perfect for a relaxing getaway.",
        images: ["https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800&auto=format&fit=crop&q=60"],
        isVerified: true
    },
    {
        user: USERS.MANJULA,
        destination: destinationIds[6], // Nuwara Eliya
        rating: 4,
        comment: "The tea plantations were beautiful and the cool climate was refreshing. The colonial architecture added to the charm of this 'Little England'.",
        images: ["https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800&auto=format&fit=crop&q=60"],
        isVerified: true
    },
    {
        user: USERS.NILUMINDHA,
        destination: destinationIds[7], // Anuradhapura
        rating: 5,
        comment: "The ancient ruins and sacred sites were magnificent. The Sacred Bodhi Tree was particularly impressive. A great place to learn about Sri Lanka's history.",
        images: ["https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800&auto=format&fit=crop&q=60"],
        isVerified: true
    },
    {
        user: USERS.MANJULA,
        destination: destinationIds[8], // Polonnaruwa
        rating: 4,
        comment: "The well-preserved ruins and statues were fascinating. The Gal Vihara was particularly impressive. Great place for history enthusiasts!",
        images: ["https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800&auto=format&fit=crop&q=60"],
        isVerified: true
    },
    {
        user: USERS.NILUMINDHA,
        destination: destinationIds[9], // Sinharaja Forest
        rating: 5,
        comment: "The biodiversity was incredible! We saw many rare birds and beautiful waterfalls. The guided tour was informative and the forest was well-preserved.",
        images: ["https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800&auto=format&fit=crop&q=60"],
        isVerified: true
    }
]);

// Booking seed data (to be filled with package IDs after creation)
const createBookings = (packageIds) => ([
    {
        user: USERS.MANJULA,
        package: packageIds[0],
        startDate: new Date("2024-05-15"),
        endDate: new Date("2024-05-15"),
        numberOfPeople: 2,
        totalPrice: 150,
        status: 'confirmed',
        paymentStatus: 'paid',
        specialRequests: "Early morning start preferred"
    },
    {
        user: USERS.NILUMINDHA,
        package: packageIds[1],
        startDate: new Date("2024-06-01"),
        endDate: new Date("2024-06-01"),
        numberOfPeople: 4,
        totalPrice: 400,
        status: 'confirmed',
        paymentStatus: 'paid',
        specialRequests: "Vegetarian lunch needed"
    },
    {
        user: USERS.MANJULA,
        package: packageIds[2],
        startDate: new Date("2024-05-20"),
        endDate: new Date("2024-05-20"),
        numberOfPeople: 3,
        totalPrice: 180,
        status: 'pending',
        paymentStatus: 'pending',
        specialRequests: "Need hiking gear"
    },
    {
        user: USERS.NILUMINDHA,
        package: packageIds[3],
        startDate: new Date("2024-06-15"),
        endDate: new Date("2024-06-15"),
        numberOfPeople: 2,
        totalPrice: 80,
        status: 'confirmed',
        paymentStatus: 'paid',
        specialRequests: "Photography tour preferred"
    },
    {
        user: USERS.MANJULA,
        package: packageIds[4],
        startDate: new Date("2024-05-25"),
        endDate: new Date("2024-05-25"),
        numberOfPeople: 4,
        totalPrice: 360,
        status: 'confirmed',
        paymentStatus: 'paid',
        specialRequests: "Evening cultural show preferred"
    },
    {
        user: USERS.NILUMINDHA,
        package: packageIds[5],
        startDate: new Date("2024-06-10"),
        endDate: new Date("2024-06-10"),
        numberOfPeople: 2,
        totalPrice: 150,
        status: 'pending',
        paymentStatus: 'pending',
        specialRequests: "Early morning whale watching"
    },
    {
        user: USERS.MANJULA,
        package: packageIds[6],
        startDate: new Date("2024-05-30"),
        endDate: new Date("2024-05-30"),
        numberOfPeople: 3,
        totalPrice: 240,
        status: 'confirmed',
        paymentStatus: 'paid',
        specialRequests: "Tea tasting session preferred"
    },
    {
        user: USERS.NILUMINDHA,
        package: packageIds[7],
        startDate: new Date("2024-06-20"),
        endDate: new Date("2024-06-20"),
        numberOfPeople: 2,
        totalPrice: 170,
        status: 'confirmed',
        paymentStatus: 'paid',
        specialRequests: "Temple visit in morning"
    },
    {
        user: USERS.MANJULA,
        package: packageIds[8],
        startDate: new Date("2024-06-05"),
        endDate: new Date("2024-06-05"),
        numberOfPeople: 2,
        totalPrice: 165,
        status: 'pending',
        paymentStatus: 'pending',
        specialRequests: "Cycling tour preferred"
    },
    {
        user: USERS.NILUMINDHA,
        package: packageIds[9],
        startDate: new Date("2024-06-25"),
        endDate: new Date("2024-06-25"),
        numberOfPeople: 4,
        totalPrice: 280,
        status: 'confirmed',
        paymentStatus: 'paid',
        specialRequests: "Bird watching in morning"
    }
]);

const seedDatabase = async () => {
    try {
        // Connect to MongoDB Atlas
        await mongoose.connect('mongodb+srv://Prashan:manjula123@cluster0.mssn6ma.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');

        // Drop existing indexes
        await Review.collection.dropIndexes();
        console.log('Dropped existing indexes');

        // Clear existing data
        await Destination.deleteMany({});
        await Package.deleteMany({});
        await Review.deleteMany({});
        await Booking.deleteMany({});
        console.log('Cleared existing data');

        // Insert destinations
        const createdDestinations = await Destination.insertMany(destinations);
        console.log('Created destinations');

        // Create and insert packages
        const packages = createPackages(createdDestinations.map(dest => dest._id));
        const createdPackages = await Package.insertMany(packages);
        console.log('Created packages');

        // Create and insert reviews (now using destination IDs)
        const reviews = createReviews(createdDestinations.map(dest => dest._id));
        await Review.insertMany(reviews);
        console.log('Created reviews');

        // Create and insert bookings
        const bookings = createBookings(createdPackages.map(pkg => pkg._id));
        await Booking.insertMany(bookings);
        console.log('Created bookings');

        console.log('Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase(); 