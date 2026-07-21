import { useNavigate } from "react-router-dom";

import {
  Bot,
  ArrowRight,
  Sparkles,
  MessageCircle,
  BrainCircuit,
} from "lucide-react";

function AIMentorCard() {
  const navigate = useNavigate();

  return (
    <div className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 overflow-hidden relative">
      {/* Decorative background */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        {/* LEFT SIDE */}

        <div className="flex items-start gap-5">
          <div className="w-14 h-14 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl flex items-center justify-center shrink-0">
            <Bot size={30} className="text-cyan-400" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold">AI Mentor</h2>

              <Sparkles size={18} className="text-cyan-400" />
            </div>

            <p className="text-slate-400 mt-2 max-w-2xl leading-6">
              Get personalized guidance for programming, courses, projects,
              interview preparation and your developer journey.
            </p>

            {/* FEATURES */}

            <div className="flex flex-wrap gap-4 mt-5">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <MessageCircle size={16} className="text-cyan-400" />
                Ask Questions
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-300">
                <BrainCircuit size={16} className="text-cyan-400" />
                Personalized Guidance
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Sparkles size={16} className="text-cyan-400" />
                AI Assistance
              </div>
            </div>
          </div>
        </div>

        {/* BUTTON */}

        <button
          onClick={() => navigate("/mentor")}
          className="flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-600 px-6 py-3.5 rounded-xl font-semibold transition shrink-0"
        >
          Open AI Mentor
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}

export default AIMentorCard;
