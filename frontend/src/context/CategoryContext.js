import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

// Tworzymy kontekst kategorii
export const CategoryContext = createContext();

// Provider dla CategoryContext
export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]); // Stan dla kategorii
  const [loading, setLoading] = useState(true); // Stan ładowania
  const [error, setError] = useState(null); // Stan błędów

  const API_URL = process.env.REACT_APP_API_URL || "https://mood-for-anime-443a0efbedff.herokuapp.com";

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log("📡 Pobieranie kategorii z:", `${API_URL}/api/categories`);
        const response = await axios.get(`${API_URL}/api/categories`);
        setCategories(response.data);
        setLoading(false);
      } catch (err) {
        console.error("❌ Błąd podczas pobierania kategorii:", err);
        setError("Nie udało się pobrać kategorii.");
        setLoading(false);
      }
    };

    fetchCategories();
  }, [API_URL]);

  return (
    <CategoryContext.Provider value={{ categories, loading, error }}>
      {children}
    </CategoryContext.Provider>
  );
};
