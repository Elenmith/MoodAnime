import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import SEO from "./SEO/SEO";
import "./AnimeDetail.css";

const AnimeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL;

  // Mock data for characters and voice cast
  const mockCharacters = [
    {
      name: "Main Character",
      role: "Protagonist",
      image: "https://via.placeholder.com/100x100/667eea/ffffff?text=MC"
    },
    {
      name: "Supporting Character",
      role: "Deuteragonist", 
      image: "https://via.placeholder.com/100x100/764ba2/ffffff?text=SC"
    },
    {
      name: "Villain",
      role: "Antagonist",
      image: "https://via.placeholder.com/100x100/dc3545/ffffff?text=V"
    }
  ];

  const mockVoiceCast = [
    { character: "Main Character", actor: "Voice Actor 1" },
    { character: "Supporting Character", actor: "Voice Actor 2" },
    { character: "Villain", actor: "Voice Actor 3" }
  ];

  const mockStreamingPlatforms = [
    { name: "Crunchyroll", url: "https://www.crunchyroll.com" },
    { name: "Funimation", url: "https://www.funimation.com" },
    { name: "Netflix", url: "https://www.netflix.com" }
  ];

  useEffect(() => {
    const fetchAnimeDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${API_URL}/api/anime/${id}`);
        
        if (!response.ok) {
          throw new Error('Anime not found');
        }
        
        const data = await response.json();
        
        // Add mock data if not present
        const enhancedData = {
          ...data,
          characters: data.characters && data.characters.length > 0 ? data.characters : mockCharacters,
          voiceCast: data.voiceCast && data.voiceCast.length > 0 ? data.voiceCast : mockVoiceCast,
          streamingPlatforms: data.streamingPlatforms && data.streamingPlatforms.length > 0 ? data.streamingPlatforms : mockStreamingPlatforms
        };
        
        setAnime(enhancedData);
      } catch (err) {
        console.error("Error fetching anime details:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnimeDetails();
  }, [id, API_URL]);

  const handleGenreClick = (genre) => {
    navigate(`/categories/${genre.toLowerCase()}`);
  };

  const handleMoodClick = (mood) => {
    navigate(`/moods/${mood.toLowerCase()}`);
  };

  if (loading) {
    return (
      <div className="anime-detail-loading">
        <div className="loading-spinner"></div>
        <p>Loading anime details...</p>
      </div>
    );
  }

  if (error || !anime) {
    return (
      <div className="anime-detail-error">
        <h2>Anime Not Found</h2>
        <p>{error || "This anime doesn't exist or has been removed."}</p>
        <button onClick={() => navigate('/')} className="back-button">
          ← Back to Home
        </button>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title={anime.title}
        description={anime.synopsis || `Discover ${anime.title} - an amazing anime with rating ${anime.rating}`}
        image={anime.imageUrl}
        url={`https://mood4anime.com/anime/${id}`}
        anime={anime}
      />
      
      <div className="anime-detail">
        {/* Hero Section */}
        <div className="anime-hero">
          <div className="hero-background">
            <div className="hero-overlay"></div>
          </div>
          
          <div className="hero-content">
            <div className="hero-poster">
              <img src={anime.imageUrl} alt={anime.title} />
              <div className="rating-badge">
                <span className="rating-number">{anime.rating}</span>
                <span className="rating-star">⭐</span>
              </div>
            </div>
            
            <div className="hero-info">
              <h1 className="anime-title">{anime.title}</h1>
              {anime.titleEnglish && anime.titleEnglish !== anime.title && (
                <h2 className="anime-title-english">{anime.titleEnglish}</h2>
              )}
              {anime.titleJapanese && (
                <h3 className="anime-title-japanese">{anime.titleJapanese}</h3>
              )}
              
              <div className="anime-meta">
                <div className="meta-item">
                  <span className="meta-label">Duration:</span>
                  <span className="meta-value">{anime.duration || "Unknown"}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Release:</span>
                  <span className="meta-value">{anime.releaseDate || "Unknown"}</span>
                </div>
                {anime.director && anime.director !== "Unknown" && (
                  <div className="meta-item">
                    <span className="meta-label">Director:</span>
                    <span className="meta-value">{anime.director}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="anime-content">
          <div className="content-grid">
            {/* Left Column */}
            <div className="content-main">
              {/* Synopsis */}
              <section className="anime-section">
                <h2>Synopsis</h2>
                <p className="anime-synopsis">
                  {anime.synopsis || anime.description || `Experience the amazing world of ${anime.title}, a captivating anime that has captured the hearts of viewers worldwide. With its unique storytelling and memorable characters, this series offers an unforgettable journey through its richly crafted universe.`}
                </p>
              </section>

              {/* Characters */}
              <section className="anime-section">
                <h2>Characters</h2>
                <div className="characters-grid">
                  {anime.characters?.map((character, index) => (
                    <div key={index} className="character-card">
                      <img src={character.image || 'https://via.placeholder.com/100x100'} alt={character.name} />
                      <h4>{character.name}</h4>
                      <p>{character.role}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Voice Cast */}
              <section className="anime-section">
                <h2>Voice Cast</h2>
                <div className="voice-cast-list">
                  {anime.voiceCast?.map((actor, index) => (
                    <div key={index} className="voice-actor">
                      <span className="character-name">{actor.character}</span>
                      <span className="actor-name">{actor.actor}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Gallery */}
              {anime.gallery && anime.gallery.length > 0 && (
                <section className="anime-section">
                  <h2>Gallery</h2>
                  <div className="gallery-grid">
                    {anime.gallery.map((image, index) => (
                      <div key={index} className="gallery-item">
                        <img src={image} alt={`Gallery ${index + 1}`} />
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Right Column */}
            <div className="content-sidebar">
              {/* Genres */}
              {anime.genres && anime.genres.length > 0 && (
                <section className="sidebar-section">
                  <h3>Genres</h3>
                  <div className="tags-container">
                    {anime.genres.map((genre, index) => (
                      <button
                        key={index}
                        className="tag genre-tag"
                        onClick={() => handleGenreClick(genre)}
                      >
                        {genre}
                      </button>
                    ))}
                  </div>
                </section>
              )}

              {/* Moods */}
              {anime.moods && anime.moods.length > 0 && (
                <section className="sidebar-section">
                  <h3>Moods</h3>
                  <div className="tags-container">
                    {anime.moods.map((mood, index) => (
                      <button
                        key={index}
                        className="tag mood-tag"
                        onClick={() => handleMoodClick(mood)}
                      >
                        {mood}
                      </button>
                    ))}
                  </div>
                </section>
              )}

              {/* Streaming Platforms */}
              <section className="sidebar-section">
                <h3>Where to Watch</h3>
                <div className="streaming-list">
                  {anime.streamingPlatforms?.map((platform, index) => (
                    <a
                      key={index}
                      href={platform.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="streaming-link"
                    >
                      <span className="platform-name">{platform.name}</span>
                      <span className="platform-icon">→</span>
                    </a>
                  ))}
                </div>
              </section>

              {/* Back Button */}
              <section className="sidebar-section">
                <button onClick={() => navigate(-1)} className="back-button">
                  ← Go Back
                </button>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AnimeDetail;
