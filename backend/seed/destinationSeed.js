const mongoose = require('mongoose');
const Destination = require('../models/Destination');

const destinations = [
  {
    name: "Nuwara Eliya",
    description: "Known as 'Little England', Nuwara Eliya is a picturesque hill station surrounded by tea plantations, waterfalls, and colonial architecture. The cool climate and stunning landscapes make it a perfect escape from the heat of the lowlands.",
    location: "Central Province, Sri Lanka",
    image: "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    bestTimeToVisit: "March to May",
    transportation: "Private vehicle or public bus",
    packages: ["681019e3e61ab2786411f24e"], // Nuwara Eliya Tea Country Tour
    highlights: [
      "Tea plantations",
      "Waterfalls",
      "Botanical gardens",
      "Colonial architecture",
      "Golf course"
    ],
    climate: "Cool and misty",
    elevation: "1,868m above sea level"
  },
  {
    name: "Galle",
    description: "A historic coastal city featuring the iconic Galle Fort, a UNESCO World Heritage Site. The city combines colonial architecture, pristine beaches, and a vibrant cultural scene.",
    location: "Southern Province, Sri Lanka",
    image: "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    bestTimeToVisit: "December to April",
    transportation: "Private vehicle or train",
    packages: ["681019e3e61ab2786411f24c"], // Galle Fort & Southern Beaches
    highlights: [
      "Galle Fort",
      "Beaches",
      "Lighthouse",
      "Maritime museum",
      "Shopping"
    ],
    climate: "Tropical",
    elevation: "Sea level"
  },
  {
    name: "Kandy",
    description: "The cultural capital of Sri Lanka, home to the Temple of the Sacred Tooth Relic and surrounded by lush hills. The city offers a perfect blend of history, culture, and natural beauty.",
    location: "Central Province, Sri Lanka",
    image: "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    bestTimeToVisit: "January to April",
    transportation: "Private vehicle or train",
    packages: ["681019e3e61ab2786411f24d"], // Kandy Cultural Experience
    highlights: [
      "Temple of the Tooth",
      "Botanical gardens",
      "Cultural shows",
      "Lake",
      "Markets"
    ],
    climate: "Tropical",
    elevation: "465m above sea level"
  },
  {
    name: "Sigiriya & Dambulla",
    description: "Home to the ancient rock fortress of Sigiriya and the famous Dambulla Cave Temple. This region showcases Sri Lanka's rich history and architectural marvels.",
    location: "Cultural Triangle, Sri Lanka",
    image: "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    bestTimeToVisit: "January to April",
    transportation: "Private vehicle",
    packages: ["681019e3e61ab2786411f24a"], // Sigiriya & Dambulla Day Tour
    highlights: [
      "Sigiriya Rock Fortress",
      "Dambulla Cave Temple",
      "Ancient frescoes",
      "Gardens",
      "Museums"
    ],
    climate: "Tropical",
    elevation: "370m above sea level"
  },
  {
    name: "Yala",
    description: "Sri Lanka's most famous national park, known for its high density of leopards and diverse wildlife. The park offers an unforgettable safari experience.",
    location: "Southern Province, Sri Lanka",
    image: "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    bestTimeToVisit: "February to July",
    transportation: "Safari jeep",
    packages: ["681019e3e61ab2786411f24b"], // Yala National Park Safari
    highlights: [
      "Wildlife safari",
      "Bird watching",
      "Beach",
      "Camping",
      "Photography"
    ],
    climate: "Hot and dry",
    elevation: "Sea level"
  }
];

const seedDestinations = async () => {
  try {
    // Clear existing destinations
    await Destination.deleteMany({});
    
    // Insert new destinations
    await Destination.insertMany(destinations);
    
    console.log('Destinations seeded successfully');
  } catch (error) {
    console.error('Error seeding destinations:', error);
  }
};

module.exports = seedDestinations; 