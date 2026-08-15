import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Shield,
  Bell,
  Lock,
  Eye,
  EyeOff,
  Save,
  CheckCircle2,
  AlertTriangle,
  Trash2,
  Loader2,
  CalendarDays,
  Globe,
  KeyRound,
  UserRound,
} from "lucide-react";

import { useAuth } from "../hooks/useAuth";

import {
  getProfile,
  updateProfile,
  changePassword,
  updateNotifications,
  deleteAccount,
} from "../services/authService";

// ======================================================
// CONSTANTS
// ======================================================

const DEFAULT_NOTIFICATIONS = {
  emailNotifications: true,
  interviewNotifications: true,
  jobRecommendations: true,
};

const DEFAULT_PASSWORD = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const SETTINGS_SECTIONS = [
  {
    id: "profile",
    label: "Profile",
    description: "Personal information",
    icon: User,
  },
  {
    id: "security",
    label: "Security",
    description: "Password & authentication",
    icon: Shield,
  },
  {
    id: "notifications",
    label: "Notifications",
    description: "Manage preferences",
    icon: Bell,
  },
  {
    id: "account",
    label: "Account",
    description: "Account management",
    icon: UserRound,
  },
];

const NOTIFICATION_ITEMS = [
  {
    key: "emailNotifications",
    title: "Email Notifications",
    description:
      "Receive important updates and account information through email.",
  },
  {
    key: "interviewNotifications",
    title: "Interview Notifications",
    description: "Get reminders and updates about your AI interviews.",
  },
  {
    key: "jobRecommendations",
    title: "Job Recommendations",
    description: "Receive personalized job and internship recommendations.",
  },
];

// ======================================================
// SMALL REUSABLE COMPONENTS
// ======================================================

function SectionHeader({ icon: Icon, title, description }) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-cyan-500/10 flex items-center justify-center">
          <Icon size={21} className="text-cyan-400" />
        </div>

        <div>
          <h2 className="text-2xl font-bold">{title}</h2>

          <p className="text-slate-400 mt-1">{description}</p>
        </div>
      </div>
    </div>
  );
}

function Message({ type, children }) {
  if (!children) return null;

  const success = type === "success";

  return (
    <div
      className={`mb-6 flex items-start gap-3 rounded-2xl px-5 py-4 ${
        success
          ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
          : "bg-red-500/10 border border-red-500/30 text-red-400"
      }`}
    >
      {success ? (
        <CheckCircle2 size={20} className="shrink-0 mt-0.5" />
      ) : (
        <AlertTriangle size={20} className="shrink-0 mt-0.5" />
      )}

      <span>{children}</span>
    </div>
  );
}

function SettingsCard({ children, className = "" }) {
  return (
    <div
      className={`bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-8 ${className}`}
    >
      {children}
    </div>
  );
}

function PasswordInput({
  name,
  value,
  onChange,
  placeholder,
  visible,
  onToggle,
  autoComplete,
}) {
  return (
    <div className="relative">
      <input
        type={visible ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3.5 pr-12 text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 transition"
      />

      <button
        type="button"
        onClick={onToggle}
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition"
      >
        {visible ? <EyeOff size={19} /> : <Eye size={19} />}
      </button>
    </div>
  );
}

function LoadingButton({
  loading,
  icon: Icon,
  loadingText,
  children,
  type = "button",
  onClick,
  disabled = false,
  className = "",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      className={`inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
    >
      {loading ? (
        <>
          <Loader2 size={18} className="animate-spin" />
          {loadingText}
        </>
      ) : (
        <>
          {Icon && <Icon size={18} />}
          {children}
        </>
      )}
    </button>
  );
}

// ======================================================
// MAIN COMPONENT
// ======================================================

function Settings() {
  const { user, updateUser, logout } = useAuth();

  // ====================================================
  // GENERAL STATE
  // ====================================================

  const [activeSection, setActiveSection] = useState("profile");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ====================================================
  // PROFILE STATE
  // ====================================================

  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    role: "student",
    authProvider: "local",
    createdAt: null,
  });

  const [profileLoading, setProfileLoading] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);

  // ====================================================
  // PASSWORD STATE
  // ====================================================

  const [passwordData, setPasswordData] = useState(DEFAULT_PASSWORD);

  const [passwordVisibility, setPasswordVisibility] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [passwordLoading, setPasswordLoading] = useState(false);

  // ====================================================
  // NOTIFICATION STATE
  // ====================================================

  const [notifications, setNotifications] = useState(DEFAULT_NOTIFICATIONS);

  const [notificationSaving, setNotificationSaving] = useState(false);

  // ====================================================
  // DELETE ACCOUNT STATE
  // ====================================================

  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  // ====================================================
  // HELPERS
  // ====================================================

  const clearMessages = () => {
    setMessage("");
    setError("");
  };

  const getErrorMessage = (err, fallback) => {
    return err.response?.data?.message || fallback;
  };

  const syncUser = (updatedUser) => {
    if (!updatedUser) return;

    updateUser(updatedUser);

    setProfileData((prev) => ({
      ...prev,
      fullName: updatedUser.fullName ?? prev.fullName,
      email: updatedUser.email ?? prev.email,
      role: updatedUser.role ?? prev.role,
      authProvider: updatedUser.authProvider ?? prev.authProvider,
      createdAt: updatedUser.createdAt ?? prev.createdAt,
    }));
  };

  // ====================================================
  // LOAD PROFILE
  // ====================================================

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setProfileLoading(true);

        const res = await getProfile();
        const profile = res.user;

        if (!profile) {
          throw new Error("User profile not found.");
        }

        const profileNotifications = {
          emailNotifications: profile.notifications?.emailNotifications ?? true,

          interviewNotifications:
            profile.notifications?.interviewNotifications ?? true,

          jobRecommendations: profile.notifications?.jobRecommendations ?? true,
        };

        setProfileData({
          fullName: profile.fullName || "",
          email: profile.email || "",
          role: profile.role || "student",
          authProvider: profile.authProvider || "local",
          createdAt: profile.createdAt || null,
        });

        setNotifications(profileNotifications);

        updateUser(profile);
      } catch (err) {
        console.error("Failed to load profile:", err);

        setError(
          getErrorMessage(
            err,
            "Failed to load your profile. Please try again.",
          ),
        );
      } finally {
        setProfileLoading(false);
      }
    };

    loadProfile();
  }, []);

  // ====================================================
  // PROFILE
  // ====================================================

  const handleProfileChange = (event) => {
    const { name, value } = event.target;

    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));

    clearMessages();
  };

  const handleProfileSave = async (event) => {
    event.preventDefault();
    clearMessages();

    const fullName = profileData.fullName.trim();

    if (!fullName) {
      setError("Full name is required.");
      return;
    }

    if (fullName.length < 2) {
      setError("Full name must contain at least 2 characters.");
      return;
    }

    try {
      setProfileSaving(true);

      const res = await updateProfile(fullName);

      if (res.user) {
        syncUser(res.user);
      }

      setMessage(res.message || "Profile updated successfully.");
    } catch (err) {
      console.error("Profile update failed:", err);

      setError(getErrorMessage(err, "Failed to update your profile."));
    } finally {
      setProfileSaving(false);
    }
  };

  // ====================================================
  // PASSWORD
  // ====================================================

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));

    clearMessages();
  };

  const togglePasswordVisibility = (field) => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    clearMessages();

    const { currentPassword, newPassword, confirmPassword } = passwordData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Please fill in all password fields.");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      setError("New password must be different from your current password.");
      return;
    }

    try {
      setPasswordLoading(true);

      const res = await changePassword(currentPassword, newPassword);

      setMessage(res.message || "Password changed successfully.");

      setPasswordData(DEFAULT_PASSWORD);

      setPasswordVisibility({
        currentPassword: false,
        newPassword: false,
        confirmPassword: false,
      });
    } catch (err) {
      console.error("Password change failed:", err);

      setError(getErrorMessage(err, "Failed to change password."));
    } finally {
      setPasswordLoading(false);
    }
  };

  // ====================================================
  // NOTIFICATIONS
  // ====================================================

  const handleNotificationToggle = (key) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));

    clearMessages();
  };

  const handleNotificationSave = async () => {
    clearMessages();

    try {
      setNotificationSaving(true);

      const res = await updateNotifications(notifications);

      const updatedNotifications = {
        emailNotifications: res.notifications?.emailNotifications ?? true,

        interviewNotifications:
          res.notifications?.interviewNotifications ?? true,

        jobRecommendations: res.notifications?.jobRecommendations ?? true,
      };

      setNotifications(updatedNotifications);

      updateUser({
        ...user,
        notifications: updatedNotifications,
      });

      setMessage(
        res.message || "Notification preferences updated successfully.",
      );
    } catch (err) {
      console.error("Notification update failed:", err);

      setError(
        getErrorMessage(err, "Failed to update notification preferences."),
      );
    } finally {
      setNotificationSaving(false);
    }
  };

  // ====================================================
  // DELETE ACCOUNT
  // ====================================================

  const openDeleteModal = () => {
    clearMessages();
    setDeleteConfirmation("");
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    if (deleteLoading) return;

    setShowDeleteModal(false);
    setDeleteConfirmation("");
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== "DELETE") {
      setError('Please type "DELETE" to confirm account deletion.');
      return;
    }

    clearMessages();

    try {
      setDeleteLoading(true);

      const res = await deleteAccount();

      console.log(res.message || "Account deleted successfully.");

      setShowDeleteModal(false);
      setDeleteConfirmation("");

      logout();

      window.location.href = "/login";
    } catch (err) {
      console.error("Account deletion failed:", err);

      setError(
        getErrorMessage(err, "Failed to delete account. Please try again."),
      );

      setDeleteLoading(false);
    }
  };

  // ====================================================
  // DERIVED DATA
  // ====================================================

  const authProvider =
    profileData.authProvider || user?.authProvider || "local";

  const isGoogleAccount = authProvider === "google";

  const displayName = profileData.fullName || user?.fullName || "User";

  const initials =
    displayName
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((name) => name.charAt(0).toUpperCase())
      .join("") || "U";

  const formattedRole = profileData.role || user?.role || "student";

  const formattedCreatedDate = profileData.createdAt
    ? new Date(profileData.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "Not available";

  // ====================================================
  // LOADING
  // ====================================================

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={42} className="animate-spin text-cyan-400" />

          <p className="text-slate-400">Loading your account...</p>
        </div>
      </div>
    );
  }

  // ====================================================
  // UI
  // ====================================================

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* BACKGROUND */}

      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-cyan-500/10 blur-[170px]" />

        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-violet-500/10 blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-6 py-8 sm:py-10">
        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <Shield size={24} className="text-cyan-400" />
            </div>

            <div>
              <h1 className="text-3xl sm:text-4xl font-black">Settings</h1>

              <p className="text-slate-400 mt-1">
                Manage your DevSphere AI account.
              </p>
            </div>
          </div>
        </div>

        {/* ==================================================
            PROFILE SUMMARY
        ================================================== */}

        <div className="mb-8 bg-slate-900/80 border border-slate-800 rounded-3xl p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            {/* AVATAR */}

            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-2xl font-black text-white shadow-lg shadow-cyan-500/10">
                {initials}
              </div>

              {isGoogleAccount && (
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center">
                  <Globe size={16} className="text-cyan-400" />
                </div>
              )}
            </div>

            {/* USER INFORMATION */}

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-2xl font-bold truncate">{displayName}</h2>

                <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold capitalize">
                  {formattedRole}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-5 mt-2 text-sm text-slate-400">
                <div className="flex items-center gap-2 min-w-0">
                  <Mail size={15} />

                  <span className="truncate">
                    {profileData.email || user?.email || "No email"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <CalendarDays size={15} />

                  <span>Joined {formattedCreatedDate}</span>
                </div>
              </div>
            </div>

            {/* AUTH BADGE */}

            <div
              className={`shrink-0 rounded-2xl border px-4 py-3 ${
                isGoogleAccount
                  ? "bg-blue-500/10 border-blue-500/20"
                  : "bg-slate-800/70 border-slate-700"
              }`}
            >
              <div className="flex items-center gap-2">
                {isGoogleAccount ? (
                  <Globe size={18} className="text-blue-400" />
                ) : (
                  <KeyRound size={18} className="text-cyan-400" />
                )}

                <div>
                  <p className="text-xs text-slate-500">Sign-in method</p>

                  <p className="text-sm font-semibold text-white">
                    {isGoogleAccount ? "Google" : "Email & Password"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ==================================================
            MESSAGES
        ================================================== */}

        <Message type="success">{message}</Message>

        <Message type="error">{error}</Message>

        {/* ==================================================
            MAIN LAYOUT
        ================================================== */}

        <div className="grid lg:grid-cols-[270px_1fr] gap-8">
          {/* SIDEBAR */}

          <aside className="bg-slate-900 border border-slate-800 rounded-3xl p-3 h-fit">
            <div className="space-y-1">
              {SETTINGS_SECTIONS.map((section) => {
                const Icon = section.icon;
                const active = activeSection === section.id;

                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => {
                      setActiveSection(section.id);
                      clearMessages();
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl transition-all text-left ${
                      active
                        ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/10"
                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        active ? "bg-white/15" : "bg-slate-800"
                      }`}
                    >
                      <Icon size={18} />
                    </div>

                    <div>
                      <p className="font-semibold text-sm">{section.label}</p>

                      <p
                        className={`text-xs mt-0.5 ${
                          active ? "text-cyan-100" : "text-slate-500"
                        }`}
                      >
                        {section.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* CONTENT */}

          <main>
            {/* ==================================================
                PROFILE
            ================================================== */}

            {activeSection === "profile" && (
              <SettingsCard>
                <SectionHeader
                  icon={User}
                  title="Profile Information"
                  description="Update your personal information."
                />

                <form onSubmit={handleProfileSave} className="space-y-6">
                  {/* NAME */}

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Full Name
                    </label>

                    <div className="relative">
                      <User
                        size={19}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                      />

                      <input
                        type="text"
                        name="fullName"
                        value={profileData.fullName}
                        onChange={handleProfileChange}
                        autoComplete="name"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-12 pr-4 py-3.5 text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 transition"
                      />
                    </div>
                  </div>

                  {/* EMAIL */}

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Email Address
                    </label>

                    <div className="relative">
                      <Mail
                        size={19}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                      />

                      <input
                        type="email"
                        value={profileData.email}
                        disabled
                        className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-12 pr-4 py-3.5 text-slate-500 cursor-not-allowed"
                      />
                    </div>

                    <p className="text-xs text-slate-600 mt-2">
                      Your email address cannot be changed here.
                    </p>
                  </div>

                  {/* ROLE */}

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Account Role
                    </label>

                    <div className="relative">
                      <Shield
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                      />

                      <input
                        type="text"
                        value={formattedRole}
                        disabled
                        className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-12 pr-4 py-3.5 text-slate-500 capitalize cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* AUTH METHOD */}

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Authentication Method
                    </label>

                    <div className="flex items-center gap-3 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5">
                      {isGoogleAccount ? (
                        <Globe size={19} className="text-blue-400" />
                      ) : (
                        <KeyRound size={19} className="text-cyan-400" />
                      )}

                      <div>
                        <p className="text-white font-medium">
                          {isGoogleAccount ? "Google" : "Email & Password"}
                        </p>

                        <p className="text-xs text-slate-500 mt-0.5">
                          {isGoogleAccount
                            ? "Your account is secured through Google."
                            : "Your account uses a local password."}
                        </p>
                      </div>
                    </div>
                  </div>

                  <LoadingButton
                    type="submit"
                    loading={profileSaving}
                    icon={Save}
                    loadingText="Saving..."
                  >
                    Save Changes
                  </LoadingButton>
                </form>
              </SettingsCard>
            )}

            {/* ==================================================
                SECURITY
            ================================================== */}

            {activeSection === "security" && (
              <SettingsCard>
                <SectionHeader
                  icon={Shield}
                  title="Security"
                  description="Manage your authentication and account security."
                />

                {isGoogleAccount ? (
                  <GoogleSecurityCard />
                ) : (
                  <form
                    onSubmit={handlePasswordSubmit}
                    className="bg-slate-950 border border-slate-800 rounded-2xl p-5 sm:p-6"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                        <Lock size={21} className="text-cyan-400" />
                      </div>

                      <div>
                        <h3 className="font-semibold">Change Password</h3>

                        <p className="text-sm text-slate-500 mt-1">
                          Update your account password.
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 space-y-4">
                      <PasswordInput
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        placeholder="Current Password"
                        autoComplete="current-password"
                        visible={passwordVisibility.currentPassword}
                        onToggle={() =>
                          togglePasswordVisibility("currentPassword")
                        }
                      />

                      <PasswordInput
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        placeholder="New Password"
                        autoComplete="new-password"
                        visible={passwordVisibility.newPassword}
                        onToggle={() => togglePasswordVisibility("newPassword")}
                      />

                      <PasswordInput
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        placeholder="Confirm New Password"
                        autoComplete="new-password"
                        visible={passwordVisibility.confirmPassword}
                        onToggle={() =>
                          togglePasswordVisibility("confirmPassword")
                        }
                      />

                      <LoadingButton
                        type="submit"
                        loading={passwordLoading}
                        icon={Lock}
                        loadingText="Updating..."
                      >
                        Update Password
                      </LoadingButton>
                    </div>
                  </form>
                )}

                {/* SECURITY INFO */}

                <div className="mt-5 grid sm:grid-cols-2 gap-4">
                  <InfoCard
                    icon={KeyRound}
                    title="Authentication"
                    value={
                      isGoogleAccount ? "Managed by Google" : "Email & password"
                    }
                  />

                  <InfoCard
                    icon={Shield}
                    iconClass="text-emerald-400"
                    title="Account Status"
                    value="Authentication active"
                    valueClass="text-emerald-400"
                  />
                </div>
              </SettingsCard>
            )}

            {/* ==================================================
                NOTIFICATIONS
            ================================================== */}

            {activeSection === "notifications" && (
              <SettingsCard>
                <SectionHeader
                  icon={Bell}
                  title="Notifications"
                  description="Choose which notifications you want to receive."
                />

                <div className="space-y-4">
                  {NOTIFICATION_ITEMS.map((item) => {
                    const enabled = notifications[item.key];

                    return (
                      <div
                        key={item.key}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 bg-slate-950 border border-slate-800 rounded-2xl p-5"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 shrink-0 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center">
                            <Bell size={17} className="text-slate-400" />
                          </div>

                          <div>
                            <h3 className="font-semibold">{item.title}</h3>

                            <p className="text-sm text-slate-500 mt-1 leading-5">
                              {item.description}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          role="switch"
                          aria-checked={enabled}
                          aria-label={`Toggle ${item.title}`}
                          onClick={() => handleNotificationToggle(item.key)}
                          className={`relative shrink-0 w-12 h-6 rounded-full transition ${
                            enabled ? "bg-cyan-500" : "bg-slate-700"
                          }`}
                        >
                          <span
                            className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                              enabled ? "left-7" : "left-1"
                            }`}
                          />
                        </button>
                      </div>
                    );
                  })}
                </div>

                <LoadingButton
                  className="mt-6"
                  loading={notificationSaving}
                  icon={Save}
                  loadingText="Saving..."
                  onClick={handleNotificationSave}
                >
                  Save Preferences
                </LoadingButton>
              </SettingsCard>
            )}

            {/* ==================================================
                ACCOUNT
            ================================================== */}

            {activeSection === "account" && (
              <SettingsCard>
                <SectionHeader
                  icon={UserRound}
                  title="Account"
                  description="Manage your DevSphere AI account."
                />

                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  <InfoCard
                    icon={User}
                    title="Account Role"
                    value={formattedRole}
                    valueClass="capitalize"
                  />

                  <InfoCard
                    icon={CalendarDays}
                    title="Member Since"
                    value={formattedCreatedDate}
                  />
                </div>

                {/* DANGER ZONE */}

                <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-5 sm:p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 shrink-0 rounded-xl bg-red-500/10 flex items-center justify-center">
                      <AlertTriangle size={22} className="text-red-400" />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-red-400">
                        Danger Zone
                      </h3>

                      <p className="text-slate-400 mt-2 leading-6">
                        Deleting your account will permanently remove your
                        profile, applications and AI interview history.
                      </p>

                      <button
                        type="button"
                        onClick={openDeleteModal}
                        className="mt-5 flex items-center gap-2 px-5 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:border-red-500/40 transition-all"
                      >
                        <Trash2 size={18} />
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </SettingsCard>
            )}
          </main>
        </div>
      </div>

      {/* ======================================================
          DELETE MODAL
      ====================================================== */}

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm px-4">
          <div className="w-full max-w-lg bg-slate-900 border border-red-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <AlertTriangle size={28} className="text-red-400" />
            </div>

            <h2 className="text-2xl font-bold mt-5">Delete Your Account?</h2>

            <p className="text-slate-400 mt-3 leading-7">
              This action is permanent and cannot be undone. Your profile,
              applications and AI interview history will be permanently deleted.
            </p>

            <div className="mt-5 bg-red-500/5 border border-red-500/20 rounded-xl p-4">
              <p className="text-sm text-red-300 leading-6">
                Jobs posted by you will remain available to other users, but
                your account will no longer be associated with them.
              </p>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Type <span className="text-red-400 font-bold">DELETE</span> to
                confirm
              </label>

              <input
                type="text"
                value={deleteConfirmation}
                onChange={(event) => setDeleteConfirmation(event.target.value)}
                placeholder="Type DELETE"
                autoComplete="off"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-red-500 transition"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-7">
              <button
                type="button"
                disabled={deleteLoading}
                onClick={closeDeleteModal}
                className="flex-1 px-5 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-all disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={deleteLoading || deleteConfirmation !== "DELETE"}
                onClick={handleDeleteAccount}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {deleteLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={18} />
                    Delete Permanently
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ======================================================
// GOOGLE SECURITY CARD
// ======================================================

function GoogleSecurityCard() {
  return (
    <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-6">
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        <div className="w-12 h-12 shrink-0 rounded-xl bg-blue-500/10 flex items-center justify-center">
          <Globe size={24} className="text-blue-400" />
        </div>

        <div>
          <h3 className="text-lg font-bold">Google Account</h3>

          <p className="text-slate-400 mt-2 leading-6">
            Your DevSphere AI account is authenticated through Google. Your
            Google account manages your password and sign-in security.
          </p>

          <div className="mt-5 inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
            <CheckCircle2 size={16} />
            Google authentication active
          </div>
        </div>
      </div>
    </div>
  );
}

// ======================================================
// INFO CARD
// ======================================================

function InfoCard({
  icon: Icon,
  title,
  value,
  iconClass = "text-cyan-400",
  valueClass = "",
}) {
  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5">
      <div className="flex items-center gap-3">
        <Icon size={19} className={iconClass} />

        <div>
          <p className="text-xs text-slate-500">{title}</p>

          <p className={`text-sm font-semibold mt-1 ${valueClass}`}>{value}</p>
        </div>
      </div>
    </div>
  );
}

export default Settings;
