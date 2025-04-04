import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./AnimeDetail.css";

const AnimeDetail = () => {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);

  // Pobierz URL backendu z zmiennej środowiskowej
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchAnimeDetails = async () => {
      try {
        const response = await fetch(`${API_URL}/api/anime/${id}`);
        const data = await response.json();
        setAnime(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching anime details:", err);
        setLoading(false);
      }
    };

    fetchAnimeDetails();
  }, [id, API_URL]); // Dodano `API_URL` jako zależność

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!anime) {
    return <p>Anime not found</p>;
  }

  return (
    <div className="anime-detail">
      {/* Sekcja głównego baneru */}
      <div className="anime-banner"></div>

      {/* Sekcja głównego nagłówka */}
      <div className="anime-header">
        <div className="anime-poster">
          <img src={anime.imageUrl} alt={anime.title} />
        </div>
        <div className="anime-info">
          <h1>{anime.title}</h1>
          <p className="anime-description">{anime.synopsis}</p>
          <div className="anime-meta">
            <p>
              <strong>Director:</strong> {anime.director || "Unknown"}
            </p>
            <p>
              <strong>Release Date:</strong> {anime.releaseDate || "Unknown"}
            </p>
            <p>
              <strong>Duration:</strong> {anime.duration || "Unknown"}
            </p>
            <p>
              <strong>Rating:</strong> {anime.rating || "N/A"} ⭐
            </p>
          </div>
        </div>
      </div>

      {/* Sekcja gatunków */}
      <div className="anime-genres">
        {anime.genres?.map((genre, index) => (
          <span key={index} className="anime-genre">
            {genre}
          </span>
        ))}
      </div>

      {/* Galeria */}
      <div className="anime-gallery">
        <h2>Gallery</h2>
        <div className="gallery-images">
          {anime.gallery?.map((image, index) => (
            <img key={index} src={image} alt={`Gallery ${index}`} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnimeDetail;
