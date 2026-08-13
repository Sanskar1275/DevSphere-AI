import { useEffect, useState } from "react";

import {
  Users,
  Search,
  ShieldCheck,
  UserRound,
  BriefcaseBusiness,
  Trash2,
  Loader2,
  RefreshCw,
  X,
  AlertTriangle,
} from "lucide-react";

import {
  getAllUsers,
  updateUserRole,
  deleteUser,
} from "../services/adminUserService";

function AdminUsers() {
  // ==========================================
  // STATE
  // ==========================================

  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [actionLoading, setActionLoading] = useState("");

  const [search, setSearch] = useState("");

  const [role, setRole] = useState("all");

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  const [deleteTarget, setDeleteTarget] = useState(null);

  // ==========================================
  // LOAD USERS
  // ==========================================

  useEffect(() => {
    fetchUsers();
  }, [role]);

  const fetchUsers = async (currentSearch = search) => {
    try {
      setLoading(true);

      clearMessages();

      const data = await getAllUsers(currentSearch, role);

      setUsers(data.users || []);
    } catch (error) {
      console.error("Failed to load users:", error);

      setError(error.response?.data?.message || "Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // SEARCH
  // ==========================================

  const handleSearch = async (event) => {
    event.preventDefault();

    await fetchUsers(search);
  };

  // ==========================================
  // CLEAR SEARCH
  // ==========================================

  const handleClearSearch = async () => {
    setSearch("");

    await fetchUsers("");
  };

  // ==========================================
  // CLEAR MESSAGES
  // ==========================================

  const clearMessages = () => {
    setMessage("");
    setError("");
  };

  // ==========================================
  // ROLE CHANGE
  // ==========================================

  const handleRoleChange = async (userId, newRole) => {
    try {
      clearMessages();

      setActionLoading(`role-${userId}`);

      const data = await updateUserRole(userId, newRole);

      setUsers((previousUsers) =>
        previousUsers.map((user) => (user._id === userId ? data.user : user)),
      );

      setMessage(data.message || "User role updated successfully.");
    } catch (error) {
      console.error("Failed to update role:", error);

      setError(error.response?.data?.message || "Failed to update user role.");
    } finally {
      setActionLoading("");
    }
  };

  // ==========================================
  // DELETE USER
  // ==========================================

  const handleDeleteUser = async () => {
    if (!deleteTarget) {
      return;
    }

    try {
      clearMessages();

      setActionLoading(`delete-${deleteTarget._id}`);

      const data = await deleteUser(deleteTarget._id);

      setUsers((previousUsers) =>
        previousUsers.filter((user) => user._id !== deleteTarget._id),
      );

      setMessage(data.message || "User deleted successfully.");

      setDeleteTarget(null);
    } catch (error) {
      console.error("Failed to delete user:", error);

      setError(error.response?.data?.message || "Failed to delete user.");
    } finally {
      setActionLoading("");
    }
  };

  // ==========================================
  // ROLE BADGE
  // ==========================================

  const getRoleBadge = (userRole) => {
    if (userRole === "admin") {
      return "bg-red-500/10 text-red-400 border-red-500/20";
    }

    if (userRole === "recruiter") {
      return "bg-violet-500/10 text-violet-400 border-violet-500/20";
    }

    return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
  };

  // ==========================================
  // ROLE ICON
  // ==========================================

  const getRoleIcon = (userRole) => {
    if (userRole === "admin") {
      return ShieldCheck;
    }

    if (userRole === "recruiter") {
      return BriefcaseBusiness;
    }

    return UserRound;
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-10">
      {/* BACKGROUND */}

      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-cyan-500/10 blur-[170px]" />

        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-violet-500/10 blur-[150px]" />
      </div>

      <div className="max-w-[1500px] mx-auto">
        {/* ======================================
            HEADER
        ====================================== */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <Users size={28} className="text-cyan-400" />
            </div>

            <div>
              <h1 className="text-4xl md:text-5xl font-black">Manage Users</h1>

              <p className="text-slate-400 mt-2">
                Manage DevSphere AI users and their roles.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => fetchUsers()}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500 text-slate-300 hover:text-white transition-all disabled:opacity-50"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* ======================================
            MESSAGES
        ====================================== */}

        {message && (
          <div className="mt-8 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl px-5 py-4">
            {message}
          </div>
        )}

        {error && (
          <div className="mt-8 flex items-center gap-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-5 py-4">
            <AlertTriangle size={20} />

            <span>{error}</span>
          </div>
        )}

        {/* ======================================
            FILTERS
        ====================================== */}

        <div className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* SEARCH */}

            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by name or email..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-12 pr-24 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
                />

                {search && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-14 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                  >
                    <X size={18} />
                  </button>
                )}

                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-cyan-500 text-white text-sm font-semibold hover:bg-cyan-600 transition-all"
                >
                  Search
                </button>
              </div>
            </form>

            {/* ROLE FILTER */}

            <select
              value={role}
              onChange={(event) => setRole(event.target.value)}
              className="lg:w-52 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Roles</option>

              <option value="student">Students</option>

              <option value="recruiter">Recruiters</option>

              <option value="admin">Admins</option>
            </select>
          </div>
        </div>

        {/* ======================================
            USER COUNT
        ====================================== */}

        <div className="mt-6 flex items-center justify-between">
          <p className="text-slate-400">
            Showing{" "}
            <span className="text-white font-semibold">{users.length}</span>{" "}
            user
            {users.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* ======================================
            USERS TABLE
        ====================================== */}

        <div className="mt-4 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center">
              <Loader2 size={40} className="animate-spin text-cyan-400" />

              <p className="text-slate-400 mt-4">Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="py-24 flex flex-col items-center justify-center text-center px-6">
              <Users size={55} className="text-slate-700" />

              <h2 className="text-xl font-bold mt-5">No Users Found</h2>

              <p className="text-slate-500 mt-2">
                Try changing your search or role filter.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/50">
                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      User
                    </th>

                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Email
                    </th>

                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Role
                    </th>

                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Joined
                    </th>

                    <th className="text-right px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user) => {
                    const RoleIcon = getRoleIcon(user.role);

                    const isDeleting = actionLoading === `delete-${user._id}`;

                    const isChangingRole = actionLoading === `role-${user._id}`;

                    return (
                      <tr
                        key={user._id}
                        className="border-b border-slate-800 last:border-b-0 hover:bg-slate-800/30 transition-colors"
                      >
                        {/* USER */}

                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                              <UserRound size={20} className="text-cyan-400" />
                            </div>

                            <div>
                              <p className="font-semibold text-white">
                                {user.fullName}
                              </p>

                              <p className="text-xs text-slate-600 mt-1">
                                ID: {user._id.slice(0, 8)}
                                ...
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* EMAIL */}

                        <td className="px-6 py-5">
                          <p className="text-slate-300">{user.email}</p>
                        </td>

                        {/* ROLE */}

                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-9 h-9 rounded-lg border flex items-center justify-center ${getRoleBadge(
                                user.role,
                              )}`}
                            >
                              <RoleIcon size={17} />
                            </div>

                            <select
                              value={user.role}
                              disabled={isChangingRole}
                              onChange={(event) =>
                                handleRoleChange(user._id, event.target.value)
                              }
                              className={`bg-slate-950 border rounded-lg px-3 py-2 text-sm capitalize focus:outline-none ${getRoleBadge(
                                user.role,
                              )}`}
                            >
                              <option value="student">Student</option>

                              <option value="recruiter">Recruiter</option>

                              <option value="admin">Admin</option>
                            </select>
                          </div>
                        </td>

                        {/* JOINED */}

                        <td className="px-6 py-5">
                          <p className="text-slate-400">
                            {new Date(user.createdAt).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </p>
                        </td>

                        {/* ACTIONS */}

                        <td className="px-6 py-5">
                          <div className="flex justify-end">
                            <button
                              type="button"
                              disabled={isDeleting}
                              onClick={() => setDeleteTarget(user)}
                              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:border-red-500/40 transition-all disabled:opacity-50"
                            >
                              {isDeleting ? (
                                <Loader2 size={17} className="animate-spin" />
                              ) : (
                                <Trash2 size={17} />
                              )}
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ======================================
          DELETE CONFIRMATION MODAL
      ====================================== */}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="w-full max-w-lg bg-slate-900 border border-red-500/30 rounded-2xl p-7 shadow-2xl">
            <div className="w-14 h-14 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <AlertTriangle size={28} className="text-red-400" />
            </div>

            <h2 className="text-2xl font-bold mt-5">Delete User?</h2>

            <p className="text-slate-400 mt-3 leading-7">
              Are you sure you want to permanently delete{" "}
              <span className="text-white font-semibold">
                {deleteTarget.fullName}
              </span>
              ?
            </p>

            <div className="mt-5 bg-red-500/5 border border-red-500/20 rounded-xl p-4">
              <p className="text-sm text-red-300 leading-6">
                This will delete the user's account, applications and AI
                interview history. Jobs posted by the user will be preserved.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-7">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={actionLoading.startsWith("delete-")}
                className="flex-1 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-all disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteUser}
                disabled={actionLoading.startsWith("delete-")}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition-all disabled:opacity-50"
              >
                {actionLoading.startsWith("delete-") ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={18} />
                    Delete User
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

export default AdminUsers;
