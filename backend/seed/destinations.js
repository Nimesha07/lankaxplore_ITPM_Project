const mongoose = require('mongoose');
const Destination = require('../models/Destination');
const User = require('../models/User');
require('dotenv').config();

const destinations = [
    {
        name: "Sigiriya",
        description: "Ancient rock fortress and palace complex, a UNESCO World Heritage site featuring stunning frescoes and the famous Lion's Paw entrance.",
        location: "Matale District",
        image: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
        bestTimeToVisit: "January to April",
        weather: "Tropical, hot and humid",
        transportation: "Bus, taxi, or private vehicle from Dambulla",
        locationDetails: "Located in the Matale District, about 3 hours from Colombo"
    },
    {
        name: "Kandy",
        description: "Cultural capital of Sri Lanka, home to the Temple of the Sacred Tooth Relic and the beautiful Kandy Lake.",
        location: "Central Province",
        image: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
        bestTimeToVisit: "January to April",
        weather: "Cool and pleasant",
        transportation: "Train, bus, or private vehicle from Colombo",
        locationDetails: "Located in the Central Province, about 4 hours from Colombo"
    },
    {
        name: "Galle",
        description: "Historic coastal city with a well-preserved Dutch fort, beautiful beaches, and colonial architecture.",
        location: "Southern Province",
        image: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
        bestTimeToVisit: "December to March",
        weather: "Tropical, warm and humid",
        transportation: "Train, bus, or private vehicle from Colombo",
        locationDetails: "Located in the Southern Province, about 2 hours from Colombo"
    },
    {
        name: "Nuwara Eliya",
        description: "Known as 'Little England', this hill station features tea plantations, colonial architecture, and cool climate.",
        location: "Central Province",
        image: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
        bestTimeToVisit: "March to May",
        weather: "Cool and misty",
        transportation: "Train, bus, or private vehicle from Kandy",
        locationDetails: "Located in the Central Province, about 6 hours from Colombo"
    },
    {
        name: "Anuradhapura",
        description: "Ancient capital of Sri Lanka, featuring well-preserved ruins of an ancient city and sacred Buddhist sites.",
        location: "North Central Province",
        image: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
        bestTimeToVisit: "January to April",
        weather: "Hot and dry",
        transportation: "Bus or private vehicle from Colombo",
        locationDetails: "Located in the North Central Province, about 4 hours from Colombo"
    },
    {
        name: "Polonnaruwa",
        description: "Medieval capital of Sri Lanka, featuring well-preserved ruins of palaces, temples, and statues.",
        location: "North Central Province",
        image: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
        bestTimeToVisit: "January to April",
        weather: "Hot and dry",
        transportation: "Bus or private vehicle from Colombo",
        locationDetails: "Located in the North Central Province, about 5 hours from Colombo"
    },
    {
        name: "Yala National Park",
        description: "Famous wildlife sanctuary known for its leopards, elephants, and diverse bird life.",
        location: "Southern Province",
        image: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
        bestTimeToVisit: "February to June",
        weather: "Hot and dry",
        transportation: "Private vehicle or safari jeep",
        locationDetails: "Located in the Southern Province, about 6 hours from Colombo"
    },
    {
        name: "Ella",
        description: "Scenic hill town known for its beautiful views, hiking trails, and the famous Nine Arch Bridge.",
        location: "Uva Province",
        image: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
        bestTimeToVisit: "January to April",
        weather: "Cool and pleasant",
        transportation: "Train, bus, or private vehicle",
        locationDetails: "Located in the Uva Province, about 7 hours from Colombo"
    },
    {
        name: "Mirissa",
        description: "Popular beach destination known for whale watching, surfing, and beautiful sunsets.",
        location: "Southern Province",
        image: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
        bestTimeToVisit: "December to April",
        weather: "Tropical, warm and humid",
        transportation: "Bus or private vehicle from Colombo",
        locationDetails: "Located in the Southern Province, about 3 hours from Colombo"
    },
    {
        name: "Jaffna",
        description: "Cultural capital of the Northern Province, known for its unique Tamil culture, temples, and cuisine.",
        location: "Northern Province",
        image: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
        bestTimeToVisit: "January to April",
        weather: "Hot and dry",
        transportation: "Train, bus, or private vehicle from Colombo",
        locationDetails: "Located in the Northern Province, about 8 hours from Colombo"
    }
];

const seedDestinations = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Create a default admin user if it doesn't exist
        let adminUser = await User.findOne({ email: 'admin@lankaxplore.com' });
        if (!adminUser) {
            adminUser = await User.create({
                name: 'Admin User',
                email: 'admin@lankaxplore.com',
                password: 'admin123',
                role: 'admin'
            });
            console.log('Created admin user');
        }

        // Clear existing destinations
        await Destination.deleteMany({});
        console.log('Cleared existing destinations');

        // Add user ID to all destinations
        const destinationsWithUser = destinations.map(dest => ({
            ...dest,
            user: adminUser._id
        }));

        // Add new destinations
        const createdDestinations = await Destination.insertMany(destinationsWithUser);
        console.log(`Added ${createdDestinations.length} destinations`);

        process.exit(0);
    } catch (error) {
        console.error('Error seeding destinations:', error);
        process.exit(1);
    }
};

seedDestinations(); 