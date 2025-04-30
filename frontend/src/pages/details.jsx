import React from 'react';
import { useNavigate } from 'react-router-dom';

const TourPackageDetails = () => {
  const navigate = useNavigate();

  const handleBookNow = () => {
    const packageData = {
      name: "Tour Package 2 Days",
      duration: "3 Days, 2Nights",
      price: "US$ 300",
      description: "Experience the best of Sri Lanka with our 2-day tour package"
    };
    navigate('/book', { state: { package: packageData } });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">Sri Lanka Tour & Holiday Packages</h1>
        <p className="text-gray-600">The Wait is Over! Sri Lanka Reopened with Great Offers</p>
      </div>

      {/* Tour Info Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="font-semibold mb-2">Tour Duration:</h3>
            <p>2 DAYS</p>
          </div>
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="font-semibold mb-2">Price:</h3>
            <p>US$ 300 Per Person (Max - 05)</p>
          </div>
        </div>
        <h2 className="text-xl font-bold mb-4">Tour Package 2 Days</h2>
        <div className="flex justify-center">
          <button
            onClick={handleBookNow}
            className="bg-teal-600 text-white py-2 px-8 rounded-lg hover:bg-teal-700 transition duration-300"
          >
            Book Now
          </button>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="space-y-12">
        {/* Day 1 */}
        <div className="relative">
          <div className="absolute left-0 top-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
          <div className="ml-12">
            <h2 className="text-xl font-bold mb-4">Day 01 - Colombo</h2>
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <p className="text-gray-700 mb-6">
                Start your journey in the vibrant capital city of Colombo. Experience the perfect blend of colonial architecture and modern city life. Visit the historic Fort area, explore the bustling Pettah market, and enjoy the scenic Galle Face Green promenade.
              </p>
              <img 
                src="/assets/images/colombo.jpg" 
                alt="Colombo City"
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
              <div className="space-y-4">
                <h3 className="font-bold">Activities</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Arrive at Sri Lanka (Katunayake International Airport)</li>
                  <li>Welcome by our representative at the airport</li>
                  <li>City tour of Colombo</li>
                  <li>Visit to Gangaramaya Temple</li>
                  <li>Evening at Galle Face Green</li>
                </ul>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <img src="/assets/images/5day.jpg" alt="Temple" className="w-full h-32 object-cover rounded-lg" />
                  <img src="/assets/images/7day.jpg" alt="Market" className="w-full h-32 object-cover rounded-lg" />
                  <img src="/assets/images/10day.jpg" alt="Beach" className="w-full h-32 object-cover rounded-lg" />
                </div>
                <div className="mt-6 space-y-2">
                  <p><strong>Accommodation:</strong> Cinnamon Grand Colombo (5 star)</p>
                  <p><strong>Meal Plan:</strong> Breakfast & Dinner</p>
                  <p><strong>Travel Time:</strong> Airport to Colombo - 30min (approx.)</p>
                  <p><strong>Transfer Mode:</strong> Private Car (Air Conditioned)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Day 2 */}
        <div className="relative">
          <div className="absolute left-0 top-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
          <div className="ml-12">
            <h2 className="text-xl font-bold mb-4">Day 02 - Negombo</h2>
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <p className="text-gray-700 mb-6">
                Experience the beautiful coastal city of Negombo, known for its pristine beaches and rich fishing heritage. Visit the historic Dutch Fort, explore the fish market, and enjoy water activities at the beach.
              </p>
              <img 
                src="/assets/images/minneriyajeep.jpg" 
                alt="minneriyajeep"
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
              <div className="space-y-4">
                <h3 className="font-bold">Activities</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Morning visit to Dutch Fort</li>
                  <li>Explore Negombo Fish Market</li>
                  <li>Beach activities and relaxation</li>
                  <li>Evening boat ride in Negombo Lagoon</li>
                </ul>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <img src="/assets/images/minneriyajeep.jpg" alt="Fort" className="w-full h-32 object-cover rounded-lg" />
                  <img src="/assets/images/3dayinn.jpg" alt="Market" className="w-full h-32 object-cover rounded-lg" />
                  <img src="/assets/images/polonnaruwa.jpg" alt="Beach" className="w-full h-32 object-cover rounded-lg" />
                </div>
                <div className="mt-6 space-y-2">
                  <p><strong>Accommodation:</strong> Jetwing Lagoon (5 star)</p>
                  <p><strong>Meal Plan:</strong> Breakfast & Dinner</p>
                  <p><strong>Travel Time:</strong> Colombo to Negombo - 1 hour (approx.)</p>
                  <p><strong>Transfer Mode:</strong> Private Car (Air Conditioned)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* End */}
        <div className="relative">
          <div className="absolute left-0 top-0 w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
          <div className="ml-12">
            <h2 className="text-xl font-bold">End</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourPackageDetails;
