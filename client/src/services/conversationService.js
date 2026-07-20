import API from "./axios";

// CREATE A NEW CONVERSATION
export const createConversation = async (title, userId) => {
  const res = await API.post("/conversations", {
    title,
    user: userId,
  });

  return res.data.conversation;
};

// GET ALL CONVERSATIONS OF A USER
export const getConversations = async (userId) => {
  const res = await API.get(`/conversations/${userId}`);

  return res.data.conversations;
};

// RENAME CONVERSATION
export const renameConversation = async (
  conversationId,
  title
) => {
  const res = await API.patch(
    `/conversations/${conversationId}`,
    {
      title,
    }
  );

  return res.data.conversation;
};

// DELETE CONVERSATION
export const deleteConversation = async (conversationId) => {
  const res = await API.delete(
    `/conversations/${conversationId}`
  );

  return res.data;
};