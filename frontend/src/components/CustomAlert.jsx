import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

const CustomAlert = ({ open, onClose }) => {
  const navigate = useNavigate(); // Use useNavigate hook

  const handleLogin = () => {
    navigate("/login");
    onClose();
  };

  const handleBack = () => {
    navigate("/");
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "16px", // Rounded corners for a modern feel
          padding: "20px", // Add some padding
          maxWidth: "400px", // Set a max-width for the dialog box
          boxShadow: "0 6px 20px rgba(0, 0, 0, 0.1)", // Soft shadow for depth
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: "bold",
          fontSize: "1.25rem",
          textAlign: "center",
          color: "#333", // Dark text for better readability
        }}
      >
        {"You need to be logged in to write a review"}
      </DialogTitle>
      <DialogContent
        sx={{
          textAlign: "center",
          color: "#555", // Lighter text color
          marginBottom: "20px", // Add margin for spacing
        }}
      >
        <p className="text-gray-600">Please log in to continue writing a review.</p>
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: "space-evenly", // Distribute buttons evenly
          paddingBottom: "16px", // Padding for the buttons
        }}
      >
        <Button
          onClick={handleBack}
          color="secondary"
          variant="outlined"
          sx={{
            width: "120px",
            padding: "8px 16px",
            fontWeight: "600",
            borderRadius: "8px", // Rounded corners for buttons
            borderColor: "#e0e0e0", // Lighter border
          }}
        >
          Go Back
        </Button>
        <Button
          onClick={handleLogin}
          color="primary" // Using the primary color from the theme
          variant="contained"
          sx={{
            width: "120px",
            padding: "8px 16px",
            fontWeight: "600",
            borderRadius: "8px", // Rounded corners for buttons
            backgroundColor: (theme) => theme.palette.primary.main, // Accessing the primary color from the theme
            "&:hover": {
              backgroundColor: (theme) => theme.palette.primary.dark, // Darker shade for hover effect
            },
          }}
        >
          Log In
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomAlert;
