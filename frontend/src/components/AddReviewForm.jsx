import React, { useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Avatar, Rating, Typography } from "@mui/material";
import { useAuth } from "../context/AuthContext"; // Import the useAuth hook

const AddReviewForm = ({ open, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  

  // Use the useAuth hook to get user data from AuthContext
  const { user } = useAuth(); 

  const handleSubmit = () => {
    const newReview = {
      name: user?.username || "Anonymous", // Use default name if user is not available
      avatar: user?.avatar || "https://www.example.com/default-avatar.jpg", // Use default avatar if user is not available
      rating,
      comment,
      date: new Date().toISOString(),
    };
    onSubmit(newReview);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add a Review</DialogTitle>
      <DialogContent>
        <div className="flex items-center space-x-4 mb-4">
          {/* Display user avatar or default avatar */}
          <Avatar alt={user?.name || "Anonymous"} src={user?.avatar || "https://www.example.com/default-avatar.jpg"} />
          <div>
            <Typography variant="h6" className="font-semibold">
              {user?.username || "Anonymous"}
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
            name="review-rating"
            value={rating}
            onChange={(e, newValue) => setRating(newValue)}
            precision={0.5} // Allows half stars
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancel</Button>
        <Button onClick={handleSubmit} color="primary">Submit</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddReviewForm;
