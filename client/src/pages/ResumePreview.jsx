import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  Loader2,
  Mail,
  Phone,
  MapPin,
  Link,
  Globe,
  ExternalLink,
  Printer,
  BriefcaseBusiness,
  GraduationCap,
  Code2,
  FolderGit2,
  Award,
  Trophy,
} from "lucide-react";

import { getMyResume } from "../services/resumeService";

function ResumePreview() {
  const navigate = useNavigate();

  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // LOAD RESUME
  // ==========================================

  useEffect(() => {
    const loadResume = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getMyResume();

        if (!data.exists || !data.resume) {
          setError("Create and save your resume first.");
          return;
        }

        setResume(data.resume);
      } catch (error) {
        console.error("Failed to load resume preview:", error);

        setError(
          error.response?.data?.message || "Failed to load resume preview.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadResume();
  }, []);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 size={24} className="animate-spin text-cyan-400" />

          <span>Loading Resume Preview...</span>
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error || !resume) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6">
        <h1 className="text-2xl font-bold">Resume unavailable</h1>

        <p className="text-slate-400 mt-2">{error}</p>

        <button
          onClick={() => navigate("/resume")}
          className="mt-6 bg-cyan-500 hover:bg-cyan-600 px-5 py-3 rounded-xl font-semibold transition"
        >
          Back to Resume Builder
        </button>
      </div>
    );
  }

  const personal = resume.personalInfo || {};

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-950 py-8 px-4 print:bg-white print:p-0">
      {/* ======================================
          TOP TOOLBAR
      ====================================== */}

      <div className="max-w-[210mm] mx-auto mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <button
          type="button"
          onClick={() => navigate("/resume")}
          className="flex items-center gap-2 text-slate-300 hover:text-white transition"
        >
          <ArrowLeft size={18} />
          Back to Resume Builder
        </button>

        <button
          type="button"
          onClick={() => window.print()}
          className="flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-2.5 rounded-xl font-semibold transition"
        >
          <Printer size={18} />
          Print / Save PDF
        </button>
      </div>

      {/* ======================================
          A4 RESUME
      ====================================== */}

      <main
        className="
          w-full
          max-w-[210mm]
          min-h-[297mm]
          mx-auto
          bg-white
          text-slate-900
          shadow-2xl
          print:shadow-none
          px-[16mm]
          py-[15mm]
        "
      >
        {/* ======================================
            HEADER
        ====================================== */}

        <header className="pb-6 border-b-[3px] border-slate-900">
          <div className="flex items-start justify-between gap-8">
            <div className="flex-1">
              <h1 className="text-[34px] leading-tight font-extrabold tracking-tight text-slate-950">
                {personal.fullName || "Your Name"}
              </h1>

              {resume.summary && (
                <p className="mt-3 text-[12.5px] leading-[1.7] text-slate-600 max-w-3xl">
                  {resume.summary}
                </p>
              )}
            </div>

            {/* INITIALS BOX */}

            <div className="hidden sm:flex w-16 h-16 shrink-0 rounded-xl bg-slate-900 text-white items-center justify-center text-xl font-bold tracking-wide">
              {getInitials(personal.fullName)}
            </div>
          </div>

          {/* CONTACT INFORMATION */}

          <div className="flex flex-wrap gap-x-5 gap-y-2.5 mt-5 text-[10.5px] text-slate-600">
            {personal.email && (
              <Contact
                icon={Mail}
                text={personal.email}
                href={`mailto:${personal.email}`}
              />
            )}

            {personal.phone && (
              <Contact
                icon={Phone}
                text={personal.phone}
                href={`tel:${personal.phone}`}
              />
            )}

            {personal.location && (
              <Contact icon={MapPin} text={personal.location} />
            )}

            {personal.linkedIn && (
              <Contact icon={Link} text="LinkedIn" href={personal.linkedIn} />
            )}

            {personal.github && (
              <Contact icon={Code2} text="GitHub" href={personal.github} />
            )}

            {personal.portfolio && (
              <Contact
                icon={Globe}
                text="Portfolio"
                href={personal.portfolio}
              />
            )}
          </div>
        </header>

        {/* ======================================
            EXPERIENCE
        ====================================== */}

        {resume.experience?.length > 0 && (
          <Section title="Experience" icon={BriefcaseBusiness}>
            <div className="space-y-5">
              {resume.experience.map((item, index) => (
                <div key={item._id || index}>
                  <div className="flex items-start justify-between gap-5">
                    <div>
                      <h3 className="text-[14px] font-bold text-slate-950">
                        {item.role}
                      </h3>

                      {item.company && (
                        <p className="text-[12px] font-medium text-slate-600 mt-0.5">
                          {item.company}
                        </p>
                      )}
                    </div>

                    {(item.startDate || item.endDate) && (
                      <DateBadge>
                        {formatMonth(item.startDate)}

                        {item.startDate && item.endDate ? " – " : ""}

                        {formatMonth(item.endDate)}
                      </DateBadge>
                    )}
                  </div>

                  {item.description && <Description text={item.description} />}
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* ======================================
            PROJECTS
        ====================================== */}

        {resume.projects?.length > 0 && (
          <Section title="Projects" icon={FolderGit2}>
            <div className="space-y-5">
              {resume.projects.map((project, index) => (
                <div key={project._id || index}>
                  <div className="flex items-start justify-between gap-5">
                    <h3 className="text-[14px] font-bold text-slate-950">
                      {project.title}
                    </h3>

                    <div className="flex items-center gap-3 text-[10px] font-semibold shrink-0">
                      {project.projectLink && (
                        <ResumeLink href={project.projectLink}>
                          Live Project
                        </ResumeLink>
                      )}

                      {project.githubLink && (
                        <ResumeLink href={project.githubLink}>
                          GitHub
                        </ResumeLink>
                      )}
                    </div>
                  </div>

                  {project.description && (
                    <Description text={project.description} />
                  )}

                  {project.technologies?.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mr-1">
                        Technologies
                      </span>

                      {project.technologies.map((technology, techIndex) => (
                        <span
                          key={`${technology}-${techIndex}`}
                          className="text-[9.5px] bg-slate-100 border border-slate-200 text-slate-700 px-2 py-1 rounded"
                        >
                          {technology}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* ======================================
            TECHNICAL SKILLS
        ====================================== */}

        {resume.skills?.length > 0 && (
          <Section title="Technical Skills" icon={Code2}>
            <div className="flex flex-wrap gap-2">
              {resume.skills.map((skill, index) => (
                <span
                  key={`${skill}-${index}`}
                  className="px-3 py-1.5 rounded-md bg-slate-50 border border-slate-200 text-[10.5px] font-semibold text-slate-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </Section>
        )}

        {/* ======================================
            EDUCATION
        ====================================== */}

        {resume.education?.length > 0 && (
          <Section title="Education" icon={GraduationCap}>
            <div className="space-y-4">
              {resume.education.map((item, index) => (
                <div
                  key={item._id || index}
                  className="flex items-start justify-between gap-6"
                >
                  <div>
                    <h3 className="text-[14px] font-bold text-slate-950">
                      {item.degree}

                      {item.fieldOfStudy && ` in ${item.fieldOfStudy}`}
                    </h3>

                    {item.institution && (
                      <p className="text-[12px] text-slate-600 mt-1">
                        {item.institution}
                      </p>
                    )}

                    {item.grade && (
                      <p className="text-[10.5px] text-slate-500 mt-1">
                        CGPA / Grade:{" "}
                        <span className="font-semibold text-slate-700">
                          {item.grade}
                        </span>
                      </p>
                    )}
                  </div>

                  {(item.startYear || item.endYear) && (
                    <DateBadge>
                      {item.startYear}

                      {item.startYear && item.endYear ? " – " : ""}

                      {item.endYear}
                    </DateBadge>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* ======================================
            CERTIFICATIONS
        ====================================== */}

        {resume.certifications?.length > 0 && (
          <Section title="Certifications" icon={Award}>
            <div className="space-y-4">
              {resume.certifications.map((item, index) => (
                <div
                  key={item._id || index}
                  className="flex items-start justify-between gap-6"
                >
                  <div>
                    <h3 className="text-[13px] font-bold text-slate-900">
                      {item.name}
                    </h3>

                    {item.issuer && (
                      <p className="text-[10.5px] text-slate-500 mt-1">
                        Issued by {item.issuer}
                      </p>
                    )}
                  </div>

                  <div className="text-right shrink-0">
                    {item.date && (
                      <p className="text-[10px] text-slate-500">
                        {formatMonth(item.date)}
                      </p>
                    )}

                    {item.credentialLink && (
                      <a
                        href={item.credentialLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-700 hover:underline mt-1"
                      >
                        Credential
                        <ExternalLink size={9} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* ======================================
            ACHIEVEMENTS
        ====================================== */}

        {resume.achievements?.length > 0 && (
          <Section title="Achievements" icon={Trophy}>
            <ul className="space-y-2.5">
              {resume.achievements.map((achievement, index) => (
                <li
                  key={`${achievement}-${index}`}
                  className="flex items-start gap-2.5 text-[11.5px] text-slate-700 leading-5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-900 mt-[7px] shrink-0" />

                  <span>{achievement}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}
      </main>
    </div>
  );
}

// ==========================================
// SECTION COMPONENT
// ==========================================

function Section({ title, icon: Icon, children }) {
  return (
    <section className="mt-6">
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-7 h-7 rounded-md bg-slate-900 text-white flex items-center justify-center shrink-0">
          <Icon size={14} />
        </div>

        <h2 className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-slate-900 whitespace-nowrap">
          {title}
        </h2>

        <div className="h-px bg-slate-300 flex-1" />
      </div>

      {children}
    </section>
  );
}

// ==========================================
// CONTACT COMPONENT
// ==========================================

function Contact({ icon: Icon, text, href }) {
  const content = (
    <>
      <Icon size={11} className="text-slate-500 shrink-0" />

      <span>{text}</span>
    </>
  );

  if (href) {
    const external = href.startsWith("http");

    return (
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
        className="inline-flex items-center gap-1.5 hover:text-slate-950 hover:underline"
      >
        {content}
      </a>
    );
  }

  return <div className="inline-flex items-center gap-1.5">{content}</div>;
}

// ==========================================
// DATE BADGE
// ==========================================

function DateBadge({ children }) {
  return (
    <span className="shrink-0 bg-slate-100 border border-slate-200 text-slate-600 px-2.5 py-1 rounded-md text-[9.5px] font-medium">
      {children}
    </span>
  );
}

// ==========================================
// DESCRIPTION
// ==========================================

function Description({ text }) {
  return (
    <p className="text-[11px] text-slate-600 leading-[1.65] mt-2 whitespace-pre-line">
      {text}
    </p>
  );
}

// ==========================================
// PROJECT LINK
// ==========================================

function ResumeLink({ href, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-950 hover:underline"
    >
      {children}

      <ExternalLink size={9} />
    </a>
  );
}

// ==========================================
// GET INITIALS
// ==========================================

function getInitials(name = "") {
  if (!name.trim()) {
    return "CV";
  }

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();
}

// ==========================================
// FORMAT MONTH
// ==========================================

function formatMonth(value) {
  if (!value) {
    return "";
  }

  const [year, month] = value.split("-");

  if (!year || !month) {
    return value;
  }

  const date = new Date(Number(year), Number(month) - 1, 1);

  return date.toLocaleDateString("en-IN", {
    month: "short",
    year: "numeric",
  });
}

export default ResumePreview;
