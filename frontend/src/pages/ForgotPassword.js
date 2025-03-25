import React, { useState } from "react";
import { Button, TextField, Box, Typography, Paper, CircularProgress } from "@mui/material";
import { z } from "zod"; // Importing Zod for validation
import { useAuth } from "../context/AuthContext"; // assuming you have this context
import { useNavigate } from "react-router-dom"; // Importing useNavigate for redirection

// Zod schema for forgot password validation
const schema = z.object({
  email: z.string().email("Please enter a valid email"),
});

export default function ForgotPassword() {
  const { resetPassword } = useAuth(); // Assuming a resetPassword function exists in your context
  const navigate = useNavigate(); // Initialize navigate
  const [formData, setFormData] = useState({ email: "" });
  const [errors, setErrors] = useState({ email: "" });
  const [backendError, setBackendError] = useState(""); // State for backend errors
  const [isLoading, setIsLoading] = useState(false); // Loading state for the spinner
  const [isSuccess, setIsSuccess] = useState(false); // To control the success animation

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({ email: "" });
    setBackendError(""); // Reset backend error

    const result = schema.safeParse(formData);

    if (!result.success) {
      const newErrors = result.error.errors.reduce((acc, curr) => {
        acc[curr.path[0]] = curr.message;
        return acc;
      }, {});
      setErrors(newErrors);
    } else {
      setIsLoading(true);

      try {
        await resetPassword(formData.email);
        setIsSuccess(true);

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } catch (error) {
        setIsLoading(false);

        if (error.response && error.response.data) {
          const { error: errorMessage } = error.response.data;
          setBackendError(errorMessage || "An unexpected error occurred. Please try again.");
        } else {
          setBackendError("Network error. Please check your connection.");
        }
      }
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "gray.100",
      }}
    >
      <Paper
        sx={{
          width: "100%",
          maxWidth: "400px",
          padding: 3,
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: "white",
        }}
      >
        <Typography
          variant="h5"
          component="h2"
          sx={{
            textAlign: "center",
            fontWeight: "600",
            marginBottom: 3,
            color: "#CB6040",
          }}
        >
          Forgot Password
        </Typography>

        {/* Display backend error if available */}
        {backendError && (
          <Typography variant="body2" color="error" sx={{ textAlign: "center", marginBottom: 2 }}>
            {backendError}
          </Typography>
        )}

        {/* Display success message if reset is successful */}
        {isSuccess && (
          <Typography variant="body2" color="primary" sx={{ textAlign: "center", marginBottom: 2 }}>
            Instructions to reset your password have been sent! Redirecting...
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            sx={{
              marginBottom: 3,
            }}
            error={!!errors.email}
            helperText={errors.email}
            autoFocus
          />

          {/* Display a loading spinner while the request is being processed */}
          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", marginBottom: 2 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: "#CB6040",
                "&:hover": {
                  backgroundColor: "#A94E34",
                },
                marginTop: 3,
                paddingY: 1.5,
              }}
              fullWidth
            >
              Send Reset Link
            </Button>
          )}
        </form>

        {/* Add a button to navigate back to the Login page */}
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
          <Typography
            variant="body2"
            sx={{
              textAlign: "center",
              color: "#CB6040",
              cursor: "pointer",
              "&:hover": { textDecoration: "underline" },
            }}
            onClick={() => navigate("/login")}
          >
            Remember your password? Login
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
