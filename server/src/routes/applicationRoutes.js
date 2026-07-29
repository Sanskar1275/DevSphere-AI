const express = require("express");

const router = express.Router();

const {
  // Student Controllers
  applyForJob,
  getMyApplications,
  getApplicationById,
  withdrawApplication,

  // Admin Controllers
  getAllApplications,
  getAdminApplicationById,
  updateApplicationStatus,
  getApplicationStats,
} = require("../controllers/applicationController");

const protect = require("../middlewares/authMiddleware");
const adminOnly = require("../middlewares/adminMiddleware");

// ==========================================
// STUDENT ROUTES
// ==========================================

// ------------------------------------------
// APPLY FOR A JOB
// POST /api/applications
// ------------------------------------------

router.post("/", protect, applyForJob);

// ------------------------------------------
// GET LOGGED-IN USER APPLICATIONS
// GET /api/applications/my
// ------------------------------------------

router.get("/my", protect, getMyApplications);

// ==========================================
// ADMIN ROUTES
// IMPORTANT:
// Keep these routes BEFORE "/:id"
// ==========================================

// ------------------------------------------
// GET APPLICATION STATISTICS
// GET /api/applications/admin/stats
// ------------------------------------------

router.get("/admin/stats", protect, adminOnly, getApplicationStats);

// ------------------------------------------
// GET ALL APPLICATIONS
// GET /api/applications/admin/all
//
// Optional query parameters:
// ?status=Applied
// ?jobId=...
// ?search=Sanskar
// ------------------------------------------

router.get("/admin/all", protect, adminOnly, getAllApplications);

// ------------------------------------------
// GET SINGLE APPLICATION AS ADMIN
// GET /api/applications/admin/:id
// ------------------------------------------

router.get("/admin/:id", protect, adminOnly, getAdminApplicationById);

// ------------------------------------------
// UPDATE APPLICATION STATUS
// PATCH /api/applications/admin/:id/status
// ------------------------------------------

router.patch("/admin/:id/status", protect, adminOnly, updateApplicationStatus);

// ==========================================
// STUDENT DYNAMIC ROUTES
// Keep these AFTER admin routes
// ==========================================

// ------------------------------------------
// WITHDRAW APPLICATION
// PATCH /api/applications/:id/withdraw
// ------------------------------------------

router.patch("/:id/withdraw", protect, withdrawApplication);

// ------------------------------------------
// GET SINGLE APPLICATION
// GET /api/applications/:id
// ------------------------------------------

router.get("/:id", protect, getApplicationById);

module.exports = router;
