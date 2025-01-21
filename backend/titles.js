const axios = require("axios");
const fs = require("fs");

// Twój endpoint
const apiEndpoint = "http://localhost:5000/anime";

// Funkcja do pobrania danych i zapisania tytułów do pliku
async function fetchAndSaveAnimeTitles() {
  try {
    // Pobierz dane z endpointa
    const response = await axios.get(apiEndpoint);
    const animeList = response.data; // Załóżmy, że dane są w formacie JSON

    // Sprawdź, czy dane są tablicą
    if (!Array.isArray(animeList)) {
      throw new Error("Nieprawidłowy format danych, oczekiwano tablicy.");
    }

    // Wyciągnij tytuły anime
    const titles = animeList.map((anime) => anime.title);

    // Zapisz tytuły do pliku lista.txt
    fs.writeFileSync("lista.txt", titles.join("\n"), "utf8");
    console.log("Tytuły anime zapisane do pliku lista.txt.");
  } catch (error) {
    console.error("Wystąpił błąd:", error.message);
  }
}

// Uruchom funkcję
fetchAndSaveAnimeTitles();
