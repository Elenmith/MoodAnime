import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./CategoryDetail.css";

const CategoryDetail = () => {
  const { category } = useParams();
  const [animeList, setAnimeList] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchCategoryAnime = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/anime/genre/${category}?page=${page}&limit=16`
        );
        setAnimeList(res.data.anime);
        setTotalPages(res.data.totalPages);
        setLoading(false);
      } catch (err) {
        console.error("❌ Error fetching category anime:", err.message);
        setLoading(false);
      }
    };

    fetchCategoryAnime();
  }, [category, page, API_URL]);
  
  if (loading) {
    return <div className="loading">Loading...</div>; // Wyświetla "Loading..." w trakcie ładowania
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="category-detail">
      <h1>Category: {category}</h1>
      {loading ? (
        <p>Loading...</p>
      ) : animeList.length === 0 ? (
        <p>No anime found in this category.</p>
      ) : (
        <>
          <div className="anime-grid">
            {animeList.map((anime) => (
              <div
                key={anime._id}
                className="anime-card"
                onClick={() => navigate(`/anime/${anime._id}`)}
              >
                <img src={anime.imageUrl} alt={anime.title} />
                <h3>{anime.title}</h3>
              </div>
            ))}
          </div>

          <div className="pagination">
            <button onClick={() => setPage(1)} disabled={page === 1}>
              ⏮
            </button>
            <button onClick={() => setPage(page - 1)} disabled={page === 1}>
              ◀️
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              ▶️
            </button>
            <button
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages}
            >
              ⏭
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default CategoryDetail;
