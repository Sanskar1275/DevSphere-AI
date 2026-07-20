import { Bot } from "lucide-react";

function TypingIndicator() {
  return (
    <div className="flex items-center gap-3 my-4">
      <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center shrink-0">
        <Bot size={18} className="text-white" />
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400">
            DevSphere AI is thinking
          </span>

          <div className="flex gap-1">
            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />

            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:150ms]" />

            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:300ms]" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TypingIndicator;