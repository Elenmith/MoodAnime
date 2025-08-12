import React, { useEffect, useState } from "react";
import axios from "axios";
import { HelmetProvider } from 'react-helmet-async';
import Header from "./components/Header/Header";
import Main from "./components/Main/Main";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MoodProvider } from "./context/MoodContext";
import { CategoryProvider } from "./context/CategoryContext"; 
import { ThemeProvider } from "./context/ThemeContext";
import { UserProvider } from "./context/UserContext";
// import { AdProvider } from "./context/AdContext"; // NEW: Ad context
import MoodPage from "./components/MoodPage/MoodPage";
import AnimeDetail from "./components/AnimeDetail";
import Footer from "./components/Footer/Footer";
import Categories from "./components/Categories/Categories";
import CategoryDetail from "./components/Categories/CategoryDetail";
import Moods from "./components/Moods/Moods";
import NotFound from "./components/NotFound/NotFound";
import About from "./components/About/About";
import Contact from "./components/Contact/Contact";
import PrivacyPolicy from "./components/PrivacyPolicy/PrivacyPolicy";
import TermsOfService from "./components/TermsOfService/TermsOfService";
import Auth from "./components/Auth/Auth";
import UserProfile from "./components/User/UserProfile";
import Recommendations from "./components/Recommendations/Recommendations";
import Discover from "./components/Discover/Discover";
import PlatformDetail from "./components/Platform/PlatformDetail";
import TestAffiliate from "./components/TestAffiliate/TestAffiliate";
// import CookieConsent from "./components/Ads/CookieConsent"; // NEW: Cookie consent

function App() {
  const [animeList, setAnimeList] = useState([]);

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    axios
      .get(`${API_URL}/anime?limit=20`) // Użyj zmiennej środowiskowej dla adresu API
      .then((response) => setAnimeList(response.data.anime || response.data))
      .catch((error) => console.error("Błąd podczas pobierania anime:", error));
  }, [API_URL]); 

  return (
    <HelmetProvider>
      <ThemeProvider>
        <UserProvider>
          {/* <AdProvider> NEW: Wrap with AdProvider */}
            <Router>
              <MoodProvider>
                <CategoryProvider> 
                  <div className="app-container">
                    <Header />
                    <Routes>
                      <Route path="/" element={<Main />} />
                      <Route path="/discover" element={<Discover />} />
                      <Route path="/platform/:platformId" element={<PlatformDetail />} />
                      <Route path="/test-affiliate" element={<TestAffiliate />} />
                      <Route path="/categories" element={<Categories />} />
                      <Route path="/categories/:category" element={<CategoryDetail />} />
                      <Route path="/moods" element={<Moods />} />
                      <Route path="/moods/:mood" element={<MoodPage />} />
                      <Route path="/anime/:id" element={<AnimeDetail />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/privacy" element={<PrivacyPolicy />} />
                      <Route path="termsofservice" element={<TermsOfService />} />
                      <Route path="/auth" element={<Auth />} />
                      <Route path="/profile" element={<UserProfile />} />
                      <Route path="/recommendations" element={<Recommendations />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                    <Footer />
                    {/* <CookieConsent /> NEW: Cookie consent banner */}
                  </div>
                </CategoryProvider>
              </MoodProvider>
            </Router>
          {/* </AdProvider> */}
        </UserProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
