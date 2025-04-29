import React, { useState, useEffect } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Avatar, Rating, Typography } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import CustomAlert from "./CustomAlert";
import SuccessAlert from "./SuccessAlert";
import { useNavigate } from "react-router-dom";

const AddReviewForm = ({ packageId }) => {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'info', actionText: '', onActionClick: null });
  const [successAlert, setSuccessAlert] = useState({ open: false, message: '' });
  const { user, isAuthenticated, getAuthToken } = useAuth();
  const navigate = useNavigate();

  // Debug logging for authentication state
  useEffect(() => {
    console.log('Auth State:', {
      isAuthenticated,
      user,
      token: getAuthToken()
    });
  }, [isAuthenticated, user, getAuthToken]);

  const navigateToLogin = () => {
    navigate("/login");
  };

  const handleOpen = () => {
    // Only check authentication if the dialog is not already open
    if (!open) {
      if (!isAuthenticated || !user) {
        setAlert({
          open: true,
          message: "Please log in to submit a review",
          severity: "warning",
          actionText: "Login",
          onActionClick: navigateToLogin
        });
        return;
      }
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setRating(0);
    setComment("");
    // Clear any existing alerts when closing the dialog
    setAlert({ open: false, message: '', severity: 'info', actionText: '', onActionClick: null });
    setSuccessAlert({ open: false, message: '' });
  };

  const handleSubmit = async () => {
    // Skip authentication check if we're already in the submit process
    if (loading) return;

    if (!user._id) {
      setAlert({
        open: true,
        message: "User information is missing. Please log in again.",
        severity: "error",
        actionText: "Login",
        onActionClick: navigateToLogin
      });
      return;
    }

    if (!packageId) {
      setAlert({
        open: true,
        message: "Package ID is missing. Please try again.",
        severity: "error"
      });
      return;
    }

    if (!rating || rating < 1 || rating > 5) {
      setAlert({
        open: true,
        message: "Please provide a valid rating between 1 and 5.",
        severity: "warning"
      });
      return;
    }

    if (!comment.trim()) {
      setAlert({
        open: true,
        message: "Please provide a comment.",
        severity: "warning"
      });
      return;
    }

    try {
      setLoading(true);
      const token = getAuthToken();
      console.log('Current token:', token);

      if (!token) {
        throw new Error('No authentication token found');
      }

      const reviewData = {
        rating: Number(rating),
        comment: comment.trim(),
        package: packageId
      };

      console.log('Submitting review data:', reviewData);

      const response = await axios.post(
        "http://localhost:5001/api/reviews",
        reviewData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Review submission response:', response.data);

      // Close the dialog first
      handleClose();
      
      // Show success message
      setSuccessAlert({
        open: true,
        message: "Your review has been successfully submitted! Thank you for your feedback."
      });
      
      // Refresh the page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Error submitting review:", error);
      console.error("Error details:", {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
        request: {
          url: error.config?.url,
          method: error.config?.method,
          data: error.config?.data,
          headers: error.config?.headers
        }
      });

      if (error.response?.status === 401) {
        setAlert({
          open: true,
          message: "Your session has expired. Please log in again.",
          severity: "warning",
          actionText: "Login",
          onActionClick: navigateToLogin
        });
      } else if (error.response?.status === 400) {
        const errorMessage = error.response?.data?.message || error.response?.data?.error || "Invalid review data. Please check your input.";
        setAlert({
          open: true,
          message: errorMessage,
          severity: "error"
        });
      } else {
        setAlert({
          open: true,
          message: error.response?.data?.error || "Failed to submit review",
          severity: "error"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Get user display name
  const getUserDisplayName = () => {
    if (!user) return "Anonymous";
    return user.username || user.name || "Anonymous";
  };

  // Get user avatar
  const getUserAvatar = () => {
    if (!user) return null;
    return user.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(getUserDisplayName())}`;
  };

  return (
    <>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleOpen}
        className="mb-4"
      >
        Add Review
      </Button>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add a Review</DialogTitle>
        <DialogContent>
          <div className="flex items-center space-x-4 mb-4">
            <Avatar 
              alt={getUserDisplayName()}
              src={getUserAvatar()}
            />
            <div>
              <Typography variant="h6" className="font-semibold">
                {getUserDisplayName()}
              </Typography>
            </div>
          </div>
          <TextField
            label="Your Review"
            fullWidth
            multiline
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="mb-4"
          />
          <div className="mb-4">
            <Typography variant="body2" className="font-semibold mb-2">
              Rating:
            </Typography>
            <Rating
              value={rating}
              onChange={(event, newValue) => setRating(newValue)}
              precision={0.5}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color="primary"
            disabled={loading || !rating || !comment}
          >
            {loading ? "Submitting..." : "Submit Review"}
          </Button>
        </DialogActions>
      </Dialog>

      <CustomAlert 
        open={alert.open}
        onClose={() => setAlert({ ...alert, open: false })}
        message={alert.message}
        severity={alert.severity}
        actionText={alert.actionText}
        onActionClick={alert.onActionClick}
      />

      <SuccessAlert
        open={successAlert.open}
        onClose={() => setSuccessAlert({ ...successAlert, open: false })}
        message={successAlert.message}
      />
    </>
  );
};

export default AddReviewForm;
