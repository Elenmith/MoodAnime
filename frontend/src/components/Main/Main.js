import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Main.css";
import { MoodContext } from "../../context/MoodContext";
import Carousel from "../Carousel/Carousel";
import FeaturedAnime from "../FeaturedAnime/FeaturedAnime";

function Main() {
  const { moods } = useContext(MoodContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMoods, setFilteredMoods] = useState([]);
  const [animeList, setAnimeList] = useState([]);
  const navigate = useNavigate(); // Hook do nawigacji
  const [featuredAnime, setFeaturedAnime] = useState(null);
  const [loading, setLoading] = useState(true);

  // Zmiana na LowerCase
  const handleInputChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    // Filtrowanie nastrojów na podstawie wpisanego tekstu
    const filtered = moods.filter((mood) =>
      mood.toLowerCase().startsWith(value)
    );
    setFilteredMoods(filtered);
  };

  // Przekierowanie do strony z wybranym nastrojem
  const handleMoodClick = (mood) => {
    navigate(`/moods/${mood}`);
  };

  // Pobranie listy plakatów anime
  useEffect(() => {
    const fetchAnime = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/anime/posters");
        const data = await response.json();
        setAnimeList(data); // Przechowujemy pełne dane anime
      } catch (err) {
        console.error("Error fetching anime:", err);
      }
    };

    fetchAnime();
  }, []);

  // Ustawianie anime dnia
  useEffect(() => {
    const fetchFeaturedAnime = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/featured-anime/"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch featured anime");
        }
        const data = await response.json();
        setFeaturedAnime(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching featured anime:", err);
        setLoading(false);
      }
    };

    fetchFeaturedAnime();
  }, []);

  return (
    <main className="main">
      <div className="main__content">
        <div className="main_mood">
          <h1 className="main__title">
            Choose an anime that matches your mood
          </h1>
          <div className="main__search-container">
            <input
              type="text"
              placeholder="Write mood..."
              className="main__search-input"
              value={searchTerm}
              onChange={handleInputChange}
            />
          </div>
          {filteredMoods.length > 0 && (
            <ul className="main__suggestions">
              {filteredMoods.map((mood, index) => (
                <li
                  key={index}
                  className="main__suggestion-item"
                  onClick={() => handleMoodClick(mood)}
                >
                  {mood}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      {/* Karuzela pod wyszukiwaniem */}
      <h2 className="carousel-h2">or try something random</h2>
      <div className="main__carousel">
        <Carousel animeList={animeList} />
      </div>
      <div className="main__carousel">
        <Carousel animeList={animeList} />
      </div>
      <div className="main__carousel">
        <Carousel animeList={animeList} />
      </div>
      {/* Karta do anime dnia */}
      <h2 className="suggestion-h2">This is our suggestion for today!</h2>
      <FeaturedAnime loading={loading} featuredAnime={featuredAnime} />
    </main>
  );
}

export default Main;
