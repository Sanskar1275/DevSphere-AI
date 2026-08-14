import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/axios";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/auth/forgot-password", {
        email: email.trim(),
      });

      setMessage(
        res.data?.message ||
          "If an account exists with this email, a password reset link has been sent.",
      );
    } catch (err) {
      console.error("Forgot password error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to process your request. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-5">
      <div className="w-full max-w-md bg-slate-900 rounded-3xl shadow-2xl p-8 border border-slate-800">
        {/* Logo / Brand */}

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-cyan-400">DevSphere AI</h1>

          <p className="text-slate-400 mt-2">Reset your password</p>
        </div>

        {/* Heading */}

        <div className="mb-7">
          <h2 className="text-2xl font-bold text-white">Forgot Password?</h2>

          <p className="text-slate-400 mt-2 leading-relaxed">
            Enter your registered email address and we'll send you a secure
            password reset link.
          </p>
        </div>

        {/* Success Message */}

        {message && (
          <div className="mb-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3">
            <p className="text-emerald-400 text-sm leading-relaxed">
              {message}
            </p>
          </div>
        )}

        {/* Error Message */}

        {error && (
          <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Form */}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              Email Address
            </label>

            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
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
            {loading ? "Sending Reset Link..." : "Send Reset Link"}
          </button>
        </form>

        {/* Back to Login */}

        <div className="text-center mt-7">
          <Link
            to="/login"
            className="text-cyan-400 hover:text-cyan-300 hover:underline transition"
          >
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
