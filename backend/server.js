const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

// Import routes
const authRoutes = require("./routes/authRoutes");
const packageRoutes = require("./routes/packageRoute");
const reviewRoutes = require("./routes/reviewRoutes");

const app = express();

// Middleware
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes); // Authentication routes
app.use("/api/packages", packageRoutes); // Package routes
app.use("/api/reviews", reviewRoutes); // Review routes

app.get("/", (req, res) => {
    res.send("MERN Backend Running");
});

const PORT = process.env.PORT || 5001;
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB Connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
})
.catch(err => console.error("MongoDB Connection Error:", err));
