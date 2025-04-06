import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./components/Header/Header";
import Main from "./components/Main/Main";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MoodProvider } from "./context/MoodContext";
import { CategoryProvider } from "./context/CategoryContext"; 
import MoodPage from "./components/MoodPage/MoodPage";
import AnimeDetail from "./components/AnimeDetail";
import Footer from "./components/Footer/Footer";
import Categories from "./components/Categories/Categories";
import CategoryDetail from "./components/Categories/CategoryDetail";
import Moods from "./components/Moods/Moods";
import NotFound from "./components/NotFound";
import About from "./components/About/About";
import Contact from "./components/Contact/Contact";

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
        <CategoryProvider> 
          <div className="app-container">
            <Header />
            <Routes>
              <Route path="/" element={<Main />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/categories/:genre" element={<CategoryDetail />} />
              <Route path="/moods" element={<Moods />} />
              <Route path="/moods/:mood" element={<MoodPage />} />
              <Route path="/anime/:id" element={<AnimeDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
          </div>
        </CategoryProvider>
      </MoodProvider>
    </Router>
  );
}

export default App;
