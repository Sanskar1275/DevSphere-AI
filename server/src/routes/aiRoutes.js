const express = require("express");

const router = express.Router();

const {
  chatWithAI,
  regenerateAIResponse,
} = require("../controllers/aiController");

// NORMAL AI CHAT
router.post(
  "/chat",
  chatWithAI
);

// REGENERATE LATEST AI RESPONSE
router.post(
  "/regenerate",
  regenerateAIResponse
);

module.exports = router;