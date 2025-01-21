const mongoose = require("mongoose");

const animeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  titleEnglish: { type: String },
  titleJapanese: { type: String },
  genres: [String],
  rating: { type: Number, default: 0 },
  imageUrl: { type: String },
  trailerImage: { type: String },
  duration: { type: String, default: "Unknown" },
  releaseDate: { type: String, default: "Unknown" },
  director: { type: String, default: "Unknown" },
  characters: [String],
  voiceCast: [String],
  synopsis: { type: String },
  gallery: [String],
  moods: [String],
});

module.exports = mongoose.model("Anime", animeSchema);
