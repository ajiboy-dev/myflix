const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
// const downloadRoutes = require("./routes/downloadRoutes");  // Comment if you don't have this
const publicDomainRoutes = require("./routes/publicDomainRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

// CORS Configuration - Allow frontend to connect
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"], // Vite uses 5173, CRA uses 3000
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

app.get("/api", (req, res) => {
  res.json({ message: "Welcome to MyFlix API" });
});

app.use("/api/auth", authRoutes);
// app.use("/api/download", downloadRoutes);  // Uncomment if you have this
app.use("/api/public-domain", publicDomainRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
