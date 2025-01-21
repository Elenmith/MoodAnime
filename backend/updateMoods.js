const mongoose = require("mongoose");
const Anime = require("./models/Anime");

require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Połączono z MongoDB"))
  .catch((err) => console.error("Błąd połączenia:", err));

const updateMoods = async () => {
  try {
    // Przykładowa logika przypisywania nastrojów
    await Anime.updateMany(
      { title: /Sousou no Frieren/i },
      { $set: { moods: ["relaxing", "happy"] } }
    );
    await Anime.updateMany(
      { title: /Fullmetal Alchemist: Brotherhood/i },
      { $set: { moods: ["dark", "motivational"] } }
    );

    console.log("Nastroje zostały zaktualizowane!");
  } catch (err) {
    console.error("Błąd podczas aktualizacji nastrojów:", err);
  } finally {
    mongoose.disconnect();
  }
};

updateMoods();
