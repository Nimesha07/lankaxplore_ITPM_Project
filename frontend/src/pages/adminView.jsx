import React, { useState } from "react";
import {FaHotel, FaUtensils, FaCar, FaClock, FaStar, FaRegStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import 'bootstrap/dist/css/bootstrap.min.css';

// Add custom CSS for hiding scrollbar
// // const scrollbarStyle = {
// //   '&::-webkit-scrollbar': {
// //     display: 'none'
// //   },
//   '-ms-overflow-style': 'none',
//   'scrollbarWidth': 'none'
// };

const packages = [
  {
    id: 1,
    name: "Tour Package 3 Days",
    price: 675,
    image: "/assets/images/4day.jpg",
    description: "A beautiful 3-day tour that takes you through the heart of Sri Lanka's rich culture and natural beauty.",
    duration: "3 Days / 2 Nights",
    days: [
      {
        day: 1,
        description: "Explore the ancient city of Sigiriya and its magnificent rock fortress",
        activities: "Climb Sigiriya Rock, Visit Dambulla Cave Temple, Cultural Dance Show",
        highlights: ["/assets/images/seegeriya.jpg", "/assets/images/dambulle.jpg"],
        accommodation: "Heritance Kandalama Hotel",
        mealPlan: "Breakfast, Lunch, Dinner",
        travelTime: "4 hours",
        transferMode: "Air-conditioned vehicle"
      },
      {
        day: 2,
        description: "Discover the cultural triangle and ancient ruins",
        activities: "Visit Polonnaruwa Ancient City, Explore Minneriya National Park",
        highlights: ["/assets/images/4day.jpg", "/assets/images/minneriyajeep.jpg"],
        accommodation: "Heritance Kandalama Hotel",
        mealPlan: "Breakfast, Lunch, Dinner",
        travelTime: "3 hours",
        transferMode: "Air-conditioned vehicle"
      },
      {
        day: 3,
        description: "Experience the cultural heritage of Kandy",
        activities: "Visit Temple of the Sacred Tooth Relic, Cultural Dance Performance, City Tour",
        highlights: ["/assets/images/kandy.jpg", "/assets/images/temple.jpg"],
        accommodation: "Heritance Kandalama Hotel",
        mealPlan: "Breakfast, Lunch, Dinner",
        travelTime: "2 hours",
        transferMode: "Air-conditioned vehicle"
      }
    ]
  },
  {
    id: 2,
    name: "Tour Package 2 Days",
    price: 900,
    image: "/assets/images/10day.jpg",
    image1: "/assets/images/3dayin.jpg",
    description: "Experience a blissful 2-day tour with one night stay, offering great food and unforgettable experiences.",
    duration: "2 Days / 1 Night",
    days: [
      {
        day: 1,
        description: "Arrival and welcome ceremony",
        activities: "Airport pickup, Welcome dinner, Hotel check-in",
        highlights: ["/assets/images/colombo.jpg","/assets/images/galleface.jpg"],
        accommodation: "Cinnamon Grand Colombo",
        mealPlan: "Dinner",
        travelTime: "1 hour",
        transferMode: "Air-conditioned vehicle"
      },
      {
        day: 2,
        description: "City exploration and cultural experience",
        activities: "City tour, Visit to historic sites, Evening cultural show",
        highlights: ["/assets/images/colombo.jpg", "/assets/images/cultural.jpg"],
        accommodation: "Check-out after breakfast",
        mealPlan: "Breakfast, Lunch",
        travelTime: "30 minutes",
        transferMode: "Air-conditioned vehicle"
      }
    ]
  },
];

const TourPackages = () => {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [editingPackage, setEditingPackage] = useState(null);
  const [currentDay, setCurrentDay] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  const handleBookNow = () => {
    if (selectedPackage) {
      const packageData = {
        name: selectedPackage.name,
        duration: selectedPackage.duration,
        price: selectedPackage.price,
        description: selectedPackage.description,
        days: selectedPackage.days.map(day => ({
          description: day.description,
          activities: day.activities,
          accommodation: day.accommodation,
          mealPlan: day.mealPlan,
          travelTime: day.travelTime,
          transferMode: day.transferMode
        }))
      };
      navigate("/book", { state: { package: packageData } });
    }
  };

  const nextImage = () => {
    if (selectedPackage && selectedPackage.days[currentDay].highlights.length > 0) {
      setCurrentImageIndex((prev) => 
        (prev + 1) % selectedPackage.days[currentDay].highlights.length
      );
    }
  };

  const prevImage = () => {
    if (selectedPackage && selectedPackage.days[currentDay].highlights.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? selectedPackage.days[currentDay].highlights.length - 1 : prev - 1
      );
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400" />);
      }
    }
    return stars;
  };

  const handleMoreInformation = (id) => {
    const selectedPkg = packages.find(pkg => pkg.id === id);
    navigate('/details', { state: { package: selectedPkg } });
  };

  const handleEdit = (pkg) => {
    navigate('/adminEdit', { state: { package: pkg } });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      // Here you would typically make an API call to delete the package
      console.log("Package deleted:", id);
      // Update the packages array after successful deletion
      const updatedPackages = packages.filter(pkg => pkg.id !== id);
      // In a real app, you would update the state or make an API call here
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    // Here you would typically make an API call to update the package
    console.log("Package updated:", editingPackage);
    setEditingPackage(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingPackage(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Title Section */}
      {/* <div className="text-center py-6 border-b">
        <h1 className="text-2xl font-bold">Sri Lanka Tour & Holiday Packages</h1>
        <p className="text-gray-600 mt-2">The Wait is Over! Sri Lanka Reopened with Great Offers</p>
      </div> */}

      {/* Tour Packages Grid */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Tour Packages</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {packages.map((pkg) => (
            <div key={pkg.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative h-64">
                <img
                  src={pkg.image}
                  alt={pkg.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold text-center mb-2">{pkg.name}</h3>
                <div className="flex items-center justify-center mb-4">
                  <div className="flex mr-2">
                    {renderStars(pkg.rating)}
                  </div>
                  <span className="text-lg font-semibold">{pkg.rating}</span>
                </div>
                <div className="flex justify-center space-x-4">
                  {/* <button
                    onClick={() => handleMoreInformation(pkg.id)}
                    className="bg-teal-600 text-white py-2 px-8 rounded-lg hover:bg-teal-700 transition duration-300 flex items-center justify-center"
                  >
                    More information <span className="ml-2">▶</span>
                  </button> */}
                  <button
                    onClick={() => handleEdit(pkg)}
                    className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(pkg.id)}
                    className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Package Modal */}
      {selectedPackage && (
        <div className="modal show" style={{ display: 'block', overflow: 'hidden' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedPackage.name}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedPackage(null)}
                ></button>
              </div>
              <div className="modal-body hide-scrollbar" style={{ 
                maxHeight: '80vh', 
                overflowY: 'auto',
                padding: '1rem'
              }}>
                {/* Package Overview */}
                <div className="mb-4">
                  <h6 className="text-muted">Package Overview</h6>
                  <p>{selectedPackage.description}</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <p className="font-bold">Price: USD ${selectedPackage.price}</p>
                    <p className="text-muted">{selectedPackage.duration}</p>
                  </div>
                </div>

                {/* Day Navigation */}
                <div className="d-flex justify-content-center mb-4">
                  {selectedPackage.days.map((_, index) => (
                    <button
                      key={index}
                      className={`btn ${currentDay === index ? 'btn-primary' : 'btn-outline-primary'} mx-1`}
                      onClick={() => setCurrentDay(index)}
                    >
                      Day {index + 1}
                    </button>
                  ))}
                </div>

                {/* Current Day Details */}
                <div className="day-details">
                  <h6 className="text-primary mb-3">Day {currentDay + 1}</h6>
                  
                  {/* Image Slider */}
                  {selectedPackage.days[currentDay].highlights.length > 0 && (
                    <div className="position-relative mb-4">
                      <img
                        src={selectedPackage.days[currentDay].highlights[currentImageIndex]}
                        alt={`Day ${currentDay + 1} highlight`}
                        className="w-100 rounded"
                        style={{ height: '300px', objectFit: 'cover' }}
                      />
                      <button
                        className="btn btn-light position-absolute top-50 start-0 translate-middle-y"
                        onClick={prevImage}
                      >
                        ❮
                      </button>
                      <button
                        className="btn btn-light position-absolute top-50 end-0 translate-middle-y"
                        onClick={nextImage}
                      >
                        ❯
                      </button>
                    </div>
                  )}

                  {/* Day Information */}
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <h6>Description</h6>
                        <p>{selectedPackage.days[currentDay].description}</p>
                      </div>
                      <div className="mb-3">
                        <h6>Activities</h6>
                        <ul className="list-unstyled">
                          {selectedPackage.days[currentDay].activities.split(',').map((activity, index) => (
                            <li key={index} className="mb-2 d-flex align-items-center">
                              <span className="me-2" style={{ color: '#0d6efd' }}>•</span>
                              <span>{activity.trim()}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <h6><FaHotel className="me-2" />Accommodation</h6>
                        <p>{selectedPackage.days[currentDay].accommodation}</p>
                      </div>
                      <div className="mb-3">
                        <h6><FaUtensils className="me-2" />Meal Plan</h6>
                        <p>{selectedPackage.days[currentDay].mealPlan}</p>
                      </div>
                      <div className="mb-3">
                        <h6><FaClock className="me-2" />Travel Time</h6>
                        <p>{selectedPackage.days[currentDay].travelTime}</p>
                      </div>
                      <div className="mb-3">
                        <h6><FaCar className="me-2" />Transfer Mode</h6>
                        <p>{selectedPackage.days[currentDay].transferMode}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={handleBookNow}
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Package Modal */}
      {editingPackage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-2xl">
            <h2 className="text-xl font-semibold mb-4">Edit Package</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Package Name</label>
                  <input
                    type="text"
                    name="name"
                    value={editingPackage.name}
                    onChange={handleEditChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price</label>
                  <input
                    type="number"
                    name="price"
                    value={editingPackage.price}
                    onChange={handleEditChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Duration</label>
                  <input
                    type="text"
                    name="duration"
                    value={editingPackage.duration}
                    onChange={handleEditChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Image URL</label>
                  <input
                    type="text"
                    name="image"
                    value={editingPackage.image}
                    onChange={handleEditChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={editingPackage.description}
                  onChange={handleEditChange}
                  rows="3"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setEditingPackage(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Update Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <style>
        {`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .modal {
            overflow: hidden !important;
          }
          .modal-dialog {
            margin: 1.75rem auto;
            max-height: calc(100vh - 3.5rem);
          }
        `}
      </style>
    </div>
  );
};

export default TourPackages;
