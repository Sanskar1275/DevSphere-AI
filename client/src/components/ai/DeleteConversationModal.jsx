import { Trash2, X, AlertTriangle } from "lucide-react";

function DeleteConversationModal({
  isOpen,
  onClose,
  onDelete,
}) {
  if (!isOpen) return null;

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
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 shrink-0 bg-red-500/10 text-red-400 rounded-xl flex items-center justify-center">
              <AlertTriangle size={20} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white">
                Delete Conversation
              </h2>

              <p className="text-sm text-slate-400 mt-1">
                This conversation and all of its messages
                will be permanently deleted.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
            title="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Warning */}
        <div className="bg-red-500/5 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-300">
          This action cannot be undone.
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
          >
            Cancel
          </button>

          <button
            onClick={onDelete}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition"
          >
            <Trash2 size={17} />
            Delete
          </button>
        </div>

      </div>
    </div>
  );
}

export default DeleteConversationModal;