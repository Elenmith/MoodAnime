import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./CategoryDetail.css";

const CategoryDetail = () => {
  const { genre } = useParams(); // Pobiera gatunek z URL
  const [animeList, setAnimeList] = useState([]); // Stan dla listy anime
  const [loading, setLoading] = useState(true); // Stan dla ładowania
  const [error, setError] = useState(null); // Obsługa błędów
  const navigate = useNavigate(); // Hook do nawigacji
  
  const API_URL = process.env.REACT_APP_API_URL || "https://mood-for-anime-443a0efbedff.herokuapp.com";


  console.log(genre);
  console.log("API_URL:", API_URL);
  console.log("Fetching from:", `${API_URL}/api/categories/${genre}`);
  console.log("🚀 Renderowanie CategoryDetail!");
  console.log("📌 Otrzymany genre:", genre);
  console.log("📡 Pobieram dane z API:", `${API_URL}/api/categories/${genre}`);

  useEffect(() => {
  setLoading(true);

  const fetchAnime = async () => {
    try {
      console.log("Fetching from:", `${API_URL}/api/categories/${genre}`);
      const response = await axios.get(`${API_URL}/api/categories/${genre}`);
      console.log("Response:", response.data);
      setAnimeList(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Błąd pobierania anime:", err);
      setError(err.message);
      setLoading(false);
    }
  };

    

  fetchAnime();
}, [genre, API_URL]);
  
  console.log("📝 Lista anime:", animeList);
  
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
