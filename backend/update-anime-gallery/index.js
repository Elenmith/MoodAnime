require("dotenv").config();
const axios = require("axios");
const mongoose = require("mongoose");

// MongoDB Schema i Model
const animeSchema = new mongoose.Schema({
  title: String,
  mal_id: Number, // MyAnimeList ID
  gallery: Array, // Galeria zdjęć
});

const Anime = mongoose.model("Anime", animeSchema);

// Funkcja do połączenia z MongoDB
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
}

// Funkcja opóźniająca wykonanie (Rate Limiting)
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Funkcja pobierająca MyAnimeList ID na podstawie tytułu
async function fetchMalId(title) {
  const url = `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(
    title
  )}&limit=1`;
  try {
    const response = await axios.get(url);
    if (response.data.data.length) {
      return response.data.data[0].mal_id; // Pobierz MyAnimeList ID
    }
    console.warn(`No MAL ID found for title: ${title}`);
    return null;
  } catch (error) {
    console.error(`Error fetching MAL ID for title "${title}":`, error.message);
    return null;
  }
}

// Funkcja aktualizująca brakujące MAL ID
async function updateMalIds() {
  const animeList = await Anime.find({ mal_id: { $exists: false } }); // Znajdź rekordy bez MyAnimeList ID
  for (const anime of animeList) {
    const malId = await fetchMalId(anime.title);
    if (malId) {
      anime.mal_id = malId;
      await anime.save();
      console.log(`Updated MAL ID for: ${anime.title}`);
    }
    await sleep(1000); // Opóźnienie, aby nie przekroczyć limitu API
  }
}

// Funkcja pobierająca zdjęcia z Jikan API
async function fetchAnimePictures(malId) {
  const url = `https://api.jikan.moe/v4/anime/${malId}/pictures`;
  try {
    const response = await axios.get(url);
    return response.data.data.map((picture) => picture.jpg.large_image_url); // Pobierz URL zdjęć
  } catch (error) {
    console.error(
      `Error fetching pictures for MAL ID ${malId}:`,
      error.message
    );
    return [];
  }
}

// Funkcja aktualizująca galerię
async function updateAnimeGallery() {
  const animeList = await Anime.find({ mal_id: { $exists: true } }); // Pobierz rekordy z MAL ID
  for (const anime of animeList) {
    const newPictures = await fetchAnimePictures(anime.mal_id);
    if (newPictures.length) {
      // Dodaj nowe zdjęcia bez duplikatów
      const updatedGallery = [
        ...new Set([...(anime.gallery || []), ...newPictures]),
      ];
      anime.gallery = updatedGallery;
      await anime.save();
      console.log(`Updated gallery for anime: ${anime.title}`);
    }
    await sleep(1000); // Opóźnienie między żądaniami
  }
}

// Główna funkcja uruchamiająca
(async function () {
  await connectDB();

  console.log("Updating MAL IDs...");
  await updateMalIds(); // Uzupełnij brakujące MAL ID

  console.log("Updating galleries...");
  await updateAnimeGallery(); // Zaktualizuj galerie

  mongoose.disconnect();
  console.log("Update completed!");
})();
