import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./components/Header/Header";
import Main from "./components/Main/Main";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MoodProvider } from "./context/MoodContext";
import MoodPage from "./components/MoodPage/MoodPage";
import AnimeDetail from "./components/AnimeDetail";
import Footer from "./components/Footer/Footer";
import Categories from "./components/Categories/Categories";
import CategoryDetail from "./components/Categories/CategoryDetail";
import Moods from "./components/Moods/Moods";
import NotFound from "./components/NotFound";
import About from "./components/About/About";

function App() {
  const [animeList, setAnimeList] = useState([]);

  // Pobierz URL backendu z zmiennej środowiskowej
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    axios
      .get(`${API_URL}/anime`) // Użyj zmiennej środowiskowej dla adresu API
      .then((response) => setAnimeList(response.data))
      .catch((error) => console.error("Błąd podczas pobierania anime:", error));
  }, [API_URL]); // Dodaj API_URL jako zależność

  return (
    <Router>
      <MoodProvider>
        <Header />
        <Routes>
          {/* Strona główna */}
          <Route path="/" element={<Main />} />

          {/* Strona szczegółowa anime */}
          <Route path="/anime/:id" element={<AnimeDetail />} />

          <Route path="/categories" element={<Categories />} />

          <Route path="/categories/:genre" element={<CategoryDetail />} />

          <Route path="/moods" element={<Moods />} />

          <Route path="/moods/:mood" element={<MoodPage />} />

          <Route path="/about" element={<About />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </MoodProvider>
    </Router>
  );
}

export default App;
