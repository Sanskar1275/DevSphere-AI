import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import API from "../services/axios";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setError("");
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    // ==========================================
    // VALIDATE PASSWORD
    // ==========================================

    if (formData.newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    // ==========================================
    // CONFIRM PASSWORD
    // ==========================================

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // ==========================================
    // CHECK TOKEN
    // ==========================================

    if (!token) {
      setError("Invalid password reset link.");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post(`/auth/reset-password/${token}`, {
        newPassword: formData.newPassword,
      });

      setMessage(res.data?.message || "Password reset successfully.");

      // ==========================================
      // REDIRECT TO LOGIN
      // ==========================================

      setTimeout(() => {
        navigate("/login");
      }, 2500);
    } catch (err) {
      console.error("Reset password error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to reset password. The link may have expired.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-5">
      <div className="w-full max-w-md bg-slate-900 rounded-3xl shadow-2xl p-8 border border-slate-800">
        {/* ======================================
            BRAND
        ====================================== */}

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 mb-5">
            <span className="text-3xl">🔐</span>
          </div>

          <h1 className="text-4xl font-bold text-cyan-400">DevSphere AI</h1>

          <p className="text-slate-400 mt-2">Create a new password</p>
        </div>

        {/* ======================================
            HEADING
        ====================================== */}

        <div className="mb-7">
          <h2 className="text-2xl font-bold text-white">Reset Password</h2>

          <p className="text-slate-400 mt-2 leading-relaxed">
            Enter your new password below.
          </p>
        </div>

        {/* ======================================
            SUCCESS MESSAGE
        ====================================== */}

        {message && (
          <div className="mb-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3">
            <p className="text-emerald-400 text-sm leading-relaxed">
              {message}
            </p>

            <p className="text-emerald-400/70 text-xs mt-2">
              Redirecting you to login...
            </p>
          </div>
        )}

        {/* ======================================
            ERROR MESSAGE
        ====================================== */}

        {error && (
          <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3">
            <p className="text-red-400 text-sm leading-relaxed">{error}</p>
          </div>
        )}

        {/* ======================================
            FORM
        ====================================== */}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* New Password */}

          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              New Password
            </label>

            <input
              id="newPassword"
              type="password"
              name="newPassword"
              placeholder="Enter new password"
              value={formData.newPassword}
              onChange={handleChange}
              required
              minLength={6}
              autoComplete="new-password"
              className="
                w-full
                p-4
                rounded-xl
                bg-slate-800
                text-white
                placeholder-slate-500
                border
                border-slate-700
                outline-none
                focus:border-cyan-400
                focus:ring-2
                focus:ring-cyan-400/20
                transition
              "
            />
          </div>

          {/* Confirm Password */}

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              Confirm Password
            </label>

            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              placeholder="Confirm new password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              minLength={6}
              autoComplete="new-password"
              className="
                w-full
                p-4
                rounded-xl
                bg-slate-800
                text-white
                placeholder-slate-500
                border
                border-slate-700
                outline-none
                focus:border-cyan-400
                focus:ring-2
                focus:ring-cyan-400/20
                transition
              "
            />
          </div>

          {/* Submit */}

          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              bg-cyan-500
              hover:bg-cyan-600
              disabled:bg-slate-700
              disabled:text-slate-400
              py-4
              rounded-xl
              text-white
              font-semibold
              transition
              duration-200
            "
          >
            {loading ? "Resetting Password..." : "Reset Password"}
          </button>
        </form>

        {/* ======================================
            BACK TO LOGIN
        ====================================== */}

        <div className="text-center mt-7">
          <Link
            to="/login"
            className="
              text-cyan-400
              hover:text-cyan-300
              hover:underline
              transition
            "
          >
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
