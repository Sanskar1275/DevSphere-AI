import { useEffect, useState } from "react";
import { X, Pencil } from "lucide-react";

function RenameConversationModal({
  isOpen,
  currentTitle,
  onClose,
  onRename,
}) {
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (isOpen) {
      setTitle(currentTitle || "");
    }
  }, [isOpen, currentTitle]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) return;

    onRename(trimmedTitle);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">

      {/* Dark Overlay */}
      <div
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-500/10 text-cyan-400 rounded-xl flex items-center justify-center">
              <Pencil size={20} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white">
                Rename Conversation
              </h2>

              <p className="text-sm text-slate-400">
                Give this chat a new title.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Rename Form */}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
            maxLength={60}
            placeholder="Conversation title"
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-400"
          />

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!title.trim()}
              className="px-4 py-2.5 rounded-xl bg-cyan-500 text-white font-medium hover:bg-cyan-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Rename
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

export default RenameConversationModal;