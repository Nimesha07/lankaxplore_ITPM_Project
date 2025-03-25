const jwt = require("jsonwebtoken");

// Middleware to verify JWT token
exports.verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "Unauthorized - No Token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user data to request
    next();
  } catch (error) {
    res.status(403).json({ error: "Invalid or Expired Token" });
  }
};
