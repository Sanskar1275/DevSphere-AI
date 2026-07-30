import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowRight,
  BrainCircuit,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  Loader2,
  MapPin,
  RefreshCw,
  Sparkles,
  Target,
  TriangleAlert,
} from "lucide-react";

import { getRecommendedJobs } from "../services/jobRecommendationService";

function RecommendedJobs() {
  const navigate = useNavigate();

  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");

  // ==========================================
  // LOAD RECOMMENDATIONS
  // ==========================================

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getRecommendedJobs();

      setRecommendations(data.recommendations || []);
    } catch (error) {
      console.error("Recommendation Error:", error);

      setError(
        error.response?.data?.message || "Failed to load job recommendations.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecommendations();
  }, []);

  // ==========================================
  // FILTER
  // ==========================================

  const filteredRecommendations = useMemo(() => {
    if (filter === "All") {
      return recommendations;
    }

    return recommendations.filter((item) => item.match?.level === filter);
  }, [recommendations, filter]);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={42} className="animate-spin text-violet-400 mx-auto" />

          <h2 className="text-xl font-semibold mt-5">
            Finding your best opportunities...
          </h2>

          <p className="text-slate-500 mt-2">
            Comparing your resume with available jobs.
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
        <div className="max-w-lg w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
          <TriangleAlert size={45} className="text-amber-400 mx-auto" />

          <h1 className="text-2xl font-bold mt-5">
            Recommendations unavailable
          </h1>

          <p className="text-slate-400 mt-3">{error}</p>

          <div className="flex flex-wrap justify-center gap-3 mt-7">
            <button
              onClick={() => navigate("/resume")}
              className="px-5 py-3 border border-slate-700 hover:bg-slate-800 rounded-xl transition"
            >
              Resume Builder
            </button>

            <button
              onClick={loadRecommendations}
              className="px-5 py-3 bg-violet-500 hover:bg-violet-600 rounded-xl font-semibold flex items-center gap-2 transition"
            >
              <RefreshCw size={18} />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-violet-400 text-sm font-semibold">
              <Sparkles size={17} />
              Personalized for your resume
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mt-3">
              Recommended Jobs
            </h1>

            <p className="text-slate-400 mt-3 max-w-2xl leading-7">
              DevSphere compares your skills, projects and experience with
              active opportunities and ranks the strongest matches first.
            </p>
          </div>

          <button
            onClick={loadRecommendations}
            className="self-start flex items-center gap-2 border border-slate-700 hover:bg-slate-900 px-5 py-3 rounded-xl text-slate-300 transition"
          >
            <RefreshCw size={18} />
            Refresh Matches
          </button>
        </div>

        {/* SUMMARY */}

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
          <SummaryCard label="Opportunities" value={recommendations.length} />

          <SummaryCard
            label="Excellent Matches"
            value={
              recommendations.filter((item) => item.match?.score >= 85).length
            }
          />

          <SummaryCard
            label="Strong Matches"
            value={
              recommendations.filter(
                (item) => item.match?.score >= 70 && item.match?.score < 85,
              ).length
            }
          />

          <SummaryCard
            label="Best Match"
            value={
              recommendations.length
                ? `${recommendations[0].match?.score || 0}%`
                : "0%"
            }
          />
        </div>

        {/* FILTERS */}

        <div className="flex flex-wrap gap-2 mt-10">
          {[
            "All",
            "Excellent Match",
            "Strong Match",
            "Moderate Match",
            "Low Match",
          ].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setFilter(option)}
              className={`px-4 py-2 rounded-xl text-sm border transition ${
                filter === option
                  ? "bg-violet-500 border-violet-500 text-white"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        {/* EMPTY */}

        {filteredRecommendations.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center mt-6">
            <BriefcaseBusiness size={45} className="text-slate-600 mx-auto" />

            <h2 className="text-xl font-bold mt-4">No matching jobs found</h2>

            <p className="text-slate-500 mt-2">
              Try another match filter or check again when more jobs are
              available.
            </p>
          </div>
        ) : (
          <div className="space-y-5 mt-6">
            {filteredRecommendations.map(({ job, match }, index) => (
              <JobRecommendationCard
                key={job._id}
                job={job}
                match={match}
                rank={
                  filter === "All"
                    ? index + 1
                    : recommendations.findIndex(
                        (item) => item.job._id === job._id,
                      ) + 1
                }
                onView={() => navigate(`/jobs/${job._id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// JOB CARD
// ==========================================

function JobRecommendationCard({ job, match, rank, onView }) {
  const matchedSkills = match?.matchedSkills || [];
  const missingSkills = match?.missingSkills || [];

  return (
    <article className="bg-slate-900 border border-slate-800 hover:border-violet-500/40 rounded-2xl p-6 transition">
      <div className="flex flex-col xl:flex-row gap-6">
        {/* COMPANY */}

        <div className="flex-1">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 shrink-0 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-center overflow-hidden">
              {job.companyLogo ? (
                <img
                  src={job.companyLogo}
                  alt={job.company}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Building2 size={26} className="text-cyan-400" />
              )}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-500">
                  #{rank} Recommendation
                </span>

                <MatchBadge level={match?.level} />
              </div>

              <h2 className="text-2xl font-bold mt-2">{job.title}</h2>

              <p className="text-slate-400 mt-1">{job.company}</p>
            </div>
          </div>

          {/* META */}

          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-400 mt-5">
            {job.location && (
              <span className="flex items-center gap-1.5">
                <MapPin size={16} />
                {job.location}
              </span>
            )}

            {job.jobType && (
              <span className="flex items-center gap-1.5">
                <BriefcaseBusiness size={16} />
                {job.jobType}
              </span>
            )}

            {job.workMode && <span>{job.workMode}</span>}
          </div>

          {/* MATCHED SKILLS */}

          <div className="mt-6">
            <p className="text-sm font-semibold flex items-center gap-2">
              <CheckCircle2 size={17} className="text-emerald-400" />
              Skills you already match
            </p>

            <div className="flex flex-wrap gap-2 mt-3">
              {matchedSkills.length > 0 ? (
                matchedSkills.slice(0, 7).map((skill) => (
                  <span
                    key={skill}
                    className="text-xs px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-sm text-slate-500">
                  No required skills matched yet.
                </span>
              )}
            </div>
          </div>

          {/* MISSING */}

          {missingSkills.length > 0 && (
            <div className="mt-5">
              <p className="text-xs text-slate-500">Skills to strengthen</p>

              <p className="text-sm text-amber-400 mt-1">
                {missingSkills.slice(0, 5).join(", ")}
                {missingSkills.length > 5 && " ..."}
              </p>
            </div>
          )}
        </div>

        {/* SCORE */}

        <div className="xl:w-64 xl:border-l border-slate-800 xl:pl-6 flex flex-col justify-between">
          <div>
            <div className="flex xl:flex-col items-center xl:items-start gap-4">
              <ScoreCircle score={match?.score || 0} />

              <div>
                <p className="text-xs text-slate-500">Resume compatibility</p>

                <p className="font-bold text-lg mt-1">
                  {match?.level || "Low Match"}
                </p>
              </div>
            </div>

            <div className="mt-5 bg-slate-950/70 border border-slate-800 rounded-xl p-4">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Skill Match</span>

                <span>
                  {match?.matchedSkillCount || 0}/{match?.totalJobSkills || 0}
                </span>
              </div>

              <div className="flex justify-between text-xs mt-2">
                <span className="text-slate-500">Relevant Projects</span>

                <span>{match?.relevantProjectCount || 0}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onView}
            className="w-full mt-5 bg-violet-500 hover:bg-violet-600 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition"
          >
            View Opportunity
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </article>
  );
}

// ==========================================
// SCORE
// ==========================================

function ScoreCircle({ score }) {
  const safeScore = Math.min(100, Math.max(0, score));

  return (
    <div
      className="relative w-20 h-20 rounded-full flex items-center justify-center shrink-0"
      style={{
        background: `conic-gradient(
          rgb(139 92 246) ${safeScore * 3.6}deg,
          rgb(30 41 59) 0deg
        )`,
      }}
    >
      <div className="absolute inset-[6px] bg-slate-900 rounded-full" />

      <span className="relative text-lg font-bold">{safeScore}%</span>
    </div>
  );
}

// ==========================================
// BADGE
// ==========================================

function MatchBadge({ level }) {
  return (
    <span className="text-xs bg-violet-500/10 border border-violet-500/20 text-violet-400 px-2.5 py-1 rounded-full flex items-center gap-1">
      <Target size={12} />
      {level || "Low Match"}
    </span>
  );
}

// ==========================================
// SUMMARY CARD
// ==========================================

function SummaryCard({ label, value }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
      <BrainCircuit size={19} className="text-violet-400" />

      <p className="text-slate-500 text-sm mt-4">{label}</p>

      <p className="text-3xl font-bold mt-1">{value}</p>
    </div>
  );
}

export default RecommendedJobs;
