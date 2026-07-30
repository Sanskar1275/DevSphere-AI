import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  BrainCircuit,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  RefreshCw,
  Sparkles,
  UserRound,
  FileText,
  GraduationCap,
  Code2,
  FolderGit2,
  BriefcaseBusiness,
  Award,
  Trophy,
} from "lucide-react";

import API from "../services/axios";

// ==========================================
// SECTION CONFIGURATION
// ==========================================

const sections = [
  {
    key: "personalInfo",
    label: "Personal Information",
    max: 15,
    icon: UserRound,
  },
  {
    key: "summary",
    label: "Professional Summary",
    max: 10,
    icon: FileText,
  },
  {
    key: "education",
    label: "Education",
    max: 10,
    icon: GraduationCap,
  },
  {
    key: "skills",
    label: "Technical Skills",
    max: 20,
    icon: Code2,
  },
  {
    key: "projects",
    label: "Projects",
    max: 20,
    icon: FolderGit2,
  },
  {
    key: "experience",
    label: "Experience",
    max: 15,
    icon: BriefcaseBusiness,
  },
  {
    key: "certifications",
    label: "Certifications",
    max: 5,
    icon: Award,
  },
  {
    key: "achievements",
    label: "Achievements",
    max: 5,
    icon: Trophy,
  },
];

function ResumeAnalysis() {
  const navigate = useNavigate();

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // LOAD ANALYSIS
  // ==========================================

  const loadAnalysis = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/resume-analysis");

      setAnalysis(response.data.analysis);
    } catch (error) {
      console.error("Resume Analysis Error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to analyze your resume.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalysis();
  }, []);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2
            size={42}
            className="animate-spin text-cyan-400 mx-auto"
          />

          <h2 className="text-xl font-semibold mt-5">
            Analyzing your resume...
          </h2>

          <p className="text-slate-500 text-sm mt-2">
            DevSphere is evaluating your developer profile.
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error || !analysis) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
          <AlertTriangle
            size={42}
            className="text-amber-400 mx-auto"
          />

          <h1 className="text-2xl font-bold mt-5">
            Analysis unavailable
          </h1>

          <p className="text-slate-400 mt-3">
            {error}
          </p>

          <div className="flex gap-3 justify-center mt-6">
            <button
              onClick={() => navigate("/resume")}
              className="px-5 py-2.5 border border-slate-700 rounded-xl hover:bg-slate-800 transition"
            >
              Resume Builder
            </button>

            <button
              onClick={loadAnalysis}
              className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-600 rounded-xl font-semibold transition"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const score = analysis.score || 0;

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-950 text-white p-5 md:p-10">
      <div className="max-w-6xl mx-auto">

        {/* ======================================
            TOP NAVIGATION
        ====================================== */}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <button
            onClick={() => navigate("/resume")}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition"
          >
            <ArrowLeft size={19} />
            Back to Resume Builder
          </button>

          <button
            onClick={loadAnalysis}
            className="flex items-center justify-center gap-2 border border-slate-700 hover:border-cyan-500 hover:bg-slate-900 px-4 py-2.5 rounded-xl text-sm transition"
          >
            <RefreshCw size={16} />
            Analyze Again
          </button>
        </div>

        {/* ======================================
            HEADER
        ====================================== */}

        <div className="mt-9">
          <div className="flex items-center gap-3 text-cyan-400">
            <BrainCircuit size={24} />

            <span className="font-semibold">
              DevSphere Resume Intelligence
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold mt-3">
            Resume Analysis
          </h1>

          <p className="text-slate-400 mt-3 max-w-2xl">
            See how complete your developer resume is and discover
            areas that can make your profile stronger.
          </p>
        </div>

        {/* ======================================
            SCORE AREA
        ====================================== */}

        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-6 mt-10">

          {/* SCORE */}

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7 md:p-9">
            <p className="text-sm text-slate-400">
              Overall Resume Score
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center gap-8 mt-6">

              {/* CIRCLE */}

              <div
                className="relative w-44 h-44 rounded-full flex items-center justify-center shrink-0"
                style={{
                  background: `conic-gradient(
                    rgb(6 182 212) ${score * 3.6}deg,
                    rgb(30 41 59) 0deg
                  )`,
                }}
              >
                <div className="absolute inset-[10px] bg-slate-900 rounded-full" />

                <div className="relative text-center">
                  <p className="text-5xl font-bold">
                    {score}
                  </p>

                  <p className="text-slate-500 text-sm">
                    / 100
                  </p>
                </div>
              </div>

              {/* RATING */}

              <div>
                <p className="text-slate-500 text-sm">
                  Overall Rating
                </p>

                <h2 className="text-3xl font-bold mt-2 text-cyan-400">
                  {analysis.rating}
                </h2>

                <p className="text-slate-400 mt-3 leading-6">
                  {getScoreMessage(score)}
                </p>
              </div>

            </div>
          </div>

          {/* SUMMARY CARD */}

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7 md:p-9">
            <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/20 rounded-xl flex items-center justify-center">
              <Sparkles
                size={23}
                className="text-cyan-400"
              />
            </div>

            <h2 className="text-2xl font-bold mt-5">
              Analysis Summary
            </h2>

            <p className="text-slate-400 mt-3 leading-6">
              Your resume was evaluated across eight important
              sections used to build a strong developer profile.
            </p>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <MiniStat
                value={analysis.strengths?.length || 0}
                label="Strengths"
              />

              <MiniStat
                value={analysis.improvements?.length || 0}
                label="Suggestions"
              />
            </div>
          </div>

        </div>

        {/* ======================================
            SECTION BREAKDOWN
        ====================================== */}

        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 mt-6">
          <h2 className="text-2xl font-bold">
            Section Breakdown
          </h2>

          <p className="text-slate-500 text-sm mt-2">
            Your score across each resume section.
          </p>

          <div className="grid md:grid-cols-2 gap-x-10 gap-y-7 mt-8">
            {sections.map((section) => {
              const value =
                analysis.sectionScores?.[section.key] || 0;

              const percentage =
                (value / section.max) * 100;

              const Icon = section.icon;

              return (
                <div key={section.key}>
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <div className="flex items-center gap-2.5">
                      <Icon
                        size={17}
                        className="text-cyan-400"
                      />

                      <span className="text-sm font-medium">
                        {section.label}
                      </span>
                    </div>

                    <span className="text-sm text-slate-400">
                      <span className="text-white font-semibold">
                        {value}
                      </span>
                      /{section.max}
                    </span>
                  </div>

                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyan-500 rounded-full transition-all duration-700"
                      style={{
                        width: `${Math.min(percentage, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ======================================
            STRENGTHS + IMPROVEMENTS
        ====================================== */}

        <div className="grid lg:grid-cols-2 gap-6 mt-6">

          {/* STRENGTHS */}

          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center">
                <CheckCircle2
                  size={20}
                  className="text-emerald-400"
                />
              </div>

              <div>
                <h2 className="text-xl font-bold">
                  Resume Strengths
                </h2>

                <p className="text-xs text-slate-500 mt-1">
                  What's already working well
                </p>
              </div>
            </div>

            <div className="space-y-3 mt-6">
              {analysis.strengths?.length > 0 ? (
                analysis.strengths.map((item, index) => (
                  <FeedbackCard
                    key={index}
                    text={item}
                    type="strength"
                  />
                ))
              ) : (
                <p className="text-slate-500 text-sm">
                  Complete more resume sections to unlock strengths.
                </p>
              )}
            </div>
          </section>

          {/* IMPROVEMENTS */}

          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center">
                <AlertTriangle
                  size={20}
                  className="text-amber-400"
                />
              </div>

              <div>
                <h2 className="text-xl font-bold">
                  Recommended Improvements
                </h2>

                <p className="text-xs text-slate-500 mt-1">
                  Ways to increase your score
                </p>
              </div>
            </div>

            <div className="space-y-3 mt-6">
              {analysis.improvements?.length > 0 ? (
                analysis.improvements.map((item, index) => (
                  <FeedbackCard
                    key={index}
                    text={item}
                    type="improvement"
                  />
                ))
              ) : (
                <p className="text-slate-500 text-sm">
                  Excellent. No major improvements were detected.
                </p>
              )}
            </div>
          </section>

        </div>

        {/* ======================================
            EDIT CTA
        ====================================== */}

        <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-2xl p-7 mt-6 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <h2 className="text-xl font-bold">
              Want a higher score?
            </h2>

            <p className="text-slate-400 text-sm mt-2">
              Update your resume using the recommendations above
              and analyze it again.
            </p>
          </div>

          <button
            onClick={() => navigate("/resume")}
            className="bg-cyan-500 hover:bg-cyan-600 px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition"
          >
            Improve Resume
          </button>
        </div>

      </div>
    </div>
  );
}

// ==========================================
// MINI STAT
// ==========================================

function MiniStat({ value, label }) {
  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
      <p className="text-2xl font-bold text-cyan-400">
        {value}
      </p>

      <p className="text-xs text-slate-500 mt-1">
        {label}
      </p>
    </div>
  );
}

// ==========================================
// FEEDBACK CARD
// ==========================================

function FeedbackCard({ text, type }) {
  const strength = type === "strength";

  return (
    <div className="flex items-start gap-3 bg-slate-950/60 border border-slate-800 rounded-xl p-4">
      {strength ? (
        <CheckCircle2
          size={17}
          className="text-emerald-400 shrink-0 mt-0.5"
        />
      ) : (
        <AlertTriangle
          size={17}
          className="text-amber-400 shrink-0 mt-0.5"
        />
      )}

      <p className="text-sm text-slate-300 leading-6">
        {text}
      </p>
    </div>
  );
}

// ==========================================
// SCORE MESSAGE
// ==========================================

function getScoreMessage(score) {
  if (score >= 85) {
    return "Your resume is well-rounded and presents a strong developer profile.";
  }

  if (score >= 70) {
    return "Your resume has a solid foundation with a few areas that can be strengthened.";
  }

  if (score >= 50) {
    return "Your resume is taking shape, but several sections could use more detail.";
  }

  return "Your resume needs more information to present your skills and experience effectively.";
}

export default ResumeAnalysis;