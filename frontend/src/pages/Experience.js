import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Rating,
  Avatar,
  Divider,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Download as DownloadIcon,
  Star as StarIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';

const Experience = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/reviews');
      setReviews(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch reviews');
      setLoading(false);
      setSnackbar({
        open: true,
        message: 'Error loading reviews',
        severity: 'error'
      });
    }
  };

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

    // Add table
    doc.autoTable({
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

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-8">
            <Typography variant="h4" className="font-bold">
              Travel Experiences
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
            {reviews.map((review) => (
              <Grid item xs={12} md={6} key={review._id}>
                <Card className="h-full transform transition-transform duration-300 hover:scale-105">
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Avatar
                          src={review.user?.profileImage}
                          alt={review.user?.name}
                          className="bg-[#ff6347]"
                        >
                          <PersonIcon />
                        </Avatar>
                        <div>
                          <Typography variant="subtitle1" className="font-semibold">
                            {review.user?.name || 'Anonymous'}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {review.destination?.name}
                          </Typography>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Rating value={review.rating} readOnly precision={0.5} />
                        <StarIcon className="text-yellow-500" />
                      </div>
                    </div>

                    <Typography variant="body1" className="mb-4">
                      {review.comment}
                    </Typography>

                    <Divider className="my-4" />

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <CalendarIcon fontSize="small" />
                        <span>
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => navigate(`/destinations/${review.destination?._id}`)}
                        className="text-[#ff6347] border-[#ff6347] hover:bg-[#ff6347] hover:text-white"
                      >
                        View Destination
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </motion.div>

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
      </Container>
    </div>
  );
};

export default Experience; 