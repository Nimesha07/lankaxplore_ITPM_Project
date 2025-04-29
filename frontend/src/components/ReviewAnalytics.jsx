import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Rating,
  Grid,
  CircularProgress
} from '@mui/material';
import axios from 'axios';

const ReviewAnalytics = ({ packageId }) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Get reviews for this specific package
        const reviewsResponse = await axios.get(`http://localhost:5001/api/packages/${packageId}/reviews`, {
          withCredentials: true
        });
        
        const reviews = reviewsResponse.data.reviews || [];
        console.log('Fetched reviews:', reviews); // Debug log
        
        // Calculate analytics
        const totalReviews = reviews.length;
        const averageRating = totalReviews > 0 
          ? reviews.reduce((acc, review) => acc + review.rating, 0) / totalReviews 
          : 0;

        // Initialize rating distribution with all possible ratings
        const ratingDistribution = {
          5: 0,
          4: 0,
          3: 0,
          2: 0,
          1: 0
        };

        // Count each rating
        reviews.forEach(review => {
          const rating = Math.round(review.rating); // Round to nearest whole number
          if (rating >= 1 && rating <= 5) {
            ratingDistribution[rating]++;
          }
        });

        console.log('Rating distribution:', ratingDistribution); // Debug log

        // Get recent reviews (last 5)
        const recentReviews = reviews
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);

        setAnalytics({
          totalReviews,
          averageRating,
          ratingDistribution,
          recentReviews
        });
      } catch (error) {
        console.error('Error fetching review analytics:', error);
        setError('Failed to load review analytics');
      } finally {
        setLoading(false);
      }
    };

    if (packageId) {
      fetchAnalytics();
    }
  }, [packageId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50px">
        <CircularProgress size={20} />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center" variant="body2">
        {error}
      </Typography>
    );
  }

  if (!analytics) {
    return null;
  }

  const {
    totalReviews,
    averageRating,
    ratingDistribution,
    recentReviews
  } = analytics;

  return (
    <Box className="mb-4">
      <Grid container spacing={1} alignItems="center">
        {/* Overall Rating */}
        <Grid item xs={3}>
          <Box textAlign="center">
            <Typography variant="h5" color="primary">
              {averageRating.toFixed(1)}
            </Typography>
            <Rating 
              value={averageRating} 
              precision={0.1} 
              readOnly 
              size="small"
            />
            <Typography variant="caption" color="textSecondary">
              {totalReviews} reviews
            </Typography>
          </Box>
        </Grid>

        {/* Rating Distribution */}
        <Grid item xs={9}>
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = ratingDistribution[rating] || 0;
            const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
            
            return (
              <Box key={rating} display="flex" alignItems="center" mb={0.5}>
                <Typography variant="caption" sx={{ minWidth: 15 }}>
                  {rating}
                </Typography>
                <Box flex={1} mx={1}>
                  <Box 
                    bgcolor="primary.main" 
                    height={4} 
                    width={`${percentage}%`}
                    borderRadius={1}
                  />
                </Box>
                <Typography variant="caption" color="textSecondary" sx={{ minWidth: 25 }}>
                  {count}
                </Typography>
              </Box>
            );
          })}
        </Grid>
      </Grid>

      {/* Recent Reviews Summary */}
      {recentReviews.length > 0 && (
        <Box mt={2}>
          <Typography variant="subtitle2" gutterBottom>
            Recent Reviews
          </Typography>
          {recentReviews.map((review) => (
            <Box key={review._id} display="flex" alignItems="center" mb={1}>
              <Rating value={review.rating} readOnly size="small" />
              <Typography variant="caption" sx={{ ml: 1 }}>
                {review.comment.substring(0, 50)}...
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ReviewAnalytics; 