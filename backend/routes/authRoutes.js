const express = require("express");
const { body } = require("express-validator");
const { signup, login, logout, getUser } = require("../controllers/authController");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/signup", [
  body("email").isEmail().withMessage("Invalid email format"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long")
], signup);

router.post("/login", login);
router.post("/logout", logout);
router.get("/user", verifyToken, getUser);

module.exports = router;
