import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Header.css";
import { Link, useLocation } from "react-router-dom";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import { useUser } from "../../context/UserContext";

function Logo() {
  return (
    <Link to="/" className="header__logo">
      Mood4Anime
    </Link>
  );
}

function SearchNav() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL;

  const searchAnime = useCallback(
    async (titleQuery) => {
      if (!titleQuery || titleQuery.length < 2) {
        setResults([]);
        return;
      }

      try {
        const response = await axios.get(
          `${API_URL}/api/anime/search?title=${encodeURIComponent(titleQuery)}`
        );
        setResults(response.data);
      } catch (error) {
        console.error("Error fetching search results:", error.message);
      }
    },
    [API_URL]
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchAnime(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, searchAnime]);

  const handleSelect = (id) => {
    navigate(`/anime/${id}`);
    setQuery("");
    setResults([]);
  };

  return (
    <div className="header__search" style={{ position: "relative" }}>
      <input
        type="text"
        placeholder="Search anime by title..."
        className="header__search-input"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {results.length > 0 && (
        <ul
          className="header__search-results"
          style={{
            position: "absolute",
            top: "40px",
            width: "100%",
            background: "var(--card-bg)",
            border: "1px solid var(--border-color)",
            borderRadius: "5px",
            listStyle: "none",
            padding: "0",
            margin: "0",
            zIndex: 1000,
            boxShadow: "var(--shadow)",
          }}
        >
          {results.map((anime) => (
            <li
              key={anime._id}
              onClick={() => handleSelect(anime._id)}
              style={{
                padding: "10px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                color: "var(--text-primary)",
                transition: "background-color 0.2s ease",
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = "var(--hover-bg)"}
              onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
            >
              <img
                src={anime.imageUrl || "https://via.placeholder.com/40"}
                alt={anime.title}
                style={{ width: "40px", height: "40px", marginRight: "10px" }}
              />
              {anime.title || "No title available"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function NavLinks({ isOpen, onLinkClick }) {
  const { isAuthenticated } = useUser();
  
  return (
    <nav className={`header__nav ${isOpen ? "is-open" : ""}`}>
      <Link to="/categories" className="header__link" onClick={onLinkClick}>
        Categories
      </Link>
      <Link to="/moods" className="header__link" onClick={onLinkClick}>
        Moods
      </Link>
      {isAuthenticated && (
        <Link to="/recommendations" className="header__link" onClick={onLinkClick}>
          Recommendations
        </Link>
      )}
    </nav>
  );
}

function UserMenu() {
  const { user, isAuthenticated, logout } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  if (!isAuthenticated) {
    return (
      <Link to="/auth" className="header__auth-button">
        Sign In
      </Link>
    );
  }

  return (
    <div className="header__user-menu">
      <button
        className="header__user-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="User menu"
      >
        {user?.avatar ? (
          <img src={user.avatar} alt={user.username} className="header__user-avatar" />
        ) : (
          <div className="header__user-avatar-placeholder">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
        )}
      </button>
      
      {isOpen && (
        <div className="header__user-dropdown">
          <div className="header__user-info">
            <span className="header__user-name">{user?.username}</span>
            <span className="header__user-email">{user?.email}</span>
          </div>
          <Link to="/profile" className="header__dropdown-item" onClick={() => setIsOpen(false)}>
            <i className="fa fa-user"></i>
            Profile
          </Link>
          <button className="header__dropdown-item" onClick={handleLogout}>
            <i className="fa fa-sign-out"></i>
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}

function NavSocial() {
  return (
    <div className="header__icons">
      <ThemeToggle />
      <UserMenu />
      <button className="header__icon header__icon--youtube">
        <i className="fa fa-youtube"></i>
      </button>
      <button className="header__icon header__icon--instagram">
        <i className="fa fa-instagram"></i>
      </button>
      <button className="header__icon header__icon--close">
        <i className="fa fa-times"></i>
      </button>
    </div>
  );
}

function Header() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className={`header ${
        isHomePage ? "header--transparent" : "header--solid"
      }`}
    >
      <Logo />

      <button
        className="hamburger"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle navigation"
      >
        ☰
      </button>

      <NavLinks isOpen={menuOpen} onLinkClick={() => setMenuOpen(false)} />

      <SearchNav />
      <NavSocial />
    </header>
  );
}

export default Header;
