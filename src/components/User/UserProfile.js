import React, { useState, useEffect } from 'react';
import { useUser } from '../../context/UserContext';
import { Link } from 'react-router-dom';
import './UserProfile.css';

const UserProfile = () => {
  const { user, updateProfile, loading } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    avatar: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        bio: user.bio || '',
        avatar: user.avatar || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (formData.username.length > 30) {
      newErrors.username = 'Username must be less than 30 characters';
    }

    if (formData.bio && formData.bio.length > 500) {
      newErrors.bio = 'Bio must be less than 500 characters';
    }

    if (formData.avatar && !/^https?:\/\/.+/.test(formData.avatar)) {
      newErrors.avatar = 'Avatar must be a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      const result = await updateProfile(formData);
      if (result.success) {
        setIsEditing(false);
        setErrors({});
      } else {
        setErrors({
          general: result.error?.message || 'Failed to update profile'
        });
      }
    } catch (err) {
      setErrors({
        general: 'An unexpected error occurred'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      username: user.username || '',
      bio: user.bio || '',
      avatar: user.avatar || ''
    });
    setErrors({});
    setIsEditing(false);
  };

  const getWatchlistStats = () => {
    if (!user?.watchlist) return { total: 0, completed: 0, watching: 0, planToWatch: 0, dropped: 0 };
    
    return {
      total: user.watchlist.length,
      completed: user.watchlist.filter(item => item.status === 'completed').length,
      watching: user.watchlist.filter(item => item.status === 'watching').length,
      planToWatch: user.watchlist.filter(item => item.status === 'plan_to_watch').length,
      dropped: user.watchlist.filter(item => item.status === 'dropped').length
    };
  };

  const getWatchlistByStatus = (status) => {
    if (!user?.watchlist) return [];
    return user.watchlist.filter(item => item.status === status);
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="profile-loading">
          <div className="loading-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-container">
        <div className="profile-error">
          <h2>Not Authenticated</h2>
          <p>Please log in to view your profile.</p>
          <Link to="/auth" className="auth-link">Sign In</Link>
        </div>
      </div>
    );
  }

  const stats = getWatchlistStats();

  return (
    <div className="profile-container">
      <div className="profile-hero">
        <div className="profile-hero-content">
          <div className="profile-avatar-large">
            {user.avatar ? (
              <img src={user.avatar} alt={user.username} />
            ) : (
              <div className="avatar-placeholder-large">
                {user.username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="profile-hero-info">
            <h1>{user.username}</h1>
            <p className="user-email">{user.email}</p>
            {user.bio && <p className="user-bio-hero">{user.bio}</p>}
            <div className="profile-actions">
              <button
                className="edit-profile-button"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-tabs">
          <button 
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab-button ${activeTab === 'watchlist' ? 'active' : ''}`}
            onClick={() => setActiveTab('watchlist')}
          >
            Watchlist ({stats.total})
          </button>
          <button 
            className={`tab-button ${activeTab === 'preferences' ? 'active' : ''}`}
            onClick={() => setActiveTab('preferences')}
          >
            Preferences
          </button>
        </div>

        {errors.general && (
          <div className="error-message">
            {errors.general}
          </div>
        )}

        {isEditing ? (
          <div className="profile-edit-section">
            <h3>Edit Profile</h3>
            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={errors.username ? 'error' : ''}
                  disabled={isSubmitting}
                />
                {errors.username && <span className="error-text">{errors.username}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className={errors.bio ? 'error' : ''}
                  rows="4"
                  placeholder="Tell us about yourself..."
                  disabled={isSubmitting}
                />
                {errors.bio && <span className="error-text">{errors.bio}</span>}
                <small className="help-text">
                  {formData.bio.length}/500 characters
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="avatar">Avatar URL</label>
                <input
                  type="url"
                  id="avatar"
                  name="avatar"
                  value={formData.avatar}
                  onChange={handleChange}
                  className={errors.avatar ? 'error' : ''}
                  placeholder="https://example.com/avatar.jpg"
                  disabled={isSubmitting}
                />
                {errors.avatar && <span className="error-text">{errors.avatar}</span>}
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="save-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="profile-tab-content">
            {activeTab === 'overview' && (
              <div className="overview-tab">
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon">📺</div>
                    <div className="stat-content">
                      <span className="stat-number">{stats.total}</span>
                      <span className="stat-label">Total Anime</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">✅</div>
                    <div className="stat-content">
                      <span className="stat-number">{stats.completed}</span>
                      <span className="stat-label">Completed</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">👀</div>
                    <div className="stat-content">
                      <span className="stat-number">{stats.watching}</span>
                      <span className="stat-label">Watching</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">📋</div>
                    <div className="stat-content">
                      <span className="stat-number">{stats.planToWatch}</span>
                      <span className="stat-label">Plan to Watch</span>
                    </div>
                  </div>
                </div>

                <div className="recent-activity">
                  <h3>Recent Activity</h3>
                  {user.watchlist && user.watchlist.length > 0 ? (
                    <div className="recent-anime">
                      {user.watchlist.slice(0, 5).map((item, index) => (
                        <div key={index} className="recent-anime-item">
                          <div className="anime-poster">
                            <img src={item.imageUrl || "https://via.placeholder.com/60"} alt={item.title} />
                          </div>
                          <div className="anime-info">
                            <h4>{item.title}</h4>
                            <span className={`status-badge status-${item.status}`}>
                              {item.status.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="no-activity">No anime in your watchlist yet. Start exploring!</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'watchlist' && (
              <div className="watchlist-tab">
                <div className="watchlist-filters">
                  <button 
                    className={`filter-button ${activeTab === 'all' ? 'active' : ''}`}
                    onClick={() => setActiveTab('all')}
                  >
                    All ({stats.total})
                  </button>
                  <button 
                    className={`filter-button ${activeTab === 'watching' ? 'active' : ''}`}
                    onClick={() => setActiveTab('watching')}
                  >
                    Watching ({stats.watching})
                  </button>
                  <button 
                    className={`filter-button ${activeTab === 'completed' ? 'active' : ''}`}
                    onClick={() => setActiveTab('completed')}
                  >
                    Completed ({stats.completed})
                  </button>
                  <button 
                    className={`filter-button ${activeTab === 'plan_to_watch' ? 'active' : ''}`}
                    onClick={() => setActiveTab('plan_to_watch')}
                  >
                    Plan to Watch ({stats.planToWatch})
                  </button>
                </div>

                <div className="watchlist-grid">
                  {user.watchlist && user.watchlist.length > 0 ? (
                    user.watchlist.map((item, index) => (
                      <div key={index} className="watchlist-item">
                        <div className="anime-poster">
                          <img src={item.imageUrl || "https://via.placeholder.com/120"} alt={item.title} />
                          <div className="anime-overlay">
                            <Link to={`/anime/${item.animeId}`} className="view-button">
                              View Details
                            </Link>
                          </div>
                        </div>
                        <div className="anime-details">
                          <h4>{item.title}</h4>
                          <span className={`status-badge status-${item.status}`}>
                            {item.status.replace('_', ' ')}
                          </span>
                          {item.rating && (
                            <div className="rating">
                              <span className="stars">{'★'.repeat(item.rating)}{'☆'.repeat(5-item.rating)}</span>
                              <span className="rating-text">{item.rating}/5</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-watchlist">
                      <div className="empty-icon">📺</div>
                      <h3>Your watchlist is empty</h3>
                      <p>Start adding anime to your watchlist to see them here!</p>
                      <Link to="/" className="browse-button">Browse Anime</Link>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="preferences-tab">
                <div className="preferences-section">
                  <h3>Favorite Genres</h3>
                  {user.preferences?.favoriteGenres?.length > 0 ? (
                    <div className="tags">
                      {user.preferences.favoriteGenres.map(genre => (
                        <span key={genre} className="tag">{genre}</span>
                      ))}
                    </div>
                  ) : (
                    <p className="no-preferences">No favorite genres set yet.</p>
                  )}
                </div>
                
                <div className="preferences-section">
                  <h3>Favorite Moods</h3>
                  {user.preferences?.favoriteMoods?.length > 0 ? (
                    <div className="tags">
                      {user.preferences.favoriteMoods.map(mood => (
                        <span key={mood} className="tag">{mood}</span>
                      ))}
                    </div>
                  ) : (
                    <p className="no-preferences">No favorite moods set yet.</p>
                  )}
                </div>

                <div className="preferences-section">
                  <h3>Account Information</h3>
                  <div className="account-info">
                    <div className="info-item">
                      <span className="info-label">Member since:</span>
                      <span className="info-value">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Last updated:</span>
                      <span className="info-value">
                        {new Date(user.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
