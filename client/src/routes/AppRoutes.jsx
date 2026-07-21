import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Courses from "../pages/Courses";
import CourseDetails from "../pages/CourseDetails";
import CourseLearn from "../pages/CourseLearn";
import Jobs from "../pages/Jobs";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import NotFound from "../pages/NotFound";

import AdminDashboard from "../pages/AdminDashboard";
import Admin from "../pages/Admin";
import AdminCourses from "../pages/AdminCourses";
import EditCourse from "../pages/EditCourse";

import ProtectedRoute from "../components/ProtectedRoute";

import AIMentor from "../pages/AIMentor";
import AdminAddJob from "../pages/AdminAddJob";
import JobDetails from "../pages/JobDetails";
import AdminJobs from "../pages/AdminJobs";
import EditJob from "../pages/EditJob";
import AdminRoute from "./AdminRoute";
import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}

      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected User Routes */}

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

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

      {/* Course Learning Page */}
      <Route
        path="/courses/:id/learn"
        element={
          <ProtectedRoute>
            <CourseLearn />
          </ProtectedRoute>
        }
      />

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

      {/* AI Mentor */}

      <Route
        path="/mentor"
        element={
          <ProtectedRoute>
            <AIMentor />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}

      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />

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

      <Route
        path="/admin/add-job"
        element={
          <ProtectedRoute>
            <AdminAddJob />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/jobs"
        element={
          <ProtectedRoute>
            <AdminJobs />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/jobs/edit/:id"
        element={
          <ProtectedRoute>
            <EditJob />
          </ProtectedRoute>
        }
      />

      {/* 404 */}

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
