import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Main.css";
import { MoodContext } from "../../context/MoodContext";
import { useUser } from "../../context/UserContext";
import Carousel from "../Carousel/Carousel";
import FeaturedAnime from "../FeaturedAnime/FeaturedAnime";
import SEO from "../SEO/SEO";
// import AdPlaceholder from "../Ads/AdPlaceholder"; // NEW: Import ad component

function Main() {
  const { moods } = useContext(MoodContext);
  const { isAuthenticated } = useUser();
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
      
      {/* Header Ad */}
      {/* <AdPlaceholder position="header" category="anime" /> */}
      
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
        
        {/* Content Ad */}
        {/* <AdPlaceholder position="content" category="anime" /> */}
        
        {/* Sekcja z karuzelą */}
        <div className="section-spacing">
          <h2 className="section-header">Discover Amazing Anime</h2>
          <p className="section-subheader">Explore diverse anime from different genres and moods</p>
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
        </div>
        
        {/* Inline Ad */}
        {/* <AdPlaceholder position="inline" category="figures" /> */}
        
        {/* Sekcja statystyk */}
        <div className="stats-section">
          <h2 className="section-header" style={{ color: 'white', marginTop: 0 }}>Mood4Anime Stats</h2>
          <p className="section-subheader" style={{ color: 'rgba(255,255,255,0.8)' }}>Join thousands of anime enthusiasts</p>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">10,000+</span>
              <span className="stat-label">Anime Titles</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">50+</span>
              <span className="stat-label">Mood Categories</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">25+</span>
              <span className="stat-label">Genres</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">100K+</span>
              <span className="stat-label">Happy Users</span>
            </div>
          </div>
        </div>
        
        {/* Karta do anime dnia */}
        <div className="section-spacing">
          <h2 className="section-header">Today's Pick</h2>
          <p className="section-subheader">Our carefully selected recommendation just for you</p>
          <FeaturedAnime loading={loading} featuredAnime={featuredAnime} />
        </div>
        
        {/* Call to Action section */}
        <div className="cta-section">
          <h2 className="cta-title">Ready to Discover Your Perfect Anime?</h2>
          <p className="cta-description">
            Join our community and start exploring anime that matches your mood perfectly. 
            Create your account to save favorites and get personalized recommendations.
          </p>
          {isAuthenticated ? (
            <a href="/profile" className="cta-button">View Your Profile</a>
          ) : (
            <a href="/auth" className="cta-button">Get Started Now</a>
          )}
        </div>
      </main>
    </>
  );
}

export default Main;
