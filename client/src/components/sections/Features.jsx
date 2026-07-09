import FeatureCard from "../common/FeatureCard";

const features = [
  {
    title: "AI Resume Review",
    description: "Improve your resume using AI-powered suggestions.",
    icon: "🤖",
  },
  {
    title: "Coding Practice",
    description: "Practice DSA and Full Stack interview questions.",
    icon: "💻",
  },
  {
    title: "Job Portal",
    description: "Apply directly to internships and jobs.",
    icon: "🎯",
  },
  {
    title: "Learning Paths",
    description: "Structured roadmaps for MERN, AI, and DSA.",
    icon: "📚",
  },
];

function Features() {
  return (
    <section className="bg-slate-950 py-24">

      <div className="max-w-7xl mx-auto px-6">

        <h1 className="text-5xl font-bold text-center text-white">
          Why Choose
          <span className="text-cyan-400"> DevSphere AI?</span>
        </h1>

        <p className="text-slate-400 text-center mt-5 max-w-2xl mx-auto">
          Everything you need to become an industry-ready software engineer.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">

          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
            />
          ))}

        </div>

      </div>

    </section>
  );
}

export default Features;