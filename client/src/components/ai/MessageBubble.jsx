import { useState } from "react";
import {
  Copy,
  Check,
  RefreshCw,
} from "lucide-react";

import AIAvatar from "./AIAvatar";
import UserAvatar from "./UserAvatar";
import CodeBlock from "./CodeBlock";

import ReactMarkdown from "react-markdown";

function MessageBubble({
  message,
  isLatestAIMessage = false,
  onRegenerate,
  isLoading = false,
}) {
  const isUser = message.sender === "user";

  const [copied, setCopied] =
    useState(false);

  // Copy complete AI response
  const handleCopyResponse = async () => {
    try {
      await navigator.clipboard.writeText(
        message.text
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error(
        "Failed to copy response:",
        error
      );
    }
  };

  return (
    <div
      className={`flex gap-3 mb-5 ${
        isUser
          ? "justify-end"
          : "justify-start"
      }`}
    >
      {/* AI Avatar */}
      {!isUser && <AIAvatar />}

      {/* Message Container */}
      <div
        className={`max-w-[85%] md:max-w-[75%] ${
          isUser ? "" : "min-w-0"
        }`}
      >
        {/* Message Bubble */}
        <div
          className={`rounded-2xl px-4 py-3 text-[15px] overflow-hidden ${
            isUser
              ? "bg-cyan-500 text-white"
              : "bg-slate-800 border border-slate-700 text-slate-100"
          }`}
        >
          <ReactMarkdown
            components={{
              // Paragraph
              p({ children }) {
                return (
                  <p className="mb-3 last:mb-0 leading-7">
                    {children}
                  </p>
                );
              },

              // Heading 1
              h1({ children }) {
                return (
                  <h1 className="text-2xl font-bold mt-4 mb-3">
                    {children}
                  </h1>
                );
              },

              // Heading 2
              h2({ children }) {
                return (
                  <h2 className="text-xl font-bold mt-4 mb-3">
                    {children}
                  </h2>
                );
              },

              // Heading 3
              h3({ children }) {
                return (
                  <h3 className="text-lg font-semibold mt-3 mb-2">
                    {children}
                  </h3>
                );
              },

              // Unordered List
              ul({ children }) {
                return (
                  <ul className="list-disc ml-6 mb-3 space-y-1">
                    {children}
                  </ul>
                );
              },

              // Ordered List
              ol({ children }) {
                return (
                  <ol className="list-decimal ml-6 mb-3 space-y-1">
                    {children}
                  </ol>
                );
              },

              // List Item
              li({ children }) {
                return (
                  <li className="leading-7">
                    {children}
                  </li>
                );
              },

              // Blockquote
              blockquote({ children }) {
                return (
                  <blockquote className="border-l-4 border-cyan-400 pl-4 my-3 text-slate-300 italic">
                    {children}
                  </blockquote>
                );
              },

              // Links
              a({ href, children }) {
                return (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 underline hover:text-cyan-300"
                  >
                    {children}
                  </a>
                );
              },

              // Code
              code({
                className,
                children,
                ...props
              }) {
                const match =
                  /language-(\w+)/.exec(
                    className || ""
                  );

                // Code Block
                if (match) {
                  return (
                    <CodeBlock
                      language={match[1]}
                    >
                      {children}
                    </CodeBlock>
                  );
                }

                // Inline Code
                return (
                  <code
                    className="bg-slate-950 text-cyan-300 px-1.5 py-0.5 rounded text-sm"
                    {...props}
                  >
                    {children}
                  </code>
                );
              },
            }}
          >
            {message.text}
          </ReactMarkdown>
        </div>

        {/* AI Response Actions */}
        {!isUser && (
          <div className="flex items-center gap-1 mt-2 px-1">

            {/* Copy Response */}
            <button
              onClick={
                handleCopyResponse
              }
              className="flex items-center gap-1.5 px-2 py-1 text-xs text-slate-500 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition"
              title="Copy response"
            >
              {copied ? (
                <>
                  <Check
                    size={14}
                    className="text-green-400"
                  />

                  <span className="text-green-400">
                    Copied
                  </span>
                </>
              ) : (
                <>
                  <Copy size={14} />

                  <span>
                    Copy response
                  </span>
                </>
              )}
            </button>

            {/* Regenerate Response */}
            {isLatestAIMessage &&
              onRegenerate && (
                <button
                  onClick={
                    onRegenerate
                  }
                  disabled={isLoading}
                  className="flex items-center gap-1.5 px-2 py-1 text-xs text-slate-500 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Regenerate response"
                >
                  <RefreshCw
                    size={14}
                    className={
                      isLoading
                        ? "animate-spin"
                        : ""
                    }
                  />

                  <span>
                    Regenerate
                  </span>
                </button>
              )}

          </div>
        )}
      </div>

      {/* User Avatar */}
      {isUser && <UserAvatar />}
    </div>
  );
}

export default MessageBubble;