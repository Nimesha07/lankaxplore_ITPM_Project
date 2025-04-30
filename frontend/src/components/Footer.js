import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-5">
        <div className="flex justify-center space-x-8 mb-4">
          <Link to="/about" className="hover:text-[#ff6347] transition-colors">About</Link>
          <Link to="/contact" className="hover:text-[#ff6347] transition-colors">Contact</Link>
          <Link to="/privacy" className="hover:text-[#ff6347] transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-[#ff6347] transition-colors">Terms of Service</Link>
        </div>
        <div className="text-center text-sm">
          <p>&copy; 2024 LankaXplore. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 