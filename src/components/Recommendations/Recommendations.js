import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Recommendations.css';

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('all');

  useEffect(() => {
    fetchRecommendations();
    fetchStats();
  }, [selectedAlgorithm]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Musisz być zalogowany, aby zobaczyć rekomendacje');
        setLoading(false);
        return;
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const params = { limit: 20 };
      if (selectedAlgorithm !== 'all') {
        params.algorithm = selectedAlgorithm;
      }

      const response = await axios.get('/api/recommendations', config, { params });
      
      if (response.data.success) {
        setRecommendations(response.data.data);
      } else {
        setError('Nie udało się pobrać rekomendacji');
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      if (error.response?.status === 400) {
        setError('Potrzebujesz ocenić przynajmniej 3 anime, aby otrzymać rekomendacje');
      } else {
        setError('Błąd podczas pobierania rekomendacji');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const response = await axios.get('/api/recommendations/stats', config);
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const generateNewRecommendations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const response = await axios.post('/api/recommendations/generate', { limit: 20 }, config);
      
      if (response.data.success) {
        await fetchRecommendations();
        await fetchStats();
      }
    } catch (error) {
      console.error('Error generating recommendations:', error);
      setError('Błąd podczas generowania rekomendacji');
    } finally {
      setLoading(false);
    }
  };

  const markAsViewed = async (animeId) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      await axios.post(`/api/recommendations/${animeId}/view`, {}, config);
      
      // Usuń z listy rekomendacji
      setRecommendations(prev => prev.filter(rec => rec.anime.id !== animeId));
    } catch (error) {
      console.error('Error marking as viewed:', error);
    }
  };

  const getAlgorithmColor = (algorithm) => {
    switch (algorithm) {
      case 'collaborative': return '#667eea';
      case 'content-based': return '#f093fb';
      case 'hybrid': return '#4facfe';
      default: return '#666';
    }
  };

  const getReasonText = (reason) => {
    switch (reason) {
      case 'similar_users': return 'Podobni użytkownicy';
      case 'similar_genres': return 'Podobne gatunki';
      case 'similar_moods': return 'Podobne nastroje';
      case 'high_rated': return 'Wysoko ocenione';
      case 'popular': return 'Popularne';
      default: return reason;
    }
  };

  if (loading) {
    return (
      <div className="recommendations-container">
        <div className="recommendations-loading">
          <div className="loading-spinner"></div>
          <p>Ładowanie rekomendacji...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="recommendations-container">
        <div className="recommendations-error">
          <h3>Błąd</h3>
          <p>{error}</p>
          {error.includes('Potrzebujesz ocenić') && (
            <button onClick={() => window.location.href = '/profile'} className="rate-button">
              Oceń anime
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="recommendations-container">
      <div className="recommendations-header">
        <h2>Rekomendacje dla Ciebie</h2>
        <div className="recommendations-controls">
          <select 
            value={selectedAlgorithm} 
            onChange={(e) => setSelectedAlgorithm(e.target.value)}
            className="algorithm-select"
          >
            <option value="all">Wszystkie algorytmy</option>
            <option value="collaborative">Collaborative Filtering</option>
            <option value="content-based">Content-Based</option>
            <option value="hybrid">Hybrid</option>
          </select>
          <button onClick={generateNewRecommendations} className="generate-button">
            Wygeneruj nowe
          </button>
        </div>
      </div>

      {stats && (
        <div className="recommendations-stats">
          <div className="stat-item">
            <span className="stat-number">{stats.total}</span>
            <span className="stat-label">Wszystkie rekomendacje</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{stats.viewed}</span>
            <span className="stat-label">Obejrzane</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{stats.viewRate}%</span>
            <span className="stat-label">Współczynnik oglądania</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{stats.averageScore.toFixed(2)}</span>
            <span className="stat-label">Średni score</span>
          </div>
        </div>
      )}

      {recommendations.length === 0 ? (
        <div className="no-recommendations">
          <h3>Brak rekomendacji</h3>
          <p>Oceń więcej anime, aby otrzymać spersonalizowane rekomendacje</p>
          <button onClick={generateNewRecommendations} className="generate-button">
            Wygeneruj rekomendacje
          </button>
        </div>
      ) : (
        <div className="recommendations-grid">
          {recommendations.map((recommendation) => (
            <div key={recommendation.id} className="recommendation-card">
              <div className="recommendation-image">
                <img src={recommendation.anime.imageUrl} alt={recommendation.anime.title} />
                <div className="recommendation-overlay">
                  <button 
                    onClick={() => markAsViewed(recommendation.anime.id)}
                    className="view-button"
                  >
                    Obejrzane
                  </button>
                </div>
              </div>
              
              <div className="recommendation-content">
                <h3 className="recommendation-title">{recommendation.anime.title}</h3>
                
                <div className="recommendation-meta">
                  <div className="recommendation-rating">
                    <span className="rating-stars">★</span>
                    <span>{recommendation.anime.rating}</span>
                  </div>
                  
                  <div className="recommendation-score">
                    <span className="score-label">Score:</span>
                    <span className="score-value">{(recommendation.score * 10).toFixed(1)}</span>
                  </div>
                </div>

                <div className="recommendation-algorithm">
                  <span 
                    className="algorithm-badge"
                    style={{ backgroundColor: getAlgorithmColor(recommendation.algorithm) }}
                  >
                    {recommendation.algorithm}
                  </span>
                  <span className="reason-text">{getReasonText(recommendation.reason)}</span>
                </div>

                <div className="recommendation-genres">
                  {recommendation.anime.genres.slice(0, 3).map((genre, index) => (
                    <span key={index} className="genre-tag">{genre}</span>
                  ))}
                </div>

                {recommendation.anime.synopsis && (
                  <p className="recommendation-synopsis">
                    {recommendation.anime.synopsis.length > 100 
                      ? `${recommendation.anime.synopsis.substring(0, 100)}...`
                      : recommendation.anime.synopsis
                    }
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Recommendations;
