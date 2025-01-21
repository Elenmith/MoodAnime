// const axios = require("axios");
// const mongoose = require("mongoose");
// const Anime = require("./models/Anime"); // Import modelu Anime

// require("dotenv").config(); // Wczytaj zmienne środowiskowe

// // Połącz z MongoDB
// mongoose
//   .connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("Połączono z MongoDB"))
//   .catch((err) => console.error("Błąd połączenia:", err));

// // Funkcja do pobierania danych z API
// const fetchAnimeData = async () => {
//   try {
//     const response = await axios.get("https://api.jikan.moe/v4/top/anime");
//     const animeList = response.data.data;

//     for (const anime of animeList) {
//       const newAnime = new Anime({
//         title: anime.title,
//         genres: anime.genres.map((g) => g.name),
//         rating: anime.score || 0,
//         imageUrl: anime.images.jpg.large_image_url,
//         moods: [], // Dodaj pole `moods` jako pustą tablicę
//       });

//       await newAnime.save();
//       console.log(`Dodano anime: ${anime.title}`);
//     }

//     console.log("Wszystkie dane zostały dodane!");
//   } catch (error) {
//     console.error("Błąd podczas pobierania danych:", error);
//   } finally {
//     mongoose.disconnect();
//   }
// };
// fetchAnimeData();

const axios = require("axios");
const mongoose = require("mongoose");
const Anime = require("./models/Anime"); // Import modelu Anime
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

require("dotenv").config(); // Wczytaj zmienne środowiskowe

// Połącz z MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Połączono z MongoDB"))
  .catch((err) => console.error("Błąd połączenia:", err));

// Funkcja do pobierania szczegółowych danych dla jednego anime
const fetchDetailedAnimeData = async (animeId) => {
  try {
    // Pobierz szczegóły anime
    const response = await axios.get(
      `https://api.jikan.moe/v4/anime/${animeId}`
    );
    const animeDetails = response.data.data;

    // Pobierz postacie i voice cast
    const charactersResponse = await axios.get(
      `https://api.jikan.moe/v4/anime/${animeId}/characters`
    );
    const charactersData = charactersResponse.data.data;

    const characters =
      charactersData?.slice(0, 5).map((c) => c.character.name) || [];
    const voiceCast =
      charactersData
        ?.slice(0, 5)
        .map((c) => c.voice_actors?.[0]?.name || "Unknown") || [];

    return {
      title: animeDetails.title,
      titleEnglish: animeDetails.title_english || "Unknown",
      titleJapanese: animeDetails.title_japanese || "Unknown",
      genres: animeDetails.genres.map((g) => g.name),
      rating: animeDetails.score || 0,
      imageUrl: animeDetails.images.jpg.large_image_url,
      trailerImage: animeDetails.trailer.images?.medium_image_url || null,
      duration: animeDetails.duration || "Unknown",
      releaseDate: animeDetails.aired?.string || "Unknown",
      director: animeDetails.studios?.[0]?.name || "Unknown",
      characters: characters,
      voiceCast: voiceCast,
      synopsis: animeDetails.synopsis || "No synopsis available",
      gallery: [animeDetails.images.jpg.large_image_url], // Możesz dodać więcej zdjęć
      moods: [], // Domyślnie pusta tablica
    };
  } catch (err) {
    console.error(
      `Błąd podczas pobierania szczegółowych danych dla anime ID: ${animeId}`,
      err
    );
    return null;
  }
};

// Funkcja do pobierania listy anime i ich szczegółów
const fetchAnimeData = async (limit = 500) => {
  let totalFetched = 0; // Licznik pobranych anime
  let page = 41; // Zaczynamy od pierwszej strony

  try {
    while (totalFetched < limit) {
      console.log(`Pobieranie strony ${page}...`);
      const response = await axios.get(
        `https://api.jikan.moe/v4/anime?page=${page}`
      );
      const animeList = response.data.data;

      if (!animeList || animeList.length === 0) {
        console.log("Brak więcej danych do pobrania.");
        break;
      }

      // Przetwórz każde anime
      for (const anime of animeList) {
        const newAnime = new Anime({
          title: anime.title,
          genres: anime.genres.map((g) => g.name),
          rating: anime.score || 0,
          imageUrl: anime.images.jpg.large_image_url,
          duration: anime.duration || "Unknown",
          releaseDate: anime.aired?.string || "Unknown",
          synopsis: anime.synopsis || "No synopsis available",
          moods: [], // Dodaj pole `moods` jako pustą tablicę
        });

        await newAnime.save();
        totalFetched++;
        console.log(`Dodano anime: ${anime.title}`);

        // Zakończ, jeśli osiągnięto limit
        if (totalFetched >= limit) break;
      }

      // Przejdź do następnej strony i dodaj opóźnienie
      page++;
      console.log("Czekam 2 sekundy przed kolejnym żądaniem...");
      await delay(2000); // Opóźnienie 2 sekundy między żądaniami
    }

    console.log(`Pobrano ${totalFetched} anime!`);
  } catch (error) {
    console.error("Błąd podczas pobierania danych:", error);
  } finally {
    mongoose.disconnect();
  }
};

fetchAnimeData();
