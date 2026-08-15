import { Bell, UserCircle } from "lucide-react";

function Topbar({ user, onProfileClick }) {
  return (
    <header
      className="
        w-full
        border-b border-slate-800
        bg-slate-900
        px-4 sm:px-6 lg:px-8
        py-5 sm:py-6
      "
    >
      <div className="flex items-center justify-between gap-4">
        {/* ==========================================
            WELCOME SECTION
        ========================================== */}

        <div className="min-w-0">
          <h1
            className="
              text-2xl
              sm:text-3xl
              font-bold
              leading-tight
              text-white
            "
          >
            Welcome back,
            <span className="text-cyan-400"> {user?.fullName}</span>
            <span className="ml-1">👋</span>
          </h1>

          <p className="text-slate-400 mt-2 text-sm sm:text-base">
            Ready to build something amazing today?
          </p>

          <div className="mt-2 text-xs sm:text-sm text-slate-500">
            <p className="truncate max-w-[260px] sm:max-w-none">
              {user?.email}
            </p>

            <p className="capitalize">{user?.role}</p>
          </div>
        </div>

        {/* ==========================================
            ACTIONS
        ========================================== */}

        <div className="flex items-center gap-3 sm:gap-5 shrink-0">
          {/* NOTIFICATIONS */}

          <button
            type="button"
            className="
              relative
              w-10 h-10
              flex items-center justify-center
              rounded-xl
              text-white
              hover:bg-slate-800
              transition
            "
            title="Notifications"
          >
            <Bell size={23} className="hover:text-cyan-400 transition" />

            <span
              className="
                absolute
                -top-1
                -right-1
                w-5 h-5
                rounded-full
                bg-red-500
                text-xs
                flex
                justify-center
                items-center
                text-white
              "
            >
              3
            </span>
          </button>

          {/* PROFILE */}

          <button
            type="button"
            onClick={onProfileClick}
            className="
              w-11 h-11
              flex items-center justify-center
              rounded-full
              hover:bg-cyan-500/10
              focus:outline-none
              focus:ring-2
              focus:ring-cyan-400
              focus:ring-offset-2
              focus:ring-offset-slate-900
              transition
            "
            title="My Profile"
            aria-label="Open My Profile"
          >
            <UserCircle
              size={36}
              className="
                text-cyan-400
                hover:text-cyan-300
                transition
              "
            />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
