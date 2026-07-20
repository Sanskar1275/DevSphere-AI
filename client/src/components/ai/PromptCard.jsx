function PromptCard({ onPromptClick, isLoading }) {
  const prompts = [
    "Explain React Hooks",
    "Solve a DSA Problem",
    "Debug my Node.js code",
    "Prepare me for Interview",
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
      {prompts.map((prompt) => (
        <button
          key={prompt}
          onClick={() => onPromptClick(prompt)}
          disabled={isLoading}
          className="bg-slate-900 border border-slate-800 rounded-xl h-16 text-sm hover:border-cyan-400 hover:-translate-y-1 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          {prompt}
        </button>
      ))}
    </div>
  );
}

export default PromptCard;