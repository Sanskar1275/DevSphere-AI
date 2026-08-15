import { Routes, Route, Navigate } from "react-router-dom";

// ==========================================
// PUBLIC PAGES
// ==========================================

import Home from "../pages/Home";

import Courses from "../pages/Courses";

import Jobs from "../pages/Jobs";
import JobDetails from "../pages/JobDetails";

import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";

import NotFound from "../pages/NotFound";

// ==========================================
// PROTECTED USER PAGES
// ==========================================

import CourseLearn from "../pages/CourseLearn";

import Dashboard from "../pages/Dashboard";
import AIMentor from "../pages/AIMentor";

import MyApplications from "../pages/MyApplications";
import RecommendedJobs from "../pages/RecommendedJobs";

import Resume from "../pages/Resume";
import ResumePreview from "../pages/ResumePreview";
import ResumeAnalysis from "../pages/ResumeAnalysis";

import InterviewSetup from "../pages/InterviewSetup";
import InterviewSession from "../pages/InterviewSession";
import InterviewResult from "../pages/InterviewResult";
import InterviewHistory from "../pages/InterviewHistory";

import Settings from "../pages/Settings";
import Profile from "../pages/Profile";

// ==========================================
// ADMIN PAGES
// ==========================================

import AdminDashboard from "../pages/AdminDashboard";

import Admin from "../pages/Admin";
import AdminCourses from "../pages/AdminCourses";
import EditCourse from "../pages/EditCourse";

import AdminAddJob from "../pages/AdminAddJob";
import AdminJobs from "../pages/AdminJobs";
import EditJob from "../pages/EditJob";

import AdminApplications from "../pages/AdminApplications";
import AdminApplicationDetails from "../pages/AdminApplicationDetails";

import AdminUsers from "../pages/AdminUsers";
import AdminAnalytics from "../pages/AdminAnalytics";

// ==========================================
// ROUTE GUARDS
// ==========================================

import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";

function AppRoutes() {
  return (
    <Routes>
      {/* ==================================================
          PUBLIC ROUTES
      ================================================== */}

      {/* HOME */}

      <Route path="/" element={<Home />} />

      {/* AUTHENTICATION */}

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* ==================================================
          COURSES

          IMPORTANT:
          Courses page is PUBLIC.
          Course details are PUBLIC.

          User can browse courses without login.
      ================================================== */}

      <Route path="/courses" element={<Courses />} />

      <Route
        path="/courses/:id"
        element={
          <ProtectedRoute>
            <CourseLearn />
          </ProtectedRoute>
        }
      />

      {/* ==================================================
          START COURSE

          ONLY THIS ROUTE IS PROTECTED.

          User reaches this route after clicking
          "Start Course".

          Logged out:
              → /login

          Logged in:
              → CourseLearn
      ================================================== */}

      <Route
        path="/courses/:id/learn"
        element={
          <ProtectedRoute>
            <CourseLearn />
          </ProtectedRoute>
        }
      />

      {/* ==================================================
          JOBS

          Jobs page requires login.
      ================================================== */}

      <Route path="/jobs" element={<Jobs />} />

      {/* ==================================================
          JOB DETAILS

          View Details requires login.
      ================================================== */}

      <Route
        path="/jobs/:id"
        element={
          <ProtectedRoute>
            <JobDetails />
          </ProtectedRoute>
        }
      />

      {/* ==================================================
          APPLICATIONS
      ================================================== */}

      <Route
        path="/applications"
        element={
          <ProtectedRoute>
            <MyApplications />
          </ProtectedRoute>
        }
      />

      {/* ==================================================
          RECOMMENDED JOBS
      ================================================== */}

      <Route
        path="/jobs/recommended"
        element={
          <ProtectedRoute>
            <RecommendedJobs />
          </ProtectedRoute>
        }
      />

      {/* ==================================================
          DASHBOARD
      ================================================== */}

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* ==================================================
          AI MENTOR
      ================================================== */}

      <Route
        path="/mentor"
        element={
          <ProtectedRoute>
            <AIMentor />
          </ProtectedRoute>
        }
      />

      {/* ==================================================
          RESUME
      ================================================== */}

      <Route
        path="/resume"
        element={
          <ProtectedRoute>
            <Resume />
          </ProtectedRoute>
        }
      />

      <Route
        path="/resume/preview"
        element={
          <ProtectedRoute>
            <ResumePreview />
          </ProtectedRoute>
        }
      />

      <Route
        path="/resume/analysis"
        element={
          <ProtectedRoute>
            <ResumeAnalysis />
          </ProtectedRoute>
        }
      />

      {/* ==================================================
          INTERVIEW
      ================================================== */}

      <Route
        path="/interview"
        element={
          <ProtectedRoute>
            <Navigate to="/interviews/history" replace />
          </ProtectedRoute>
        }
      />

      <Route
        path="/interview/setup/:jobId"
        element={
          <ProtectedRoute>
            <InterviewSetup />
          </ProtectedRoute>
        }
      />

      <Route
        path="/interview/:id"
        element={
          <ProtectedRoute>
            <InterviewSession />
          </ProtectedRoute>
        }
      />

      <Route
        path="/interview/result/:id"
        element={
          <ProtectedRoute>
            <InterviewResult />
          </ProtectedRoute>
        }
      />

      <Route
        path="/interviews/history"
        element={
          <ProtectedRoute>
            <InterviewHistory />
          </ProtectedRoute>
        }
      />

      {/* ==================================================
          SETTINGS
      ================================================== */}

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />

      {/* ==================================================
          PROFILE
      ================================================== */}

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* ==================================================
          ADMIN DASHBOARD
      ================================================== */}

      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/analytics"
        element={
          <AdminRoute>
            <AdminAnalytics />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <AdminRoute>
            <AdminUsers />
          </AdminRoute>
        }
      />

      {/* ==================================================
          ADMIN COURSES
      ================================================== */}

      <Route
        path="/admin/add-course"
        element={
          <AdminRoute>
            <Admin />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/courses"
        element={
          <AdminRoute>
            <AdminCourses />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/courses/edit/:id"
        element={
          <AdminRoute>
            <EditCourse />
          </AdminRoute>
        }
      />

      {/* ==================================================
          ADMIN JOBS
      ================================================== */}

      <Route
        path="/admin/add-job"
        element={
          <AdminRoute>
            <AdminAddJob />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/jobs"
        element={
          <AdminRoute>
            <AdminJobs />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/jobs/edit/:id"
        element={
          <AdminRoute>
            <EditJob />
          </AdminRoute>
        }
      />

      {/* ==================================================
          ADMIN APPLICATIONS
      ================================================== */}

      <Route
        path="/admin/applications"
        element={
          <AdminRoute>
            <AdminApplications />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/applications/:id"
        element={
          <AdminRoute>
            <AdminApplicationDetails />
          </AdminRoute>
        }
      />

      {/* ==================================================
          404
      ================================================== */}

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
