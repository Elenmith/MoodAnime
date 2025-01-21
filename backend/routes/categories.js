const express = require("express");
const router = express.Router();
const Anime = require("../models/Anime"); // Model Anime zdefiniowany w MongoDB

// Endpoint do obsługi żądań dla kategorii
router.get("/:genre", async (req, res) => {
  try {
    const { genre } = req.params;
    console.log(`Received request for genre: ${genre}`);

    // Szukanie w tablicy `genres` (dopasowanie ignorujące wielkość liter)
    const animeList = await Anime.find({
      genres: { $regex: new RegExp(`^${genre}$`, "i") }, // 'i' - ignorowanie wielkości liter
    });

    if (!animeList.length) {
      return res
        .status(404)
        .json({ message: `No anime found for genre: ${genre}` });
    }

    res.status(200).json(animeList);
  } catch (error) {
    console.error("Error fetching anime by genre:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
