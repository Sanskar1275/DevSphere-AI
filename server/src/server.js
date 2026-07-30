require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

// ==========================================
// ROUTES
// ==========================================

const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const courseRoutes = require("./routes/courseRoutes");
const adminRoutes = require("./routes/adminRoutes");
const aiRoutes = require("./routes/aiRoutes");
const conversationRoutes = require("./routes/conversationRoutes");
const messageRoutes = require("./routes/messageRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const resumeAnalysisRoutes = require("./routes/resumeAnalysisRoutes");

const app = express();

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors());

app.use(express.json());

// ==========================================
// API ROUTES
// ==========================================

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/resume-analysis", resumeAnalysisRoutes);

// ==========================================
// DATABASE
// ==========================================

connectDB();

// ==========================================
// TEST ROUTES
// ==========================================

app.get("/", (req, res) => {
  res.send("🚀 DevSphere AI Backend Running...");
});

app.get("/api/message", (req, res) => {
  res.json({
    success: true,
    message: "🚀 Welcome to DevSphere AI",
  });
});

// ==========================================
// SERVER
// ==========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
