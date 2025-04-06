import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Header.css";
import { Link, useLocation } from "react-router-dom";

function Logo() {
  return (
    <Link to="/" className="header__logo">
      AnimeMood
    </Link>
  );
}

function SearchNav() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  // Pobierz URL API z zmiennej środowiskowej
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
            background: "#fff",
            border: "1px solid #ccc",
            borderRadius: "5px",
            listStyle: "none",
            padding: "0",
            margin: "0",
            zIndex: 1000,
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
              }}
            >
              <img
                src={anime.imageUrl || "https://via.placeholder.com/40"} // Placeholder, jeśli brak obrazu
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

function NavLinks() {
  return (
    <nav className="header__nav">
      <Link to="/categories" className="header__link">
        Categories
      </Link>
      <Link to="/moods" className="header__link">
        Moods
      </Link>
    </nav>
  );
}

function NavSocial() {
  return (
    <div className="header__icons">
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

  // Zmienna określająca, czy jesteśmy na stronie głównej
  const isHomePage = location.pathname === "/";

  return (
    <header
      className={`header ${
        isHomePage ? "header--transparent" : "header--solid"
      }`}
    >
      <Logo />
      <NavLinks />
      <SearchNav />
      <NavSocial />
    </header>
  );
}

export default Header;
