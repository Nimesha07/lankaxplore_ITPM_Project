import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardMedia, Typography, Grid, Container, Button, Rating, Avatar, Divider, CircularProgress, Snackbar, Alert } from '@mui/material';
import { motion } from 'framer-motion';
import axios from 'axios';
import { LocationOn, Download } from '@mui/icons-material';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Destinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/destinations', {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          withCredentials: true
        });
        console.log('Fetched destinations:', response.data);
        setDestinations(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching destinations:', error);
        setError('Failed to load destinations. Please try again later.');
        setLoading(false);
        setSnackbar({
          open: true,
          message: 'Error loading destinations',
          severity: 'error'
        });
      }
    };

    fetchDestinations();
  }, []);

  const generateCatalog = () => {
    const doc = new jsPDF();
    
    // Add cover page 
    doc.setFontSize(32);
    doc.setTextColor(255, 99, 71); // Tomato color
    doc.text('LankaXplore', 105, 50, { align: 'center' });
    doc.setFontSize(24);
    doc.setTextColor(0, 0, 0);
    doc.text('Destination Catalog', 105, 70, { align: 'center' });
    doc.setFontSize(14);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 80, { align: 'center' });
    
    // Add a new page for the catalog
    doc.addPage();
    
    // Add table of contents
    doc.setFontSize(18);
    doc.text('Table of Contents', 20, 20);
    doc.setFontSize(12);
    let yPos = 30;
    destinations.forEach((dest, index) => {
      doc.text(`${index + 1}. ${dest.name}`, 20, yPos);
      yPos += 10;
    });
    
    // Add a new page for the catalog content
    doc.addPage();
    
    // Add destinations with images and details
    destinations.forEach((dest, index) => {
      if (index > 0) {
        doc.addPage();
      }
      
      // Add destination name
      doc.setFontSize(20);
      doc.setTextColor(255, 99, 71);
      doc.text(dest.name, 20, 20);
      
      // Add destination image if available
      if (dest.image) {
        const img = new Image();
        img.src = dest.image;
        doc.addImage(img, 'JPEG', 20, 30, 170, 100);
      }
      
      // Add destination details
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      let detailY = 140;
      
      // Description
      doc.setFontSize(14);
      doc.text('Description:', 20, detailY);
      doc.setFontSize(12);
      const description = doc.splitTextToSize(dest.description || 'No description available', 170);
      doc.text(description, 20, detailY + 10);
      
      // Details
      detailY += 30 + (description.length * 7);
      doc.setFontSize(14);
      doc.text('Details:', 20, detailY);
      doc.setFontSize(12);
      
      // Location
      doc.text(`Location: ${dest.location || 'N/A'}`, 20, detailY + 10);
      
      // Best time to visit
      doc.text(`Best Time to Visit: ${dest.bestTimeToVisit || 'N/A'}`, 20, detailY + 20);
      
      // Transportation
      doc.text(`Transportation: ${dest.transportation || 'N/A'}`, 20, detailY + 30);
      
      // Category
      doc.text(`Category: ${dest.category || 'N/A'}`, 20, detailY + 40);
      
      // Add a separator line
      doc.setDrawColor(255, 99, 71);
      doc.line(20, detailY + 50, 190, detailY + 50);
    });

    // Save the PDF: Pdf generator 
    doc.save('lankaxplore_destination_catalog.pdf');
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
        <Typography variant="h5" color="error">
          {error}
        </Typography>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-16">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <Typography variant="h3" className="font-bold text-gray-800 mb-4">
            All Destinations
          </Typography>
          <Typography variant="subtitle1" className="text-gray-600">
            Explore all the beautiful destinations in Sri Lanka
          </Typography>
        </motion.div>

        <div className="flex justify-between items-center mb-8">
          <Typography variant="h4" className="font-bold">
            Destinations
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Download />}
            onClick={generateCatalog}
            className="bg-[#ff6347] hover:bg-[#ff4500]"
          >
            Download Catalog
          </Button>
        </div>

        {destinations.length === 0 ? (
          <div className="text-center">
            <Typography variant="h6" color="textSecondary">
              No destinations found
            </Typography>
          </div>
        ) : (
          <>
            <Grid container spacing={4}>
              {destinations.map((destination) => (
                <Grid item xs={12} sm={6} md={4} key={destination._id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -5 }}
                    className="h-full"
                  >
                    <Card className="h-full transform transition-all duration-300 hover:shadow-2xl overflow-hidden">
                      <div className="relative h-48 overflow-hidden">
                        <CardMedia
                          component="img"
                          height="200"
                          image={destination.image || 'https://via.placeholder.com/400x200'}
                          alt={destination.name}
                          className="h-full object-cover transform transition-transform duration-500 hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <Typography variant="h5" component="h2" className="font-bold text-white">
                            {destination.name}
                          </Typography>
                          <Typography variant="body2" className="text-white/90">
                            {destination.location}
                          </Typography>
                        </div>
                      </div>
                      <CardContent className="bg-white p-4">
                        <Typography variant="body2" color="textSecondary" className="mb-4 line-clamp-2">
                          {destination.description?.substring(0, 100)}...
                        </Typography>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <LocationOn className="text-[#ff6347]" />
                            <Typography variant="body2" color="textSecondary">
                              {destination.category}
                            </Typography>
                          </div>
                          <Button
                            component={Link}
                            to={`/destinations/${destination._id}`}
                            variant="contained"
                            className="bg-[#ff6347] hover:bg-[#ff4500] text-white rounded-lg 
                                     transition-all duration-300 transform hover:scale-105 
                                     flex items-center space-x-2 shadow-md hover:shadow-lg"
                          >
                            <span>Explore</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </>
        )}

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

export default Destinations; 