import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Header.css"; // Import stylów
import { Link, useLocation } from "react-router-dom";

function Logo() {
  return (
    <Link to="/" className="header__logo">
      AnimeMood
    </Link>
  );
}

// Zrobić settera do bazy na endpoint animeList na 3 elementy albo skorzystać z postera i
// dopiero z niego wybrać title i go wypluć do searcha
function SearchNav() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  const searchAnime = async (animeId) => {
    if (!animeId) {
      setResults([]);
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:5000/api/anime/search?id=${animeId}`
      );
      setResults([response.data]); // Wynik jest obiektem, więc opakowujemy go w tablicę
    } catch (error) {
      console.error("Error fetching search results:", error.message);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchAnime(query); // Wysyłanie zapytania z ID
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSelect = (id) => {
    navigate(`/anime/${id}`);
    setQuery("");
    setResults([]);
  };

  return (
    <div className="header__search" style={{ position: "relative" }}>
      <input
        type="text"
        placeholder="Enter Anime ID"
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
