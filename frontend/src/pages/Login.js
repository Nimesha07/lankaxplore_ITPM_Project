import React, { useState } from "react";
import {
  Button,
  TextField,
  Box,
  Typography,
  Paper,
  CircularProgress,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import { z } from "zod"; // Importing Zod for validation
import { useAuth } from "../context/AuthContext"; // assuming you have this context
import { useNavigate } from "react-router-dom"; // Importing useNavigate for redirection

// Zod schema for login validation
const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"), // Basic validation
});

// Custom theme with primary color
const theme = createTheme({
  palette: {
    primary: {
      main: "#CB6040",
    },
  },
});

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate(); // Initialize navigate
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [backendError, setBackendError] = useState(""); // State for backend errors
  const [isLoading, setIsLoading] = useState(false); // Loading state for the spinner
  const [isSuccess, setIsSuccess] = useState(false); // To control the success animation

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({ email: "", password: "" });
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
        await login(formData);
        setIsSuccess(true);

        setTimeout(() => {
          navigate("/");
        }, 1000);
      } catch (error) {
        setIsLoading(false);

        if (error.response && error.response.data) {
          const { error: errorMessage, errors: validationErrors } = error.response.data;

          if (validationErrors) {
            const newErrors = validationErrors.reduce((acc, curr) => {
              acc[curr.param] = curr.msg;
              return acc;
            }, {});
            setErrors(newErrors);
          } else if (errorMessage) {
            setBackendError(errorMessage);
          } else {
            setBackendError("An unexpected error occurred. Please try again.");
          }
        } else {
          setBackendError("Network error. Please check your connection.");
        }
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box className="flex justify-center items-center min-h-screen bg-gray-100">
        <Paper className="w-full sm:max-w-md max-w-sm p-8 rounded-lg shadow-md bg-white">
          <Typography
            variant="h5"
            component="h2"
            className="text-center font-semibold mb-6 text-gray-800"
          >
            Login
          </Typography>

          {/* Display backend error if available */}
          {backendError && (
            <Typography variant="body2" color="error" className="mb-4 text-center">
              {backendError}
            </Typography>
          )}

          {/* Display success message if login is successful */}
          {isSuccess && (
            <Typography variant="body2" color="primary" className="mb-4 text-center">
              Login Successful! Redirecting...
            </Typography> 
          )}
console.log("Login Successful!");

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
              className="mb-4"
              error={!!errors.email}
              helperText={errors.email}
              autoFocus
            />
            <TextField
              label="Password"
              variant="outlined"
              fullWidth
              margin="normal"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mb-6"
              error={!!errors.password}
              helperText={errors.password}
              sx={{ marginBottom: 3 }}
            />

            {/* Display a loading spinner while the request is being processed */}
            {isLoading ? (
              <Box className="flex justify-center mb-4">
                <CircularProgress />
              </Box>
            ) : (
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                className="mt-4 py-2"
              >
                Login
              </Button>
            )}
          </form>

          {/* Add a button to navigate to the Sign Up page */}
          <Box className="flex justify-center mt-4">
            <Typography
              variant="body2"
              color="primary"
              sx={{
                textAlign: "center",
                cursor: "pointer",
                "&:hover": { textDecoration: "underline" },
              }}
              onClick={() => navigate("/signup")}
            >
              Don't have an account? Sign Up
            </Typography>
          </Box>

          {/* Add a link to navigate to the Forgot Password page */}
          <Box className="flex justify-center mt-2">
            <Typography
              variant="body2"
              color="primary"
              sx={{
                textAlign: "center",
                cursor: "pointer",
                "&:hover": { textDecoration: "underline" },
              }}
              onClick={() => navigate("/forgot-password")}
            >
              Forgot Password?
            </Typography>
          </Box>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}
