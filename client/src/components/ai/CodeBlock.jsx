import { useState } from "react";

import { Copy, Check } from "lucide-react";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

function CodeBlock({ language = "text", children }) {
  const [copied, setCopied] = useState(false);

  // Convert React children into plain code text
  const code = String(children).replace(/\n$/, "");

  // =========================================
  // COPY CODE
  // =========================================

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy code:", error);
    }
  };

  return (
    <div className="my-4 rounded-xl overflow-hidden border border-slate-700 bg-slate-950">
      {/* =====================================
          CODE HEADER
      ===================================== */}

      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-700">
        <span className="text-xs font-medium text-slate-400 uppercase">
          {language}
        </span>

        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"
        >
          {copied ? (
            <>
              <Check size={14} className="text-green-400" />

              <span className="text-green-400">Copied</span>
            </>
          ) : (
            <>
              <Copy size={14} />

              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* =====================================
          SYNTAX HIGHLIGHTED CODE
      ===================================== */}

      <div className="overflow-x-auto">
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: "1.25rem",
            background: "transparent",
            fontSize: "14px",
            lineHeight: "1.7",
          }}
          codeTagProps={{
            style: {
              fontFamily: '"Fira Code", "Cascadia Code", Consolas, monospace',
            },
          }}
          wrapLongLines={false}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

export default CodeBlock;
