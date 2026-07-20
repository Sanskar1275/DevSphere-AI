const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

// CREATE NEW CONVERSATION
const createConversation = async (req, res) => {
  try {
    const { title, user } = req.body;

    const conversation = await Conversation.create({
      title,
      user,
    });

    res.status(201).json({
      success: true,
      conversation,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL CONVERSATIONS OF A USER
const getConversations = async (req, res) => {
  try {
    const { user } = req.params;

    const conversations = await Conversation.find({
      user,
    }).sort({
      updatedAt: -1,
    });

    res.status(200).json({
      success: true,
      conversations,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE / RENAME CONVERSATION
const updateConversationTitle = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { title } = req.body;

    // Validate title
    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Conversation title is required",
      });
    }

    // Find and update conversation
    const conversation = await Conversation.findByIdAndUpdate(
      conversationId,
      {
        title: title.trim(),
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Conversation renamed successfully",
      conversation,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE CONVERSATION
const deleteConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;

    // Check if conversation exists
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    // Delete all messages belonging to the conversation
    await Message.deleteMany({
      conversation: conversationId,
    });

    // Delete the conversation
    await Conversation.findByIdAndDelete(conversationId);

    res.status(200).json({
      success: true,
      message: "Conversation deleted successfully",
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
  createConversation,
  getConversations,
  updateConversationTitle,
  deleteConversation,
};
