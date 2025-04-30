import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  CircularProgress, 
  Grid, 
  Card, 
  CardContent,
  Divider
} from '@mui/material';
import AddReviewForm from '../components/AddReviewForm';
import ReviewList from '../components/ReviewList';
import ReviewAnalytics from '../components/ReviewAnalytics';
import axios from 'axios';

const PackageDetails = () => {
  const { id } = useParams();
  const [packageData, setPackageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPackageDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/packages/${id}`, {
          withCredentials: true
        });
        setPackageData(response.data);
      } catch (error) {
        console.error('Error fetching package details:', error);
        setError('Failed to load package details');
      } finally {
        setLoading(false);
      }
    };

    fetchPackageDetails();
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center">
        {error}
      </Typography>
    );
  }

  if (!packageData) {
    return null;
  }

  // Default image if none is provided
  const defaultImage = "https://placehold.co/600x400?text=No+Image+Available";
  const displayImage = packageData.image || defaultImage;

  return (
    <Container maxWidth="lg" className="py-8">
      <Grid container spacing={4}>
        {/* Package Image and Basic Info */}
        <Grid item xs={12} md={6}>
          <img 
            src={displayImage}
            alt={packageData.name}
            className="w-full h-64 object-cover rounded-lg"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = defaultImage;
            }}
          />
          <Typography variant="h4" className="mt-4">
            {packageData.name}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            {packageData.location}
          </Typography>
          <Typography variant="body1" className="mt-2">
            {packageData.description}
          </Typography>
          <Box className="mt-4">
            <Typography variant="h6">Features</Typography>
            <ul className="list-disc list-inside">
              {packageData.features?.map((feature, index) => (
                <li key={index}>{feature}</li>
              )) || <li>No features available</li>}
            </ul>
          </Box>
        </Grid>

        {/* Package Details and Reviews */}
        <Grid item xs={12} md={6}>
          <Card className="mb-4">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Package Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    Duration
                  </Typography>
                  <Typography variant="body1">
                    {packageData.duration} days
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    Price
                  </Typography>
                  <Typography variant="h6" color="primary">
                    ${packageData.price}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Combined Reviews Section */}
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">
                  Reviews
                </Typography>
                <AddReviewForm packageId={id} />
              </Box>
              
              <Divider className="mb-4" />
              
              {/* Analytics and Reviews in one section */}
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <ReviewAnalytics packageId={id} />
                </Grid>
                <Grid item xs={12}>
                  <ReviewList packageId={id} />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PackageDetails; 