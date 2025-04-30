import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Rating,
  Button,
  Chip,
  Alert,
  CircularProgress,
  Snackbar
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  LocationOn,
  AccessTime,
  People,
  CalendarToday,
  DirectionsCar,
} from '@mui/icons-material';
import ReviewAnalytics from '../components/ReviewAnalytics';
import ReviewList from '../components/ReviewList';
import AddReviewForm from '../components/AddReviewForm';
import { Link } from 'react-router-dom';

const DestinationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [destination, setDestination] = useState(null);
  const [packages, setPackages] = useState([]);
  const [reviews, setReviews] = useState({ reviews: [], totalReviews: 0, averageRating: 0 });
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    const fetchDestinationDetails = async () => {
      try {
        const [destinationRes, packagesRes, reviewsRes] = await Promise.all([
          axios.get(`http://localhost:5001/api/destinations/${id}`),
          axios.get(`http://localhost:5001/api/destinations/${id}/packages`),
          axios.get(`http://localhost:5001/api/destinations/${id}/reviews`),
        ]);

        setDestination(destinationRes.data.data);
        setPackages(packagesRes.data);
        
        // Ensure reviews data has the correct structure
        const reviewsData = reviewsRes.data || {};
        const ratingDistribution = reviewsData.ratingDistribution || {
          5: 0,
          4: 0,
          3: 0,
          2: 0,
          1: 0
        };
        
        setReviews({
          reviews: reviewsData.reviews || [],
          totalReviews: reviewsData.totalReviews || 0,
          averageRating: reviewsData.averageRating || 0,
          ratingDistribution
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching destination details:', error);
        setSnackbar({
          open: true,
          message: 'Error loading destination details. Please try again.',
          severity: 'error',
        });
        setLoading(false);
      }
    };

    fetchDestinationDetails();
  }, [id]);

  const handleBookNow = (packageId) => {
    navigate(`/booking/${packageId}`);
  };

  const handleReviewUpdate = (updatedReview) => {
    setReviews(prev => ({
      ...prev,
      reviews: prev.reviews.map(review => 
        review._id === updatedReview._id ? updatedReview : review
      )
    }));
  };

  const handleReviewDelete = (deletedReviewId) => {
    setReviews(prev => ({
      ...prev,
      reviews: prev.reviews.filter(review => review._id !== deletedReviewId),
      totalReviews: prev.totalReviews - 1
    }));
  };

  // Updated to use destination reviews
  const getDestinationRating = () => {
    return reviews.averageRating || 0;
  };

  const handleAddReview = () => {
    console.log("DestinationDetails handleAddReview called");
    setShowReviewForm(true);
  };

  const handleReviewSubmit = async (reviewData) => {
    try {
      const token = localStorage.getItem('token');
      console.log("Submitting review with token:", token ? "Present" : "Missing");
      
      const response = await axios.post(
        `http://localhost:5001/api/destinations/${destination._id}/reviews`, 
        reviewData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      console.log("Review submission response:", response.data);
      
      // Update reviews state with the new review
      setReviews(prev => ({
        ...prev,
        reviews: [response.data, ...prev.reviews],
        totalReviews: prev.totalReviews + 1,
        averageRating: ((prev.averageRating * prev.totalReviews) + reviewData.rating) / (prev.totalReviews + 1)
      }));

      setSnackbar({
        open: true,
        message: 'Review submitted successfully!',
        severity: 'success',
      });
      
      setShowReviewForm(false);
    } catch (error) {
      console.error('Error submitting review:', error);
      console.log("Error response:", error.response);
      
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Error submitting review. Please try again.',
        severity: 'error',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Typography variant="h6" color="error">
          Destination not found
        </Typography>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <Container>
        {/* Destination Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="mb-8">
            <CardContent>
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-96 object-cover rounded-lg"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h4" className="font-bold mb-4">
                    {destination.name}
                  </Typography>
                  <Typography variant="body1" className="mb-4">
                    {destination.description}
                  </Typography>
                  <div className="flex items-center mb-2">
                    <LocationOn className="text-gray-500 mr-2" />
                    <Typography variant="body2" color="textSecondary">
                      {destination.location}
                    </Typography>
                  </div>
                  <div className="flex items-center mb-2">
                    <AccessTime className="text-gray-500 mr-2" />
                    <Typography variant="body2" color="textSecondary">
                      Best time to visit: {destination.bestTimeToVisit}
                    </Typography>
                  </div>
                  <div className="flex items-center mb-2">
                    <People className="text-gray-500 mr-2" />
                    <Typography variant="body2" color="textSecondary">
                      Transportation: {destination.transportation}
                    </Typography>
                  </div>
                  <div className="flex items-center mt-4">
                    <Rating value={getDestinationRating()} readOnly precision={0.5} />
                    <Typography variant="body2" color="textSecondary" className="ml-2">
                      ({reviews.totalReviews} reviews)
                    </Typography>
                  </div>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </motion.div>

        {/* Packages Section */}
        <Typography variant="h5" className="font-bold mb-6">
          Available Packages
        </Typography>
        <Grid container spacing={4} className="mb-8">
          {packages.map((pkg) => (
            <Grid item xs={12} md={6} key={pkg._id}>
              <Card className="h-full transform transition-transform duration-300 hover:scale-105">
                <CardMedia
                  component="img"
                  height="200"
                  image={pkg.images[0]}
                  alt={pkg.name}
                  className="object-cover"
                />
                <CardContent>
                  <Typography variant="h6" className="font-bold mb-2">
                    {pkg.name}
                  </Typography>
                  <Typography variant="body2" className="mb-4">
                    {pkg.description}
                  </Typography>
                  
                  {/* Package Details */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center">
                      <CalendarToday className="text-gray-500 mr-2" />
                      <Typography variant="body2" color="textSecondary">
                        Duration: {pkg.duration}
                      </Typography>
                    </div>
                    <div className="flex items-center">
                      <People className="text-gray-500 mr-2" />
                      <Typography variant="body2" color="textSecondary">
                        Max People: {pkg.maxPeople}
                      </Typography>
                    </div>
                    <div className="flex items-center">
                      <LocationOn className="text-gray-500 mr-2" />
                      <Typography variant="body2" color="textSecondary">
                        Distance: {pkg.distance}
                      </Typography>
                    </div>
                    <div className="flex items-center">
                      <DirectionsCar className="text-gray-500 mr-2" />
                      <Typography variant="body2" color="textSecondary">
                        Vehicle: {pkg.vehicleType}
                      </Typography>
                    </div>
                  </div>

                  {/* Price and Book Now */}
                  <div className="flex justify-between items-center">
                    <div>
                      <Typography variant="h6" color="primary" className="font-bold">
                        ${pkg.price}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        per person: ${pkg.perPersonPrice}
                      </Typography>
                    </div>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleBookNow(pkg._id)}
                    >
                      Book Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Reviews Section */}
        <div className="mt-8">
          <Typography variant="h5" className="font-bold mb-6">
            Reviews and Ratings
          </Typography>
          <ReviewAnalytics
            totalReviews={reviews.totalReviews}
            averageRating={reviews.averageRating}
            ratingDistribution={reviews.ratingDistribution}
            reviews={reviews.reviews}
          />
          <ReviewList 
            reviews={reviews.reviews} 
            onReviewUpdate={handleReviewUpdate}
            onReviewDelete={handleReviewDelete}
            onAddReview={handleAddReview}
          />
          <AddReviewForm 
            destinationId={destination._id}
            open={showReviewForm}
            onClose={() => setShowReviewForm(false)}
            onSubmit={handleReviewSubmit}
          />
        </div>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </div>
  );
};

export default DestinationDetails; 