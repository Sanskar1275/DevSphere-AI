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
const jobMatchRoutes = require("./routes/jobMatchRoutes");
const jobRecommendationRoutes = require("./routes/jobRecommendationRoutes");
const interviewRoutes = require("./routes/interviewRoutes");

const app = express();

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

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
app.use("/api/job-match", jobMatchRoutes);
app.use("/api/job-recommendations", jobRecommendationRoutes);
app.use("/api/interviews", interviewRoutes);

// ==========================================
// DATABASE
// ==========================================

connectDB();

// ==========================================
// HEALTH ROUTES
// ==========================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 DevSphere AI Backend Running...",
  });
});

app.get("/api/message", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 Welcome to DevSphere AI",
  });
});

// ==========================================
// 404 HANDLER
// ==========================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ==========================================
// LOCAL DEVELOPMENT / VERCEL
// ==========================================

if (require.main === module) {
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`🚀 DevSphere AI server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
