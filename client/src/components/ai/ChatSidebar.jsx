import {
  MessageSquarePlus,
  MessageCircle,
  Bot,
  X,
  Trash2,
  Pencil,
} from "lucide-react";

function ChatSidebar({
  conversations,
  activeConversationId,
  onNewChat,
  onSelectConversation,
  onRenameConversation,
  onDeleteConversation,
  mobile = false,
  onClose,
}) {
  return (
    <aside
      className={`w-full h-full shrink-0 bg-slate-900 border border-slate-800 rounded-2xl p-4 flex-col ${
        mobile ? "flex" : "hidden md:flex md:w-64"
      }`}
    >
      {/* Mobile Close Button */}
      {mobile && (
        <div className="flex justify-end mb-3">
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
            title="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>
      )}

      {/* Logo */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-cyan-500 flex items-center justify-center">
          <Bot size={22} className="text-white" />
        </div>

        <div className="min-w-0">
          <h2 className="font-bold text-white">DevSphere AI</h2>

          <p className="text-xs text-slate-400">Coding Mentor</p>
        </div>
      </div>

      {/* New Chat Button */}
      <button
        onClick={onNewChat}
        className="w-full flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-3 rounded-xl font-medium transition mb-6"
      >
        <MessageSquarePlus size={18} />
        New Chat
      </button>

      {/* Recent Chats Title */}
      <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-3 px-2">
        Recent Chats
      </p>

      {/* Conversations */}
      <div className="flex-1 space-y-2 overflow-y-auto">
        {conversations.length === 0 ? (
          <p className="text-sm text-slate-500 px-2">No conversations yet.</p>
        ) : (
          conversations.map((conversation) => (
            <div
              key={conversation._id}
              className={`group flex items-center rounded-xl transition ${
                activeConversationId === conversation._id
                  ? "bg-slate-700"
                  : "hover:bg-slate-800"
              }`}
            >
              {/* Select Conversation */}
              <button
                onClick={() => onSelectConversation(conversation._id)}
                className={`flex-1 min-w-0 flex items-center gap-3 px-3 py-3 text-left ${
                  activeConversationId === conversation._id
                    ? "text-white"
                    : "text-slate-400 group-hover:text-white"
                }`}
              >
                <MessageCircle size={17} className="shrink-0" />

                <span className="truncate text-sm">{conversation.title}</span>
              </button>

              {/* Rename Conversation */}
              <button
                onClick={(e) => {
                  e.stopPropagation();

                  if (onRenameConversation) {
                    onRenameConversation(conversation._id, conversation.title);
                  }
                }}
                className="shrink-0 p-2 text-slate-500 hover:text-cyan-400 hover:bg-slate-700 rounded-lg transition"
                title="Rename conversation"
              >
                <Pencil size={15} />
              </button>

              {/* Delete Conversation */}
              <button
                onClick={(e) => {
                  e.stopPropagation();

                  if (onDeleteConversation) {
                    onDeleteConversation(conversation._id);
                  }
                }}
                className="shrink-0 p-2 mr-1 text-slate-500 hover:text-red-400 hover:bg-slate-700 rounded-lg transition"
                title="Delete conversation"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}

export default ChatSidebar;
