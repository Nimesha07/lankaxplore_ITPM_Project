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
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Divider,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import { motion } from 'framer-motion';

const PackageDetails = () => {
  const { id } = useParams();
  const [packageData, setPackageData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openBookingDialog, setOpenBookingDialog] = useState(false);
  const [bookingData, setBookingData] = useState({
    startDate: '',
    endDate: '',
    numberOfPeople: 1,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    const fetchPackageDetails = async () => {
      try {
        const [packageRes, reviewsRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/packages/${id}`),
          axios.get(`http://localhost:5000/api/packages/${id}/reviews`),
        ]);

        setPackageData(packageRes.data);
        setReviews(reviewsRes.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching package details:', error);
        setLoading(false);
      }
    };

    fetchPackageDetails();
  }, [id]);

  const handleBookingDialogOpen = () => {
    setOpenBookingDialog(true);
  };

  const handleBookingDialogClose = () => {
    setOpenBookingDialog(false);
  };

  const handleBookingSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setSnackbar({
          open: true,
          message: 'Please login to book a package',
          severity: 'error',
        });
        return;
      }

      await axios.post(
        `http://localhost:5000/api/bookings`,
        {
          packageId: id,
          ...bookingData,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSnackbar({
        open: true,
        message: 'Booking successful!',
        severity: 'success',
      });
      handleBookingDialogClose();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Error booking package',
        severity: 'error',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!packageData) {
    return (
      <Container className="py-16 text-center">
        <Typography variant="h4">Package not found</Typography>
      </Container>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative h-[50vh] bg-cover bg-center"
        style={{
          backgroundImage: `url(${packageData.image || 'https://via.placeholder.com/1920x1080'})`,
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50">
          <Container className="h-full flex flex-col justify-center">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-white"
            >
              <Typography variant="h2" className="font-bold mb-4">
                {packageData.name}
              </Typography>
              <Typography variant="h6" className="mb-8">
                {packageData.destination?.name}
              </Typography>
            </motion.div>
          </Container>
        </div>
      </motion.div>

      <Container className="py-16">
        <Grid container spacing={4}>
          {/* Main Content */}
          <Grid item xs={12} md={8}>
            <Card className="mb-8">
              <CardContent>
                <Typography variant="h5" className="font-bold mb-4">
                  Package Details
                </Typography>
                <Typography variant="body1" className="mb-6">
                  {packageData.description}
                </Typography>
                <Typography variant="h6" className="font-bold mb-4">
                  Itinerary
                </Typography>
                <Typography variant="body1">
                  {packageData.itinerary}
                </Typography>
              </CardContent>
            </Card>

            {/* Reviews Section */}
            <Card>
              <CardContent>
                <Typography variant="h5" className="font-bold mb-6">
                  Reviews
                </Typography>
                {reviews.map((review) => (
                  <div key={review._id} className="mb-6">
                    <div className="flex items-center mb-4">
                      <Avatar src={review.user?.avatar} className="mr-4">
                        {review.user?.name?.charAt(0)}
                      </Avatar>
                      <div>
                        <Typography variant="subtitle1" className="font-bold">
                          {review.user?.name}
                        </Typography>
                        <Rating value={review.rating} readOnly size="small" />
                      </div>
                    </div>
                    <Typography variant="body1">{review.comment}</Typography>
                    <Typography variant="caption" color="textSecondary" className="mt-2 block">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </Typography>
                    <Divider className="my-4" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            <Card className="sticky top-4">
              <CardContent>
                <Typography variant="h5" className="font-bold mb-4">
                  Book This Package
                </Typography>
                <Typography variant="h4" color="primary" className="mb-6">
                  ${packageData.price}
                </Typography>
                <div className="space-y-4 mb-6">
                  <div>
                    <Typography variant="subtitle2" color="textSecondary">
                      Duration
                    </Typography>
                    <Typography variant="body2">{packageData.duration} days</Typography>
                  </div>
                  <div>
                    <Typography variant="subtitle2" color="textSecondary">
                      Max Group Size
                    </Typography>
                    <Typography variant="body2">{packageData.maxGroupSize} people</Typography>
                  </div>
                  <div>
                    <Typography variant="subtitle2" color="textSecondary">
                      Difficulty Level
                    </Typography>
                    <Typography variant="body2">{packageData.difficultyLevel}</Typography>
                  </div>
                </div>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  onClick={handleBookingDialogOpen}
                >
                  Book Now
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Booking Dialog */}
      <Dialog open={openBookingDialog} onClose={handleBookingDialogClose}>
        <DialogTitle>Book Package</DialogTitle>
        <DialogContent>
          <div className="space-y-4 mt-4">
            <TextField
              label="Start Date"
              type="date"
              fullWidth
              value={bookingData.startDate}
              onChange={(e) => setBookingData({ ...bookingData, startDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="End Date"
              type="date"
              fullWidth
              value={bookingData.endDate}
              onChange={(e) => setBookingData({ ...bookingData, endDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Number of People"
              type="number"
              fullWidth
              value={bookingData.numberOfPeople}
              onChange={(e) => setBookingData({ ...bookingData, numberOfPeople: e.target.value })}
              InputProps={{ inputProps: { min: 1, max: packageData.maxGroupSize } }}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleBookingDialogClose}>Cancel</Button>
          <Button onClick={handleBookingSubmit} variant="contained" color="primary">
            Confirm Booking
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default PackageDetails; 