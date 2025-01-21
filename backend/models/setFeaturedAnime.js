const mongoose = require("mongoose");
const Anime = require("./Anime");
const FeaturedAnime = require("./FeaturedAnime");

require("dotenv").config({ path: "../.env" });

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Połączono z MongoDB"))
  .catch((err) => console.error("Błąd połączenia:", err));

const setFeaturedAnime = async () => {
  try {
    const animeCount = await Anime.countDocuments({ rating: { $gt: 8.5 } });
    if (animeCount === 0) {
      console.log("No high-rated anime found");
      return;
    }

    const randomIndex = Math.floor(Math.random() * animeCount);
    const randomAnime = await Anime.findOne({ rating: { $gt: 8.5 } }).skip(
      randomIndex
    );

    const featuredAnime = new FeaturedAnime({
      anime: randomAnime._id,
      date: new Date(),
    });

    await FeaturedAnime.deleteMany({}); // Usuwamy poprzednie "anime dnia"
    await featuredAnime.save();
    console.log("Featured anime set for today:", randomAnime.title);
  } catch (err) {
    console.error("Error setting featured anime:", err);
  } finally {
    mongoose.disconnect();
  }
};

setFeaturedAnime();
