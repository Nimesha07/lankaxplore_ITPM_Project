import React, { useState } from "react";
import { 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle, 
  TextField, 
  Button, 
  Avatar, 
  Rating, 
  Typography,
  Box
} from "@mui/material";
import { Star as StarIcon } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import CustomAlert from "./CustomAlert";
import SuccessAlert from "./SuccessAlert";
import { useNavigate } from "react-router-dom";

const AddReviewForm = ({ destinationId, open, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'info', actionText: '', onActionClick: null });
  const [successAlert, setSuccessAlert] = useState({ open: false, message: '' });
  const { user, isAuthenticated, getAuthToken } = useAuth();
  const navigate = useNavigate();

  const navigateToLogin = () => {
    navigate("/login");
  };

  const handleClose = () => {
    setRating(0);
    setComment("");
    setAlert({ open: false, message: '', severity: 'info', actionText: '', onActionClick: null });
    setSuccessAlert({ open: false, message: '' });
    onClose();
  };

  const handleSubmit = async () => {
    console.log("Starting review submission...");
    console.log("User:", user);
    console.log("Destination ID:", destinationId);
    console.log("Rating:", rating);
    console.log("Comment:", comment);

    if (loading) return;

    if (!user?._id) {
      console.log("No user ID found");
      setAlert({
        open: true,
        message: "User information is missing. Please log in again.",
        severity: "error",
        actionText: "Login",
        onActionClick: navigateToLogin
      });
      return;
    }

    if (!destinationId) {
      console.log("No destination ID found");
      setAlert({
        open: true,
        message: "Destination ID is missing. Please try again.",
        severity: "error"
      });
      return;
    }

    if (!rating || rating < 1 || rating > 5) {
      console.log("Invalid rating:", rating);
      setAlert({
        open: true,
        message: "Please provide a valid rating between 1 and 5.",
        severity: "warning"
      });
      return;
    }

    if (!comment.trim()) {
      console.log("Empty comment");
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
      console.log("Auth token:", token ? "Present" : "Missing");

      if (!token) {
        throw new Error('No authentication token found');
      }

      const reviewData = {
        rating: Number(rating),
        comment: comment.trim(),
        destination: destinationId,
        user: user._id
      };

      console.log("Review data to submit:", reviewData);

      if (onSubmit) {
        console.log("Using onSubmit prop");
        await onSubmit(reviewData);
        setSuccessAlert({
          open: true,
          message: "Your review has been successfully submitted! Thank you for your feedback."
        });
        handleClose();
      } else {
        console.log("Making direct API call");
        const response = await axios.post(
          `http://localhost:5001/api/destinations/${destinationId}/reviews`,
          reviewData,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          }
        );
        console.log("API response:", response.data);

        if (response.data) {
          setSuccessAlert({
            open: true,
            message: "Your review has been successfully submitted! Thank you for your feedback."
          });
          handleClose();
        }
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      console.log("Error response:", error.response);

      if (error.response?.status === 401) {
        setAlert({
          open: true,
          message: "Your session has expired. Please log in again.",
          severity: "warning",
          actionText: "Login",
          onActionClick: navigateToLogin
        });
      } else if (error.response?.status === 400) {
        const errorMessage = error.response?.data?.message || "You have already reviewed this destination. You can edit your existing review instead.";
        setAlert({
          open: true,
          message: errorMessage,
          severity: "warning"
        });
      } else if (error.response?.status === 404) {
        setAlert({
          open: true,
          message: "Destination not found. Please try again.",
          severity: "error"
        });
      } else {
        setAlert({
          open: true,
          message: error.response?.data?.message || "Failed to submit review. Please try again.",
          severity: "error"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const getUserDisplayName = () => {
    if (!user) return "Anonymous";
    return user.username || user.name || "Anonymous";
  };

  const getUserAvatar = () => {
    if (!user) return null;
    return user.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(getUserDisplayName())}`;
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle className="text-center">
          <Typography variant="h5" component="div">
            Write a Review
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box className="flex flex-col items-center space-y-6">
            <Box className="flex items-center space-x-4">
              <Avatar 
                alt={getUserDisplayName()}
                src={getUserAvatar()}
                className="w-16 h-16"
              />
              <Box>
                <Typography variant="h6" className="font-semibold">
                  {getUserDisplayName()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Share your experience
                </Typography>
              </Box>
            </Box>

            <Box className="w-full">
              <Typography variant="subtitle1" className="mb-2">
                How would you rate this destination?
              </Typography>
              <Rating
                value={rating}
                onChange={(event, newValue) => setRating(newValue)}
                precision={0.5}
                size="large"
                icon={<StarIcon fontSize="large" />}
                emptyIcon={<StarIcon fontSize="large" />}
                className="w-full justify-center"
              />
            </Box>

            <TextField
              label="Your Review"
              fullWidth
              multiline
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              variant="outlined"
              placeholder="Share your experience with this destination..."
            />
          </Box>
        </DialogContent>
        <DialogActions className="p-4">
          <Button onClick={handleClose} variant="outlined">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color="primary"
            disabled={loading || !rating || !comment}
            className="min-w-[120px]"
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
