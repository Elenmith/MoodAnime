import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Moods.css";

const Moods = () => {
  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Funkcja pobierająca nastroje z backendu
    const fetchMoods = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/moods");
        setMoods(response.data);
      } catch (error) {
        console.error("Error fetching moods:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMoods();
  }, []);

  if (loading) return <p>Loading moods...</p>;

  return (
    <div className="moods-page">
      <h1>Moods</h1>
      <p>
        Select a mood to explore anime recommendations tailored to your current
        feelings.
      </p>
      <div className="moods-grid">
        {moods.map((mood, index) => (
          <Link
            to={`/moods/${mood.toLowerCase()}`}
            key={index}
            className="mood-card"
          >
            <div className="mood-content">
              <h2>{mood.charAt(0).toUpperCase() + mood.slice(1)}</h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Moods;
