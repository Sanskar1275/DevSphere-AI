import { useState } from "react";

import { Copy, Check, RefreshCw } from "lucide-react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import AIAvatar from "./AIAvatar";
import UserAvatar from "./UserAvatar";
import CodeBlock from "./CodeBlock";

function MessageBubble({
  message,
  isLatestAIMessage = false,
  onRegenerate,
  isLoading = false,
}) {
  const isUser = message.sender === "user";

  const [copied, setCopied] = useState(false);

  // =========================================
  // COPY COMPLETE AI RESPONSE
  // =========================================

  const handleCopyResponse = async () => {
    try {
      await navigator.clipboard.writeText(message.text);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy response:", error);
    }
  };

  return (
    <div
      className={`flex gap-3 mb-6 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {/* =====================================
          AI AVATAR
      ===================================== */}

      {!isUser && <AIAvatar />}

      {/* =====================================
          MESSAGE CONTAINER
      ===================================== */}

      <div
        className={`max-w-[90%] md:max-w-[80%] lg:max-w-[75%] ${
          isUser ? "" : "min-w-0"
        }`}
      >
        {/* ===================================
            MESSAGE BUBBLE
        =================================== */}

        <div
          className={`rounded-2xl px-4 py-3 text-[15px] overflow-hidden ${
            isUser
              ? "bg-cyan-500 text-white"
              : "bg-slate-800 border border-slate-700 text-slate-100"
          }`}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              // =================================
              // PARAGRAPH
              // =================================

              p({ children }) {
                return <p className="mb-3 last:mb-0 leading-7">{children}</p>;
              },

              // =================================
              // HEADINGS
              // =================================

              h1({ children }) {
                return (
                  <h1 className="text-2xl font-bold mt-5 mb-3 text-white">
                    {children}
                  </h1>
                );
              },

              h2({ children }) {
                return (
                  <h2 className="text-xl font-bold mt-5 mb-3 text-white">
                    {children}
                  </h2>
                );
              },

              h3({ children }) {
                return (
                  <h3 className="text-lg font-semibold mt-4 mb-2 text-white">
                    {children}
                  </h3>
                );
              },

              // =================================
              // LISTS
              // =================================

              ul({ children }) {
                return (
                  <ul className="list-disc ml-6 mb-4 space-y-1.5">
                    {children}
                  </ul>
                );
              },

              ol({ children }) {
                return (
                  <ol className="list-decimal ml-6 mb-4 space-y-1.5">
                    {children}
                  </ol>
                );
              },

              li({ children }) {
                return <li className="leading-7 pl-1">{children}</li>;
              },

              // =================================
              // BOLD
              // =================================

              strong({ children }) {
                return (
                  <strong className="font-bold text-white">{children}</strong>
                );
              },

              // =================================
              // BLOCKQUOTE
              // =================================

              blockquote({ children }) {
                return (
                  <blockquote className="border-l-4 border-cyan-400 bg-slate-900/50 pl-4 pr-4 py-2 my-4 text-slate-300 rounded-r-lg">
                    {children}
                  </blockquote>
                );
              },

              // =================================
              // LINKS
              // =================================

              a({ href, children }) {
                return (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 underline underline-offset-2 hover:text-cyan-300"
                  >
                    {children}
                  </a>
                );
              },

              // =================================
              // HORIZONTAL RULE
              // =================================

              hr() {
                return <hr className="border-slate-700 my-5" />;
              },

              // =================================
              // TABLE
              // =================================

              table({ children }) {
                return (
                  <div className="overflow-x-auto my-5 rounded-xl border border-slate-700">
                    <table className="w-full border-collapse text-sm">
                      {children}
                    </table>
                  </div>
                );
              },

              thead({ children }) {
                return <thead className="bg-slate-900">{children}</thead>;
              },

              tbody({ children }) {
                return (
                  <tbody className="divide-y divide-slate-700">
                    {children}
                  </tbody>
                );
              },

              tr({ children }) {
                return (
                  <tr className="hover:bg-slate-700/30 transition">
                    {children}
                  </tr>
                );
              },

              th({ children }) {
                return (
                  <th className="text-left px-4 py-3 font-semibold text-cyan-300 border-r last:border-r-0 border-slate-700">
                    {children}
                  </th>
                );
              },

              td({ children }) {
                return (
                  <td className="px-4 py-3 text-slate-300 border-r last:border-r-0 border-slate-700 align-top">
                    {children}
                  </td>
                );
              },

              // =================================
              // CODE
              // =================================

              code({ className, children, ...props }) {
                const match = /language-([\w-]+)/.exec(className || "");

                // Fenced Code Block
                if (match) {
                  return <CodeBlock language={match[1]}>{children}</CodeBlock>;
                }

                // Inline Code
                return (
                  <code
                    className="bg-slate-950 text-cyan-300 px-1.5 py-0.5 rounded-md text-sm font-mono"
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

        {/* =====================================
            AI RESPONSE ACTIONS
        ===================================== */}

        {!isUser && (
          <div className="flex items-center gap-1 mt-2 px-1">
            {/* Copy Complete Response */}

            <button
              type="button"
              onClick={handleCopyResponse}
              className="flex items-center gap-1.5 px-2 py-1 text-xs text-slate-500 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition"
              title="Copy response"
            >
              {copied ? (
                <>
                  <Check size={14} className="text-green-400" />

                  <span className="text-green-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy size={14} />

                  <span>Copy response</span>
                </>
              )}
            </button>

            {/* Regenerate */}

            {isLatestAIMessage && onRegenerate && (
              <button
                type="button"
                onClick={onRegenerate}
                disabled={isLoading}
                className="flex items-center gap-1.5 px-2 py-1 text-xs text-slate-500 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                title="Regenerate response"
              >
                <RefreshCw
                  size={14}
                  className={isLoading ? "animate-spin" : ""}
                />

                <span>Regenerate</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* =====================================
          USER AVATAR
      ===================================== */}

      {isUser && <UserAvatar />}
    </div>
  );
}

export default MessageBubble;
