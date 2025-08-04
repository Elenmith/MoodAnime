import React from "react";
import { useNavigate } from "react-router-dom";
import "./FeaturedAnime.css";

const FeaturedAnime = ({ loading, featuredAnime }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    if (featuredAnime && featuredAnime._id) {
      navigate(`/anime/${featuredAnime._id}`);
    }
  };

  const handleGenreClick = (genre) => {
    navigate(`/categories/${genre.toLowerCase()}`);
  };

  const handleMoodClick = (mood) => {
    navigate(`/moods/${mood}`);
  };

  if (loading) {
    return (
      <div className="featured-anime-container">
        <div className="featured-anime-loading">
          <div className="loading-spinner"></div>
          <p>Loading today's recommendation...</p>
        </div>
      </div>
    );
  }

  if (!featuredAnime) {
    return (
      <div className="featured-anime-container">
        <div className="featured-anime-error">
          <p>No recommendation available today.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="featured-anime-container">
      <div className="featured-anime-card">
        <div className="featured-anime-image-container">
          <img 
            src={featuredAnime.imageUrl} 
            alt={featuredAnime.title} 
            className="featured-anime-image"
          />
          <div className="featured-anime-overlay">
            <span className="featured-badge">Today's Pick</span>
          </div>
        </div>
        
        <div className="featured-anime-content">
          <h2 className="featured-anime-title">{featuredAnime.title}</h2>
          
          <div className="featured-anime-rating">
            <span className="rating-stars">
              {'⭐'.repeat(Math.floor(featuredAnime.rating || 0))}
            </span>
            <span className="rating-number">{featuredAnime.rating || 'N/A'}</span>
          </div>

          {featuredAnime.genres && featuredAnime.genres.length > 0 && (
            <div className="featured-anime-genres">
              {featuredAnime.genres.slice(0, 3).map((genre, index) => (
                <span 
                  key={index} 
                  className="genre-tag"
                  onClick={() => handleGenreClick(genre)}
                >
                  {genre}
                </span>
              ))}
            </div>
          )}

          {featuredAnime.moods && featuredAnime.moods.length > 0 && (
            <div className="featured-anime-moods">
              <span className="moods-label">Moods:</span>
              {featuredAnime.moods.slice(0, 4).map((mood, index) => (
                <span 
                  key={index} 
                  className="mood-tag"
                  onClick={() => handleMoodClick(mood)}
                >
                  {mood}
                </span>
              ))}
            </div>
          )}

          {featuredAnime.synopsis && (
            <p className="featured-anime-description">
              {featuredAnime.synopsis.length > 150 
                ? `${featuredAnime.synopsis.substring(0, 150)}...` 
                : featuredAnime.synopsis
              }
            </p>
          )}

          <div className="featured-anime-details">
            {featuredAnime.duration && (
              <span className="detail-item">⏱️ {featuredAnime.duration}</span>
            )}
            {featuredAnime.releaseDate && (
              <span className="detail-item">📅 {featuredAnime.releaseDate}</span>
            )}
          </div>

          <button 
            className="featured-anime-button"
            onClick={handleViewDetails}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedAnime;
