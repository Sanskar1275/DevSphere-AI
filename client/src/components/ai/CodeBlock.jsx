import { useState } from "react";
import { Check, Copy } from "lucide-react";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

function CodeBlock({
  language,
  children,
}) {
  const [copied, setCopied] = useState(false);

  const code = String(children).replace(
    /\n$/,
    ""
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        code
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error(
        "Failed to copy code:",
        error
      );
    }
  };

  return (
    <div className="my-4 rounded-xl overflow-hidden border border-slate-700 bg-slate-950">

      {/* Code Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-700">

        <span className="text-xs text-slate-400">
          {language || "code"}
        </span>

        <button
          onClick={handleCopy}
          className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition"
        >
          {copied ? (
            <>
              <Check size={14} />
              Copied
            </>
          ) : (
            <>
              <Copy size={14} />
              Copy
            </>
          )}
        </button>

      </div>

      {/* Code */}
      <SyntaxHighlighter
        style={atomDark}
        language={language || "text"}
        PreTag="div"
        customStyle={{
          margin: 0,
          borderRadius: 0,
          fontSize: "14px",
        }}
      >
        {code}
      </SyntaxHighlighter>

    </div>
  );
}

export default CodeBlock;