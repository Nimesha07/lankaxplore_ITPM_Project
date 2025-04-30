import React, { useState, useEffect } from "react";
import { Card, CardContent, CardMedia, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const PackageSection = () => {
  const [packages, setPackages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch packages from the backend
    const fetchPackages = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/packages");
        console.log(response);
        setPackages(response.data);
      } catch (error) {
        console.error("Error fetching packages:", error);
      }
    };

    fetchPackages();
  }, []);

  // Navigate to package details page
  const handlePackageClick = (packageId) => {
    navigate(`/packages/${packageId}`);
  };

  return (
    <div className="p-6">
      <Typography variant="h4" className="mb-6 font-bold text-center">
        Available Packages
      </Typography>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-7">
        {packages.map((pkg) => (
          <Card
            key={pkg._id}
            className="shadow-lg rounded-2xl hover:shadow-2xl transition-shadow"
          >
            <CardMedia
              component="img"
              height="200"
              image={pkg.image || "https://placehold.co/300x200?text=No+Image"} // Updated placeholder image
              alt={pkg.name}
              className="rounded-t-2xl"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://placehold.co/300x200?text=No+Image";
              }}
            />
            <CardContent>
              <Typography variant="h6" className="font-semibold">
                {pkg.name}
              </Typography>
              <Typography variant="body2" className="text-gray-600">
                Location: {pkg.location}
              </Typography>
              <Typography variant="body2" className="text-gray-600">
                Price: ${pkg.price}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                className="mt-4 w-full"
                onClick={() => handlePackageClick(pkg._id)}
              >
                View Details
              </Button>
              
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PackageSection; 