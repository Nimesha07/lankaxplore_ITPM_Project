import React, { useState } from 'react';
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
  Paper,
  Divider,
  Chip,
  Snackbar,
  Alert,
  Grid,
  Menu,
  MenuItem
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  Person as PersonIcon,
  MoreVert as MoreVertIcon,
  Star as StarIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import CustomAlert from './CustomAlert';
import SuccessAlert from './SuccessAlert';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from "react-router-dom";

const ReviewList = ({ 
  reviews = [], 
  onReviewUpdate = () => {}, 
  onReviewDelete = () => {}, 
  onAddReview 
}) => {
  console.log("ReviewList rendered");
  console.log("Props:", { reviews, onReviewUpdate, onReviewDelete, onAddReview });
  
  const { user, isAuthenticated } = useAuth();
  console.log("Auth state:", { user, isAuthenticated });
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [editedRating, setEditedRating] = useState(0);
  const [editedComment, setEditedComment] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [successAlert, setSuccessAlert] = useState({ open: false, message: '' });
  const navigate = useNavigate();

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const checkEditability = (review) => {
    if (!user || !review) return false;
    if (review.user._id !== user._id) return false;
    
    const reviewDate = new Date(review.createdAt);
    const now = new Date();
    const hours24 = 24 * 60 * 60 * 1000;
    return (now - reviewDate) <= hours24;
  };

  const formatDate = (date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  const handleMenuOpen = (event, review) => {
    setAnchorEl(event.currentTarget);
    setSelectedReview(review);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditClick = () => {
    if (selectedReview) {
      setEditedRating(selectedReview.rating);
      setEditedComment(selectedReview.comment);
      setEditDialogOpen(true);
    }
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    if (selectedReview) {
      setDeleteDialogOpen(true);
    }
    handleMenuClose();
  };

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

      setSuccessAlert({
        open: true,
        message: "Review updated successfully!"
      });

      if (onReviewUpdate) {
        onReviewUpdate(response.data);
      }
      
      setEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating review:", error);
      showSnackbar(error.response?.data?.error || "Failed to update review", "error");
    } finally {
      setActionLoading(false);
    }
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

      setSuccessAlert({
        open: true,
        message: "Review deleted successfully!"
      });

      if (onReviewDelete) {
        onReviewDelete(reviewId);
      }
      
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting review:", error);
      showSnackbar(error.response?.data?.error || "Failed to delete review", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddReview = () => {
    console.log("ReviewList handleAddReview called");
    console.log("isAuthenticated:", isAuthenticated);
    console.log("onAddReview prop:", onAddReview);
    
    if (!isAuthenticated) {
      setSnackbar({
        open: true,
        message: "Please login to add a review",
        severity: "warning",
        actionText: "Login",
        onActionClick: () => navigate("/login")
      });
      return;
    }
    
    if (onAddReview && typeof onAddReview === 'function') {
      console.log("Calling onAddReview function");
      onAddReview();
    } else {
      console.error("onAddReview is not a function");
    }
  };

  if (!reviews || reviews.length === 0) {
    return (
      <Box className="space-y-4">
        <Paper elevation={0} className="p-4 bg-gray-50">
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="h6" className="font-semibold">
                Reviews (0)
              </Typography>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddReview}
                size="small"
                startIcon={<AddIcon />}
              >
                Add Review
              </Button>
            </Grid>
          </Grid>
        </Paper>
        <Paper elevation={0} className="p-4 bg-gray-50">
          <Typography variant="body1" color="text.secondary" align="center">
            No reviews yet. Be the first to review!
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box className="space-y-4">
      <Paper elevation={0} className="p-4 bg-gray-50">
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h6" className="font-semibold">
              Reviews ({reviews.length})
            </Typography>
          </Grid>
          <Grid item>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleAddReview}
              size="small"
              startIcon={<AddIcon />}
            >
              Add Review
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Box className="space-y-3">
        {reviews.map((review) => (
          <Paper key={review._id} elevation={0} className="p-4 bg-gray-50">
            <Box className="flex justify-between items-start">
              <Box className="flex items-center space-x-3">
                <Avatar 
                  alt={review.user.name || review.user.username}
                  src={review.user.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.user.name || review.user.username)}`}
                  className="w-10 h-10"
                >
                  <PersonIcon />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" className="font-medium">
                    {review.user.name || review.user.username}
                  </Typography>
                  <Box className="flex items-center space-x-1">
                    <Rating 
                      value={review.rating} 
                      readOnly 
                      precision={0.5}
                      size="small"
                      icon={<StarIcon fontSize="small" />}
                      emptyIcon={<StarIcon fontSize="small" />}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(review.createdAt)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              {checkEditability(review) && (
                <IconButton
                  size="small"
                  onClick={(e) => handleMenuOpen(e, review)}
                >
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
            <Typography variant="body2" className="mt-2 text-gray-700">
              {review.comment}
            </Typography>
          </Paper>
        ))}
      </Box>

      {/* Review Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEditClick}>
          <EditIcon fontSize="small" className="mr-2" />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDeleteClick}>
          <DeleteIcon fontSize="small" className="mr-2" />
          Delete
        </MenuItem>
      </Menu>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Review</DialogTitle>
        <DialogContent>
          <Box className="flex flex-col gap-4 mt-4">
            <Rating
              value={editedRating}
              onChange={(event, newValue) => setEditedRating(newValue)}
              precision={0.5}
              icon={<StarIcon fontSize="large" />}
              emptyIcon={<StarIcon fontSize="large" />}
            />
            <TextField
              label="Comment"
              multiline
              rows={4}
              value={editedComment}
              onChange={(e) => setEditedComment(e.target.value)}
              fullWidth
              variant="outlined"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleEdit} 
            variant="contained" 
            disabled={actionLoading}
          >
            {actionLoading ? <CircularProgress size={24} /> : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Review</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this review? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={() => handleDelete(selectedReview?._id)} 
            variant="contained" 
            color="error"
            disabled={actionLoading}
          >
            {actionLoading ? <CircularProgress size={24} /> : 'Delete Review'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Alert */}
      <SuccessAlert
        open={successAlert.open}
        message={successAlert.message}
        onClose={() => setSuccessAlert({ ...successAlert, open: false })}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        action={
          snackbar.actionText && (
            <Button 
              color="inherit" 
              size="small"
              onClick={() => {
                if (snackbar.onActionClick) {
                  snackbar.onActionClick();
                }
                setSnackbar({ ...snackbar, open: false });
              }}
            >
              {snackbar.actionText}
            </Button>
          )
        }
      >
        <Alert 
          severity={snackbar.severity} 
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ReviewList; 