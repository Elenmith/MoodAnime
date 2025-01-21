import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./MoodDetails.css";
import axios from "axios";

function MoodPage() {
  const { mood } = useParams(); // Pobiera nastrój z URL
  const [animeList, setAnimeList] = useState([]); // Stan dla listy anime
  const [loading, setLoading] = useState(true); // Stan dla ładowania
  const [error, setError] = useState(null); // Obsługa błędów
  const navigate = useNavigate(); // Hook do nawigacji

  // Pobierz URL API z zmiennej środowiskowej
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchAnime = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/anime/moods/${mood}`);
        setAnimeList(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        console.error("Błąd podczas pobierania anime:", err);
        setLoading(false);
      }
    };

    fetchAnime();
  }, [mood, API_URL]); // Dodano `API_URL` jako zależność

  if (loading) {
    return <p>Loading...</p>;
  }

  if (animeList.length === 0) {
    return <p>No anime found for mood: {mood}</p>;
  }

  return (
    <div className="mood-detail">
      <h1>Anime for mood: {mood}</h1>
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
                className="anime-poster-mood"
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
        <p>No anime found for this mood.</p>
      )}
    </div>
  );
}

export default MoodPage;
