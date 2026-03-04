require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// ─── POST /api/auth/register ──────────────────────────
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill in all fields." });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use." });
    }
    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error during registration.",
      error: error.message,
    });
  }
});

// ─── POST /api/auth/login ─────────────────────────────
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password." });
    }
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password." });
    }
    const token = generateToken(user._id);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error during login." });
  }
});

// ─── GET /api/auth/profile (protected) ───────────────
router.get("/profile", protect, async (req, res) => {
  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    favorites: req.user.favorites,
    createdAt: req.user.createdAt,
  });
});

// ─── PUT /api/auth/profile (protected) ───────────────
router.put("/profile", protect, async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findById(req.user._id);

    // Check if email is being changed and already in use
    if (email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use." });
      }
    }

    user.name = name || user.name;
    user.email = email || user.email;
    await user.save();

    res.json({
      message: "Profile updated successfully.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error updating profile." });
  }
});

// ─── PUT /api/auth/change-password (protected) ───────
router.put("/change-password", protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Please provide current and new password." });
    }

    const user = await User.findById(req.user._id);

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Current password is incorrect." });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ message: "Password changed successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error changing password." });
  }
});

// ─── POST /api/auth/favorites (protected) ────────────
router.post("/favorites", protect, async (req, res) => {
  try {
    const { movieId, title, poster, rating } = req.body;
    const user = await User.findById(req.user._id);

    const alreadySaved = user.favorites.some((f) => f.movieId === movieId);
    if (alreadySaved) {
      return res.status(400).json({ message: "Movie already in favorites." });
    }

    user.favorites.push({ movieId, title, poster, rating });
    await user.save();

    res.json({ message: "Added to favorites.", favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ message: "Server error adding favorite." });
  }
});

// ─── DELETE /api/auth/favorites/:movieId (protected) ─
router.delete("/favorites/:movieId", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.favorites = user.favorites.filter(
      (f) => f.movieId !== parseInt(req.params.movieId),
    );
    await user.save();

    res.json({ message: "Removed from favorites.", favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ message: "Server error removing favorite." });
  }
});

module.exports = router;
