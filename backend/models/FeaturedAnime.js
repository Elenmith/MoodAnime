const mongoose = require("mongoose");

const FeaturedAnimeSchema = new mongoose.Schema({
  anime: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Anime",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("FeaturedAnime", FeaturedAnimeSchema);
