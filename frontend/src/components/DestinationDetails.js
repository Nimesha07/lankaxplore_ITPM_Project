import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { getAuthToken } from '../utils/auth';
import { useAuth } from '../contexts/AuthContext';
import ReviewAnalytics from './ReviewAnalytics';
import ReviewList from './ReviewList';
import AddReviewForm from './AddReviewForm';

const DestinationDetails = () => {
  const [destination, setDestination] = useState(null);
  const [reviews, setReviews] = useState({ reviews: [], totalReviews: 0, averageRating: 0 });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/destinations/${id}`);
        setDestination(response.data);
      } catch (error) {
        console.error("Error fetching destination:", error);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/reviews/destination/${id}`);
        setReviews({
          reviews: response.data.reviews,
          totalReviews: response.data.totalReviews,
          averageRating: response.data.averageRating
        });
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchDestination();
    fetchReviews();
  }, [id]);

  const handleAddReview = () => {
    console.log("DestinationDetails handleAddReview called");
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    console.log("Setting showReviewForm to true");
    setShowReviewForm(true);
  };

  const handleReviewSubmit = async (reviewData) => {
    try {
      const token = getAuthToken();
      const response = await axios.post(
        "http://localhost:5001/api/reviews",
        reviewData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      setReviews(prevReviews => ({
        ...prevReviews,
        reviews: [response.data, ...prevReviews.reviews],
        totalReviews: prevReviews.totalReviews + 1,
        averageRating: ((prevReviews.averageRating * prevReviews.totalReviews) + reviewData.rating) / (prevReviews.totalReviews + 1)
      }));

      setShowReviewForm(false);
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  const handleReviewUpdate = async (updatedReview) => {
    try {
      setReviews(prevReviews => ({
        ...prevReviews,
        reviews: prevReviews.reviews.map(review => 
          review._id === updatedReview._id ? updatedReview : review
        )
      }));
    } catch (error) {
      console.error("Error updating review:", error);
    }
  };

  const handleReviewDelete = async (reviewId) => {
    try {
      setReviews(prevReviews => ({
        ...prevReviews,
        reviews: prevReviews.reviews.filter(review => review._id !== reviewId),
        totalReviews: prevReviews.totalReviews - 1
      }));
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  const calculateRatingDistribution = (reviews) => {
    const distribution = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0
    };

    if (reviews && reviews.length > 0) {
      reviews.forEach(review => {
        const rating = Math.round(review.rating);
        distribution[rating] = (distribution[rating] || 0) + 1;
      });
    }

    return distribution;
  };

  if (!destination) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mt-8">
        <ReviewAnalytics 
          totalReviews={reviews.totalReviews} 
          averageRating={reviews.averageRating} 
          ratingDistribution={calculateRatingDistribution(reviews.reviews)}
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
    </div>
  );
};

export default DestinationDetails; 