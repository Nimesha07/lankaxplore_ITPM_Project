import React from "react";
import { Avatar, Rating, Typography } from "@mui/material";
import { formatDistanceToNow } from "date-fns";

// Function to format the review time relative to now
const formatTimeAgo = (date) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

const ReviewCard = ({ avatar, name, rating, comment, date }) => {
  return (
    <div className="flex space-x-4 items-start">
      <Avatar src={avatar} alt={name} className="w-12 h-12" />
      <div className="flex flex-col w-full">
        {/* Name Section */}
        <div className="flex justify-between items-center">
          <h3 className="font-medium">{name}</h3>
        </div>

        {/* Rating and Time Section */}
        <div className="flex items-center space-x-2 mt-2">
          <Rating value={rating} precision={0.5} readOnly />
          <Typography variant="body2" className="text-gray-500 ml-4">
            {formatTimeAgo(date)}
          </Typography>
        </div>

        {/* Comment Section */}
        <p className="text-gray-700 mt-2">{comment}</p>
      </div>
    </div>
  );
};

export default ReviewCard;
