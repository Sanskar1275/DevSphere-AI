import { useState } from "react";
import { Send } from "lucide-react";

function ChatInput({ onSend, isLoading }) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    // Prevent empty messages and duplicate sends
    if (!message.trim() || isLoading) return;

    onSend(message);

    setMessage("");
  };

  return (
    <div className="flex gap-3">
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !isLoading) {
            handleSend();
          }
        }}
        disabled={isLoading}
        placeholder={
          isLoading
            ? "DevSphere AI is thinking..."
            : "Ask DevSphere AI anything..."
        }
        className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-5 h-14 outline-none focus:border-cyan-400 disabled:opacity-60 disabled:cursor-not-allowed"
      />

      <button
        onClick={handleSend}
        disabled={isLoading}
        className="bg-cyan-500 hover:bg-cyan-600 w-14 rounded-xl flex items-center justify-center transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-cyan-500"
      >
        <Send size={20} />
      </button>
    </div>
  );
}

export default ChatInput;
