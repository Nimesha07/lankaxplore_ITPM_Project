import React, { useState, useEffect, useCallback } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Rating, 
  IconButton, 
  Dialog, 
  DialogTitle,
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  Avatar, 
  CircularProgress,
  Box,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Alert
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  Person as PersonIcon,
  AccessTime as AccessTimeIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import CustomAlert from './CustomAlert';
import SuccessAlert from './SuccessAlert';

const ReviewList = ({ packageId, onReviewUpdate, onReviewDelete }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [editedRating, setEditedRating] = useState(0);
  const [editedComment, setEditedComment] = useState('');
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'info', actionText: '', onActionClick: null });
  const [actionLoading, setActionLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [successAlert, setSuccessAlert] = useState({ open: false, message: '' });

  const showAlert = (message, severity = 'info', actionText = '', onActionClick = null) => {
    setAlert({ open: true, message, severity, actionText, onActionClick });
  };

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const checkEditability = useCallback((review) => {
    if (!user || !review) return false;
    if (review.user._id !== user._id) return false;
    
    const reviewDate = new Date(review.createdAt);
    const now = new Date();
    const hours24 = 24 * 60 * 60 * 1000;
    return (now - reviewDate) <= hours24;
  }, [user]);

  const getTimeRemaining = (createdAt) => {
    const reviewDate = new Date(createdAt);
    const now = new Date();
    const hours24 = 24 * 60 * 60 * 1000;
    const timeLeft = hours24 - (now - reviewDate);
    
    if (timeLeft <= 0) return 'Expired';
    
    const hours = Math.floor(timeLeft / (60 * 60 * 1000));
    const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
    return `${hours}h ${minutes}m left`;
  };

  const handleMenuOpen = (event, review) => {
    setAnchorEl(event.currentTarget);
    setSelectedReview(review);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5001/api/packages/${packageId}/reviews`, {
          withCredentials: true
        });
        const reviewsWithEditable = response.data.reviews.map(review => ({
          ...review,
          isEditable: checkEditability(review),
          timeRemaining: getTimeRemaining(review.createdAt)
        }));
        setReviews(reviewsWithEditable);
        setError(null);
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError("Failed to load reviews");
        showAlert("Failed to load reviews", "error");
      } finally {
        setLoading(false);
      }
    };

    if (packageId) {
      fetchReviews();
    }
  }, [packageId, user, checkEditability]);

  const handleEdit = async () => {
    if (!selectedReview) return;

    try {
      setActionLoading(true);
      const response = await axios.put(
        `http://localhost:5001/api/reviews/${selectedReview._id}`,
        {
          rating: editedRating,
          comment: editedComment
        },
        {
          withCredentials: true
        }
      );

      // Show success message
      setSuccessAlert({
        open: true,
        message: "Review updated successfully!"
      });

      // Update the reviews list
      setReviews(reviews.map(review => 
        review._id === selectedReview._id ? response.data : review
      ));
      
      // Close the edit dialog
      setEditDialogOpen(false);
      
      // Refresh the page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Error updating review:", error);
      showSnackbar(error.response?.data?.error || "Failed to update review", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteClick = () => {
    if (selectedReview) {
      setDeleteDialogOpen(true);
    }
    handleMenuClose();
  };

  const handleDelete = async (reviewId) => {
    if (!reviewId) {
      showSnackbar("Invalid review ID", "error");
      return;
    }

    try {
      setActionLoading(true);
      await axios.delete(`http://localhost:5001/api/reviews/${reviewId}`, {
        withCredentials: true
      });

      // Show success message
      setSuccessAlert({
        open: true,
        message: "Review deleted successfully!"
      });

      // Update the reviews list
      setReviews(reviews.filter(review => review._id !== reviewId));
      
      // Close the delete dialog
      setDeleteDialogOpen(false);
      
      // Refresh the page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Error deleting review:", error);
      showSnackbar(error.response?.data?.error || "Failed to delete review", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditClick = () => {
    if (selectedReview) {
      setEditedRating(selectedReview.rating);
      setEditedComment(selectedReview.comment);
      setEditDialogOpen(true);
    }
    handleMenuClose();
  };

  if (loading) {
    return (
      <Box className="flex justify-center items-center p-8">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="m-4">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <Card key={review._id} className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-0">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-3">
                <Avatar 
                  alt={review.user.name || review.user.username}
                  src={review.user.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.user.name || review.user.username)}`}
                  className="w-10 h-10"
                >
                  <PersonIcon />
                </Avatar>
                <div>
                  <Typography variant="subtitle1" component="div" className="font-medium">
                    {review.user.name || review.user.username}
                  </Typography>
                  <div className="flex items-center space-x-2">
                    <Typography variant="body2" color="text.secondary" className="text-xs">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </Typography>
                    {review.isEditable && (
                      <Tooltip title={review.timeRemaining}>
                        <div className="flex items-center text-blue-500 text-xs">
                          <AccessTimeIcon fontSize="small" />
                          <span className="ml-1">{review.timeRemaining}</span>
                        </div>
                      </Tooltip>
                    )}
                  </div>
                </div>
              </div>
              {review.isEditable && (
                <IconButton
                  size="small"
                  onClick={(e) => handleMenuOpen(e, review)}
                >
                  <MoreVertIcon />
                </IconButton>
              )}
            </div>
            <div className="mt-3">
              <Rating value={review.rating} readOnly precision={0.5} />
            </div>
            <Typography variant="body1" className="mt-2">
              {review.comment}
            </Typography>
          </CardContent>
        </Card>
      ))}

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Review</DialogTitle>
        <DialogContent>
          <div className="mt-4">
            <Typography component="legend">Rating</Typography>
            <Rating
              value={editedRating}
              onChange={(event, newValue) => setEditedRating(newValue)}
              precision={0.5}
            />
          </div>
          <TextField
            autoFocus
            margin="dense"
            label="Comment"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={editedComment}
            onChange={(e) => setEditedComment(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleEdit} 
            variant="contained" 
            color="primary"
            disabled={actionLoading || !editedRating || !editedComment}
          >
            {actionLoading ? <CircularProgress size={24} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => {
        setDeleteDialogOpen(false);
        setSelectedReview(null);
      }}>
        <DialogTitle>Delete Review</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this review? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setDeleteDialogOpen(false);
            setSelectedReview(null);
          }}>Cancel</Button>
          <Button 
            onClick={() => selectedReview && handleDelete(selectedReview._id)} 
            variant="contained" 
            color="error"
            disabled={actionLoading}
          >
            {actionLoading ? "Deleting..." : "Delete Review"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Custom Alert */}
      <CustomAlert 
        open={alert.open}
        onClose={() => setAlert({ ...alert, open: false })}
        message={alert.message}
        severity={alert.severity}
        actionText={alert.actionText}
        onActionClick={alert.onActionClick}
      />

      {/* Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleEditClick()}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleDeleteClick()}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      {/* Snackbar for error messages */}
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

      {/* Success Alert */}
      <SuccessAlert
        open={successAlert.open}
        onClose={() => setSuccessAlert({ ...successAlert, open: false })}
        message={successAlert.message}
      />
    </div>
  );
};

export default ReviewList; 