const express = require("express");
const router = express.Router();

// Lista nastrojów
const moods = [
  "happy",
  "sad",
  "epic",
  "dark",
  "relaxing",
  "romantic",
  "motivational",
  "adventurous",
  "excited",
  "cheerful",
  "optimistic",
  "relaxed",
  "playful",
  "joyful",
  "lonely",
  "melancholic",
  "anxious",
  "angry",
  "frustrated",
  "heartbroken",
  "depressed",
  "envious",
  "irritated",
  "thoughtful",
  "calm",
  "reflective",
  "peaceful",
  "focused",
  "serious",
  "motivated",
  "energic",
  "aggressive",
  "spontaneous",
  "tense",
  "dramatic",
  "suspenseful",
  "magical",
  "inspirational",
  "whimisical",
  "dreamy",
  "mythical",
  "surreal",
  "uplifting",
];

// Endpoint: Pobierz listę nastrojów
router.get("/", (req, res) => {
  res.json(moods);
});

module.exports = router;
