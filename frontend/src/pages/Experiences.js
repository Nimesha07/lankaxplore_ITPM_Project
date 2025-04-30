import React, { useState, useEffect } from 'react';
import { Container, Grid, Card, CardContent, Typography, Rating, Avatar, Box, CircularProgress, Button, Snackbar, Alert } from '@mui/material';
import { Download as DownloadIcon } from '@mui/icons-material';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Footer from '../components/Footer';

const Experiences = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/reviews', {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          withCredentials: true
        });
        
        const reviewsData = response.data?.data || response.data || [];
        setReviews(reviewsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setError('Failed to load experiences. Please try again later.');
        setLoading(false);
        setSnackbar({
          open: true,
          message: 'Error loading experiences',
          severity: 'error'
        });
      }
    };

    fetchReviews();
  }, []);

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('Travel Experiences Report', 20, 20);
    
    // Add date
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
    
    // Prepare data for the table
    const tableData = reviews.map(review => [
      review.destination?.name || 'N/A',
      review.user?.name || 'Anonymous',
      review.rating,
      new Date(review.createdAt).toLocaleDateString(),
      review.comment?.substring(0, 50) + '...' || 'No comment'
    ]);

    // Add table using autoTable
    autoTable(doc, {
      startY: 40,
      head: [['Destination', 'User', 'Rating', 'Date', 'Comment']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [255, 99, 71] }, // Tomato color
      styles: { fontSize: 10 },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 30 },
        2: { cellWidth: 20 },
        3: { cellWidth: 30 },
        4: { cellWidth: 70 }
      }
    });

    // Save the PDF
    doc.save('travel_experiences_report.pdf');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Typography color="error" variant="h5">
          {error}
        </Typography>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Container className="py-16">
        <div className="flex justify-between items-center mb-8">
          <Typography variant="h3" className="font-bold">
            Traveler Experiences
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<DownloadIcon />}
            onClick={generatePDF}
            className="bg-[#ff6347] hover:bg-[#ff4500]"
          >
            Download Report
          </Button>
        </div>
        
        <Grid container spacing={4}>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <Grid item xs={12} md={6} lg={4} key={review._id}>
                <Card className="h-full transform hover:-translate-y-1 transition-transform duration-200">
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Avatar 
                        src={review.user?.avatar} 
                        alt={review.user?.name}
                        className="mr-2"
                      >
                        {review.user?.name?.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" className="font-bold">
                          {review.user?.name || 'Anonymous'}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Rating value={review.rating} readOnly precision={0.5} className="mb-2" />
                    
                    <Typography variant="body1" className="mb-4">
                      {review.comment}
                    </Typography>
                    
                    {review.images && review.images.length > 0 && (
                      <Box className="mt-4">
                        <img
                          src={review.images[0]}
                          alt="Review"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography variant="h6" className="text-center text-gray-500">
                No experiences found. Be the first to share your experience!
              </Typography>
            </Grid>
          )}
        </Grid>
      </Container>
      <Footer />

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

export default Experiences; 