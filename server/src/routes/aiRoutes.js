const express = require("express");

const router = express.Router();

const {
  chatWithAI,
  regenerateAIResponse,
} = require("../controllers/aiController");

const protect = require("../middlewares/authMiddleware");

router.post("/chat", protect, chatWithAI);

router.post("/regenerate", protect, regenerateAIResponse);

module.exports = router;
