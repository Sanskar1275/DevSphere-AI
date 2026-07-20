const axios = require("axios");
const Message = require("../models/Message");

// Helper function to call OpenRouter
const generateAIResponse = async (message) => {
  const response = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: "tencent/hy3:free",
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:5173",
        "X-Title": "DevSphere AI",
      },
    }
  );

  return response.data.choices[0].message.content;
};


// ================================
// NORMAL AI CHAT
// ================================

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

    // Save user message
    await Message.create({
      conversation: conversationId,
      sender: "user",
      text: message.trim(),
    });

    // Generate AI response
    const reply = await generateAIResponse(
      message.trim()
    );

    // Save AI response
    await Message.create({
      conversation: conversationId,
      sender: "ai",
      text: reply,
    });

    // Send response
    res.status(200).json({
      success: true,
      reply,
    });

  } catch (error) {
    console.error(
      "AI Chat Error:",
      error.response?.data || error.message
    );

    res.status(500).json({
      success: false,
      message:
        error.response?.data?.error?.message ||
        error.message ||
        "AI request failed",
    });
  }
};


// ================================
// REGENERATE AI RESPONSE
// ================================

const regenerateAIResponse = async (req, res) => {
  try {
    const { conversationId } = req.body;

    // Validate conversation ID
    if (!conversationId) {
      return res.status(400).json({
        success: false,
        message: "Conversation ID is required",
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

    // Generate a new AI response
    const reply = await generateAIResponse(
      latestUserMessage.text
    );

    if (latestAIMessage) {
      // Replace existing latest AI response
      latestAIMessage.text = reply;

      await latestAIMessage.save();
    } else {
      // Create AI response if one doesn't exist
      await Message.create({
        conversation: conversationId,
        sender: "ai",
        text: reply,
      });
    }

    // Send regenerated response
    res.status(200).json({
      success: true,
      reply,
    });

  } catch (error) {
    console.error(
      "AI Regenerate Error:",
      error.response?.data || error.message
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