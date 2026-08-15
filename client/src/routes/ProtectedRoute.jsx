import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  const location = useLocation();

  // ==========================================
  // CHECKING AUTHENTICATION
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-slate-700 border-t-cyan-400 rounded-full animate-spin mx-auto mb-4" />

          <p className="text-slate-400">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // NOT LOGGED IN
  // ==========================================

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  // ==========================================
  // LOGGED IN
  // ==========================================

  return children;
}

export default ProtectedRoute;
