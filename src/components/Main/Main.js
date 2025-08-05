import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Main.css";
import { MoodContext } from "../../context/MoodContext";
import Carousel from "../Carousel/Carousel";
import FeaturedAnime from "../FeaturedAnime/FeaturedAnime";
import SEO from "../SEO/SEO";

function Main() {
  const { moods } = useContext(MoodContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMoods, setFilteredMoods] = useState([]);
  const [animeList, setAnimeList] = useState([]);
  const [carouselLoading, setCarouselLoading] = useState(true);
  const [carouselError, setCarouselError] = useState(null);
  const navigate = useNavigate();
  const [featuredAnime, setFeaturedAnime] = useState(null);
  const [loading, setLoading] = useState(true);

  // Pobierz URL API z zmiennej środowiskowej
  const API_URL = process.env.REACT_APP_API_URL;

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

  // Pobranie zróżnicowanych anime dla karuzeli
  useEffect(() => {
    const fetchRandomAnime = async () => {
      try {
        setCarouselLoading(true);
        setCarouselError(null);
        
        // Próbuj najpierw random-categories
        let response = await fetch(`${API_URL}/api/anime/random-categories`);
        
        // Jeśli nie działa, użyj posters jako fallback
        if (!response.ok) {
          console.log("⚠️ random-categories nie działa, używam posters jako fallback");
          response = await fetch(`${API_URL}/api/anime/posters`);
        }
        
        if (!response.ok) {
          throw new Error('Failed to fetch anime data');
        }
        
        const data = await response.json();
        console.log(`✅ Pobrano ${data.length} anime dla karuzeli`);
        setAnimeList(data);
      } catch (err) {
        console.error("Error fetching anime for carousel:", err);
        setCarouselError("Nie udało się załadować anime. Spróbuj odświeżyć stronę.");
      } finally {
        setCarouselLoading(false);
      }
    };

    fetchRandomAnime();
  }, [API_URL]);

  // Ustawianie anime dnia
  useEffect(() => {
    const fetchFeaturedAnime = async () => {
      try {
        const response = await fetch(`${API_URL}/api/featured-anime/`);
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
  }, [API_URL]);

  return (
    <>
      <SEO 
        title="Discover Perfect Anime for Your Mood"
        description="Find the perfect anime based on your mood! Browse thousands of anime recommendations filtered by emotions, genres, and ratings. Discover new anime that matches your current feelings."
        keywords="anime recommendations, anime by mood, anime emotions, anime discovery, best anime, anime list"
        url="https://mood4anime.com"
      />
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
        
        {/* Jedna zróżnicowana karuzela */}
        <h2 className="carousel-h2">Discover amazing anime from different genres</h2>
        <div className="main__carousel">
          {carouselLoading ? (
            <div className="carousel-loading">
              <div className="loading-spinner"></div>
              <p>Loading amazing anime...</p>
            </div>
          ) : carouselError ? (
            <div className="carousel-error">
              <p>{carouselError}</p>
              <button onClick={() => window.location.reload()} className="retry-button">
                Try Again
              </button>
            </div>
          ) : (
            <Carousel animeList={animeList} />
          )}
        </div>
        
        {/* Karta do anime dnia */}
        <h2 className="suggestion-h2">This is our suggestion for today!</h2>
        <FeaturedAnime loading={loading} featuredAnime={featuredAnime} />
      </main>
    </>
  );
}

export default Main;
