import API from "./axios";

// GET ALL MESSAGES OF A CONVERSATION
export const getMessages = async (conversationId) => {
  const res = await API.get(`/messages/${conversationId}`);

  return res.data.messages;
};