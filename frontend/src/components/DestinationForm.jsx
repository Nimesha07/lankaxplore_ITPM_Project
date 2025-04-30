import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  Paper,
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  CloudUpload as CloudUploadIcon
} from '@mui/icons-material';
import axios from 'axios';

const categories = ['Adventure', 'History', 'Nature', 'Beach', 'Cultural', 'Wildlife'];

const DestinationForm = ({ destination, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    category: '',
    bestTimeToVisit: '',
    weather: '',
    transportation: '',
    locationDetails: '',
    highlights: [],
    image: null,
    additionalImages: []
  });

  const [newHighlight, setNewHighlight] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [previewImages, setPreviewImages] = useState([]);

  useEffect(() => {
    if (destination) {
      setFormData({
        name: destination.name || '',
        description: destination.description || '',
        location: destination.location || '',
        category: destination.category || '',
        bestTimeToVisit: destination.bestTimeToVisit || '',
        weather: destination.weather || '',
        transportation: destination.transportation || '',
        locationDetails: destination.locationDetails || '',
        highlights: destination.highlights || [],
        image: null,
        additionalImages: []
      });
      setPreviewImages([
        destination.image,
        ...(destination.images || [])
      ]);
    }
  }, [destination]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleHighlightAdd = () => {
    if (newHighlight.trim()) {
      setFormData(prev => ({
        ...prev,
        highlights: [...prev.highlights, newHighlight.trim()]
      }));
      setNewHighlight('');
    }
  };

  const handleHighlightDelete = (index) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index)
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImages(prev => [reader.result, ...prev.slice(1)]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdditionalImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setFormData(prev => ({ ...prev, additionalImages: files }));
      const previews = files.map(file => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        return new Promise(resolve => {
          reader.onloadend = () => resolve(reader.result);
        });
      });
      Promise.all(previews).then(results => {
        setPreviewImages(prev => [...prev.slice(0, 1), ...results]);
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const formDataToSend = new FormData();
      
      // Add all form fields
      Object.keys(formData).forEach(key => {
        if (key === 'highlights') {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else if (key === 'image') {
          // Handle main image
          if (formData[key] instanceof File) {
            formDataToSend.append('image', formData[key]);
          } else if (typeof formData[key] === 'string' && formData[key].startsWith('http')) {
            // If it's an existing URL, keep it
            formDataToSend.append('image', formData[key]);
          } else if (destination?.image) {
            // If no new image but existing image, keep the existing one
            formDataToSend.append('image', destination.image);
          }
        } else if (key === 'additionalImages') {
          // Handle additional images
          if (formData[key].length > 0) {
            formData[key].forEach(file => {
              if (file instanceof File) {
                formDataToSend.append('additionalImages', file);
              }
            });
          } else if (destination?.images?.length > 0) {
            // If no new additional images but existing ones, keep them
            destination.images.forEach(image => {
              formDataToSend.append('additionalImages', image);
            });
          }
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      };

      let response;
      if (destination) {
        response = await axios.patch(
          `http://localhost:5001/api/destinations/${destination._id}`,
          formDataToSend,
          config
        );
      } else {
        response = await axios.post(
          'http://localhost:5001/api/destinations',
          formDataToSend,
          config
        );
      }

      setSuccess(destination ? 'Destination updated successfully!' : 'Destination created successfully!');
      
      // Reset form data after successful submission
      if (!destination) {
        setFormData({
          name: '',
          description: '',
          location: '',
          category: '',
          bestTimeToVisit: '',
          weather: '',
          transportation: '',
          locationDetails: '',
          highlights: [],
          image: null,
          additionalImages: []
        });
        setPreviewImages([]);
      } else {
        // Update the form data with the response data
        setFormData(prev => ({
          ...prev,
          ...response.data,
          image: response.data.image,
          additionalImages: response.data.images || []
        }));
        setPreviewImages([
          response.data.image,
          ...(response.data.images || [])
        ]);
      }

      // Call onSubmit callback with the response data
      if (onSubmit) {
        onSubmit(response.data);
      }

      // Auto-refresh after 2 seconds
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error) {
      console.error('Error submitting destination:', error);
      setError(error.response?.data?.message || 'An error occurred while submitting the destination');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        {destination ? 'Edit Destination' : 'Add New Destination'}
      </Typography>
      <Divider sx={{ mb: 3 }} />

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

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Destination Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={4}
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={formData.category}
                onChange={handleChange}
                label="Category"
              >
                {categories.map(category => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Best Time to Visit"
              name="bestTimeToVisit"
              value={formData.bestTimeToVisit}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Weather"
              name="weather"
              value={formData.weather}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Transportation"
              name="transportation"
              value={formData.transportation}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Location Details"
              name="locationDetails"
              value={formData.locationDetails}
              onChange={handleChange}
              multiline
              rows={3}
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Highlights
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <TextField
                  size="small"
                  value={newHighlight}
                  onChange={(e) => setNewHighlight(e.target.value)}
                  placeholder="Add a highlight"
                />
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleHighlightAdd}
                >
                  Add
                </Button>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {formData.highlights.map((highlight, index) => (
                  <Chip
                    key={index}
                    label={highlight}
                    onDelete={() => handleHighlightDelete(index)}
                  />
                ))}
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Main Image
            </Typography>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
              id="image-upload"
            />
            <label htmlFor="image-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<CloudUploadIcon />}
                sx={{ mb: 2 }}
              >
                Upload Main Image
              </Button>
            </label>
            {previewImages[0] && (
              <Box sx={{ mt: 2, mb: 2 }}>
                <img
                  src={previewImages[0]}
                  alt="Preview"
                  style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'cover' }}
                />
              </Box>
            )}
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Additional Images
            </Typography>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleAdditionalImagesChange}
              style={{ display: 'none' }}
              id="additional-images-upload"
            />
            <label htmlFor="additional-images-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<CloudUploadIcon />}
                sx={{ mb: 2 }}
              >
                Upload Additional Images
              </Button>
            </label>
            {previewImages.slice(1).length > 0 && (
              <Box sx={{ display: 'flex', gap: 2, mt: 2, mb: 2, flexWrap: 'wrap' }}>
                {previewImages.slice(1).map((preview, index) => (
                  <img
                    key={index}
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    style={{ maxWidth: '150px', maxHeight: '150px', objectFit: 'cover' }}
                  />
                ))}
              </Box>
            )}
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={onCancel}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : null}
              >
                {destination ? 'Update Destination' : 'Create Destination'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default DestinationForm; 