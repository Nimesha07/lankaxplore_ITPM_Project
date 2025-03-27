import React from 'react';
import { useNavigate } from 'react-router-dom';

const TourPackageDetails = () => {
  const navigate = useNavigate();

  const handleBookNow = () => {
    navigate('/book');
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
            <p>3 DAYS</p>
          </div>
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="font-semibold mb-2">Price:</h3>
            <p>US$ 400 Per Person (Max - 05)</p>
          </div>
        </div>
        <h2 className="text-xl font-bold mb-4">Tour Package 3 Days</h2>
        <button
          onClick={handleBookNow}
          className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 transition duration-300"
        >
          Book Now
        </button>
      </div>

      {/* Timeline Section */}
      <div className="space-y-12">
        {/* Day 1 */}
        <div className="relative">
          <div className="absolute left-0 top-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
          <div className="ml-12">
            <h2 className="text-xl font-bold mb-4">Day 01 - Kandy</h2>
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <p className="text-gray-700 mb-6">
                An essential part of Sri Lanka trips, being the home to the sacred relic of the Buddhist faith is located above sea level near the gigantic Everest and Himalaya/Sripada Mountain Ranges along with a chilled atmosphere and a picturesque view! On our way to Kandy, you will witness the sight of elephants marching to take their daily bath ritual at the Pinnawala Elephant Orphanage, which is definitely a lifetime experience. After arrival, you will be able to witness a colorful cultural performance at the Kandyan Cultural Show, where the traditional dancers and drummers highlight another aspect of Sri Lanka, dressed in different costumes and drums highlights our rich culture and you will be able to catch a glimpse of it. Being the figurehead of art, culture, and history, Kandy is the ultimate destination in our Sri Lanka tour packages that you should visit and after a tiring.
              </p>
              <img 
                src="/assets/images/4day.jpg" 
                alt="Temple of the Sacred Tooth Relic"
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
              <div className="space-y-4">
                <h3 className="font-bold">Activities</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Arrive at Sri Lanka (Katunayake International Airport)</li>
                  <li>Warm welcome from our Olanka representative and driver at the airport</li>
                  <li>Proceed to beautiful Kandy</li>
                </ul>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <img src="/assets/images/4day.jpg" alt="Cultural Dance" className="w-full h-32 object-cover rounded-lg" />
                  <img src="/assets/images/4day.jpg" alt="Elephants" className="w-full h-32 object-cover rounded-lg" />
                  <img src="/assets/images/4day.jpg" alt="Spices" className="w-full h-32 object-cover rounded-lg" />
                </div>
                <div className="mt-6 space-y-2">
                  <p><strong>Accommodation:</strong> Fox Kandy by Fox Resorts (4 star)</p>
                  <p><strong>Meal Plan:</strong> Breakfast & Dinner</p>
                  <p><strong>Travel Time:</strong> Airport to Kandy - 2 hours (approx.)</p>
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
            <h2 className="text-xl font-bold mb-4">Day 02 - Colombo</h2>
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <p className="text-gray-700 mb-6">
                An essential part of Sri Lanka trips, being the home to the sacred relic of the Buddhist faith is located above sea level near the gigantic Everest and Himalaya/Sripada Mountain Ranges along with a chilled atmosphere and a picturesque view! On our way to Kandy, you will witness the sight of elephants marching to take their daily bath ritual at the Pinnawala Elephant Orphanage, which is definitely a lifetime experience.
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
                  <li>Warm welcome from our Olanka representative and driver at the airport</li>
                  <li>Proceed to beautiful Kandy</li>
                </ul>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <img src="/assets/images/spa.jpg" alt="Spa" className="w-full h-32 object-cover rounded-lg" />
                  <img src="/assets/images/casino.jpg" alt="Casino" className="w-full h-32 object-cover rounded-lg" />
                  <img src="/assets/images/massage.jpg" alt="Massage" className="w-full h-32 object-cover rounded-lg" />
                </div>
                <div className="mt-6 space-y-2">
                  <p><strong>Accommodation:</strong> Fox Kandy by Fox Resorts (4 star)</p>
                  <p><strong>Meal Plan:</strong> Breakfast & Dinner</p>
                  <p><strong>Travel Time:</strong> Colombo to Airport - 30min (approx.)</p>
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
