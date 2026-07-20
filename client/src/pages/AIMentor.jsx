import { useEffect, useState } from "react";
import { Menu } from "lucide-react";

import {
  chatWithAI,
  regenerateAIResponse,
} from "../services/aiService";

import {
  createConversation,
  getConversations,
  renameConversation,
  deleteConversation,
} from "../services/conversationService";

import { getMessages } from "../services/messageService";
import { useAuth } from "../hooks/useAuth";

import ChatSidebar from "../components/ai/ChatSidebar";
import PromptCard from "../components/ai/PromptCard";
import ChatWindow from "../components/ai/ChatWindow";
import ChatInput from "../components/ai/ChatInput";
import ChatHeader from "../components/ai/ChatHeader";
import RenameConversationModal from "../components/ai/RenameConversationModal";
import DeleteConversationModal from "../components/ai/DeleteConversationModal";

function AIMentor() {
  const { user } = useAuth();

  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Rename modal state
  const [renameModal, setRenameModal] = useState({
    isOpen: false,
    conversationId: null,
    currentTitle: "",
  });

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    conversationId: null,
  });

  // =========================
  // LOAD CONVERSATIONS
  // =========================

  useEffect(() => {
    const loadConversations = async () => {
      if (!user?.id) return;

      try {
        const data = await getConversations(
          user.id
        );

        setConversations(data);
      } catch (error) {
        console.error(
          "Failed to load conversations:",
          error
        );
      }
    };

    loadConversations();
  }, [user?.id]);

  // =========================
  // NEW CHAT
  // =========================

  const handleNewChat = () => {
    setConversationId(null);
    setMessages([]);
  };

  // =========================
  // SELECT CONVERSATION
  // =========================

  const handleSelectConversation = async (
    id
  ) => {
    try {
      setConversationId(id);

      const savedMessages =
        await getMessages(id);

      setMessages(savedMessages);
    } catch (error) {
      console.error(
        "Failed to load messages:",
        error
      );

      setMessages([]);
    }
  };

  // =========================
  // RENAME CONVERSATION
  // =========================

  const handleRenameConversation = (
    id,
    currentTitle
  ) => {
    setRenameModal({
      isOpen: true,
      conversationId: id,
      currentTitle,
    });
  };

  const handleCloseRenameModal = () => {
    setRenameModal({
      isOpen: false,
      conversationId: null,
      currentTitle: "",
    });
  };

  const handleRenameSubmit = async (
    newTitle
  ) => {
    const trimmedTitle =
      newTitle.trim();

    if (!trimmedTitle) return;

    if (
      trimmedTitle ===
      renameModal.currentTitle
    ) {
      handleCloseRenameModal();
      return;
    }

    try {
      const updatedConversation =
        await renameConversation(
          renameModal.conversationId,
          trimmedTitle
        );

      setConversations((prev) =>
        prev.map((conversation) =>
          conversation._id ===
          renameModal.conversationId
            ? updatedConversation
            : conversation
        )
      );

      handleCloseRenameModal();
    } catch (error) {
      console.error(
        "Failed to rename conversation:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to rename conversation."
      );
    }
  };

  // =========================
  // DELETE CONVERSATION
  // =========================

  const handleDeleteConversation = (
    id
  ) => {
    setDeleteModal({
      isOpen: true,
      conversationId: id,
    });
  };

  const handleCloseDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      conversationId: null,
    });
  };

  const handleDeleteConfirm =
    async () => {
      const id =
        deleteModal.conversationId;

      if (!id) return;

      try {
        await deleteConversation(id);

        setConversations((prev) =>
          prev.filter(
            (conversation) =>
              conversation._id !== id
          )
        );

        if (
          conversationId === id
        ) {
          setConversationId(null);
          setMessages([]);
        }

        handleCloseDeleteModal();
      } catch (error) {
        console.error(
          "Failed to delete conversation:",
          error
        );

        alert(
          error.response?.data?.message ||
            "Failed to delete conversation."
        );
      }
    };

  // =========================
  // SEND MESSAGE
  // =========================

  const handleSend = async (text) => {
    if (
      !text.trim() ||
      !user?.id ||
      isLoading
    ) {
      return;
    }

    const userMessage = {
      sender: "user",
      text,
    };

    // Show user message immediately
    setMessages((prev) => [
      ...prev,
      userMessage,
    ]);

    setIsLoading(true);

    try {
      let currentConversationId =
        conversationId;

      // Create conversation on first message
      if (!currentConversationId) {
        const conversationTitle =
          text.length > 35
            ? `${text.slice(
                0,
                35
              )}...`
            : text;

        const newConversation =
          await createConversation(
            conversationTitle,
            user.id
          );

        currentConversationId =
          newConversation._id;

        setConversationId(
          currentConversationId
        );

        setConversations((prev) => [
          newConversation,
          ...prev,
        ]);
      }

      // Send message to AI
      const reply =
        await chatWithAI(
          text,
          currentConversationId
        );

      const aiMessage = {
        sender: "ai",
        text: reply,
      };

      setMessages((prev) => [
        ...prev,
        aiMessage,
      ]);
    } catch (error) {
      console.error(
        "AI Mentor Error:",
        error
      );

      const errorMessage =
        error.response?.data
          ?.message ||
        "Unable to connect to AI Mentor.";

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: `❌ ${errorMessage}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // =========================
  // REGENERATE AI RESPONSE
  // =========================

  const handleRegenerate = async () => {
    if (
      !conversationId ||
      isLoading
    ) {
      return;
    }

    setIsLoading(true);

    try {
      // Remove the latest AI message
      // from the UI while regenerating
      setMessages((prev) => {
        const updated = [...prev];

        for (
          let i =
            updated.length - 1;
          i >= 0;
          i--
        ) {
          if (
            updated[i].sender === "ai"
          ) {
            updated.splice(i, 1);
            break;
          }
        }

        return updated;
      });

      // Request regenerated response
      const reply =
        await regenerateAIResponse(
          conversationId
        );

      const regeneratedMessage = {
        sender: "ai",
        text: reply,
      };

      // Display regenerated response
      setMessages((prev) => [
        ...prev,
        regeneratedMessage,
      ]);
    } catch (error) {
      console.error(
        "Failed to regenerate response:",
        error
      );

      const errorMessage =
        error.response?.data
          ?.message ||
        "Failed to regenerate AI response.";

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: `❌ ${errorMessage}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">

      {/* Rename Conversation Modal */}
      <RenameConversationModal
        isOpen={
          renameModal.isOpen
        }
        currentTitle={
          renameModal.currentTitle
        }
        onClose={
          handleCloseRenameModal
        }
        onRename={
          handleRenameSubmit
        }
      />

      {/* Delete Conversation Modal */}
      <DeleteConversationModal
        isOpen={
          deleteModal.isOpen
        }
        onClose={
          handleCloseDeleteModal
        }
        onDelete={
          handleDeleteConfirm
        }
      />

      {/* Mobile Conversation Sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">

          {/* Dark Overlay */}
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() =>
              setIsSidebarOpen(
                false
              )
            }
          />

          {/* Mobile Sidebar */}
          <div className="absolute left-0 top-0 h-full w-72 p-4">
            <ChatSidebar
              mobile
              conversations={
                conversations
              }
              activeConversationId={
                conversationId
              }
              onClose={() =>
                setIsSidebarOpen(
                  false
                )
              }
              onNewChat={() => {
                handleNewChat();
                setIsSidebarOpen(
                  false
                );
              }}
              onSelectConversation={(
                id
              ) => {
                handleSelectConversation(
                  id
                );

                setIsSidebarOpen(
                  false
                );
              }}
              onRenameConversation={
                handleRenameConversation
              }
              onDeleteConversation={
                handleDeleteConversation
              }
            />
          </div>
        </div>
      )}

      <div className="flex gap-5 max-w-[1500px] mx-auto">

        {/* Desktop Conversation Sidebar */}
        <ChatSidebar
          conversations={
            conversations
          }
          activeConversationId={
            conversationId
          }
          onNewChat={
            handleNewChat
          }
          onSelectConversation={
            handleSelectConversation
          }
          onRenameConversation={
            handleRenameConversation
          }
          onDeleteConversation={
            handleDeleteConversation
          }
        />

        {/* Main AI Chat Area */}
        <main className="flex-1 min-w-0">

          {/* Mobile Menu Button */}
          <button
            onClick={() =>
              setIsSidebarOpen(
                true
              )
            }
            className="md:hidden mb-4 p-2 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 transition"
          >
            <Menu size={22} />
          </button>

          <ChatHeader />

          <PromptCard
            onPromptClick={
              handleSend
            }
            isLoading={
              isLoading
            }
          />

          <ChatWindow
            messages={
              messages
            }
            isLoading={
              isLoading
            }
            onRegenerate={
              handleRegenerate
            }
          />

          <ChatInput
            onSend={
              handleSend
            }
            isLoading={
              isLoading
            }
          />

        </main>
      </div>
    </div>
  );
}

export default AIMentor;