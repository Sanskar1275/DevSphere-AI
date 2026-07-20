const Message = require("../models/Message");

// CREATE / SAVE A NEW MESSAGE
const createMessage = async (req, res) => {
  try {
    const { conversation, sender, text } = req.body;

    if (!conversation || !sender || !text) {
      return res.status(400).json({
        success: false,
        message: "Conversation, sender and text are required",
      });
    }

    const message = await Message.create({
      conversation,
      sender,
      text,
    });

    res.status(201).json({
      success: true,
      message,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL MESSAGES OF A CONVERSATION
const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const messages = await Message.find({
      conversation: conversationId,
    }).sort({
      createdAt: 1,
    });

    res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createMessage,
  getMessages,
};