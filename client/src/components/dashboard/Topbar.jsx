import { Bell, UserCircle } from "lucide-react";

function Topbar({ user }) {
  return (
    <header className="flex justify-between items-center border-b border-slate-800 bg-slate-900 px-8 py-6">

      <div>
        <h1 className="text-3xl font-bold">
          Welcome back,
          <span className="text-cyan-400">
            {" "}
            {user?.fullName}
          </span>{" "}
          👋
        </h1>

        <p className="text-slate-400 mt-2">
          Ready to build something amazing today?
        </p>

        <div className="mt-2 text-sm text-slate-500">
          <p>{user?.email}</p>
          <p className="capitalize">{user?.role}</p>
        </div>
      </div>

      <div className="flex items-center gap-6">

        <button className="relative">
          <Bell
            size={24}
            className="hover:text-cyan-400 transition"
          />

          <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-xs flex justify-center items-center">
            3
          </span>
        </button>

        <UserCircle
          size={38}
          className="text-cyan-400"
        />

      </div>

    </header>
  );
}

export default Topbar;