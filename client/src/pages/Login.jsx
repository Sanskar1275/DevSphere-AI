import { useState } from "react";

function Login() {

  const [showPassword, setShowPassword] = useState(false);

  return (

    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-5">

      <div className="w-full max-w-md bg-slate-900 p-8 rounded-2xl border border-slate-700 shadow-2xl">

        <h1 className="text-4xl font-bold text-white text-center">
          Welcome Back 👋
        </h1>

        <p className="text-slate-400 text-center mt-3">
          Continue your journey with DevSphere AI
        </p>

        <form className="mt-8 space-y-6">

          <div>

            <label className="text-slate-300">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              className="w-full mt-2 p-3 rounded-xl bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-cyan-400"
            />

          </div>

          <div>

            <label className="text-slate-300">
              Password
            </label>

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              className="w-full mt-2 p-3 rounded-xl bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-cyan-400"
            />

          </div>

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-cyan-400"
          >
            {showPassword ? "Hide Password" : "Show Password"}
          </button>

          <button
            className="w-full bg-cyan-500 hover:bg-cyan-600 py-3 rounded-xl font-semibold text-white"
          >
            Login
          </button>

        </form>

      </div>

    </div>

  );

}

export default Login;