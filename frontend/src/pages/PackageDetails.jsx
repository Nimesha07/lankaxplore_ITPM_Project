import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaHotel, FaUtensils, FaCar, FaClock } from 'react-icons/fa';

const PackageDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentDay, setCurrentDay] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const packageData = location.state?.package;

  if (!packageData) {
    navigate('/');
    return null;
  }

  const nextImage = () => {
    if (packageData.days[currentDay].highlights.length > 0) {
      setCurrentImageIndex((prev) => 
        (prev + 1) % packageData.days[currentDay].highlights.length
      );
    }
  };

  const prevImage = () => {
    if (packageData.days[currentDay].highlights.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? packageData.days[currentDay].highlights.length - 1 : prev - 1
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">{packageData.name}</h1>
            <div className="text-xl font-semibold text-indigo-600">
              ${packageData.price}
            </div>
          </div>

          <div className="mb-6">
            <img
              src={packageData.image}
              alt={packageData.name}
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Package Overview</h2>
            <p className="text-gray-600">{packageData.description}</p>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Itinerary</h2>
            
            {/* Day Navigation */}
            <div className="flex justify-center space-x-4 mb-6">
              {packageData.days.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentDay(index);
                    setCurrentImageIndex(0);
                  }}
                  className={`px-4 py-2 rounded-md ${
                    currentDay === index
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  Day {index + 1}
                </button>
              ))}
            </div>

            {/* Current Day Details */}
            {packageData.days[currentDay] && (
              <div className="space-y-6">
                {/* Image Slider */}
                {packageData.days[currentDay].highlights.length > 0 && (
                  <div className="relative">
                    <img
                      src={packageData.days[currentDay].highlights[currentImageIndex]}
                      alt={`Day ${currentDay + 1} highlight`}
                      className="w-full h-96 object-cover rounded-lg"
                    />
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md"
                    >
                      ❮
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md"
                    >
                      ❯
                    </button>
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-gray-600">
                    {packageData.days[currentDay].description}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Place</h3>
                  <p className="text-gray-600">
                    {packageData.days[currentDay].place}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Activities</h3>
                  <ul className="list-disc list-inside text-gray-600">
                    {packageData.days[currentDay].activities.split(',').map((activity, index) => (
                      <li key={index}>{activity.trim()}</li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-2">
                    <FaHotel className="text-indigo-600" />
                    <div>
                      <h4 className="font-semibold">Accommodation</h4>
                      <p className="text-gray-600">{packageData.days[currentDay].accommodation}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <FaUtensils className="text-indigo-600" />
                    <div>
                      <h4 className="font-semibold">Meal Plan</h4>
                      <p className="text-gray-600">{packageData.days[currentDay].mealPlan}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <FaClock className="text-indigo-600" />
                    <div>
                      <h4 className="font-semibold">Travel Time</h4>
                      <p className="text-gray-600">{packageData.days[currentDay].travelTime}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <FaCar className="text-indigo-600" />
                    <div>
                      <h4 className="font-semibold">Transfer Mode</h4>
                      <p className="text-gray-600">{packageData.days[currentDay].transferMode}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Back to Packages
            </button>
            <button
              onClick={() => navigate('/book', { state: { package: packageData } })}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetails; 