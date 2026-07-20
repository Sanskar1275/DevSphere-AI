import API from "./axios";

// NORMAL AI CHAT
export const chatWithAI = async (
  message,
  conversationId
) => {
  const res = await API.post("/ai/chat", {
    message,
    conversationId,
  });

  return res.data.reply;
};

// REGENERATE LATEST AI RESPONSE
export const regenerateAIResponse = async (
  conversationId
) => {
  const res = await API.post(
    "/ai/regenerate",
    {
      conversationId,
    }
  );

  return res.data.reply;
};