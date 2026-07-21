import {
  ArrowLeft,
  BriefcaseBusiness,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import AddJobForm from "../components/admin/AddJobForm";

function AdminAddJob() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-10">

      <div className="max-w-5xl mx-auto">

        <button
          onClick={() =>
            navigate("/admin")
          }
          className="flex items-center gap-2 text-slate-400 hover:text-white transition mb-8"
        >
          <ArrowLeft size={19} />

          Back to Admin Dashboard
        </button>

        <div className="flex items-center gap-4 mb-8">

          <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/20 rounded-xl flex items-center justify-center">
            <BriefcaseBusiness
              className="text-cyan-400"
            />
          </div>

          <div>
            <h1 className="text-4xl font-bold">
              Post Opportunity
            </h1>

            <p className="text-slate-400 mt-1">
              Add a job or internship to
              DevSphere AI.
            </p>
          </div>

        </div>

        <AddJobForm />

      </div>
    </div>
  );
}

export default AdminAddJob;