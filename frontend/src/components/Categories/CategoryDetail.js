import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./CategoryDetail.css";

const CategoryDetail = () => {
  const { genre } = useParams(); // Pobiera gatunek z URL
  const [animeList, setAnimeList] = useState([]); // Stan dla listy anime
  const [loading, setLoading] = useState(true); // Stan dla ładowania
  const [error, setError] = useState(null); // Obsługa błędów
  const navigate = useNavigate(); // Hook do nawigacji

  useEffect(() => {
    setLoading(true); // Rozpoczyna ładowanie przed fetch
    fetch(`${process.env.REACT_APP_API_URL}/api/categories/${genre}`)
) // Port 5000 dla backendu
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setAnimeList(data);
        setLoading(false); // Kończy ładowanie po fetch
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false); // Kończy ładowanie nawet przy błędzie
      });
  }, [genre]);

  if (loading) {
    return <div className="loading">Loading...</div>; // Wyświetla "Loading..." w trakcie ładowania
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="category-detail">
      <h1>Anime for category: {genre}</h1>
      {animeList.length > 0 ? (
        <div className="anime-grid">
          {animeList.map((anime) => (
            <div
              key={anime._id}
              className="anime-card"
              onClick={() => navigate(`/anime/${anime._id}`)} // Nawigacja po kliknięciu
            >
              <img
                src={anime.imageUrl}
                alt={anime.title}
                className="anime-poster-category"
              />
              <div className="anime-info">
                <h2>{anime.title}</h2>
                <p>Genres: {anime.genres.join(", ")}</p>
                <p>Rating: {anime.rating}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No anime found for this category.</p>
      )}
    </div>
  );
};

export default CategoryDetail;
