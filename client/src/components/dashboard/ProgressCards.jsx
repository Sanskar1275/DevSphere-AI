import { Bell, UserCircle, LogOut, Settings, User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function Topbar({ user }) {

  const [open, setOpen] = useState(false);

  const { logout } = useAuth();

  const navigate = useNavigate();

  const handleLogout = () => {

    logout();

    navigate("/login");

  };

  return (

    <header className="flex justify-between items-center border-b border-slate-800 bg-slate-900 px-8 py-6">

      <div>

        <h1 className="text-3xl font-bold">

          Welcome back,

          <span className="text-cyan-400">
            {" "}
            {user?.fullName}
          </span>

          👋

        </h1>

        <p className="text-slate-400 mt-2">
          Ready to build something amazing today?
        </p>

      </div>

      <div className="flex items-center gap-6 relative">

        <Bell
          className="cursor-pointer hover:text-cyan-400"
          size={24}
        />

        <button
          onClick={() => setOpen(!open)}
        >

          <UserCircle
            size={40}
            className="text-cyan-400 cursor-pointer"
          />

        </button>

        {open && (

          <div className="absolute right-0 top-14 w-72 bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl p-5 z-50">

            <div className="border-b border-slate-700 pb-4">

              <h2 className="font-bold text-lg">
                {user?.fullName}
              </h2>

              <p className="text-slate-400 text-sm">
                {user?.email}
              </p>

              <p className="text-cyan-400 capitalize mt-2">
                {user?.role}
              </p>

            </div>

            <div className="mt-4 space-y-3">

              <button className="flex gap-3 items-center hover:text-cyan-400">

                <User size={18} />

                My Profile

              </button>

              <button className="flex gap-3 items-center hover:text-cyan-400">

                <Settings size={18} />

                Settings

              </button>

              <button

                onClick={handleLogout}

                className="flex gap-3 items-center text-red-500 hover:text-red-400"

              >

                <LogOut size={18} />

                Logout

              </button>

            </div>

          </div>

        )}

      </div>

    </header>

  );

}

export default Topbar;