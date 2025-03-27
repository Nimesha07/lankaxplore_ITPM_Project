import React, { useState } from "react";
import { FaMapMarkerAlt, FaHotel, FaUtensils, FaCar, FaClock } from "react-icons/fa";
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
    image: "/assets/images/3day.jpg",
    image1: "/assets/images/3dayin.jpg",
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
        highlights: ["/assets/images/polonnaruwa.jpg", "/assets/images/minneriyajeep.jpg"],
        accommodation: "Heritance Kandalama Hotel",
        mealPlan: "Breakfast, Lunch, Dinner",
        travelTime: "3 hours",
        transferMode: "Air-conditioned vehicle"
      },

    ]
  },
  {
    id: 2,
    name: "2 Days of Blissful Eid",
    price: 900,
    image: "/assets/images/10day.jpg",
    image1: "/assets/images/3dayin.jpg",
    description: "A 7-day package during Eid, offering blissful moments, great food, and unforgettable experiences.",
    duration: "2 Days / 1 Nights",
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
    ]
  },
];

const TourPackages = () => {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [currentDay, setCurrentDay] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  const handlePackageClick = (pkg) => {
    setSelectedPackage(pkg);
    setCurrentDay(0);
    setCurrentImageIndex(0);
  };

  const handleBookNow = () => {
    if (selectedPackage) {
      navigate("/book", { state: { package: selectedPackage } });
    }
  };

  const handleViewBooking = () => {
    navigate("/view-booking", { state: { package: selectedPackage } });
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

  return (
    <div className="container mx-auto p-6">
      {/* Header Section */}
      <div className="bg-gray-100 p-4 text-center mb-6">
        <h2 className="text-xl font-bold">Sri Lanka Tour & Holiday Packages</h2>
        <p className="text-gray-600 font-semibold">
          The Wait is Over! Sri Lanka Reopened with Great Offers
        </p>
      </div>

      {/* View Your Booking Button */}
      <div className="d-flex justify-content-end mb-5">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleViewBooking}
        >
          View Your Booking
        </button>
      </div>

      {/* Package Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-white shadow-lg rounded-2xl overflow-hidden cursor-pointer"
            onClick={() => handlePackageClick(pkg)}
          >
            <img src={pkg.image} alt={pkg.name} className="w-full h-52 object-cover" />
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-blue-600 flex items-center">
                  <FaMapMarkerAlt className="mr-1" /> Sri Lanka
                </span>
              </div>
              <h3 className="text-lg font-semibold">{pkg.name}</h3>
              <p className="text-gray-500 text-sm mt-1">{pkg.duration}</p>
              <p className="text-gray-500 text-sm mt-1">Starting From</p>
              <p className="text-blue-600 font-bold">USD ${pkg.price}</p>
            </div>
          </div>
        ))}
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
                  <p className="font-bold">Price: USD ${selectedPackage.price}</p>
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
