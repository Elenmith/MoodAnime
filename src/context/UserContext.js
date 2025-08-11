import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

// Initial state
const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true,
  error: null
};

// Action types
const USER_ACTIONS = {
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAIL: 'LOGIN_FAIL',
  LOGOUT: 'LOGOUT',
  REGISTER_SUCCESS: 'REGISTER_SUCCESS',
  REGISTER_FAIL: 'REGISTER_FAIL',
  USER_LOADED: 'USER_LOADED',
  AUTH_ERROR: 'AUTH_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  UPDATE_PROFILE: 'UPDATE_PROFILE',
  ADD_TO_WATCHLIST: 'ADD_TO_WATCHLIST',
  REMOVE_FROM_WATCHLIST: 'REMOVE_FROM_WATCHLIST',
  RATE_ANIME: 'RATE_ANIME'
};

// Reducer
const userReducer = (state, action) => {
  switch (action.type) {
    case USER_ACTIONS.LOGIN_SUCCESS:
    case USER_ACTIONS.REGISTER_SUCCESS:
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    
    case USER_ACTIONS.USER_LOADED:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    
    case USER_ACTIONS.LOGIN_FAIL:
    case USER_ACTIONS.REGISTER_FAIL:
    case USER_ACTIONS.AUTH_ERROR:
    case USER_ACTIONS.LOGOUT:
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload
      };
    
    case USER_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    
    case USER_ACTIONS.UPDATE_PROFILE:
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };
    
    case USER_ACTIONS.ADD_TO_WATCHLIST:
      return {
        ...state,
        user: {
          ...state.user,
          watchlist: [...state.user.watchlist, action.payload]
        }
      };
    
    case USER_ACTIONS.REMOVE_FROM_WATCHLIST:
      return {
        ...state,
        user: {
          ...state.user,
          watchlist: state.user.watchlist.filter(
            item => item.animeId !== action.payload
          )
        }
      };
    
    case USER_ACTIONS.RATE_ANIME:
      return {
        ...state,
        user: {
          ...state.user,
          watchlist: state.user.watchlist.map(item =>
            item.animeId === action.payload.animeId
              ? { ...item, rating: action.payload.rating, review: action.payload.review }
              : item
          )
        }
      };
    
    default:
      return state;
  }
};

// Create context
const UserContext = createContext();

// Provider component
export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  // Set auth token header
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  // Load user on mount
  useEffect(() => {
    if (state.token) {
      setAuthToken(state.token);
      loadUser();
    } else {
      setAuthToken(null);
      dispatch({ type: USER_ACTIONS.AUTH_ERROR });
    }
  }, [state.token]);

  // Load user from API
  const loadUser = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/profile`);
      dispatch({
        type: USER_ACTIONS.USER_LOADED,
        payload: res.data.user
      });
    } catch (error) {
      dispatch({
        type: USER_ACTIONS.AUTH_ERROR,
        payload: error.response?.data?.message || 'Authentication failed'
      });
    }
  };

  // Register user
  const register = async (userData) => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/users/register`, userData);
      dispatch({
        type: USER_ACTIONS.REGISTER_SUCCESS,
        payload: res.data
      });
      return { success: true };
    } catch (error) {
      dispatch({
        type: USER_ACTIONS.REGISTER_FAIL,
        payload: error.response?.data?.message || 'Registration failed'
      });
      return { success: false, error: error.response?.data };
    }
  };

  // Login user
  const login = async (credentials) => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/users/login`, credentials);
      dispatch({
        type: USER_ACTIONS.LOGIN_SUCCESS,
        payload: res.data
      });
      return { success: true };
    } catch (error) {
      dispatch({
        type: USER_ACTIONS.LOGIN_FAIL,
        payload: error.response?.data?.message || 'Login failed'
      });
      return { success: false, error: error.response?.data };
    }
  };

  // Logout user
  const logout = () => {
    dispatch({ type: USER_ACTIONS.LOGOUT });
  };

  // Update profile
  const updateProfile = async (profileData) => {
    try {
      const res = await axios.put(`${process.env.REACT_APP_API_URL}/api/users/profile`, profileData);
      dispatch({
        type: USER_ACTIONS.UPDATE_PROFILE,
        payload: res.data.user
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data };
    }
  };

  // Add to watchlist
  const addToWatchlist = async (animeId, status = 'plan_to_watch') => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/users/watchlist`, {
        animeId,
        status
      });
      dispatch({
        type: USER_ACTIONS.ADD_TO_WATCHLIST,
        payload: { animeId, status }
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data };
    }
  };

  // Remove from watchlist
  const removeFromWatchlist = async (animeId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/users/watchlist/${animeId}`);
      dispatch({
        type: USER_ACTIONS.REMOVE_FROM_WATCHLIST,
        payload: animeId
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data };
    }
  };

  // Rate anime
  const rateAnime = async (animeId, rating, review = '') => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/users/rate`, {
        animeId,
        rating,
        review
      });
      dispatch({
        type: USER_ACTIONS.RATE_ANIME,
        payload: { animeId, rating, review }
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data };
    }
  };

  // Get recommendations
  const getRecommendations = async (limit = 10) => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/recommendations?limit=${limit}`);
      return { success: true, data: res.data };
    } catch (error) {
      return { success: false, error: error.response?.data };
    }
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: USER_ACTIONS.CLEAR_ERROR });
  };

  const value = {
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    loading: state.loading,
    error: state.error,
    register,
    login,
    logout,
    updateProfile,
    addToWatchlist,
    removeFromWatchlist,
    rateAnime,
    getRecommendations,
    clearError
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use user context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
