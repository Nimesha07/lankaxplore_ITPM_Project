import React from "react";
import PackageSection from "../components/PackageSection";

const Home = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Home Page</h1>
      <p className="text-gray-700">Welcome to our Travel Management System!</p>

      {/* Package Section */}
      <PackageSection />
    </div>
  );
};

export default Home;
 