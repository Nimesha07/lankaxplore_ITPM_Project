import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
const TourPackageDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [packages, setPackageData] = useState(null);
  useEffect(() => {
    const fetchPackageDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/packages/${id}`,
          {
            withCredentials: true,
          }
        );
        console.log(response.data);
        setPackageData(response.data);
      } catch (error) {
        console.error("Error fetching package details:", error);
      }
    };

    fetchPackageDetails();
  }, []);

  const handleBookNow = () => {
    const packageData = {
      name: packages?.packageName,
      duration: `${packages?.days?.length} Days`,
      price: packages?.startingPrice,
      description: packages?.description,
      packageId: packages?._id
    };
    navigate("/book", { state: { package: packageData } });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">
          Sri Lanka Tour & Holiday Packages
        </h1>
        <p className="text-gray-600">
          The Wait is Over! Sri Lanka Reopened with Great Offers
        </p>
      </div>

      {/* Tour Info Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="font-semibold mb-2">Tour Duration:</h3>
            <p>{packages?.days?.length} DAYS</p>
          </div>
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="font-semibold mb-2">Price:</h3>
            <p>
              US$ {packages?.startingPrice} Per Person (Max -{" "}
              {packages?.groupSize})
            </p>
          </div>
        </div>
        <h2 className="text-xl font-bold mb-4">
          Tour Package {packages?.days?.length} Days
        </h2>
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
        {packages?.days.map((day, index) => (
          <div className="relative">
            <div className="absolute left-0 top-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
            <div className="ml-12">
              <h2 className="text-xl font-bold mb-4">
                Day {index + 1} - {day.place}
              </h2>
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <p className="text-gray-700 mb-6">{day.description}</p>
                <img
                  src={day.packageImages}
                  alt="Colombo City"
                  className="w-full h-64 object-cover rounded-lg mb-6"
                />
                <div className="space-y-4">
                  <h3 className="font-bold">Activities</h3>

                  {day.activities}
                  {/* <ul className="list-disc pl-5 space-y-2">
                    <li>
                      Arrive at Sri Lanka (Katunayake International Airport)
                    </li>
                    <li>Welcome by our representative at the airport</li>
                    <li>City tour of Colombo</li>
                    <li>Visit to Gangaramaya Temple</li>
                    <li>Evening at Galle Face Green</li>
                  </ul> */}
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <img
                      src={day.highlights}
                      alt="Temple"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <img
                      src="/assets/images/7day.jpg"
                      alt="Market"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <img
                      src="/assets/images/10day.jpg"
                      alt="Beach"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                  <div className="mt-6 space-y-2">
                    <p>
                      <strong>Accommodation:</strong> {day.accommodation}
                    </p>
                    <p>
                      <strong>Meal Plan:</strong>
                      {day.mealPlan}
                    </p>
                    <p>
                      <strong>Travel Time:</strong>
                      {day.travelTime}
                      (approx.)
                    </p>
                    <p>
                      <strong>Transfer Mode:</strong> {day.transferMode}{" "}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

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
