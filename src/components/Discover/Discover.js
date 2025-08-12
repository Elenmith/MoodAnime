import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Discover.css';
import SEO from '../SEO/SEO';
import { generateAffiliateLink, trackAffiliateClick } from '../../config/affiliate';

const Discover = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const selectedMood = searchParams.get('mood') || '';
  const selectedPlatform = searchParams.get('platform') || '';

  const API_URL = process.env.REACT_APP_API_URL;

  // Platformy streamingowe z affiliate links
  const platforms = [
    { 
      id: "netflix", 
      name: "Netflix", 
      icon: "🎬", 
      color: "#E50914",
      affiliateUrl: "https://www.netflix.com/search?q=anime",
      description: "Największa biblioteka anime",
      hasAffiliate: false // Netflix nie ma programu afiliacyjnego
    },
    { 
      id: "crunchyroll", 
      name: "Crunchyroll", 
      icon: "🍊", 
      color: "#F47521",
      affiliateUrl: "https://www.crunchyroll.com/browse",
      description: "Specjalista od anime",
      hasAffiliate: false // Crunchyroll nie ma publicznego programu
    },
    { 
      id: "funimation", 
      name: "Funimation", 
      icon: "🎭", 
      color: "#5C2D91",
      affiliateUrl: "https://www.funimation.com/shows/",
      description: "Dubbing i subbing",
      hasAffiliate: false
    },
    { 
      id: "hbo", 
      name: "HBO Max", 
      icon: "📺", 
      color: "#5F2EEA",
      affiliateUrl: "https://play.hbomax.com/search?q=anime",
      description: "Selekcja premium",
      hasAffiliate: false
    },
    { 
      id: "disney", 
      name: "Disney+", 
      icon: "🏰", 
      color: "#0063E5",
      affiliateUrl: "https://www.disneyplus.com/search?q=anime",
      description: "Studio Ghibli i więcej",
      hasAffiliate: false
    },
    { 
      id: "amazon", 
      name: "Prime Video", 
      icon: "📦", 
      color: "#00A8E1",
      affiliateUrl: "https://www.amazon.com/Prime-Video/b?node=2858778011",
      description: "Różnorodna kolekcja",
      hasAffiliate: true // Amazon ma program Associates
    }
  ];

  // Popularne nastroje
  const popularMoods = [
    { id: "happy", name: "Szczęśliwy", icon: "😊", color: "#FFD700" },
    { id: "sad", name: "Smutny", icon: "😢", color: "#87CEEB" },
    { id: "excited", name: "Ekscytujący", icon: "🤩", color: "#FF6B6B" },
    { id: "relaxed", name: "Relaksujący", icon: "😌", color: "#98FB98" },
    { id: "romantic", name: "Romantyczny", icon: "💕", color: "#FFB6C1" },
    { id: "adventure", name: "Przygodowy", icon: "🗺️", color: "#FFA500" },
    { id: "mystery", name: "Tajemniczy", icon: "🔍", color: "#9370DB" },
    { id: "comedy", name: "Komediowy", icon: "😂", color: "#FFD700" },
    { id: "drama", name: "Dramatyczny", icon: "🎭", color: "#DC143C" },
    { id: "action", name: "Akcji", icon: "⚡", color: "#FF4500" },
    { id: "fantasy", name: "Fantasy", icon: "🐉", color: "#9932CC" },
    { id: "slice-of-life", name: "Slice of Life", icon: "🌸", color: "#FF69B4" }
  ];

  useEffect(() => {
    if (selectedMood || selectedPlatform) {
      fetchAnime();
    }
  }, [selectedMood, selectedPlatform]);

  const fetchAnime = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let url = `${API_URL}/api/anime?limit=20`;
      const params = new URLSearchParams();
      
      if (selectedMood) params.append('mood', selectedMood);
      if (selectedPlatform) params.append('platform', selectedPlatform);
      
      if (params.toString()) {
        url += `&${params.toString()}`;
      }

      const response = await axios.get(url);
      setAnimeList(response.data.anime || response.data);
    } catch (err) {
      console.error('Error fetching anime:', err);
      setError('Nie udało się pobrać anime. Spróbuj ponownie.');
    } finally {
      setLoading(false);
    }
  };

  const handleMoodSelect = (mood) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('mood', mood);
    setSearchParams(newParams);
  };

  const handlePlatformSelect = (platform) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('platform', platform);
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({});
    setAnimeList([]);
  };

  const handlePlatformClick = (platform, animeTitle = 'anime') => {
    if (platform.hasAffiliate) {
      // Dla Amazon - generuj affiliate link
      const affiliateUrl = generateAffiliateLink('amazon', animeTitle, 'discovery');
      if (affiliateUrl) {
        trackAffiliateClick('amazon', animeTitle, 'discovery');
        window.open(affiliateUrl, '_blank', 'noopener,noreferrer');
        return;
      }
    }
    
    // Dla innych platform - direct link
    trackAffiliateClick(platform.id, animeTitle, 'direct');
    window.open(platform.affiliateUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <SEO 
        title="Odkryj Anime - Mood4Anime"
        description="Odkryj najlepsze anime na Netflix, Crunchyroll, Funimation i innych platformach. Filtruj według nastroju i znajdź idealne anime dla siebie."
        keywords="anime on netflix, anime on crunchyroll, anime discovery, mood based anime, anime streaming platforms"
      />
      
      <div className="discover-page">
        {/* Hero Section */}
        <section className="discover-hero">
          <div className="hero-content">
            <h1 className="hero-title">
              Odkryj <span className="highlight">Idealne Anime</span>
            </h1>
            <p className="hero-subtitle">
              Wybierz swój nastrój i platformę, a znajdziemy dla Ciebie najlepsze anime
            </p>
          </div>
        </section>

        {/* Filters Section */}
        <section className="filters-section">
          <div className="container">
            {/* Active Filters */}
            {(selectedMood || selectedPlatform) && (
              <div className="active-filters">
                <h3>Aktywne filtry:</h3>
                <div className="filter-tags">
                  {selectedMood && (
                    <span className="filter-tag">
                      {popularMoods.find(m => m.id === selectedMood)?.name || selectedMood}
                      <button onClick={() => handleMoodSelect('')}>×</button>
                    </span>
                  )}
                  {selectedPlatform && (
                    <span className="filter-tag">
                      {platforms.find(p => p.id === selectedPlatform)?.name || selectedPlatform}
                      <button onClick={() => handlePlatformSelect('')}>×</button>
                    </span>
                  )}
                  <button className="clear-filters" onClick={clearFilters}>
                    Wyczyść wszystkie
                  </button>
                </div>
              </div>
            )}

            {/* Mood Selection */}
            <div className="filter-group">
              <h3>🎭 Wybierz nastrój</h3>
              <div className="moods-grid">
                {popularMoods.map((mood) => (
                  <button
                    key={mood.id}
                    className={`mood-card ${selectedMood === mood.id ? 'active' : ''}`}
                    onClick={() => handleMoodSelect(mood.id)}
                    style={{ '--mood-color': mood.color }}
                  >
                    <span className="mood-icon">{mood.icon}</span>
                    <span className="mood-name">{mood.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Platform Selection */}
            <div className="filter-group">
              <h3>📺 Wybierz platformę</h3>
              <div className="platforms-grid">
                {platforms.map((platform) => (
                  <button
                    key={platform.id}
                    className={`platform-card ${selectedPlatform === platform.id ? 'active' : ''}`}
                    onClick={() => handlePlatformSelect(platform.id)}
                    style={{ '--platform-color': platform.color }}
                  >
                    <span className="platform-icon">{platform.icon}</span>
                    <span className="platform-name">{platform.name}</span>
                    <span className="platform-description">{platform.description}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Results Section */}
        {(selectedMood || selectedPlatform) && (
          <section className="results-section">
            <div className="container">
              <div className="results-header">
                <h2>
                  {selectedMood && selectedPlatform 
                    ? `Anime ${popularMoods.find(m => m.id === selectedMood)?.name} na ${platforms.find(p => p.id === selectedPlatform)?.name}`
                    : selectedMood 
                    ? `Anime ${popularMoods.find(m => m.id === selectedMood)?.name}`
                    : `Anime na ${platforms.find(p => p.id === selectedPlatform)?.name}`
                  }
                </h2>
                <p>Znalezione: {animeList.length} anime</p>
              </div>

              {loading ? (
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                  <p>Wyszukiwanie anime...</p>
                </div>
              ) : error ? (
                <div className="error-container">
                  <p>{error}</p>
                  <button onClick={fetchAnime} className="retry-button">
                    Spróbuj ponownie
                  </button>
                </div>
              ) : (
                <div className="anime-grid">
                  {animeList.map((anime) => (
                    <div key={anime._id} className="anime-card" onClick={() => navigate(`/anime/${anime._id}`)}>
                      <div className="anime-image">
                        <img src={anime.imageUrl} alt={anime.title} loading="lazy" />
                        <div className="anime-overlay">
                          <span className="anime-rating">⭐ {anime.rating || 'N/A'}</span>
                        </div>
                      </div>
                      <div className="anime-info">
                        <h3>{anime.title}</h3>
                        <p>{anime.genres?.slice(0, 3).join(', ')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Platform Links */}
              {selectedPlatform && animeList.length > 0 && (
                <div className="platform-links">
                  <h3>Zobacz więcej na {platforms.find(p => p.id === selectedPlatform)?.name}</h3>
                  <button 
                    className="platform-link-button"
                    onClick={() => handlePlatformClick(platforms.find(p => p.id === selectedPlatform))}
                    style={{ backgroundColor: platforms.find(p => p.id === selectedPlatform)?.color }}
                  >
                    Przejdź do {platforms.find(p => p.id === selectedPlatform)?.name}
                  </button>
                </div>
              )}
            </div>
          </section>
        )}

        {/* CTA Section */}
        {!selectedMood && !selectedPlatform && (
          <section className="cta-section">
            <div className="container">
              <h2>Gotowy na odkrywanie?</h2>
              <p>Wybierz nastrój i platformę, aby rozpocząć przygodę z anime</p>
            </div>
          </section>
        )}
      </div>
    </>
  );
};

export default Discover;
