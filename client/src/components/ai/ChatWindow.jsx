import { useEffect, useRef } from "react";

import TypingIndicator from "./TypingIndicator";
import MessageBubble from "./MessageBubble";

function ChatWindow({
  messages,
  isLoading,
  onRegenerate,
}) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isLoading]);

  // Find the index of the latest AI message
  const lastAIMessageIndex = messages
    .map((message) => message.sender)
    .lastIndexOf("ai");

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 h-[520px] overflow-y-auto mb-4">

      {/* Empty Chat Welcome Screen */}
      {messages.length === 0 && !isLoading && (
        <div className="h-full flex flex-col items-center justify-center text-center px-4">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-5">
            <span className="text-3xl">
              🤖
            </span>
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">
            How can I help you today?
          </h2>

          <p className="text-slate-400 max-w-md leading-relaxed">
            Ask coding questions, debug errors,
            solve programming problems, or
            prepare for your next technical
            interview.
          </p>
        </div>
      )}

      {/* Chat Messages */}
      {messages.map((message, index) => (
        <MessageBubble
          key={index}
          message={message}
          isLatestAIMessage={
            message.sender === "ai" &&
            index === lastAIMessageIndex
          }
          onRegenerate={onRegenerate}
          isLoading={isLoading}
        />
      ))}

      {/* AI Typing Indicator */}
      {isLoading && <TypingIndicator />}

      {/* Auto Scroll Target */}
      <div ref={bottomRef}></div>
    </div>
  );
}

export default ChatWindow;