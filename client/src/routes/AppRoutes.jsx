import { Routes, Route } from "react-router-dom";

// ==========================================
// PUBLIC / USER PAGES
// ==========================================

import Home from "../pages/Home";

import Courses from "../pages/Courses";
import CourseDetails from "../pages/CourseDetails";
import CourseLearn from "../pages/CourseLearn";

import Jobs from "../pages/Jobs";
import JobDetails from "../pages/JobDetails";
import MyApplications from "../pages/MyApplications";

import Login from "../pages/Login";
import Register from "../pages/Register";

import Dashboard from "../pages/Dashboard";
import AIMentor from "../pages/AIMentor";

import NotFound from "../pages/NotFound";

import Resume from "../pages/Resume";
import ResumePreview from "../pages/ResumePreview";
import RecommendedJobs from "../pages/RecommendedJobs";

import InterviewSetup from "../pages/InterviewSetup";
import InterviewSession from "../pages/InterviewSession";
import InterviewResult from "../pages/InterviewResult";

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
import ResumeAnalysis from "../pages/ResumeAnalysis";

// ==========================================
// ROUTE GUARDS
// ==========================================

import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";

function AppRoutes() {
  return (
    <Routes>
      {/* ======================================
          PUBLIC ROUTES
      ====================================== */}

      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      {/* ======================================
          DASHBOARD
      ====================================== */}

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* ======================================
          COURSE ROUTES
      ====================================== */}

      <Route
        path="/courses"
        element={
          <ProtectedRoute>
            <Courses />
          </ProtectedRoute>
        }
      />

      <Route
        path="/courses/:id"
        element={
          <ProtectedRoute>
            <CourseDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/courses/:id/learn"
        element={
          <ProtectedRoute>
            <CourseLearn />
          </ProtectedRoute>
        }
      />

      {/* ======================================
          JOB ROUTES
      ====================================== */}

      <Route
        path="/jobs"
        element={
          <ProtectedRoute>
            <Jobs />
          </ProtectedRoute>
        }
      />

      <Route
        path="/jobs/:id"
        element={
          <ProtectedRoute>
            <JobDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/applications"
        element={
          <ProtectedRoute>
            <MyApplications />
          </ProtectedRoute>
        }
      />

      <Route
        path="/jobs/recommended"
        element={
          <ProtectedRoute>
            <RecommendedJobs />
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

      {/* ======================================
          AI MENTOR
      ====================================== */}

      <Route
        path="/mentor"
        element={
          <ProtectedRoute>
            <AIMentor />
          </ProtectedRoute>
        }
      />

      {/* ======================================
          RESUME
      ====================================== */}

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

      {/* ======================================
          ADMIN DASHBOARD
      ====================================== */}

      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />

      {/* ======================================
          ADMIN COURSE ROUTES
      ====================================== */}

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

      {/* ======================================
          ADMIN JOB ROUTES
      ====================================== */}

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

      {/* ======================================
          404
      ====================================== */}

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
