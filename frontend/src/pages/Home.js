import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import Footer from '../components/Footer';

// Configure axios defaults
axios.defaults.withCredentials = true;

// Components
const NavigationBar = ({ onExperienceClick }) => (
  <nav className="fixed top-0 left-0 right-0 h-20 flex justify-between items-center px-5 bg-transparent hover:bg-[#257180] transition-colors duration-300 z-50">
    <div className="flex-shrink-0">
      <img src="/assets/images/logo.png" alt="Logo" className="h-10 w-auto" />
    </div>
    <ul className="flex space-x-5">
      <li><a href="#home" className="text-white hover:text-[#CB6040] transition-colors">Home</a></li>
      <li><a href="#destinations" className="text-white hover:text-[#CB6040] transition-colors">Destinations</a></li>
      <li><a href="#video" className="text-white hover:text-[#CB6040] transition-colors">Video</a></li>
      <li><a href="#expert-advice" className="text-white hover:text-[#CB6040] transition-colors">Expert Advice</a></li>
      <li><a href="#categories" className="text-white hover:text-[#CB6040] transition-colors">Categories</a></li>
      <li><a href="#experience" className="text-white hover:text-[#CB6040] transition-colors">Experience</a></li>
    </ul>
    <div className="flex space-x-3">
      <Link to="/login" className="px-4 py-2 bg-[#CB6040] text-white rounded hover:bg-[#FD8B51] transition-colors">Login</Link>
      <Link to="/register" className="px-4 py-2 bg-[#CB6040] text-white rounded hover:bg-[#FD8B51] transition-colors">Sign Up</Link>
    </div>
  </nav>
);

const HeroSection = ({ destinations, searchQuery, setSearchQuery, handleSearch, showSearchResults, setShowSearchResults, searchSuggestions, handleSearchResultClick }) => (
  <motion.section
    id="home"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1 }}
    className="relative h-screen"
  >
    <div className="absolute inset-0">
      <img
        src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
        alt="Sri Lanka"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black bg-opacity-50" />
    </div>
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.8 }}
      className="relative z-10 flex flex-col items-center justify-center h-full px-4 sm:px-6 lg:px-8"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.8 }}
        className="max-w-3xl text-center"
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-8">
          Discover the Wonders of Sri Lanka
        </h1>
        <div className="relative w-full max-w-2xl mx-auto search-container">
          <div className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search destinations, experiences..."
              className="w-full px-6 py-4 pr-24 rounded-full bg-white/90 backdrop-blur-sm text-gray-800 
                       focus:outline-none focus:ring-2 focus:ring-[#ff6347] focus:bg-white
                       transition-all duration-300 shadow-lg"
            />
            <button
              onClick={handleSearch}
              className="absolute right-2 bg-[#ff6347] text-white 
                       px-6 py-2 rounded-full hover:bg-[#ff4500] 
                       transition-all duration-300 transform hover:scale-105 shadow-lg
                       flex items-center space-x-2"
            >
              <span>Search</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
          {showSearchResults && searchSuggestions.length > 0 && (
            <div className="absolute w-full mt-2 bg-white rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
              {searchSuggestions.map((destination) => (
                <div
                  key={destination._id}
                  onClick={() => handleSearchResultClick(destination)}
                  className="p-4 hover:bg-gray-100 cursor-pointer flex items-center space-x-4"
                >
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{destination.name}</p>
                    <p className="text-sm text-gray-500">{destination.location}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  </motion.section>
);
//Experience section

const ExperienceSection = ({ reviews, activeReviewTab, setActiveReviewTab, averageRating }) => (
  <motion.section 
    id="experience" 
    className="py-16 px-5 bg-gradient-to-b from-gray-50 to-white"
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    viewport={{ once: true }}
  >
    <div className="max-w-7xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-4">Traveler Experiences</h2>
      <p className="text-gray-600 text-center mb-12">Discover what our travelers say about their adventures</p>

      {/* Rating Summary */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
        <div className="flex items-center justify-between">
          <div className="text-center">
            <div className="text-5xl font-bold text-[#ff6347]">{averageRating}</div>
            <div className="flex items-center justify-center mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-6 h-6 ${
                    star <= Math.round(averageRating)
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-2">Based on {reviews?.length || 0} reviews</p>
          </div>
          <div className="flex space-x-4">
            {[
              { label: 'All', value: 'all' },
              { label: 'Excellent', value: 'excellent' },
              { label: 'Good', value: 'good' },
              { label: 'Average', value: 'average' }
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveReviewTab(tab.value)}
                className={`px-4 py-2 rounded-full transition-colors ${
                  activeReviewTab === tab.value
                    ? 'bg-[#ff6347] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div
              key={review._id}
              className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-200"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 rounded-full bg-[#ff6347] flex items-center justify-center text-white font-bold">
                      {review.user?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {review.user?.name || 'Anonymous'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-yellow-400 mr-1">★</span>
                    <span className="font-semibold">{review.rating}</span>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4 line-clamp-3">{review.comment}</p>
                
                {review.images && review.images.length > 0 && (
                  <div className="relative h-40 rounded-lg overflow-hidden mb-4">
                    <img
                      src={review.images[0]}
                      alt="Review"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Verified Purchase
                  </span>
                  <Link
                    to={`/packages/${review.package?._id}`}
                    className="text-[#ff6347] hover:text-[#ff4500] transition-colors"
                  >
                    View Package →
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="flex flex-col items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-500 text-lg font-medium">No reviews found</p>
              <p className="text-gray-400 mt-2">Be the first to share your experience!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  </motion.section>
);

//Categories section
const CategoriesSection = ({ destinations, selectedFilter, handleFilterClick }) => (
  <motion.section 
    id="categories" 
    className="py-16 px-5 bg-gray-100"
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    viewport={{ once: true }}
  >
    <h2 className="text-4xl font-bold text-center mb-10">Find the Perfect Spot for Your Next Adventure!</h2>
    <div className="flex justify-center space-x-4 mb-10">
      {['All', 'Adventure', 'History', 'Nature'].map((filter) => (
        <button
          key={filter}
          onClick={() => handleFilterClick(filter)}
          className={`px-6 py-2 rounded-lg text-white transition-colors ${
            selectedFilter === filter ? 'bg-[#ff6347]' : 'bg-gray-800 hover:bg-[#ff6347]'
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {destinations.length > 0 ? (
        destinations.map((destination) => (
          <Link to={`/destinations/${destination._id}`} key={destination._id} className="bg-white rounded-lg overflow-hidden shadow-lg transform hover:-translate-y-2 transition-transform">
            <img src={destination.image} alt={destination.name} className="w-full h-48 object-cover" />
            <div className="p-4">
              <p className="text-center font-medium">{destination.name}</p>
              <p className="text-sm text-gray-600 text-center mt-2">{destination.location}</p>
              <p className="text-xs text-gray-500 text-center mt-1">{destination.category}</p>
            </div>
          </Link>
        ))
      ) : (
        <div className="col-span-full text-center text-gray-500">
          No destinations found matching your search criteria.
        </div>
      )}
    </div>
  </motion.section>
);
//Video section
const VideoSection = () => (
  <motion.section 
    id="video" 
    className="py-16 px-5 bg-gray-50"
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    viewport={{ once: true }}
  >
    <h2 className="text-4xl font-bold text-center mb-10">Welcome to LankaXplore</h2>
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-10 items-center">
      <div className="w-full md:w-1/2">
        <iframe
          className="w-full aspect-video rounded-lg shadow-lg"
          src="https://www.youtube.com/embed/5U3_ssYGa7I"
          title="Watch the Journey"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
      <div className="w-full md:w-1/2 text-lg text-gray-700">
        <p className="leading-relaxed">
          "We are your ultimate travel companions, dedicated to unlocking 
          the wonders of Sri Lanka with innovation and passion. From breathtaking 
          beaches and lush landscapes to thrilling adventures and cultural treasures, we craft
          personalized travel experiences for every adventurer.

          Our AI weather based activity planner, curated travel packages, and real-time 
          destination insights, ensuring an unforgettable journey. Whether you're a solo explorer, 
          a family on vacation, or a group of thrill-seekers, we're here to guide you every step of the way.

          Let's embark on an adventure where every moment counts!"
        </p>
      </div>
    </div>
  </motion.section>
);
//Expert advice section
const ExpertAdviceSection = ({ destinations }) => (
  <motion.section 
    id="expert-advice" 
    className="py-16 px-5 bg-gray-800 text-white"
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    viewport={{ once: true }}
  >
    <h2 className="text-4xl font-bold text-center mb-12">Find travel perfection with the wisdom of experts</h2>
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      {destinations.slice(0, 3).map((destination) => (
        <div key={destination._id} className="bg-white rounded-lg overflow-hidden shadow-lg transform hover:-translate-y-2 transition-transform">
          <img src={destination.image} alt={destination.name} className="w-full h-48 object-cover" />
          <p className="p-4 text-gray-800 font-bold text-center">{destination.name}</p>
        </div>
      ))}
    </div>
    <div className="text-center mt-10">
      <Link to="/destinations" className="px-8 py-3 bg-[#ff4500] text-white rounded-lg hover:bg-[#CB6040] transition-colors">
        Get Started
      </Link>
    </div>
  </motion.section>
);

//Main Home component
const Home = () => {
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [activeReviewTab, setActiveReviewTab] = useState('all');
  const [searchSuggestions, setSearchSuggestions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [destinationsRes, reviewsRes] = await Promise.all([
          axios.get('http://localhost:5001/api/destinations', {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            withCredentials: true
          }),
          axios.get('http://localhost:5001/api/reviews', {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            withCredentials: true
          })
        ]);
        
        const reviewsData = reviewsRes.data?.data || reviewsRes.data || [];
        setDestinations(destinationsRes.data.data || []);
        setReviews(reviewsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try again later.');
        setLoading(false);
        setDestinations([]);
        setReviews([]);
      }
    };

    fetchData();
  }, []);

  // Add useEffect for real-time search
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = destinations.filter(destination => {
        const query = searchQuery.toLowerCase();
        return (
          destination.name.toLowerCase().includes(query) ||
          destination.location.toLowerCase().includes(query) ||
          destination.description.toLowerCase().includes(query)
        );
      });
      setSearchSuggestions(filtered);
      setShowSearchResults(true);
    } else {
      setSearchSuggestions([]);
      setShowSearchResults(false);
    }
  }, [searchQuery, destinations]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
    }
  };

  const handleSearchResultClick = (destination) => {
    setSearchQuery(destination.name);
    setShowSearchResults(false);
    navigate(`/destinations/${destination._id}`);
  };

  const handleClickOutside = (e) => {
    if (!e.target.closest('.search-container')) {
      setShowSearchResults(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Filter destinations based on category and search query
  const filteredDestinations = destinations.filter(destination => {
    const matchesSearch = !searchQuery || (
      destination.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      destination.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      destination.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const matchesCategory = selectedFilter === 'All' || destination.category === selectedFilter;

    return matchesSearch && matchesCategory;
  });

  // Filter reviews based on rating
  const filteredReviews = reviews?.filter(review => {
    if (!review) return false;
    if (activeReviewTab === 'all') return true;
    if (activeReviewTab === 'excellent') return review.rating >= 4.5;
    if (activeReviewTab === 'good') return review.rating >= 3.5 && review.rating < 4.5;
    if (activeReviewTab === 'average') return review.rating >= 2.5 && review.rating < 3.5;
    return true;
  }) || [];

  // Calculate average rating
  const averageRating = reviews?.length > 0
    ? (reviews.reduce((acc, review) => acc + (review?.rating || 0), 0) / reviews.length).toFixed(1)
    : 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <section id="home">
        <HeroSection 
          destinations={destinations}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
          showSearchResults={showSearchResults}
          setShowSearchResults={setShowSearchResults}
          searchSuggestions={searchSuggestions}
          handleSearchResultClick={handleSearchResultClick}
        />
      </section>

      <section id="video">
        <VideoSection />
      </section>

      <section id="expert-advice">
        <ExpertAdviceSection destinations={destinations} />
      </section>

      <section id="categories">
        <CategoriesSection 
          destinations={filteredDestinations}
          selectedFilter={selectedFilter}
          handleFilterClick={setSelectedFilter}
        />
      </section>

      <section id="experience">
        {!loading && !error && (
          <ExperienceSection 
            reviews={filteredReviews}
            activeReviewTab={activeReviewTab}
            setActiveReviewTab={setActiveReviewTab}
            averageRating={averageRating}
          />
        )}
      </section>

      <Footer />
    </div>
  );
};

export default Home;
 