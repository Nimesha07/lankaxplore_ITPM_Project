import { useState } from "react";
import axios from "axios";
import { TextField, Button, Typography, Paper, Box, CircularProgress } from "@mui/material";
import { z } from "zod";
import { useNavigate } from "react-router-dom";

const schema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long").max(20, "Username can't exceed 20 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export default function SignupPage() {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [errors, setErrors] = useState({ username: "", email: "", password: "" });
  const [backendError, setBackendError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({ username: "", email: "", password: "" });
    setBackendError("");
    setSuccessMessage("");

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
        await axios.post("http://localhost:5001/api/auth/signup", formData);
        setSuccessMessage("Signup successful! Redirecting to login page...");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } catch (error) {
        setIsLoading(false);
        if (error.response && error.response.data) {
          setBackendError(error.response.data.message || "An error occurred. Please try again.");
        }
      }
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <Paper sx={{ padding: 4, width: "100%", maxWidth: 400, borderRadius: 2, boxShadow: 3, backgroundColor: "white" }}>
        <Typography variant="h5" component="h2" sx={{ textAlign: "center", fontWeight: 600, marginBottom: 3, color: "#CB6040" }}>
          Sign Up
        </Typography>

        {backendError && (
          <Typography variant="body2" color="error" sx={{ marginBottom: 2, textAlign: "center" }}>
            {backendError}
          </Typography>
        )}

        {successMessage && (
          <Typography variant="body2" sx={{ color: "#CB6040", marginBottom: 2, textAlign: "center" }}>
            {successMessage}
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            error={!!errors.username}
            helperText={errors.username}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            error={!!errors.email}
            helperText={errors.email}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            error={!!errors.password}
            helperText={errors.password}
            sx={{ marginBottom: 3 }}
          />

          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", marginBottom: 3 }}>
              <CircularProgress sx={{ color: "#CB6040" }} />
            </Box>
          ) : (
            <Button type="submit" variant="contained" fullWidth sx={{ marginBottom: 3, backgroundColor: "#CB6040", "&:hover": { backgroundColor: "#A94D34" } }}>
              Sign Up
            </Button>
          )}
        </form>

        <Typography
          variant="body2"
          sx={{
            textAlign: "center",
            cursor: "pointer",
            color: "#CB6040",
            "&:hover": { textDecoration: "underline" },
          }}
          onClick={() => navigate("/login")}
        >
          Already have an account? Login here.
        </Typography>
      </Paper>
    </Box>
  );
}
