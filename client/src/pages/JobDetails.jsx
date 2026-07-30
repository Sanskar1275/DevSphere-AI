import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  Briefcase,
  Building2,
  CalendarDays,
  Clock3,
  IndianRupee,
  Loader2,
  MapPin,
  CheckCircle2,
  Send,
  X,
  ExternalLink,
  BrainCircuit,
  Target,
  AlertTriangle,
  FolderGit2,
  Lightbulb,
  RefreshCw,
} from "lucide-react";

import { getJobById } from "../services/jobService";
import { applyForJob, getMyApplications } from "../services/applicationService";

import API from "../services/axios";

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // =========================================
  // JOB STATE
  // =========================================

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================
  // APPLICATION STATE
  // =========================================

  const [showApplyModal, setShowApplyModal] = useState(false);

  const [coverLetter, setCoverLetter] = useState("");

  const [applying, setApplying] = useState(false);

  const [applicationError, setApplicationError] = useState("");

  const [applicationSuccess, setApplicationSuccess] = useState("");

  const [alreadyApplied, setAlreadyApplied] = useState(false);

  const [checkingApplication, setCheckingApplication] = useState(true);

  // =========================================
  // RESUME MATCH STATE
  // =========================================

  const [showMatchModal, setShowMatchModal] = useState(false);

  const [matchData, setMatchData] = useState(null);

  const [matchLoading, setMatchLoading] = useState(false);

  const [matchError, setMatchError] = useState("");

  // =========================================
  // LOAD JOB
  // =========================================

  useEffect(() => {
    const loadJob = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getJobById(id);

        setJob(data);
      } catch (error) {
        console.error("Failed to load job:", error);

        setError(
          error.response?.data?.message || "Failed to load job details.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadJob();
  }, [id]);

  // =========================================
  // CHECK APPLICATION
  // =========================================

  useEffect(() => {
    const checkApplication = async () => {
      try {
        setCheckingApplication(true);

        const data = await getMyApplications();

        const applications = data.applications || [];

        const found = applications.some(
          (application) =>
            application.job?._id === id && application.status !== "Withdrawn",
        );

        setAlreadyApplied(found);
      } catch (error) {
        console.error("Failed to check application:", error);
      } finally {
        setCheckingApplication(false);
      }
    };

    checkApplication();
  }, [id]);

  // =========================================
  // APPLY MODAL
  // =========================================

  const openApplyModal = () => {
    setApplicationError("");
    setApplicationSuccess("");
    setShowApplyModal(true);
  };

  const closeApplyModal = () => {
    if (applying) return;

    setShowApplyModal(false);
    setApplicationError("");
  };

  // =========================================
  // APPLY
  // =========================================

  const handleApply = async () => {
    try {
      setApplying(true);
      setApplicationError("");
      setApplicationSuccess("");

      const data = await applyForJob(id, coverLetter);

      setApplicationSuccess(
        data.message || "Application submitted successfully",
      );

      setAlreadyApplied(true);
      setCoverLetter("");

      setTimeout(() => {
        setShowApplyModal(false);
        setApplicationSuccess("");
      }, 1800);
    } catch (error) {
      console.error("Application failed:", error);

      const message =
        error.response?.data?.message || "Failed to submit application.";

      setApplicationError(message);

      if (message.toLowerCase().includes("already applied")) {
        setAlreadyApplied(true);
      }
    } finally {
      setApplying(false);
    }
  };

  // =========================================
  // CHECK RESUME MATCH
  // =========================================

  const handleResumeMatch = async () => {
    try {
      setShowMatchModal(true);
      setMatchLoading(true);
      setMatchError("");
      setMatchData(null);

      const response = await API.get(`/job-match/${id}`);

      setMatchData(response.data.match);
    } catch (error) {
      console.error("Resume Match Error:", error);

      setMatchError(
        error.response?.data?.message || "Failed to analyze resume match.",
      );
    } finally {
      setMatchLoading(false);
    }
  };

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-300">
          <Loader2 size={24} className="animate-spin text-cyan-400" />
          Loading Job...
        </div>
      </div>
    );
  }

  // =========================================
  // ERROR
  // =========================================

  if (error || !job) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6">
        <Briefcase size={48} className="text-slate-600 mb-4" />

        <h2 className="text-2xl font-bold">Job Not Found</h2>

        <p className="text-slate-400 mt-2 text-center">
          {error || "This opportunity is no longer available."}
        </p>

        <button
          onClick={() => navigate("/jobs")}
          className="mt-6 bg-cyan-500 hover:bg-cyan-600 px-6 py-3 rounded-xl font-semibold transition"
        >
          Back to Jobs
        </button>
      </div>
    );
  }

  // =========================================
  // APPLICATION AVAILABILITY
  // =========================================

  const deadlinePassed =
    job.applicationDeadline && new Date(job.applicationDeadline) < new Date();

  const canApply = job.isActive !== false && !deadlinePassed && !alreadyApplied;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        {/* BACK */}

        <button
          onClick={() => navigate("/jobs")}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition mb-8"
        >
          <ArrowLeft size={19} />
          Back to Jobs
        </button>

        {/* =====================================
            HEADER
        ===================================== */}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 shrink-0 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden">
                {job.companyLogo ? (
                  <img
                    src={job.companyLogo}
                    alt={job.company}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Building2 size={30} className="text-cyan-400" />
                )}
              </div>

              <div>
                <h1 className="text-3xl md:text-4xl font-bold">{job.title}</h1>

                <div className="flex items-center gap-2 text-slate-400 mt-2">
                  <Building2 size={18} />
                  <span>{job.company}</span>
                </div>
              </div>
            </div>

            <span className="self-start bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 px-4 py-2 rounded-full text-sm font-medium">
              {job.jobType}
            </span>
          </div>

          {/* META */}

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            <MetaCard icon={MapPin} label="Location" value={job.location} />

            <MetaCard
              icon={Briefcase}
              label="Work Mode"
              value={job.workMode || "Not specified"}
            />

            <MetaCard
              icon={Clock3}
              label="Experience"
              value={job.experience || "Not specified"}
            />

            <MetaCard
              icon={IndianRupee}
              label="Salary / Stipend"
              value={job.salary || "Not Disclosed"}
            />
          </div>
        </div>

        {/* =====================================
            CONTENT
        ===================================== */}

        <div className="grid lg:grid-cols-[1fr_320px] gap-8 mt-8">
          {/* LEFT */}

          <div className="space-y-8">
            <ContentSection title="About the Opportunity">
              <p className="text-slate-300 leading-7 whitespace-pre-line">
                {job.description}
              </p>
            </ContentSection>

            {/* SKILLS */}

            {job.skills?.length > 0 && (
              <ContentSection title="Skills Required">
                <div className="flex flex-wrap gap-3">
                  {job.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 px-4 py-2 rounded-xl text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </ContentSection>
            )}

            {/* REQUIREMENTS */}

            {job.requirements?.length > 0 && (
              <ContentSection title="Requirements">
                <CheckList items={job.requirements} />
              </ContentSection>
            )}

            {/* RESPONSIBILITIES */}

            {job.responsibilities?.length > 0 && (
              <ContentSection title="Responsibilities">
                <CheckList items={job.responsibilities} />
              </ContentSection>
            )}
          </div>

          {/* =====================================
              SIDEBAR
          ===================================== */}

          <aside>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 lg:sticky lg:top-6">
              <h2 className="text-xl font-bold">Interested in this role?</h2>

              <p className="text-slate-400 text-sm leading-6 mt-3">
                Check how well your resume matches this opportunity before
                applying.
              </p>

              {/* RESUME MATCH */}

              <button
                type="button"
                onClick={handleResumeMatch}
                className="w-full mt-6 py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 bg-violet-500/10 border border-violet-500/30 text-violet-400 hover:bg-violet-500/20 transition"
              >
                <BrainCircuit size={19} />
                Check Resume Match
              </button>

              {/* AI INTERVIEW */}

              <button
                type="button"
                onClick={() => navigate(`/interview/setup/${job._id}`)}
                className="w-full mt-3 py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 bg-fuchsia-500/10 border border-fuchsia-500/30 text-fuchsia-400 hover:bg-fuchsia-500/20 transition"
              >
                <BrainCircuit size={19} />
                Start AI Interview
              </button>

              {/* APPLY */}

              <button
                type="button"
                onClick={openApplyModal}
                disabled={checkingApplication || !canApply}
                className={`w-full mt-3 py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition ${
                  alreadyApplied
                    ? "bg-green-500/10 border border-green-500/30 text-green-400 cursor-not-allowed"
                    : canApply
                      ? "bg-cyan-500 hover:bg-cyan-600 text-white"
                      : "bg-slate-700 text-slate-500 cursor-not-allowed"
                }`}
              >
                {checkingApplication ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Checking...
                  </>
                ) : alreadyApplied ? (
                  <>
                    <CheckCircle2 size={18} />
                    Applied
                  </>
                ) : deadlinePassed ? (
                  "Applications Closed"
                ) : job.isActive === false ? (
                  "Job Closed"
                ) : (
                  <>
                    <Send size={18} />
                    Apply Now
                  </>
                )}
              </button>

              {/* EXTERNAL LINK */}

              {job.applyLink && (
                <button
                  type="button"
                  onClick={() =>
                    window.open(job.applyLink, "_blank", "noopener,noreferrer")
                  }
                  className="w-full mt-3 border border-slate-700 hover:border-slate-600 hover:bg-slate-800 py-3 rounded-xl text-sm text-slate-300 flex items-center justify-center gap-2 transition"
                >
                  Company Application Page
                  <ExternalLink size={16} />
                </button>
              )}

              {/* DEADLINE */}

              <div className="border-t border-slate-800 mt-6 pt-6">
                <div className="flex items-start gap-3">
                  <CalendarDays size={19} className="text-cyan-400 shrink-0" />

                  <div>
                    <p className="text-xs text-slate-500">
                      Application Deadline
                    </p>

                    <p className="text-sm mt-1">
                      {job.applicationDeadline
                        ? new Date(job.applicationDeadline).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            },
                          )
                        : "Not specified"}
                    </p>
                  </div>
                </div>
              </div>

              {/* POSTED */}

              <div className="border-t border-slate-800 mt-5 pt-5">
                <p className="text-xs text-slate-500">Posted On</p>

                <p className="text-sm mt-1">
                  {job.createdAt
                    ? new Date(job.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : "Recently"}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* =====================================
          APPLICATION MODAL
      ===================================== */}

      {showApplyModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl">
            <div className="flex items-start justify-between p-6 border-b border-slate-800">
              <div>
                <h2 className="text-2xl font-bold">Apply for {job.title}</h2>

                <p className="text-slate-400 mt-1">{job.company}</p>
              </div>

              <button
                type="button"
                onClick={closeApplyModal}
                disabled={applying}
                className="text-slate-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Cover Letter
                <span className="text-slate-500 font-normal"> (Optional)</span>
              </label>

              <textarea
                value={coverLetter}
                onChange={(event) => setCoverLetter(event.target.value)}
                disabled={applying}
                rows={8}
                maxLength={3000}
                placeholder="Tell the company why you're interested in this opportunity..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-slate-200 focus:outline-none focus:border-cyan-500 resize-none"
              />

              <div className="flex justify-between mt-2 text-xs text-slate-500">
                <span>Optional</span>

                <span>{coverLetter.length}/3000</span>
              </div>

              {applicationError && (
                <div className="mt-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-3 text-sm">
                  {applicationError}
                </div>
              )}

              {applicationSuccess && (
                <div className="mt-4 bg-green-500/10 border border-green-500/30 text-green-400 rounded-xl p-3 text-sm flex items-center gap-2">
                  <CheckCircle2 size={18} />

                  {applicationSuccess}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-slate-800">
              <button
                type="button"
                onClick={closeApplyModal}
                disabled={applying}
                className="px-5 py-2.5 border border-slate-700 hover:bg-slate-800 rounded-xl"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleApply}
                disabled={applying || Boolean(applicationSuccess)}
                className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-700 rounded-xl font-semibold flex items-center gap-2"
              >
                {applying ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Submit Application
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================
          RESUME MATCH MODAL
      ===================================== */}

      {showMatchModal && (
        <ResumeMatchModal
          match={matchData}
          loading={matchLoading}
          error={matchError}
          onClose={() => setShowMatchModal(false)}
          onRetry={handleResumeMatch}
          onResume={() => navigate("/resume")}
        />
      )}
    </div>
  );
}

// =====================================================
// RESUME MATCH MODAL
// =====================================================

function ResumeMatchModal({
  match,
  loading,
  error,
  onClose,
  onRetry,
  onResume,
}) {
  return (
    <div className="fixed inset-0 z-[60] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl">
        {/* HEADER */}

        <div className="sticky top-0 bg-slate-900 z-10 flex items-center justify-between p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
              <BrainCircuit className="text-violet-400" />
            </div>

            <div>
              <h2 className="text-xl font-bold">Resume Match</h2>

              <p className="text-xs text-slate-500 mt-1">
                Job compatibility analysis
              </p>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* LOADING */}

        {loading && (
          <div className="py-20 text-center">
            <Loader2
              size={42}
              className="animate-spin text-violet-400 mx-auto"
            />

            <h3 className="font-semibold mt-5">Comparing your resume...</h3>

            <p className="text-sm text-slate-500 mt-2">
              Checking skills, projects and experience.
            </p>
          </div>
        )}

        {/* ERROR */}

        {!loading && error && (
          <div className="p-8 text-center">
            <AlertTriangle size={42} className="text-amber-400 mx-auto" />

            <h3 className="text-xl font-bold mt-4">Unable to analyze match</h3>

            <p className="text-slate-400 mt-2">{error}</p>

            <div className="flex flex-wrap justify-center gap-3 mt-6">
              <button
                onClick={onResume}
                className="px-5 py-2.5 border border-slate-700 rounded-xl hover:bg-slate-800"
              >
                Open Resume Builder
              </button>

              <button
                onClick={onRetry}
                className="px-5 py-2.5 bg-violet-500 hover:bg-violet-600 rounded-xl font-semibold flex items-center gap-2"
              >
                <RefreshCw size={17} />
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* RESULTS */}

        {!loading && !error && match && (
          <div className="p-6 md:p-8">
            {/* SCORE */}

            <div className="flex flex-col md:flex-row items-center gap-8 bg-slate-950/60 border border-slate-800 rounded-2xl p-6">
              <ScoreCircle score={match.score} />

              <div className="text-center md:text-left">
                <p className="text-sm text-slate-500">Compatibility Rating</p>

                <h3 className="text-3xl font-bold text-violet-400 mt-2">
                  {match.level}
                </h3>

                <p className="text-slate-400 mt-3 max-w-md">
                  Your resume was compared against the skills and requirements
                  for this role.
                </p>
              </div>
            </div>

            {/* BREAKDOWN */}

            <h3 className="text-xl font-bold mt-8">Match Breakdown</h3>

            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              <Breakdown label="Skills" data={match.breakdown?.skills} />

              <Breakdown label="Projects" data={match.breakdown?.projects} />

              <Breakdown
                label="Experience"
                data={match.breakdown?.experience}
              />

              <Breakdown label="Profile" data={match.breakdown?.profile} />
            </div>

            {/* SKILLS */}

            <div className="grid md:grid-cols-2 gap-5 mt-8">
              <SkillBox
                title="Matched Skills"
                items={match.matchedSkills}
                type="matched"
              />

              <SkillBox
                title="Missing Skills"
                items={match.missingSkills}
                type="missing"
              />
            </div>

            {/* PROJECTS */}

            {match.relevantProjects?.length > 0 && (
              <div className="mt-8">
                <div className="flex items-center gap-2">
                  <FolderGit2 size={20} className="text-cyan-400" />

                  <h3 className="text-xl font-bold">Relevant Projects</h3>
                </div>

                <div className="space-y-3 mt-4">
                  {match.relevantProjects.map((project, index) => (
                    <div
                      key={index}
                      className="bg-slate-950/60 border border-slate-800 rounded-xl p-4"
                    >
                      <p className="font-semibold">
                        {project.title || "Project"}
                      </p>

                      <p className="text-xs text-slate-500 mt-2">
                        Matched: {project.matchedTechnologies?.join(", ")}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* RECOMMENDATIONS */}

            <div className="mt-8">
              <div className="flex items-center gap-2">
                <Lightbulb size={20} className="text-amber-400" />

                <h3 className="text-xl font-bold">Recommendations</h3>
              </div>

              <div className="space-y-3 mt-4">
                {match.recommendations?.map((recommendation, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 bg-amber-500/5 border border-amber-500/15 rounded-xl p-4"
                  >
                    <Target
                      size={17}
                      className="text-amber-400 shrink-0 mt-1"
                    />

                    <p className="text-sm text-slate-300 leading-6">
                      {recommendation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// =====================================================
// SCORE CIRCLE
// =====================================================

function ScoreCircle({ score = 0 }) {
  const safeScore = Math.min(100, Math.max(0, score));

  return (
    <div
      className="relative w-40 h-40 rounded-full flex items-center justify-center shrink-0"
      style={{
        background: `conic-gradient(
          rgb(139 92 246) ${safeScore * 3.6}deg,
          rgb(30 41 59) 0deg
        )`,
      }}
    >
      <div className="absolute inset-[10px] bg-slate-950 rounded-full" />

      <div className="relative text-center">
        <p className="text-4xl font-bold">{safeScore}%</p>

        <p className="text-xs text-slate-500 mt-1">Job Match</p>
      </div>
    </div>
  );
}

// =====================================================
// BREAKDOWN
// =====================================================

function Breakdown({ label, data }) {
  const score = data?.score || 0;
  const max = data?.maxScore || 0;

  const percentage = max > 0 ? (score / max) * 100 : 0;

  return (
    <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
      <div className="flex justify-between text-sm">
        <span>{label}</span>

        <span className="text-slate-400">
          <span className="text-white font-semibold">{score}</span>/{max}
        </span>
      </div>

      <div className="h-2 bg-slate-800 rounded-full mt-3 overflow-hidden">
        <div
          className="h-full bg-violet-500 rounded-full"
          style={{
            width: `${Math.min(percentage, 100)}%`,
          }}
        />
      </div>
    </div>
  );
}

// =====================================================
// SKILL BOX
// =====================================================

function SkillBox({ title, items = [], type }) {
  const matched = type === "matched";

  return (
    <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5">
      <div className="flex items-center gap-2">
        {matched ? (
          <CheckCircle2 size={19} className="text-emerald-400" />
        ) : (
          <AlertTriangle size={19} className="text-amber-400" />
        )}

        <h3 className="font-bold">{title}</h3>
      </div>

      {items.length > 0 ? (
        <div className="flex flex-wrap gap-2 mt-4">
          {items.map((item, index) => (
            <span
              key={`${item}-${index}`}
              className={`px-3 py-1.5 rounded-lg text-xs border ${
                matched
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                  : "bg-amber-500/10 border-amber-500/20 text-amber-400"
              }`}
            >
              {item}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-500 mt-4">
          {matched
            ? "No matching skills detected."
            : "No missing skills detected."}
        </p>
      )}
    </div>
  );
}

// =====================================================
// META CARD
// =====================================================

function MetaCard({ icon: Icon, label, value }) {
  return (
    <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
      <Icon size={20} className="text-cyan-400 mb-3" />

      <p className="text-xs text-slate-500">{label}</p>

      <p className="text-sm font-medium mt-1">{value}</p>
    </div>
  );
}

// =====================================================
// CONTENT SECTION
// =====================================================

function ContentSection({ title, children }) {
  return (
    <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8">
      <h2 className="text-2xl font-bold mb-5">{title}</h2>

      {children}
    </section>
  );
}

// =====================================================
// CHECK LIST
// =====================================================

function CheckList({ items }) {
  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={index} className="flex items-start gap-3">
          <CheckCircle2 size={19} className="text-cyan-400 shrink-0 mt-1" />

          <p className="text-slate-300 leading-6">{item}</p>
        </div>
      ))}
    </div>
  );
}

export default JobDetails;
