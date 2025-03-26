import React, { useState } from "react";
import { Button, LinearProgress, Typography, Rating } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AddReviewForm from "./AddReviewForm"; // Import the AddReviewForm component
import ReviewCard from "../components/ReviewCard";
import { useAuth } from "../context/AuthContext"; // Import the useAuth hook
import CustomAlert from "../components/CustomAlert"; // Import the CustomAlert component

const feedbacks = [
  {
    id: 1,
    name: "Jane Doe",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 4,
    comment: "Great service! I really enjoyed my experience.",
    date: "2025-03-15T14:30:00",
  },
  {
    id: 2,
    name: "John Smith",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    rating: 4,
    comment: "Very comfortable and well-organized trip.",
    date: "2025-03-14T09:20:00",
  },
  {
    id: 3,
    name: "Alice Johnson",
    avatar: "https://randomuser.me/api/portraits/women/35.jpg",
    rating: 5,
    comment: "Excellent experience, would highly recommend!",
    date: "2025-03-10T10:00:00",
  },
];

const ratingStats = [
  { stars: 5, value: 70 },
  { stars: 4, value: 50 },
  { stars: 3, value: 30 },
  { stars: 2, value: 10 },
  { stars: 1, value: 5 },
];

const averageRating = 4.2;
const totalReviews = 120;

const Feedbacks = () => {
  const { user } = useAuth(); // Get the user data from the AuthContext
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [openReviewForm, setOpenReviewForm] = useState(false);
  const [openAlert, setOpenAlert] = useState(false); // Manage the alert visibility

  const handleShowMoreReviews = () => {
    setShowAllReviews(!showAllReviews);
  };

  const handleOpenReviewForm = () => {
    

    if (user) {
      setOpenReviewForm(true); // If user is authenticated, open the review form
    } else {
      setOpenAlert(true); // If user is not authenticated, show the custom alert
    }
  };

  const handleCloseReviewForm = () => {
    setOpenReviewForm(false);
  };

  const handleReviewSubmit = (newReview) => {
    // You can handle the new review submission here (e.g., update state, make API call)
    console.log(newReview);
  };

  const handleAlertClose = () => {
    setOpenAlert(false); // Close the alert
  };

  const handleLoginRedirect = () => {
    // This function can handle any extra logic before redirecting, like tracking analytics or showing a message
    setOpenAlert(false); // Close the alert
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
      <div className="flex justify-between items-center mb-6">
        <div className="w-1/2">
          {ratingStats.map((stat) => (
            <div key={stat.stars} className="flex items-center space-x-3 mb-2">
              <span className="w-6 text-sm font-medium">{stat.stars}★</span>
              <LinearProgress
                variant="determinate"
                value={stat.value}
                className="w-full"
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: "#e0e0e0",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: "#ffc107",
                  },
                }}
              />
            </div>
          ))}
        </div>
        <div className="w-1/2 flex flex-col items-center">
          <Button
            variant="text"
            color="primary"
            startIcon={<AddIcon />}
            className="mb-2"
            sx={{ fontWeight: "bold", color: "black" }}
            onClick={handleOpenReviewForm}
          >
            Write A Review
          </Button>

          <Typography variant="h3" className="text-5xl font-extrabold">
            {averageRating.toFixed(1)}
          </Typography>
          <Rating value={averageRating} precision={0.1} readOnly className="mt-1" />
          <Typography variant="body2" className="text-gray-600 mt-1">
            ({totalReviews} reviews)
          </Typography>
        </div>
      </div>

      <div className="space-y-4">
        {feedbacks.slice(0, showAllReviews ? feedbacks.length : 2).map((review) => (
          <ReviewCard
            key={review.id}
            avatar={review.avatar}
            name={review.name}
            rating={review.rating}
            comment={review.comment}
            date={review.date}
          />
        ))}
      </div>

      <div className="text-center mt-4">
        <Button
          variant="text"
          color="primary"
          onClick={handleShowMoreReviews}
          sx={{ fontWeight: "bold", color: "black" }}
        >
          {showAllReviews ? "Show Less" : "More Reviews"}
        </Button>
      </div>

      {/* Add Review Form Popup */}
      <AddReviewForm
        open={openReviewForm}
        onClose={handleCloseReviewForm}
        onSubmit={handleReviewSubmit}
        userName={user?.name} // Pass the user's name to the form
        userAvatar={user?.avatar} // Pass the user's avatar to the form
      />

      {/* Custom Alert Box */}
      <CustomAlert open={openAlert} onClose={handleAlertClose} onLoginClick={handleLoginRedirect} />
    </div>
  );
};

export default Feedbacks;
