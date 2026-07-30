import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  BrainCircuit,
  Clock3,
  FileQuestion,
  Sparkles,
  Award,
  Play,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  Lightbulb,
} from "lucide-react";

import { startInterview } from "../services/interviewService";

const features = [
  {
    icon: Clock3,
    title: "20 Minutes",
    subtitle: "Average interview duration",
    color: "cyan",
  },
  {
    icon: FileQuestion,
    title: "10 Questions",
    subtitle: "Technical + HR Questions",
    color: "violet",
  },
  {
    icon: BrainCircuit,
    title: "AI Evaluation",
    subtitle: "Smart answer analysis",
    color: "emerald",
  },
  {
    icon: Award,
    title: "Detailed Report",
    subtitle: "Score + Recommendations",
    color: "amber",
  },
];

function InterviewSetup() {
  const { jobId } = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    try {
      setLoading(true);

      const res = await startInterview(jobId);

      navigate(`/interview/${res.interview._id}`);
    } catch (error) {
      console.error(error);

      alert("Failed to start interview.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Background */}

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-violet-500/10 blur-[150px]" />

        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-cyan-500/10 blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-14">
        {/* HERO */}

        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300">
            <BrainCircuit size={18} />
            AI Powered Interview
          </div>

          <h1 className="mt-8 text-5xl md:text-6xl font-black">
            AI Mock Interview
          </h1>

          <p className="mt-6 text-slate-400 text-lg max-w-3xl mx-auto leading-8">
            Practice a realistic interview generated specifically for this
            opportunity. Get detailed AI evaluation, technical scoring,
            communication feedback and personalized recommendations.
          </p>
        </div>

        {/* FEATURE CARDS */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-14">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={index}
                className="group bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-violet-500/30 transition-all duration-300 hover:-translate-y-2"
              >
                <div className="w-14 h-14 rounded-xl bg-slate-800 flex items-center justify-center">
                  <Icon className="text-cyan-400" size={28} />
                </div>

                <h3 className="mt-5 text-xl font-bold">{feature.title}</h3>

                <p className="text-slate-400 mt-2 leading-6">
                  {feature.subtitle}
                </p>
              </div>
            );
          })}
        </div>

        {/* =====================================
            CONTENT
        ===================================== */}

        <div className="grid lg:grid-cols-2 gap-8 mt-12">
          {/* INTERVIEW GUIDELINES */}

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                <ShieldCheck className="text-cyan-400" />
              </div>

              <div>
                <h2 className="text-2xl font-bold">Before You Begin</h2>

                <p className="text-slate-500 text-sm">
                  Follow these instructions carefully
                </p>
              </div>
            </div>

            <div className="space-y-5">
              {[
                "Read every question carefully before answering.",
                "Answer honestly using your own knowledge.",
                "Do not refresh or close the interview.",
                "Think before submitting your answer.",
                "A complete AI report will be generated at the end.",
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <CheckCircle2
                    size={20}
                    className="text-emerald-400 mt-1 shrink-0"
                  />

                  <p className="text-slate-300 leading-7">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* AI TIPS */}

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <Lightbulb className="text-amber-400" />
              </div>

              <div>
                <h2 className="text-2xl font-bold">AI Interview Tips</h2>

                <p className="text-slate-500 text-sm">
                  Improve your interview performance
                </p>
              </div>
            </div>

            <div className="space-y-5">
              {[
                "Explain your projects with confidence.",
                "Mention the technologies you used.",
                "Give practical examples whenever possible.",
                "Keep your answers clear and structured.",
                "Stay calm and think before answering.",
              ].map((tip, index) => (
                <div key={index} className="flex items-start gap-4">
                  <Sparkles
                    size={18}
                    className="text-violet-400 mt-1 shrink-0"
                  />

                  <p className="text-slate-300 leading-7">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* =====================================
            START BUTTON
        ===================================== */}

        <div className="mt-12">
          <div className="bg-gradient-to-r from-violet-600/10 via-cyan-500/10 to-violet-600/10 border border-violet-500/20 rounded-3xl p-8 text-center">
            <BrainCircuit className="mx-auto text-violet-400" size={52} />

            <h2 className="text-3xl font-bold mt-5">
              Ready to Test Your Skills?
            </h2>

            <p className="text-slate-400 mt-4 max-w-2xl mx-auto leading-7">
              Your interview will begin immediately after clicking the button
              below. Answer every question honestly and receive a complete
              AI-generated performance report.
            </p>

            <button
              onClick={handleStart}
              disabled={loading}
              className="mt-8 inline-flex items-center gap-3 bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={22} className="animate-spin" />
                  Starting Interview...
                </>
              ) : (
                <>
                  <Play size={22} />
                  Start AI Interview
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InterviewSetup;
