require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

connectDB();

app.get("/", (req, res) => {
  res.send("🚀 DevSphere AI Backend Running...");
});

app.get("/api/message", (req, res) => {
  res.json({
    success: true,
    message: "Hello from DevSphere AI Backend 🚀",
    version: "1.0.0",
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});