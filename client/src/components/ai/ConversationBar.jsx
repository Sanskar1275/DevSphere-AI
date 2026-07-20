import { MessageSquarePlus, MessageCircle } from "lucide-react";

function ConversationBar({
  conversations,
  activeConversationId,
  onNewChat,
  onSelectConversation,
}) {
  return (
    <div className="flex items-center gap-3 mb-5 overflow-x-auto pb-2">
      
      {/* New Chat Button */}
      <button
        onClick={onNewChat}
        className="flex items-center gap-2 shrink-0 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-xl font-medium transition"
      >
        <MessageSquarePlus size={18} />
        New Chat
      </button>

      {/* Previous Conversations */}
      {conversations.map((conversation) => (
        <button
          key={conversation._id}
          onClick={() => onSelectConversation(conversation._id)}
          className={`flex items-center gap-2 shrink-0 px-4 py-2 rounded-xl border transition ${
            activeConversationId === conversation._id
              ? "bg-slate-700 border-cyan-400 text-white"
              : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600"
          }`}
        >
          <MessageCircle size={17} />

          <span className="max-w-[180px] truncate">
            {conversation.title}
          </span>
        </button>
      ))}
    </div>
  );
}

export default ConversationBar;