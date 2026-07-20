const express = require("express");

const router = express.Router();

const {
  createMessage,
  getMessages,
} = require("../controllers/messageController");

// SAVE A NEW MESSAGE
router.post("/", createMessage);

// GET ALL MESSAGES OF A CONVERSATION
router.get("/:conversationId", getMessages);

module.exports = router;