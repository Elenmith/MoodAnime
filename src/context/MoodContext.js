import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

// Tworzymy kontekst
export const MoodContext = createContext();

// Provider dla MoodContext
export const MoodProvider = ({ children }) => {
  const [moods, setMoods] = useState([]); // Stan dla nastrojów
  const [loading, setLoading] = useState(true); // Stan ładowania
  const [error, setError] = useState(null); // Stan błędów

  const API_URL = process.env.REACT_APP_API_URL || "https://mood-for-anime-443a0efbedff.herokuapp.com";

  useEffect(() => {
    // Funkcja do pobierania nastrojów z backendu
    const fetchMoods = async () => {
      try {
        console.log("📡 Pobieranie nastrojów z:", `${API_URL}/api/moods`);
        const response = await axios.get(`${API_URL}/api/moods`);
        setMoods(response.data);
        setLoading(false);
      } catch (err) {
        console.error("❌ Błąd podczas pobierania nastrojów:", err);
        setError("Nie udało się pobrać nastrojów.");
        setLoading(false);
      }
    };

    fetchMoods(); // Wywołanie funkcji
  }, [API_URL]);

  return (
    <MoodContext.Provider value={{ moods, loading, error }}>
      {children}
    </MoodContext.Provider>
  );
};
