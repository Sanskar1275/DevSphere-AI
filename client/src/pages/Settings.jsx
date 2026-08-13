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
} from "lucide-react";

import { useAuth } from "../hooks/useAuth";

import {
  getProfile,
  updateProfile,
  changePassword,
  updateNotifications,
  deleteAccount,
} from "../services/authService";

function Settings() {
  const { user, updateUser, logout } = useAuth();

  // =========================================
  // ACTIVE SECTION
  // =========================================

  const [activeSection, setActiveSection] = useState("profile");

  // =========================================
  // PROFILE STATE
  // =========================================

  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    role: "",
  });

  const [profileLoading, setProfileLoading] = useState(true);

  const [profileSaving, setProfileSaving] = useState(false);

  // =========================================
  // PASSWORD STATE
  // =========================================

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordLoading, setPasswordLoading] = useState(false);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

  const [showNewPassword, setShowNewPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // =========================================
  // NOTIFICATION STATE
  // =========================================

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    interviewNotifications: true,
    jobRecommendations: true,
  });

  const [notificationSaving, setNotificationSaving] = useState(false);

  // =========================================
  // DELETE ACCOUNT STATE
  // =========================================

  const [deleteLoading, setDeleteLoading] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  // =========================================
  // MESSAGE STATE
  // =========================================

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  // =========================================
  // LOAD PROFILE
  // =========================================

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setProfileLoading(true);

      const res = await getProfile();

      if (res.user) {
        setProfileData({
          fullName: res.user.fullName || "",

          email: res.user.email || "",

          role: res.user.role || "student",
        });

        if (res.user.notifications) {
          setNotifications({
            emailNotifications:
              res.user.notifications.emailNotifications ?? true,

            interviewNotifications:
              res.user.notifications.interviewNotifications ?? true,

            jobRecommendations:
              res.user.notifications.jobRecommendations ?? true,
          });
        }

        // Keep AuthContext synchronized
        updateUser(res.user);
      }
    } catch (error) {
      console.error("Failed to load profile:", error);

      setError(error.response?.data?.message || "Failed to load profile.");
    } finally {
      setProfileLoading(false);
    }
  };

  // =========================================
  // CLEAR MESSAGES
  // =========================================

  const clearMessages = () => {
    setMessage("");
    setError("");
  };

  // =========================================
  // PROFILE INPUT
  // =========================================

  const handleProfileChange = (event) => {
    const { name, value } = event.target;

    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));

    clearMessages();
  };

  // =========================================
  // SAVE PROFILE
  // =========================================

  const handleProfileSave = async (event) => {
    event.preventDefault();

    clearMessages();

    const trimmedName = profileData.fullName.trim();

    if (!trimmedName) {
      setError("Full name is required.");

      return;
    }

    try {
      setProfileSaving(true);

      const res = await updateProfile(trimmedName);

      if (res.user) {
        updateUser(res.user);

        setProfileData((prev) => ({
          ...prev,

          fullName: res.user.fullName,

          email: res.user.email || prev.email,

          role: res.user.role || prev.role,
        }));
      }

      setMessage(res.message || "Profile updated successfully.");
    } catch (error) {
      console.error("Profile update failed:", error);

      setError(error.response?.data?.message || "Failed to update profile.");
    } finally {
      setProfileSaving(false);
    }
  };

  // =========================================
  // PASSWORD INPUT
  // =========================================

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));

    clearMessages();
  };

  // =========================================
  // CHANGE PASSWORD
  // =========================================

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

    try {
      setPasswordLoading(true);

      const res = await changePassword(currentPassword, newPassword);

      setMessage(res.message || "Password changed successfully.");

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    } catch (error) {
      console.error("Password change failed:", error);

      setError(error.response?.data?.message || "Failed to change password.");
    } finally {
      setPasswordLoading(false);
    }
  };

  // =========================================
  // NOTIFICATION TOGGLE
  // =========================================

  const handleNotificationToggle = (key) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));

    clearMessages();
  };

  // =========================================
  // SAVE NOTIFICATIONS
  // =========================================

  const handleNotificationSave = async () => {
    clearMessages();

    try {
      setNotificationSaving(true);

      const res = await updateNotifications(notifications);

      if (res.notifications) {
        setNotifications({
          emailNotifications: res.notifications.emailNotifications ?? true,

          interviewNotifications:
            res.notifications.interviewNotifications ?? true,

          jobRecommendations: res.notifications.jobRecommendations ?? true,
        });

        // Keep AuthContext synchronized
        updateUser({
          ...user,
          notifications: res.notifications,
        });
      }

      setMessage(
        res.message || "Notification preferences updated successfully.",
      );
    } catch (error) {
      console.error("Notification update failed:", error);

      setError(
        error.response?.data?.message ||
          "Failed to update notification preferences.",
      );
    } finally {
      setNotificationSaving(false);
    }
  };

  // =========================================
  // DELETE ACCOUNT
  // =========================================

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== "DELETE") {
      setError('Please type "DELETE" to confirm account deletion.');

      return;
    }

    clearMessages();

    try {
      setDeleteLoading(true);

      const res = await deleteAccount();

      setShowDeleteModal(false);

      setDeleteConfirmation("");

      // Remove authentication
      logout();

      // Redirect to login
      window.location.href = "/login";

      console.log(res.message || "Account deleted successfully.");
    } catch (error) {
      console.error("Account deletion failed:", error);

      setError(error.response?.data?.message || "Failed to delete account.");

      setDeleteLoading(false);
    }
  };

  // =========================================
  // SETTINGS SECTIONS
  // =========================================

  const sections = [
    {
      id: "profile",
      label: "Profile",
      icon: User,
    },

    {
      id: "security",
      label: "Security",
      icon: Shield,
    },

    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
    },

    {
      id: "account",
      label: "Account",
      icon: User,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* ======================================
          BACKGROUND
      ====================================== */}

      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-cyan-500/10 blur-[170px]" />

        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-violet-500/10 blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* ======================================
            HEADER
        ====================================== */}

        <div className="mb-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <Shield className="text-cyan-400" size={25} />
            </div>

            <div>
              <h1 className="text-4xl font-black">Settings</h1>

              <p className="text-slate-400 mt-1">
                Manage your DevSphere AI account and preferences.
              </p>
            </div>
          </div>
        </div>

        {/* ======================================
            SUCCESS MESSAGE
        ====================================== */}

        {message && (
          <div className="mb-6 flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl px-5 py-4">
            <CheckCircle2 size={20} />

            <span>{message}</span>
          </div>
        )}

        {/* ======================================
            ERROR MESSAGE
        ====================================== */}

        {error && (
          <div className="mb-6 flex items-center gap-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-5 py-4">
            <AlertTriangle size={20} />

            <span>{error}</span>
          </div>
        )}

        {/* ======================================
            MAIN SETTINGS LAYOUT
        ====================================== */}

        <div className="grid lg:grid-cols-[260px_1fr] gap-8">
          {/* ======================================
              SETTINGS SIDEBAR
          ====================================== */}

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 h-fit">
            <div className="space-y-2">
              {sections.map((section) => {
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
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      active
                        ? "bg-cyan-500 text-white"
                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <Icon size={19} />

                    <span className="font-medium">{section.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ======================================
              CONTENT
          ====================================== */}

          <div>
            {/* ==================================
                PROFILE
            ================================== */}

            {activeSection === "profile" && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold">Profile Information</h2>

                  <p className="text-slate-400 mt-2">
                    Manage your personal information.
                  </p>
                </div>

                {profileLoading ? (
                  <div className="flex items-center justify-center py-16">
                    <Loader2 size={35} className="animate-spin text-cyan-400" />
                  </div>
                ) : (
                  <form onSubmit={handleProfileSave} className="space-y-6">
                    {/* FULL NAME */}

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
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-cyan-500"
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
                          className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-12 pr-4 py-3 text-slate-500 cursor-not-allowed"
                        />
                      </div>

                      <p className="text-xs text-slate-600 mt-2">
                        Email address cannot be changed here.
                      </p>
                    </div>

                    {/* ROLE */}

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Account Role
                      </label>

                      <input
                        type="text"
                        value={profileData.role || user?.role || "student"}
                        disabled
                        className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-slate-500 capitalize cursor-not-allowed"
                      />
                    </div>

                    {/* SAVE */}

                    <button
                      type="submit"
                      disabled={profileSaving}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {profileSaving ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save size={18} />
                          Save Changes
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* ==================================
                SECURITY
            ================================== */}

            {activeSection === "security" && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold">Security</h2>

                  <p className="text-slate-400 mt-2">
                    Manage your password and account security.
                  </p>
                </div>

                <form
                  onSubmit={handlePasswordSubmit}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-5"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                      <Lock className="text-cyan-400" />
                    </div>

                    <div>
                      <h3 className="font-semibold">Change Password</h3>

                      <p className="text-sm text-slate-500">
                        Update your account password.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    {/* CURRENT PASSWORD */}

                    <div className="relative">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        placeholder="Current Password"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:border-cyan-500"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                      >
                        {showCurrentPassword ? (
                          <EyeOff size={19} />
                        ) : (
                          <Eye size={19} />
                        )}
                      </button>
                    </div>

                    {/* NEW PASSWORD */}

                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        placeholder="New Password"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:border-cyan-500"
                      />

                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                      >
                        {showNewPassword ? (
                          <EyeOff size={19} />
                        ) : (
                          <Eye size={19} />
                        )}
                      </button>
                    </div>

                    {/* CONFIRM PASSWORD */}

                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        placeholder="Confirm New Password"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:border-cyan-500"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={19} />
                        ) : (
                          <Eye size={19} />
                        )}
                      </button>
                    </div>

                    {/* UPDATE */}

                    <button
                      type="submit"
                      disabled={passwordLoading}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-600 font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {passwordLoading ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Lock size={18} />
                          Update Password
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ==================================
                NOTIFICATIONS
            ================================== */}

            {activeSection === "notifications" && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold">Notifications</h2>

                  <p className="text-slate-400 mt-2">
                    Choose which notifications you want to receive.
                  </p>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      key: "emailNotifications",

                      title: "Email Notifications",

                      description: "Receive important updates through email.",
                    },

                    {
                      key: "interviewNotifications",

                      title: "Interview Notifications",

                      description:
                        "Get reminders and updates about your interviews.",
                    },

                    {
                      key: "jobRecommendations",

                      title: "Job Recommendations",

                      description: "Receive personalized job recommendations.",
                    },
                  ].map((item) => (
                    <div
                      key={item.key}
                      className="flex items-center justify-between gap-6 bg-slate-950 border border-slate-800 rounded-xl p-5"
                    >
                      <div>
                        <h3 className="font-semibold">{item.title}</h3>

                        <p className="text-sm text-slate-500 mt-1">
                          {item.description}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleNotificationToggle(item.key)}
                        className={`relative w-12 h-6 rounded-full transition ${
                          notifications[item.key]
                            ? "bg-cyan-500"
                            : "bg-slate-700"
                        }`}
                      >
                        <span
                          className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                            notifications[item.key] ? "left-7" : "left-1"
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  disabled={notificationSaving}
                  onClick={handleNotificationSave}
                  className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-600 font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {notificationSaving ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Save Preferences
                    </>
                  )}
                </button>
              </div>
            )}

            {/* ==================================
                ACCOUNT
            ================================== */}

            {activeSection === "account" && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold">Account</h2>

                  <p className="text-slate-400 mt-2">Manage your account.</p>
                </div>

                <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <AlertTriangle
                      className="text-red-400 shrink-0"
                      size={24}
                    />

                    <div>
                      <h3 className="text-lg font-bold text-red-400">
                        Danger Zone
                      </h3>

                      <p className="text-slate-400 mt-2 leading-6">
                        Deleting your account will permanently remove your
                        profile, applications and AI interview history.
                      </p>

                      <button
                        type="button"
                        onClick={() => {
                          clearMessages();

                          setDeleteConfirmation("");

                          setShowDeleteModal(true);
                        }}
                        className="mt-5 flex items-center gap-2 px-5 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:border-red-500/40 transition-all"
                      >
                        <Trash2 size={18} />
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ======================================
          DELETE ACCOUNT MODAL
      ====================================== */}

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="w-full max-w-lg bg-slate-900 border border-red-500/30 rounded-2xl p-7 shadow-2xl">
            {/* ICON */}

            <div className="w-14 h-14 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <AlertTriangle size={28} className="text-red-400" />
            </div>

            {/* TITLE */}

            <h2 className="text-2xl font-bold mt-5">Delete Your Account?</h2>

            <p className="text-slate-400 mt-3 leading-7">
              This action is permanent and cannot be undone. Your profile,
              applications and AI interview history will be permanently deleted.
            </p>

            {/* WARNING */}

            <div className="mt-5 bg-red-500/5 border border-red-500/20 rounded-xl p-4">
              <p className="text-sm text-red-300 leading-6">
                Jobs posted by you will remain available to other users, but
                your account will no longer be associated with them.
              </p>
            </div>

            {/* CONFIRMATION */}

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
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500"
              />
            </div>

            {/* BUTTONS */}

            <div className="flex flex-col sm:flex-row gap-3 mt-7">
              {/* CANCEL */}

              <button
                type="button"
                disabled={deleteLoading}
                onClick={() => {
                  setShowDeleteModal(false);

                  setDeleteConfirmation("");
                }}
                className="flex-1 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-all disabled:opacity-50"
              >
                Cancel
              </button>

              {/* DELETE */}

              <button
                type="button"
                disabled={deleteLoading || deleteConfirmation !== "DELETE"}
                onClick={handleDeleteAccount}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
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

export default Settings;
