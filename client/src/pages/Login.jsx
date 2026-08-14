import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Loader2,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import API from "../services/axios";
import { useAuth } from "../hooks/useAuth";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  // ==========================================
  // GOOGLE
  // ==========================================

  const googleButtonRef = useRef(null);
  const googleInitializedRef = useRef(false);

  // ==========================================
  // FORM STATE
  // ==========================================

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [rememberMe, setRememberMe] = useState(true);

  // ==========================================
  // UI STATE
  // ==========================================

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================
  // RESTORE REMEMBERED EMAIL
  // ==========================================

  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");

    if (rememberedEmail) {
      setFormData((prev) => ({
        ...prev,
        email: rememberedEmail,
      }));

      setRememberMe(true);
    }
  }, []);

  // ==========================================
  // GOOGLE RESPONSE
  // ==========================================

  const handleGoogleResponse = async (response) => {
    try {
      setError("");
      setSuccess("");
      setGoogleLoading(true);

      if (!response?.credential) {
        throw new Error("Google authentication failed.");
      }

      const res = await API.post("/auth/google", {
        credential: response.credential,
      });

      if (!res.data?.token || !res.data?.user) {
        throw new Error("Invalid authentication response.");
      }

      // Store authentication through AuthContext
      login(res.data.token, res.data.user);

      navigate("/dashboard", {
        replace: true,
      });
    } catch (err) {
      console.error("Google login error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Google login failed. Please try again.",
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  // ==========================================
  // INITIALIZE GOOGLE
  // ==========================================

  useEffect(() => {
    let cancelled = false;

    const initializeGoogle = () => {
      if (cancelled) return;

      if (
        !window.google ||
        !window.google.accounts ||
        !window.google.accounts.id ||
        !googleButtonRef.current
      ) {
        return;
      }

      // Prevent duplicate initialization
      if (googleInitializedRef.current) {
        return;
      }

      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

      if (!clientId) {
        console.error("VITE_GOOGLE_CLIENT_ID is missing from client/.env");

        setError("Google Sign-In is not configured. Please check client/.env.");

        return;
      }

      googleInitializedRef.current = true;

      // ======================================
      // GOOGLE INITIALIZATION
      // ======================================

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleResponse,

        // Allow Google to recognize an already
        // authenticated Google account when possible.
        auto_select: true,

        use_fedcm_for_button: true,
        button_auto_select: true,

        cancel_on_tap_outside: true,

        context: "signin",
      });

      // ======================================
      // RENDER GOOGLE BUTTON
      // ======================================

      googleButtonRef.current.innerHTML = "";

      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: "outline",
        size: "large",
        width: 360,
        text: "continue_with",
        shape: "rectangular",
        logo_alignment: "left",
        type: "standard",
      });

      /*
       * Important:
       * We intentionally DO NOT call google.accounts.id.prompt()
       * here.
       *
       * This keeps the Google button flow stable and avoids
       * unnecessary One Tap / duplicate initialization issues.
       */
    };

    // ==========================================
    // CHECK EXISTING GOOGLE SCRIPT
    // ==========================================

    const existingScript = document.getElementById("google-identity-services");

    if (existingScript) {
      if (window.google?.accounts?.id) {
        initializeGoogle();
      } else {
        existingScript.addEventListener("load", initializeGoogle, {
          once: true,
        });
      }
    } else {
      // ========================================
      // LOAD GOOGLE SCRIPT
      // ========================================

      const script = document.createElement("script");

      script.id = "google-identity-services";

      script.src = "https://accounts.google.com/gsi/client";

      script.async = true;
      script.defer = true;

      script.onload = initializeGoogle;

      script.onerror = () => {
        console.error("Failed to load Google Identity Services.");

        setError(
          "Unable to load Google Sign-In. Please check your internet connection.",
        );
      };

      document.head.appendChild(script);
    }

    return () => {
      cancelled = true;
    };
  }, []);

  // ==========================================
  // INPUT HANDLER
  // ==========================================

  const handleChange = (e) => {
    setError("");
    setSuccess("");

    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ==========================================
  // VALIDATE LOGIN
  // ==========================================

  const validateForm = () => {
    const { email, password } = formData;

    if (!email.trim()) {
      return "Please enter your email address.";
    }

    if (!email.includes("@")) {
      return "Please enter a valid email address.";
    }

    if (!password) {
      return "Please enter your password.";
    }

    return null;
  };

  // ==========================================
  // EMAIL LOGIN
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      const email = formData.email.trim().toLowerCase();

      const res = await API.post("/auth/login", {
        email,
        password: formData.password,
      });

      if (!res.data?.token || !res.data?.user) {
        throw new Error("Invalid login response from server.");
      }

      // ======================================
      // REMEMBER EMAIL
      // ======================================

      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      // ======================================
      // SAVE AUTHENTICATION
      // ======================================

      login(res.data.token, res.data.user);

      setSuccess("Login successful. Redirecting...");

      // ======================================
      // REDIRECT
      // ======================================

      setTimeout(() => {
        navigate("/dashboard", {
          replace: true,
        });
      }, 500);
    } catch (err) {
      console.error("Login error:", err);

      setError(
        err.response?.data?.message ||
          "Invalid email or password. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4 py-10 relative overflow-hidden">
      {/* ======================================
          BACKGROUND
      ====================================== */}

      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[650px] h-[650px] bg-cyan-500/10 rounded-full blur-[160px]" />

        <div className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-violet-500/10 rounded-full blur-[150px]" />

        <div className="absolute top-1/2 left-0 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      {/* ======================================
          MAIN
      ====================================== */}

      <div className="relative w-full max-w-md">
        {/* ====================================
            BRAND
        ==================================== */}

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 mb-5">
            <Sparkles size={28} className="text-cyan-400" />
          </div>

          <h1 className="text-3xl font-black tracking-tight">
            DevSphere
            <span className="text-cyan-400"> AI</span>
          </h1>

          <p className="text-slate-500 text-sm mt-1">Developer Platform</p>
        </div>

        {/* ====================================
            CARD
        ==================================== */}

        <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/30 backdrop-blur-xl">
          {/* HEADER */}

          <div className="text-center mb-7">
            <h2 className="text-3xl font-black text-white">Welcome Back</h2>

            <p className="text-slate-400 mt-2">
              Sign in to continue your DevSphere AI journey
            </p>
          </div>

          {/* ==================================
              ERROR
          ================================== */}

          {error && (
            <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
              <AlertCircle size={18} className="text-red-400 mt-0.5 shrink-0" />

              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* ==================================
              SUCCESS
          ================================== */}

          {success && (
            <div className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3">
              <CheckCircle2
                size={18}
                className="text-emerald-400 mt-0.5 shrink-0"
              />

              <p className="text-sm text-emerald-400">{success}</p>
            </div>
          )}

          {/* ==================================
              GOOGLE
          ================================== */}

          <div className="relative">
            {googleLoading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-slate-900/80 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-slate-300">
                  <Loader2 size={18} className="animate-spin text-cyan-400" />

                  <span className="text-sm">Signing you in...</span>
                </div>
              </div>
            )}

            <div
              ref={googleButtonRef}
              className="w-full flex justify-center min-h-[44px]"
            />
          </div>

          {/* ==================================
              DIVIDER
          ================================== */}

          <div className="flex items-center gap-4 my-7">
            <div className="h-px bg-slate-800 flex-1" />

            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Or continue with email
            </span>

            <div className="h-px bg-slate-800 flex-1" />
          </div>

          {/* ==================================
              LOGIN FORM
          ================================== */}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* EMAIL */}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 rounded-xl py-3.5 pl-12 pr-4 outline-none transition-all focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 disabled:opacity-60"
                />
              </div>
            </div>

            {/* PASSWORD */}

            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-300"
                >
                  Password
                </label>

                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 hover:underline transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>

              <div className="relative">
                <LockKeyhole
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 rounded-xl py-3.5 pl-12 pr-12 outline-none transition-all focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 disabled:opacity-60"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  disabled={loading}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-500 hover:text-cyan-400 transition-colors disabled:opacity-50"
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            {/* ==================================
                REMEMBER ME
            ================================== */}

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={loading}
                  className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-cyan-500/20"
                />

                <span className="text-sm text-slate-400">
                  Remember my email
                </span>
              </label>

              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <ShieldCheck size={14} className="text-emerald-400" />
                Secure login
              </div>
            </div>

            {/* ==================================
                LOGIN BUTTON
            ================================== */}

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="group w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-60 disabled:cursor-not-allowed py-3.5 rounded-xl text-white font-bold shadow-lg shadow-cyan-500/10 transition-all duration-300 hover:scale-[1.01]"
            >
              {loading ? (
                <>
                  <Loader2 size={19} className="animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight
                    size={19}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </>
              )}
            </button>
          </form>

          {/* ==================================
              SECURITY
          ================================== */}

          <div className="flex items-center justify-center gap-2 mt-6 text-xs text-slate-500">
            <ShieldCheck size={15} className="text-emerald-400" />

            <span>Your information is securely protected</span>
          </div>

          {/* ==================================
              REGISTER
          ================================== */}

          <div className="border-t border-slate-800 mt-6 pt-6 text-center">
            <p className="text-sm text-slate-400">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-cyan-400 font-semibold hover:text-cyan-300 hover:underline transition-colors"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>

        {/* ====================================
            FOOTER
        ==================================== */}

        <p className="text-center text-xs text-slate-600 mt-6">
          © {new Date().getFullYear()} DevSphere AI
        </p>
      </div>
    </div>
  );
}

export default Login;
