import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

// Tworzymy kontekst
export const MoodContext = createContext();

// Provider dla MoodContext
export const MoodProvider = ({ children }) => {
  const [moods, setMoods] = useState([]); // Stan dla nastrojów
  const [loading, setLoading] = useState(true); // Stan ładowania
  const [error, setError] = useState(null); // Stan błędów

  useEffect(() => {
    // Funkcja do pobierania nastrojów z backendu
    const fetchMoods = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/moods"); // Endpoint backendu
        setMoods(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Błąd podczas pobierania nastrojów:", err);
        setError("Nie udało się pobrać nastrojów.");
        setLoading(false);
      }
    };

    fetchMoods(); // Wywołanie funkcji
  }, []);

  return (
    <MoodContext.Provider value={{ moods, loading, error }}>
      {children}
    </MoodContext.Provider>
  );
};
