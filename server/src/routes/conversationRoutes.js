const express = require("express");

const router = express.Router();

const {
  createConversation,
  getConversations,
  updateConversationTitle,
  deleteConversation,
} = require("../controllers/conversationController");

// CREATE NEW CONVERSATION
router.post("/", createConversation);

// GET ALL CONVERSATIONS OF A USER
router.get("/:user", getConversations);

// UPDATE / RENAME CONVERSATION
router.patch("/:conversationId", updateConversationTitle);

// DELETE CONVERSATION
router.delete("/:conversationId", deleteConversation);

module.exports = router;