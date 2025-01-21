// const mongoose = require("mongoose");
// const axios = require("axios");

// // Połącz z MongoDB Atlas
// const connectToDatabase = async () => {
//   try {
//     await mongoose.connect(
//       "mongodb+srv://admin:ZaEpU6JjfWVoRaQk@animemood.hezaf.mongodb.net/?retryWrites=true&w=majority&appName=AnimeMood"
//     );
//     console.log("Connected to MongoDB Atlas");
//   } catch (error) {
//     console.error("Error connecting to MongoDB:", error);
//     process.exit(1);
//   }
// };

// // Model kategorii
// const GenreModel = mongoose.model(
//   "Genre",
//   new mongoose.Schema({
//     name: { type: String, unique: true },
//   })
// );

// // Pobierz listę kategorii z Jikan API
// const fetchGenresFromAPI = async () => {
//   try {
//     const response = await axios.get("https://api.jikan.moe/v4/genres/anime");

//     // Wyciągnij unikalne kategorie
//     const genres = response.data.data.map((genre) => genre.name);
//     return genres;
//   } catch (error) {
//     console.error("Error fetching genres from Jikan API:", error);
//     return [];
//   }
// };

// // Porównaj i znajdź nowe kategorie
// const getNewGenres = async (apiGenres) => {
//   const currentGenres = await GenreModel.find().distinct("name");
//   return apiGenres.filter((genre) => !currentGenres.includes(genre));
// };

// // Dodaj nowe kategorie do bazy danych
// const addNewGenresToDatabase = async (newGenres) => {
//   try {
//     if (newGenres.length > 0) {
//       const genreDocs = newGenres.map((genre) => ({ name: genre }));
//       await GenreModel.insertMany(genreDocs);
//       console.log("New genres added:", newGenres);
//     } else {
//       console.log("No new genres to add.");
//     }
//   } catch (error) {
//     console.error("Error adding genres to database:", error);
//   }
// };

// // Główna funkcja synchronizacji
// const syncGenres = async () => {
//   await connectToDatabase();
//   const apiGenres = await fetchGenresFromAPI();
//   const newGenres = await getNewGenres(apiGenres);
//   await addNewGenresToDatabase(newGenres);
//   mongoose.connection.close();
// };

// // Uruchom skrypt
// syncGenres();
