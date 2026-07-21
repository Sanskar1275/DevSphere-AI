import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  Briefcase,
  Building2,
  CalendarDays,
  Clock3,
  ExternalLink,
  IndianRupee,
  Loader2,
  MapPin,
  CheckCircle2,
} from "lucide-react";

import { getJobById } from "../services/jobService";

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================
  // LOAD JOB DETAILS
  // =========================================

  useEffect(() => {
    const loadJob = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getJobById(id);

        setJob(data);
      } catch (error) {
        console.error(
          "Failed to load job:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load job details."
        );
      } finally {
        setLoading(false);
      }
    };

    loadJob();
  }, [id]);

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-300">
          <Loader2
            size={24}
            className="animate-spin text-cyan-400"
          />

          Loading Job...
        </div>
      </div>
    );
  }

  // =========================================
  // ERROR / JOB NOT FOUND
  // =========================================

  if (error || !job) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6">

        <Briefcase
          size={48}
          className="text-slate-600 mb-4"
        />

        <h2 className="text-2xl font-bold">
          Job Not Found
        </h2>

        <p className="text-slate-400 mt-2">
          {error ||
            "This opportunity is no longer available."}
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
  // APPLY
  // =========================================

  const handleApply = () => {
    if (!job.applyLink) {
      return;
    }

    window.open(
      job.applyLink,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-10">

      <div className="max-w-6xl mx-auto">

        {/* BACK BUTTON */}

        <button
          onClick={() => navigate("/jobs")}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition mb-8"
        >
          <ArrowLeft size={19} />

          Back to Jobs
        </button>

        {/* =========================================
            JOB HEADER
        ========================================= */}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8">

          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">

            <div className="flex items-start gap-5">

              {/* COMPANY LOGO */}

              <div className="w-16 h-16 shrink-0 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden">

                {job.companyLogo ? (
                  <img
                    src={job.companyLogo}
                    alt={job.company}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Building2
                    size={30}
                    className="text-cyan-400"
                  />
                )}

              </div>

              {/* TITLE */}

              <div>

                <h1 className="text-3xl md:text-4xl font-bold">
                  {job.title}
                </h1>

                <div className="flex items-center gap-2 text-slate-400 mt-2">

                  <Building2 size={18} />

                  <span>
                    {job.company}
                  </span>

                </div>

              </div>

            </div>

            {/* JOB TYPE */}

            <span className="self-start bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 px-4 py-2 rounded-full text-sm font-medium">
              {job.jobType}
            </span>

          </div>

          {/* JOB META INFORMATION */}

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">

            {/* LOCATION */}

            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">

              <MapPin
                size={20}
                className="text-cyan-400 mb-3"
              />

              <p className="text-xs text-slate-500">
                Location
              </p>

              <p className="text-sm font-medium mt-1">
                {job.location}
              </p>

            </div>

            {/* WORK MODE */}

            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">

              <Briefcase
                size={20}
                className="text-cyan-400 mb-3"
              />

              <p className="text-xs text-slate-500">
                Work Mode
              </p>

              <p className="text-sm font-medium mt-1">
                {job.workMode ||
                  "Not specified"}
              </p>

            </div>

            {/* EXPERIENCE */}

            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">

              <Clock3
                size={20}
                className="text-cyan-400 mb-3"
              />

              <p className="text-xs text-slate-500">
                Experience
              </p>

              <p className="text-sm font-medium mt-1">
                {job.experience ||
                  "Not specified"}
              </p>

            </div>

            {/* SALARY */}

            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">

              <IndianRupee
                size={20}
                className="text-cyan-400 mb-3"
              />

              <p className="text-xs text-slate-500">
                Salary / Stipend
              </p>

              <p className="text-sm font-medium mt-1">
                {job.salary ||
                  "Not Disclosed"}
              </p>

            </div>

          </div>

        </div>

        {/* =========================================
            MAIN CONTENT
        ========================================= */}

        <div className="grid lg:grid-cols-[1fr_320px] gap-8 mt-8">

          {/* LEFT SIDE */}

          <div className="space-y-8">

            {/* JOB DESCRIPTION */}

            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8">

              <h2 className="text-2xl font-bold">
                About the Opportunity
              </h2>

              <p className="text-slate-300 leading-7 mt-5 whitespace-pre-line">
                {job.description}
              </p>

            </section>

            {/* SKILLS */}

            {job.skills?.length > 0 && (
              <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8">

                <h2 className="text-2xl font-bold">
                  Skills Required
                </h2>

                <div className="flex flex-wrap gap-3 mt-5">

                  {job.skills.map(
                    (skill, index) => (
                      <span
                        key={index}
                        className="bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 px-4 py-2 rounded-xl text-sm"
                      >
                        {skill}
                      </span>
                    )
                  )}

                </div>

              </section>
            )}

            {/* REQUIREMENTS */}

            {job.requirements?.length >
              0 && (
              <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8">

                <h2 className="text-2xl font-bold">
                  Requirements
                </h2>

                <div className="space-y-4 mt-5">

                  {job.requirements.map(
                    (
                      requirement,
                      index
                    ) => (
                      <div
                        key={index}
                        className="flex items-start gap-3"
                      >
                        <CheckCircle2
                          size={19}
                          className="text-cyan-400 shrink-0 mt-1"
                        />

                        <p className="text-slate-300 leading-6">
                          {requirement}
                        </p>
                      </div>
                    )
                  )}

                </div>

              </section>
            )}

            {/* RESPONSIBILITIES */}

            {job.responsibilities?.length >
              0 && (
              <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8">

                <h2 className="text-2xl font-bold">
                  Responsibilities
                </h2>

                <div className="space-y-4 mt-5">

                  {job.responsibilities.map(
                    (
                      responsibility,
                      index
                    ) => (
                      <div
                        key={index}
                        className="flex items-start gap-3"
                      >
                        <CheckCircle2
                          size={19}
                          className="text-cyan-400 shrink-0 mt-1"
                        />

                        <p className="text-slate-300 leading-6">
                          {responsibility}
                        </p>
                      </div>
                    )
                  )}

                </div>

              </section>
            )}

          </div>

          {/* =========================================
              RIGHT SIDEBAR
          ========================================= */}

          <aside>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 lg:sticky lg:top-6">

              <h2 className="text-xl font-bold">
                Interested in this role?
              </h2>

              <p className="text-slate-400 text-sm leading-6 mt-3">
                Review the requirements and
                apply through the company's
                application page.
              </p>

              {/* APPLY BUTTON */}

              <button
                onClick={handleApply}
                disabled={!job.applyLink}
                className="w-full mt-6 bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition"
              >
                Apply Now

                <ExternalLink size={18} />
              </button>

              {/* DEADLINE */}

              <div className="border-t border-slate-800 mt-6 pt-6">

                <div className="flex items-start gap-3">

                  <CalendarDays
                    size={19}
                    className="text-cyan-400 shrink-0"
                  />

                  <div>
                    <p className="text-xs text-slate-500">
                      Application Deadline
                    </p>

                    <p className="text-sm mt-1">
                      {job.applicationDeadline
                        ? new Date(
                            job.applicationDeadline
                          ).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }
                          )
                        : "Not specified"}
                    </p>
                  </div>

                </div>

              </div>

              {/* POSTED */}

              <div className="border-t border-slate-800 mt-5 pt-5">

                <p className="text-xs text-slate-500">
                  Posted On
                </p>

                <p className="text-sm mt-1">
                  {job.createdAt
                    ? new Date(
                        job.createdAt
                      ).toLocaleDateString(
                        "en-IN",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )
                    : "Recently"}
                </p>

              </div>

            </div>

          </aside>

        </div>

      </div>
    </div>
  );
}

export default JobDetails;