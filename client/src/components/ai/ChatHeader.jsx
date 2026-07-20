import { Bot, Sparkles } from "lucide-react";

function ChatHeader() {
  return (
    <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-xl px-5 py-3 mb-5">

      <div className="flex items-center gap-3">

        <div className="w-11 h-11 rounded-full bg-cyan-500 flex items-center justify-center">
          <Bot size={22} className="text-white" />
        </div>

        <div>
          <h2 className="text-xl font-bold">
            DevSphere AI
          </h2>

          <p className="text-sm text-slate-400">
            Your Personal Coding Mentor
          </p>
        </div>

      </div>

      <div className="flex items-center gap-2 bg-green-500/10 px-3 py-1 rounded-full text-green-400 text-sm">

        <Sparkles size={16} />

        Online

      </div>

    </div>
  );
}

export default ChatHeader;