import React from 'react';
import { 
  Paper, 
  Typography, 
  Box, 
  LinearProgress,
  Rating,
  Grid,
  Tooltip
} from '@mui/material';
import { Star as StarIcon } from '@mui/icons-material';

const ReviewAnalytics = ({ totalReviews, averageRating, ratingDistribution, reviews }) => {
  // Debug logs
  console.log('ReviewAnalytics Props:', {
    totalReviews,
    averageRating,
    ratingDistribution,
    reviews
  });

  // Use provided distribution or calculate from reviews
  const distribution = ratingDistribution || (() => {
    console.log('Calculating distribution from reviews in ReviewAnalytics');
    const dist = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0
    };

    if (reviews && reviews.length > 0) {
      console.log('Reviews available for calculation:', reviews);
      reviews.forEach(review => {
        console.log('Processing review:', review);
        const rating = Math.round(review.rating);
        console.log('Rounded rating:', rating);
        dist[rating] = (dist[rating] || 0) + 1;
      });
    }

    console.log('Calculated distribution:', dist);
    return dist;
  })();

  console.log('Final distribution being used:', distribution);

  // Calculate percentages for each rating
  const getPercentage = (count) => {
    if (totalReviews === 0) return 0;
    const percentage = Math.round((count / totalReviews) * 100);
    return percentage;
  };

  if (!totalReviews) {
    return (
      <Box className="m-4">
        <Typography color="text.secondary">No reviews yet. Be the first to review!</Typography>
      </Box>
    );
  }

  return (
    <Paper elevation={0} className="p-6 bg-gray-50 mb-6">
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Box className="text-center">
            <Typography variant="h4" className="font-bold mb-2">
              {averageRating?.toFixed(1) || '0.0'}
            </Typography>
            <Rating
              value={averageRating || 0}
              precision={0.1}
              readOnly
              size="large"
              icon={<StarIcon fontSize="large" />}
              emptyIcon={<StarIcon fontSize="large" />}
            />
            <Typography variant="body2" color="text.secondary" className="mt-2">
              Based on {totalReviews || 0} {totalReviews === 1 ? 'review' : 'reviews'}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={8}>
          <Box className="space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = distribution[rating] || 0;
              const percentage = getPercentage(count);
              console.log(`Rating ${rating}:`, { count, percentage, totalReviews });
              return (
                <Box key={rating} className="flex items-center">
                  <Box className="flex items-center w-16">
                    <Typography variant="body2" className="font-medium">
                      {rating}
                    </Typography>
                    <StarIcon className="text-yellow-500 ml-1" fontSize="small" />
                  </Box>
                  <Box className="flex-1 mx-2">
                    <Tooltip title={`${count} ${count === 1 ? 'review' : 'reviews'} (${percentage}%)`}>
                      <Box>
                        <LinearProgress
                          variant="determinate"
                          value={percentage}
                          className="h-3 rounded-full"
                          sx={{
                            backgroundColor: 'rgba(0, 0, 0, 0.05)',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: '#f59e0b',
                              borderRadius: '4px',
                              transition: 'width 0.5s ease-in-out',
                            },
                          }}
                        />
                      </Box>
                    </Tooltip>
                  </Box>
                  <Box className="w-16 text-right">
                    <Typography variant="body2" className="font-medium">
                      {count}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ReviewAnalytics; 