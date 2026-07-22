const axios = require("axios");
const Message = require("../models/Message");
const Conversation = require("../models/Conversation");

// ==========================================
// HELPER: GENERATE AI RESPONSE
// ==========================================

const generateAIResponse = async (conversationId) => {
  // Get conversation history
  const previousMessages = await Message.find({
    conversation: conversationId,
  })
    .sort({ createdAt: 1 })
    .limit(20);

  // Convert MongoDB messages into OpenRouter format
  const messages = previousMessages.map((message) => ({
    role: message.sender === "user" ? "user" : "assistant",
    content: message.text,
  }));

  // Add system instructions
  messages.unshift({
    role: "system",
    content: `
You are DevSphere AI, a personal coding mentor for students and developers.

Your job is to help users with:
- Programming
- Web development
- MERN stack
- Data structures and algorithms
- Debugging
- Interview preparation
- Software development concepts

Explain concepts clearly and practically.

When explaining code:
- Use simple language.
- Give examples when useful.
- Format code properly.
- Explain important parts of the code.

When debugging:
- Identify the likely cause.
- Explain why the error occurred.
- Provide a corrected solution.

Remember the context of the current conversation and use previous messages when answering follow-up questions.
    `.trim(),
  });

  const response = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: "openrouter/free",
      messages,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:5173",
        "X-Title": "DevSphere AI",
      },
    },
  );

  const reply = response.data?.choices?.[0]?.message?.content;

  if (!reply) {
    throw new Error("AI provider returned an empty response");
  }

  return reply;
};

// ==========================================
// NORMAL AI CHAT
// ==========================================

const chatWithAI = async (req, res) => {
  try {
    const { message, conversationId } = req.body;

    // Validate message
    if (!message?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    // Validate conversation ID
    if (!conversationId) {
      return res.status(400).json({
        success: false,
        message: "Conversation ID is required",
      });
    }

    // Make sure conversation exists
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    // If authentication middleware provides
    // req.user, prevent access to another
    // user's conversation.
    if (req.user?.id && conversation.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to access this conversation",
      });
    }

    // Save user message first
    await Message.create({
      conversation: conversationId,
      sender: "user",
      text: message.trim(),
    });

    // Generate response using conversation history
    const reply = await generateAIResponse(conversationId);

    // Save AI response
    await Message.create({
      conversation: conversationId,
      sender: "ai",
      text: reply,
    });

    // Update conversation timestamp
    conversation.updatedAt = new Date();

    await conversation.save();

    res.status(200).json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error("AI Chat Error:", error.response?.data || error.message);

    res.status(500).json({
      success: false,
      message:
        error.response?.data?.error?.message ||
        error.message ||
        "AI request failed",
    });
  }
};

// ==========================================
// REGENERATE AI RESPONSE
// ==========================================

const regenerateAIResponse = async (req, res) => {
  try {
    const { conversationId } = req.body;

    if (!conversationId) {
      return res.status(400).json({
        success: false,
        message: "Conversation ID is required",
      });
    }

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    if (req.user?.id && conversation.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to access this conversation",
      });
    }

    // Find latest user message
    const latestUserMessage = await Message.findOne({
      conversation: conversationId,
      sender: "user",
    }).sort({
      createdAt: -1,
    });

    if (!latestUserMessage) {
      return res.status(404).json({
        success: false,
        message: "No user message found to regenerate",
      });
    }

    // Find latest AI response
    const latestAIMessage = await Message.findOne({
      conversation: conversationId,
      sender: "ai",
    }).sort({
      createdAt: -1,
    });

    /*
      Temporarily remove the latest AI answer
      from the context so the model regenerates
      from the user's latest question instead
      of seeing its previous answer.
    */

    let oldAIText = null;

    if (latestAIMessage) {
      oldAIText = latestAIMessage.text;

      await latestAIMessage.deleteOne();
    }

    let reply;

    try {
      reply = await generateAIResponse(conversationId);
    } catch (error) {
      /*
        Restore the previous response if
        regeneration fails.
      */

      if (latestAIMessage && oldAIText) {
        await Message.create({
          conversation: conversationId,
          sender: "ai",
          text: oldAIText,
        });
      }

      throw error;
    }

    // Save regenerated response
    await Message.create({
      conversation: conversationId,
      sender: "ai",
      text: reply,
    });

    res.status(200).json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error(
      "AI Regenerate Error:",
      error.response?.data || error.message,
    );

    res.status(500).json({
      success: false,
      message:
        error.response?.data?.error?.message ||
        error.message ||
        "Failed to regenerate AI response",
    });
  }
};

module.exports = {
  chatWithAI,
  regenerateAIResponse,
};
