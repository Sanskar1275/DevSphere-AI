import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  BrainCircuit,
  Clock3,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Lightbulb,
  CheckCircle2,
  Trophy,
  Sparkles,
} from "lucide-react";

import { getInterview } from "../services/interviewService";

const tips = [
  "Answer with real examples whenever possible.",
  "Explain your project contributions clearly.",
  "Mention technologies and tools you used.",
  "Keep your answers structured and concise.",
  "Stay confident and avoid one-line answers.",
];

const InterviewSession = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [interview, setInterview] = useState(null);

  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    fetchInterview();
  }, []);

  const fetchInterview = async () => {
    try {
      const res = await getInterview(id);

      setInterview(res.interview);

      setAnswers(res.interview.questions.map((q) => q.answer || ""));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (value) => {
    const updated = [...answers];
    updated[currentQuestion] = value;
    setAnswers(updated);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-5">
          <Loader2 size={55} className="animate-spin text-cyan-400" />

          <h2 className="text-white text-2xl font-bold">
            Preparing Your AI Interview...
          </h2>

          <p className="text-slate-400">Please wait a few seconds.</p>
        </div>
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="min-h-screen bg-slate-950 flex justify-center items-center">
        <div className="text-center">
          <BrainCircuit size={70} className="mx-auto text-red-400" />

          <h2 className="mt-6 text-3xl font-bold text-white">
            Interview Not Found
          </h2>

          <p className="mt-3 text-slate-400">
            Something went wrong while loading your interview.
          </p>

          <button
            onClick={() => navigate(-1)}
            className="mt-8 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const totalQuestions = interview.questions.length;

  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[750px] h-[750px] rounded-full bg-violet-500/10 blur-[160px]" />
        <div className="absolute bottom-0 right-0 w-[450px] h-[450px] rounded-full bg-cyan-500/10 blur-[130px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-8">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300">
              <BrainCircuit size={18} />
              AI Mock Interview
            </div>

            <h1 className="mt-5 text-4xl font-black">
              {interview.job?.title || "Technical Interview"}
            </h1>

            <p className="text-slate-400 mt-3 text-lg">
              Answer each question carefully to receive a detailed AI
              performance report.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl px-6 py-5 flex items-center gap-4">
            <Clock3 className="text-cyan-400" />
            <div>
              <p className="text-slate-400 text-sm">Estimated Time</p>
              <h3 className="font-bold text-xl">20 Minutes</h3>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-10 bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex justify-between mb-4">
            <div>
              <h2 className="font-bold text-lg">
                Question {currentQuestion + 1}
              </h2>
              <p className="text-slate-400">{totalQuestions} Total Questions</p>
            </div>

            <div className="text-right">
              <h2 className="font-bold text-cyan-400">
                {Math.round(progress)}%
              </h2>
              <p className="text-slate-400">Completed</p>
            </div>
          </div>

          <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-sky-500 to-violet-500 transition-all duration-700"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>

        {/* Main Layout */}
        <div className="grid lg:grid-cols-3 gap-8 mt-10">
          {/* Question Area - Corrected wrapper */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-8">
            {/* Question Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                  <Sparkles className="text-violet-400" size={22} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Interview Question</h2>
                  <p className="text-slate-400">
                    Answer thoughtfully and clearly.
                  </p>
                </div>
              </div>

              <div className="px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-semibold">
                {currentQuestion + 1} / {totalQuestions}
              </div>
            </div>

            {/* Question Card */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-7">
              <p className="text-xl md:text-2xl leading-10 font-medium text-slate-100">
                {interview.questions[currentQuestion]?.question}
              </p>
            </div>

            {/* Answer */}
            <div className="mt-8">
              <label className="block text-lg font-semibold mb-3">
                Your Answer
              </label>

              <textarea
                rows={10}
                value={answers[currentQuestion] || ""}
                onChange={(e) => handleAnswerChange(e.target.value)}
                placeholder="Write your answer here..."
                className="w-full bg-slate-950 border border-slate-700 rounded-2xl p-5 text-slate-200 placeholder:text-slate-500 resize-none focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/20 transition-all"
              />

              <div className="flex justify-between mt-3">
                <span className="text-slate-500 text-sm">
                  Give detailed answers for better AI evaluation.
                </span>
                <span className="text-slate-500 text-sm">
                  {answers[currentQuestion]?.length || 0} characters
                </span>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Tips */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <Lightbulb className="text-amber-400" />
                <h2 className="text-xl font-bold">AI Tips</h2>
              </div>

              <div className="space-y-4">
                {tips.map((tip, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2
                      size={18}
                      className="text-emerald-400 mt-1 shrink-0"
                    />
                    <p className="text-slate-300 leading-6">{tip}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Progress Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-5">
                <Trophy className="text-cyan-400" />
                <h2 className="text-xl font-bold">Interview Progress</h2>
              </div>

              <div className="space-y-5">
                <div>
                  <p className="text-slate-400 text-sm">Current Question</p>
                  <h3 className="text-3xl font-black">{currentQuestion + 1}</h3>
                </div>

                <div>
                  <p className="text-slate-400 text-sm">Remaining</p>
                  <h3 className="text-3xl font-black">
                    {totalQuestions - currentQuestion - 1}
                  </h3>
                </div>

                <div>
                  <p className="text-slate-400 text-sm">Completion</p>
                  <h3 className="text-3xl font-black text-cyan-400">
                    {Math.round(progress)}%
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            disabled={currentQuestion === 0}
            onClick={() => setCurrentQuestion((prev) => prev - 1)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={20} />
            Previous
          </button>

          {currentQuestion < totalQuestions - 1 ? (
            <button
              onClick={() => setCurrentQuestion((prev) => prev + 1)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-semibold hover:scale-105 transition-all duration-300"
            >
              Next Question
              <ChevronRight size={20} />
            </button>
          ) : (
            <button
              onClick={() =>
                alert(
                  "Interview submission will be implemented in the next step.",
                )
              }
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold hover:scale-105 transition-all duration-300"
            >
              <Trophy size={20} />
              Submit Interview
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewSession;
