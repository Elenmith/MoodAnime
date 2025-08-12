import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PlatformDetail.css';
import SEO from '../SEO/SEO';

const PlatformDetail = () => {
  const { platformId } = useParams();
  const navigate = useNavigate();
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMood, setSelectedMood] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');

  const API_URL = process.env.REACT_APP_API_URL;

  // Platformy streamingowe z szczegółami
  const platforms = {
    netflix: {
      id: "netflix",
      name: "Netflix",
      icon: "🎬",
      color: "#E50914",
      description: "Największa biblioteka anime na świecie",
      affiliateUrl: "https://www.netflix.com/search?q=anime",
      features: ["Exclusive anime", "Original content", "Multiple languages", "4K quality"],
      subscription: "Od $8.99/miesiąc"
    },
    crunchyroll: {
      id: "crunchyroll",
      name: "Crunchyroll",
      icon: "🍊",
      color: "#F47521",
      description: "Specjalista od anime i manga",
      affiliateUrl: "https://www.crunchyroll.com/browse",
      features: ["Simulcast", "Manga library", "Fan shop", "Events"],
      subscription: "Od $7.99/miesiąc"
    },
    funimation: {
      id: "funimation",
      name: "Funimation",
      icon: "🎭",
      color: "#5C2D91",
      description: "Dubbing i subbing w najwyższej jakości",
      affiliateUrl: "https://www.funimation.com/shows/",
      features: ["English dubs", "Simulcast", "Classic anime", "Exclusive content"],
      subscription: "Od $5.99/miesiąc"
    },
    hbo: {
      id: "hbo",
      name: "HBO Max",
      icon: "📺",
      color: "#5F2EEA",
      description: "Selekcja premium anime",
      affiliateUrl: "https://play.hbomax.com/search?q=anime",
      features: ["Studio Ghibli", "Crunchyroll content", "Premium quality", "Family friendly"],
      subscription: "Od $9.99/miesiąc"
    },
    disney: {
      id: "disney",
      name: "Disney+",
      icon: "🏰",
      color: "#0063E5",
      description: "Studio Ghibli i więcej",
      affiliateUrl: "https://www.disneyplus.com/search?q=anime",
      features: ["Studio Ghibli", "Family content", "4K HDR", "Multiple profiles"],
      subscription: "Od $7.99/miesiąc"
    },
    amazon: {
      id: "amazon",
      name: "Prime Video",
      icon: "📦",
      color: "#00A8E1",
      description: "Różnorodna kolekcja anime",
      affiliateUrl: "https://www.amazon.com/Prime-Video/b?node=2858778011",
      features: ["Prime benefits", "Rental options", "Multiple devices", "Offline viewing"],
      subscription: "Od $8.99/miesiąc"
    }
  };

  const platform = platforms[platformId];

  // Popularne nastroje
  const popularMoods = [
    { id: "happy", name: "Szczęśliwy", icon: "😊" },
    { id: "sad", name: "Smutny", icon: "😢" },
    { id: "excited", name: "Ekscytujący", icon: "🤩" },
    { id: "relaxed", name: "Relaksujący", icon: "😌" },
    { id: "romantic", name: "Romantyczny", icon: "💕" },
    { id: "adventure", name: "Przygodowy", icon: "🗺️" },
    { id: "mystery", name: "Tajemniczy", icon: "🔍" },
    { id: "comedy", name: "Komediowy", icon: "😂" },
    { id: "drama", name: "Dramatyczny", icon: "🎭" },
    { id: "action", name: "Akcji", icon: "⚡" },
    { id: "fantasy", name: "Fantasy", icon: "🐉" },
    { id: "slice-of-life", name: "Slice of Life", icon: "🌸" }
  ];

  // Popularne gatunki
  const popularGenres = [
    "Action", "Adventure", "Comedy", "Drama", "Fantasy", "Horror",
    "Mystery", "Romance", "Sci-Fi", "Slice of Life", "Sports", "Thriller"
  ];

  useEffect(() => {
    if (platform) {
      fetchAnime();
    }
  }, [platform, selectedMood, selectedGenre]);

  const fetchAnime = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let url = `${API_URL}/api/anime?limit=30`;
      const params = new URLSearchParams();
      
      params.append('platform', platformId);
      if (selectedMood) params.append('mood', selectedMood);
      if (selectedGenre) params.append('genre', selectedGenre);
      
      url += `&${params.toString()}`;

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
    setSelectedMood(selectedMood === mood ? '' : mood);
  };

  const handleGenreSelect = (genre) => {
    setSelectedGenre(selectedGenre === genre ? '' : genre);
  };

  const clearFilters = () => {
    setSelectedMood('');
    setSelectedGenre('');
  };

  const handlePlatformClick = () => {
    window.open(platform.affiliateUrl, '_blank', 'noopener,noreferrer');
  };

  if (!platform) {
    return (
      <div className="platform-not-found">
        <h1>Platforma nie została znaleziona</h1>
        <button onClick={() => navigate('/discover')}>Wróć do odkrywania</button>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title={`Anime na ${platform.name} - Mood4Anime`}
        description={`Odkryj najlepsze anime na ${platform.name}. ${platform.description} Filtruj według nastroju i gatunku.`}
        keywords={`anime on ${platform.name.toLowerCase()}, ${platform.name} anime, anime streaming, ${platform.name} subscription`}
      />
      
      <div className="platform-detail-page">
        {/* Hero Section */}
        <section className="platform-hero" style={{ '--platform-color': platform.color }}>
          <div className="hero-content">
            <div className="platform-info">
              <div className="platform-icon">{platform.icon}</div>
              <h1 className="platform-title">{platform.name}</h1>
              <p className="platform-description">{platform.description}</p>
              <div className="platform-features">
                {platform.features.map((feature, index) => (
                  <span key={index} className="feature-tag">{feature}</span>
                ))}
              </div>
              <div className="platform-actions">
                <button className="subscribe-button" onClick={handlePlatformClick}>
                  Subskrybuj od {platform.subscription}
                </button>
                <button className="browse-button" onClick={handlePlatformClick}>
                  Przeglądaj anime
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="filters-section">
          <div className="container">
            {/* Active Filters */}
            {(selectedMood || selectedGenre) && (
              <div className="active-filters">
                <h3>Aktywne filtry:</h3>
                <div className="filter-tags">
                  {selectedMood && (
                    <span className="filter-tag">
                      {popularMoods.find(m => m.id === selectedMood)?.name}
                      <button onClick={() => handleMoodSelect(selectedMood)}>×</button>
                    </span>
                  )}
                  {selectedGenre && (
                    <span className="filter-tag">
                      {selectedGenre}
                      <button onClick={() => handleGenreSelect(selectedGenre)}>×</button>
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
              <h3>🎭 Filtruj według nastroju</h3>
              <div className="moods-grid">
                {popularMoods.map((mood) => (
                  <button
                    key={mood.id}
                    className={`mood-card ${selectedMood === mood.id ? 'active' : ''}`}
                    onClick={() => handleMoodSelect(mood.id)}
                  >
                    <span className="mood-icon">{mood.icon}</span>
                    <span className="mood-name">{mood.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Genre Selection */}
            <div className="filter-group">
              <h3>🎨 Filtruj według gatunku</h3>
              <div className="genres-grid">
                {popularGenres.map((genre) => (
                  <button
                    key={genre}
                    className={`genre-card ${selectedGenre === genre ? 'active' : ''}`}
                    onClick={() => handleGenreSelect(genre)}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section className="results-section">
          <div className="container">
            <div className="results-header">
              <h2>
                {selectedMood && selectedGenre 
                  ? `${popularMoods.find(m => m.id === selectedMood)?.name} anime ${selectedGenre} na ${platform.name}`
                  : selectedMood 
                  ? `${popularMoods.find(m => m.id === selectedMood)?.name} anime na ${platform.name}`
                  : selectedGenre 
                  ? `Anime ${selectedGenre} na ${platform.name}`
                  : `Wszystkie anime na ${platform.name}`
                }
              </h2>
              <p>Znalezione: {animeList.length} anime</p>
            </div>

            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Wyszukiwanie anime na {platform.name}...</p>
              </div>
            ) : error ? (
              <div className="error-container">
                <p>{error}</p>
                <button onClick={fetchAnime} className="retry-button">
                  Spróbuj ponownie
                </button>
              </div>
            ) : (
              <>
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
                        {anime.moods && (
                          <div className="anime-moods">
                            {anime.moods.slice(0, 2).map((mood, index) => (
                              <span key={index} className="mood-badge">{mood}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Platform CTA */}
                {animeList.length > 0 && (
                  <div className="platform-cta">
                    <h3>Zobacz więcej na {platform.name}</h3>
                    <p>Odkryj pełną bibliotekę anime na {platform.name}</p>
                    <button 
                      className="platform-cta-button"
                      onClick={handlePlatformClick}
                      style={{ backgroundColor: platform.color }}
                    >
                      Przejdź do {platform.name}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* Platform Info Section */}
        <section className="platform-info-section">
          <div className="container">
            <div className="platform-details">
              <h2>O {platform.name}</h2>
              <div className="details-grid">
                <div className="detail-card">
                  <h3>🎯 Specjalizacja</h3>
                  <p>{platform.description}</p>
                </div>
                <div className="detail-card">
                  <h3>💰 Cena</h3>
                  <p>{platform.subscription}</p>
                </div>
                <div className="detail-card">
                  <h3>✨ Funkcje</h3>
                  <ul>
                    {platform.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default PlatformDetail;
