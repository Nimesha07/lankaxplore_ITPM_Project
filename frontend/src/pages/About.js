import React from 'react';
import Footer from '../components/Footer';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-5 bg-gradient-to-b from-[#257180] to-[#1a4d57] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">About LankaXplore</h1>
          <p className="text-xl text-gray-200">Your Ultimate Travel Companion in Sri Lanka</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-5">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Story</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              LankaXplore was born from a passion for showcasing the incredible beauty and diversity of Sri Lanka. 
              We understand that every traveler is unique, and that's why we've created a platform that combines 
              cutting-edge technology with local expertise to deliver personalized travel experiences.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Our mission is to make travel planning effortless while ensuring you discover the authentic charm 
              of Sri Lanka, from its pristine beaches and ancient temples to its lush tea plantations and 
              vibrant cities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                To be the most trusted and innovative travel platform in Sri Lanka, connecting travelers with 
                authentic experiences and helping them create unforgettable memories.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Values</h3>
              <ul className="text-gray-600 leading-relaxed space-y-2">
                <li>• Authenticity in every experience</li>
                <li>• Innovation in travel solutions</li>
                <li>• Sustainability in tourism</li>
                <li>• Customer satisfaction</li>
                <li>• Local community support</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
