const express = require("express");
const router = express.Router();

// Lista kategorii (statyczna)
const categories = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Fantasy",
  "Sci-Fi",
  "Slice of Life",
  "Sports",
  "Mystery",
  "Romance",
  "Thriller",
  "Supernatural",
  "Horror",
  "Historical",
  "Music",
  "Military",
  "Parody",
  "Psychological",
  "Martial Arts",
  "Mecha",
  "Shounen",
  "Seinen",
  "Josei",
  "Shoujo",
  "Kids",
];

// Endpoint: Pobierz listę kategorii
router.get("/", (req, res) => {
  res.json(categories);
});

module.exports = router;
