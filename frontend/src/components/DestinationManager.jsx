import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Chip,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Rating
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Visibility as ViewIcon,
  LocationOn,
  Image as ImageIcon,
  Star as StarIcon
} from '@mui/icons-material';
import axios from 'axios';
import DestinationForm from './DestinationForm';
import { useNavigate } from 'react-router-dom';

const DestinationManager = () => {
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [destinationToDelete, setDestinationToDelete] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    fetchDestinations();
  }, []);

  // Function to check if image exists
  const checkImageExists = async (url) => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      console.error('Error checking image:', url, error);
      return false;
    }
  };

  const fetchDestinations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      console.log('Fetching destinations with token:', token ? 'Token exists' : 'No token');

      const response = await axios.get('http://localhost:5001/api/users/destinations', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Raw API Response:', response.data);

      // Process destinations to ensure proper data handling
      const processedDestinations = await Promise.all(response.data.data.map(async (destination) => {
        console.log('Processing destination:', destination.name);
        
        // Fix highlights array - parse stringified array if needed
        let processedHighlights = [];
        if (Array.isArray(destination.highlights)) {
          processedHighlights = destination.highlights.map(highlight => {
            try {
              if (typeof highlight === 'string' && highlight.startsWith('[')) {
                const parsed = JSON.parse(highlight);
                return Array.isArray(parsed) ? parsed[0] : highlight;
              }
              return highlight;
            } catch (e) {
              return highlight;
            }
          });
        }

        // Process image URLs and verify they exist
        const imageUrl = destination.image 
          ? `http://localhost:5001/${destination.image}`
          : null;

        // Check if image exists
        const imageExists = imageUrl ? await checkImageExists(imageUrl) : false;
        console.log('Image exists check:', imageUrl, imageExists);

        // Process additional images
        const processedAdditionalImages = Array.isArray(destination.images)
          ? destination.images.map(img => 
              img ? `http://localhost:5001/${img}` : null
            ).filter(Boolean)
          : [];

        const processed = {
          ...destination,
          image: imageExists ? imageUrl : null,
          additionalImages: processedAdditionalImages,
          highlights: processedHighlights
        };

        console.log('Processed destination:', {
          name: processed.name,
          image: processed.image,
          additionalImages: processed.additionalImages,
          highlights: processed.highlights
        });

        return processed;
      }));

      console.log('Final processed destinations:', processedDestinations);
      setDestinations(processedDestinations);
      setError(null);
    } catch (error) {
      console.error('Error fetching destinations:', error);
      console.error('Error response:', error.response);
      setError(error.response?.data?.message || 'Failed to fetch destinations');
      setDestinations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (destination) => {
    setSelectedDestination(destination);
    setShowForm(true);
  };

  const handleDelete = (destination) => {
    setDestinationToDelete(destination);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5001/api/destinations/${destinationToDelete._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Update the destinations state by filtering out the deleted destination
      setDestinations(prevDestinations => 
        prevDestinations.filter(d => d._id !== destinationToDelete._id)
      );
      
      // Show success message
      setSuccess('Destination deleted successfully');
      setTimeout(() => setSuccess(null), 3000);
      
      // Close the dialog
      setShowDeleteDialog(false);
      setDestinationToDelete(null);
    } catch (error) {
      console.error('Error deleting destination:', error);
      setError(error.response?.data?.message || 'Failed to delete destination');
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (destination) => {
    if (selectedDestination) {
      setDestinations(destinations.map(d => 
        d._id === destination._id ? destination : d
      ));
    } else {
      setDestinations([...destinations, destination]);
    }
    setShowForm(false);
    setSelectedDestination(null);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setSelectedDestination(null);
  };

  const handleViewDestination = (destinationId) => {
    navigate(`/destinations/${destinationId}`);
  };

  const renderGridView = () => (
    <Grid container spacing={3}>
      {destinations.map((destination) => (
        <Grid item xs={12} sm={6} md={4} key={destination._id}>
          <Card 
            sx={{ 
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 6
              }
            }}
          >
            <Box sx={{ position: 'relative', height: 200 }}>
              {destination.image ? (
                <Box
                  component="img"
                  src={destination.image}
                  alt={destination.name}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderTopLeftRadius: '4px',
                    borderTopRightRadius: '4px',
                    backgroundColor: 'grey.100'
                  }}
                  onError={(e) => {
                    console.error('Image load error:', e.target.src);
                    setImageErrors(prev => ({
                      ...prev,
                      [destination._id]: true
                    }));
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                  }}
                  onLoad={(e) => {
                    console.log('Image loaded successfully:', e.target.src);
                    setImageErrors(prev => ({
                      ...prev,
                      [destination._id]: false
                    }));
                  }}
                />
              ) : (
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    bgcolor: 'grey.200',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    gap: 1
                  }}
                >
                  <ImageIcon sx={{ fontSize: 40, color: 'grey.400' }} />
                  <Typography variant="body2" color="text.secondary">
                    No Image Available
                  </Typography>
                </Box>
              )}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                  p: 2,
                  color: 'white'
                }}
              >
                <Typography variant="h6" noWrap>
                  {destination.name}
                </Typography>
                <Typography variant="body2" noWrap>
                  {destination.location}
                </Typography>
              </Box>
            </Box>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Chip
                  label={destination.category}
                  size="small"
                  color="primary"
                  sx={{ mr: 1 }}
                />
                <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
                  <StarIcon sx={{ color: 'warning.main', fontSize: 16, mr: 0.5 }} />
                  <Typography variant="body2" color="text.secondary">
                    {destination.rating?.toFixed(1) || 'N/A'}
                  </Typography>
                </Box>
              </Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  mb: 2
                }}
              >
                {destination.description}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  {destination.reviews?.length || 0} reviews
                </Typography>
                <Box>
                  <IconButton
                    size="small"
                    onClick={() => handleViewDestination(destination._id)}
                    sx={{ mr: 1 }}
                  >
                    <ViewIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleEdit(destination)}
                    sx={{ mr: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(destination)}
                    color="error"
                    disabled={loading}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderTableView = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Rating</TableCell>
            <TableCell>Reviews</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {destinations.map((destination) => (
            <TableRow key={destination._id}>
              <TableCell>{destination.name}</TableCell>
              <TableCell>{destination.location}</TableCell>
              <TableCell>
                <Chip
                  label={destination.category}
                  color="primary"
                  size="small"
                />
              </TableCell>
              <TableCell>{destination.rating?.toFixed(1) || 'N/A'}</TableCell>
              <TableCell>{destination.reviews?.length || 0}</TableCell>
              <TableCell>
                <IconButton
                  color="primary"
                  onClick={() => handleViewDestination(destination._id)}
                >
                  <ViewIcon />
                </IconButton>
                <IconButton
                  color="primary"
                  onClick={() => handleEdit(destination)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() => handleDelete(destination)}
                  disabled={loading}
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">My Destinations</Typography>
        <Box>
          <Button
            variant={viewMode === 'grid' ? 'contained' : 'outlined'}
            onClick={() => setViewMode('grid')}
            sx={{ mr: 1 }}
          >
            Grid View
          </Button>
          <Button
            variant={viewMode === 'table' ? 'contained' : 'outlined'}
            onClick={() => setViewMode('table')}
            sx={{ mr: 1 }}
          >
            Table View
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setShowForm(true)}
          >
            Add Destination
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : destinations.length === 0 ? (
        <Box sx={{ textAlign: 'center', p: 4 }}>
          <Typography variant="h6" color="text.secondary">
            You haven't added any destinations yet
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setShowForm(true)}
            sx={{ mt: 2 }}
          >
            Add Your First Destination
          </Button>
        </Box>
      ) : viewMode === 'grid' ? (
        renderGridView()
      ) : (
        renderTableView()
      )}

      <Dialog
        open={showForm}
        onClose={handleFormCancel}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedDestination ? 'Edit Destination' : 'Add New Destination'}
        </DialogTitle>
        <DialogContent>
          <DestinationForm
            destination={selectedDestination}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ 
          bgcolor: 'error.light', 
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <DeleteIcon />
          Delete Destination
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Are you sure you want to delete this destination?
          </Typography>
          <Typography color="error" variant="subtitle1">
            {destinationToDelete?.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            This action cannot be undone. All associated data including reviews and images will be permanently deleted.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setShowDeleteDialog(false)}
            variant="outlined"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <DeleteIcon />}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DestinationManager; 