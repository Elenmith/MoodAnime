import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Main.css";
import { MoodContext } from "../../context/MoodContext";
import { useUser } from "../../context/UserContext";
import Carousel from "../Carousel/Carousel";
import FeaturedAnime from "../FeaturedAnime/FeaturedAnime";
import SEO from "../SEO/SEO";

function Main() {
  const { moods } = useContext(MoodContext);
  const { isAuthenticated } = useUser();
  const [selectedMood, setSelectedMood] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [animeList, setAnimeList] = useState([]);
  const [carouselLoading, setCarouselLoading] = useState(true);
  const [carouselError, setCarouselError] = useState(null);
  const navigate = useNavigate();
  const [featuredAnime, setFeaturedAnime] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.REACT_APP_API_URL;

  // Platformy streamingowe
  const platforms = [
    { id: "netflix", name: "Netflix", icon: "🎬", color: "#E50914" },
    { id: "crunchyroll", name: "Crunchyroll", icon: "🍊", color: "#F47521" },
    { id: "funimation", name: "Funimation", icon: "🎭", color: "#5C2D91" },
    { id: "hbo", name: "HBO Max", icon: "📺", color: "#5F2EEA" },
    { id: "disney", name: "Disney+", icon: "🏰", color: "#0063E5" },
    { id: "amazon", name: "Prime Video", icon: "📦", color: "#00A8E1" }
  ];

  // Popularne nastroje
  const popularMoods = [
    "Happy", "Sad", "Excited", "Relaxed", "Romantic", "Adventure", 
    "Mystery", "Comedy", "Drama", "Action", "Fantasy", "Slice of Life"
  ];

  // Obsługa wyboru nastroju
  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    if (selectedPlatform) {
      navigate(`/discover?mood=${mood}&platform=${selectedPlatform}`);
    }
  };

  // Obsługa wyboru platformy
  const handlePlatformSelect = (platform) => {
    setSelectedPlatform(platform);
    if (selectedMood) {
      navigate(`/discover?mood=${selectedMood}&platform=${platform}`);
    }
  };

  // Pobranie anime dla karuzeli
  useEffect(() => {
    const fetchRandomAnime = async () => {
      try {
        setCarouselLoading(true);
        setCarouselError(null);
        
        let response = await fetch(`${API_URL}/api/anime/random-categories`);
        
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

  // Pobranie anime dnia
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
        title="Find Your Next Anime - Discover Anime on Netflix, Crunchyroll & More"
        description="Find the perfect anime on your favorite streaming platform! Discover anime on Netflix, Crunchyroll, Funimation, HBO Max and more. Get personalized recommendations based on your mood and platform."
        keywords="anime on netflix, anime on crunchyroll, anime discovery, find anime, anime recommendations, streaming anime, netflix anime, crunchyroll anime"
        url="https://mood4anime.com"
      />
      
      <main className="main">
        <div className="main__content">
          {/* Hero Section */}
          <div className="hero-section">
            <h1 className="hero-title">
              Find Your Next <span className="highlight">Anime</span>
            </h1>
            <p className="hero-subtitle">
              Discover amazing anime on your favorite streaming platform
            </p>
            
            {/* Discovery Flow */}
            <div className="discovery-flow">
              <div className="flow-step">
                <div className="step-number">1</div>
                <h3>Choose Your Mood</h3>
                <div className="mood-grid">
                  {popularMoods.slice(0, 6).map((mood) => (
                    <button
                      key={mood}
                      className={`mood-chip ${selectedMood === mood ? 'selected' : ''}`}
                      onClick={() => handleMoodSelect(mood)}
                    >
                      {mood}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flow-arrow">→</div>
              
              <div className="flow-step">
                <div className="step-number">2</div>
                <h3>Pick Your Platform</h3>
                <div className="platform-grid">
                  {platforms.slice(0, 6).map((platform) => (
                    <button
                      key={platform.id}
                      className={`platform-chip ${selectedPlatform === platform.id ? 'selected' : ''}`}
                      onClick={() => handlePlatformSelect(platform.id)}
                      style={{ '--platform-color': platform.color }}
                    >
                      <span className="platform-icon">{platform.icon}</span>
                      <span className="platform-name">{platform.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flow-arrow">→</div>
              
              <div className="flow-step">
                <div className="step-number">3</div>
                <h3>Get Recommendations</h3>
                <p className="step-description">
                  Find perfect anime that matches your mood and is available on your platform
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Quick Discovery Section */}
        <div className="quick-discovery">
          <h2 className="section-title">Quick Discovery</h2>
                      <div className="discovery-cards">
            <div className="discovery-card" onClick={() => navigate('/discover?mood=happy&platform=netflix')}>
              <div className="card-icon">😊</div>
              <h3>Happy Anime on Netflix</h3>
              <p>Feel-good anime to brighten your day</p>
            </div>
            
            <div className="discovery-card" onClick={() => navigate('/discover?mood=action&platform=crunchyroll')}>
              <div className="card-icon">⚡</div>
              <h3>Action Anime on Crunchyroll</h3>
              <p>Epic battles and thrilling adventures</p>
            </div>
            
            <div className="discovery-card" onClick={() => navigate('/discover?mood=romantic&platform=netflix')}>
              <div className="card-icon">💕</div>
              <h3>Romance on Netflix</h3>
              <p>Beautiful love stories and relationships</p>
            </div>
            
            <div className="discovery-card" onClick={() => navigate('/discover')}>
              <div className="card-icon">🔍</div>
              <h3>Advanced Discovery</h3>
              <p>Customize your search with filters</p>
            </div>
            
            <div className="discovery-card" onClick={() => navigate('/platform/netflix')}>
              <div className="card-icon">🎬</div>
              <h3>Netflix Anime Collection</h3>
              <p>Explore all anime on Netflix</p>
            </div>
            
            <div className="discovery-card" onClick={() => navigate('/platform/crunchyroll')}>
              <div className="card-icon">🍊</div>
              <h3>Crunchyroll Library</h3>
              <p>Browse the largest anime collection</p>
            </div>
            
            <div className="discovery-card" onClick={() => navigate('/discover?mood=fantasy&platform=crunchyroll')}>
              <div className="card-icon">🐉</div>
              <h3>Fantasy on Crunchyroll</h3>
              <p>Magical worlds and supernatural powers</p>
            </div>
          </div>
        </div>
        
        {/* Featured Anime */}
        <div className="featured-section">
          <h2 className="section-title">Today's Pick</h2>
          <p className="section-subtitle">Our carefully selected recommendation</p>
          <FeaturedAnime loading={loading} featuredAnime={featuredAnime} />
        </div>
        
        {/* Popular Anime Carousel */}
        <div className="carousel-section">
          <h2 className="section-title">Popular Anime</h2>
          <p className="section-subtitle">Trending anime across all platforms</p>
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
        
        {/* Platform Showcase */}
        <div className="platforms-section">
          <h2 className="section-title">Available Platforms</h2>
          <p className="section-subtitle">Find anime on your favorite streaming services</p>
          <div className="platforms-grid">
            {platforms.map((platform) => (
              <div key={platform.id} className="platform-card" onClick={() => navigate(`/platform/${platform.id}`)}>
                <div className="platform-icon-large">{platform.icon}</div>
                <h3>{platform.name}</h3>
                <p>Discover anime on {platform.name}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="cta-section">
          <h2 className="cta-title">Ready to Discover?</h2>
          <p className="cta-description">
            Join thousands of anime fans finding their next favorite show. 
            Get personalized recommendations based on your mood and platform.
          </p>
          {isAuthenticated ? (
            <a href="/profile" className="cta-button">View Your Profile</a>
          ) : (
            <a href="/auth" className="cta-button">Start Discovering</a>
          )}
        </div>
      </main>
    </>
  );
}

export default Main;
