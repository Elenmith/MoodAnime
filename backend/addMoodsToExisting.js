const mongoose = require("mongoose");
const Anime = require("./models/Anime");
const moods = require("./routes/moods"); // Importuj nastroje z Moods.js
require("dotenv").config();

// Funkcja do przypisywania nastrojów na podstawie gatunków i opisu
const assignMoods = (anime) => {
  const assignedMoods = [];

  // Przykładowa logika przypisywania nastrojów na podstawie gatunków
  if (anime.genres?.includes("Comedy"))
    assignedMoods.push("cheerful", "playful");
  if (anime.genres?.includes("Drama"))
    assignedMoods.push("melancholic", "serious");
  if (anime.genres?.includes("Fantasy"))
    assignedMoods.push("magical", "mythical", "dreamy");
  if (anime.genres?.includes("Action"))
    assignedMoods.push("energic", "epic", "tense");
  if (anime.genres?.includes("Romance"))
    assignedMoods.push("romantic", "heartbroken");

  // Dodatkowe przypisanie na podstawie opisu (sprawdzanie istnienia `description`)
  if (anime.description?.toLowerCase().includes("relaxing"))
    assignedMoods.push("relaxing", "peaceful");
  if (anime.description?.toLowerCase().includes("intense"))
    assignedMoods.push("intense", "suspenseful");

  // Usuń duplikaty i ogranicz liczbę nastrojów do np. 5
  return [...new Set(assignedMoods)].slice(0, 5);
};

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Połączono z MongoDB"))
  .catch((err) => console.error("Błąd połączenia:", err));

const addMoodsToExisting = async () => {
  try {
    const animes = await Anime.find(); // Pobierz wszystkie anime

    for (const anime of animes) {
      // Przypisz nastroje na podstawie funkcji `assignMoods`
      const moodsForAnime = assignMoods(anime);

      // Zaktualizuj pole `moods` w dokumencie
      anime.moods = moodsForAnime;
      await anime.save(); // Zapisz zmiany w bazie
    }

    console.log("Nastroje zostały logicznie przypisane do wszystkich anime!");
  } catch (err) {
    console.error("Błąd podczas aktualizacji dokumentów:", err);
  } finally {
    mongoose.disconnect();
  }
};

addMoodsToExisting();
