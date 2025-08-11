import React, { useState, useEffect } from 'react';
import { useUser } from '../../context/UserContext';
import './UserProfile.css';

const UserProfile = () => {
  const { user, updateProfile, loading } = useUser();
  const [isEditing, setIsEditing] = useState(false);
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
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <h2>Profile</h2>
          {!isEditing && (
            <button
              className="edit-button"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </button>
          )}
        </div>

        {errors.general && (
          <div className="error-message">
            {errors.general}
          </div>
        )}

        {isEditing ? (
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
        ) : (
          <div className="profile-info">
            <div className="profile-avatar">
              {user.avatar ? (
                <img src={user.avatar} alt={user.username} />
              ) : (
                <div className="avatar-placeholder">
                  {user.username.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className="profile-details">
              <h3>{user.username}</h3>
              <p className="user-email">{user.email}</p>
              {user.bio && <p className="user-bio">{user.bio}</p>}
              
              <div className="user-stats">
                <div className="stat-item">
                  <span className="stat-number">{user.watchlist?.length || 0}</span>
                  <span className="stat-label">Anime in List</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">
                    {user.watchlist?.filter(item => item.status === 'completed').length || 0}
                  </span>
                  <span className="stat-label">Completed</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">
                    {user.watchlist?.filter(item => item.status === 'watching').length || 0}
                  </span>
                  <span className="stat-label">Watching</span>
                </div>
              </div>

              <div className="user-preferences">
                <h4>Preferences</h4>
                {user.preferences?.favoriteGenres?.length > 0 && (
                  <div className="preference-section">
                    <strong>Favorite Genres:</strong>
                    <div className="tags">
                      {user.preferences.favoriteGenres.map(genre => (
                        <span key={genre} className="tag">{genre}</span>
                      ))}
                    </div>
                  </div>
                )}
                
                {user.preferences?.favoriteMoods?.length > 0 && (
                  <div className="preference-section">
                    <strong>Favorite Moods:</strong>
                    <div className="tags">
                      {user.preferences.favoriteMoods.map(mood => (
                        <span key={mood} className="tag">{mood}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
