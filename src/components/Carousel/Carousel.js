import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "./Carousel.css";
import { useNavigate } from "react-router-dom";

const Carousel = ({ animeList, speed = 2000, autoplaySpeed = 3000 }) => {
  const navigate = useNavigate();

  // Losowe sortowanie tablicy anime
  const shuffledAnimeList = [...animeList]
    .sort(() => Math.random() - 0.5)
    .slice(0, 50);

  // Ustawienia karuzeli
  const settings = {
    infinite: true, // Nieskończona pętla
    speed: 40000, // Prędkość animacji
    slidesToShow: 5, // Widoczne obrazy
    slidesToScroll: 20, // Liczba przesuwanych obrazów
    autoplay: true, // Automatyczne przesuwanie
    autoplaySpeed: 0, // Wyłączanie przerw między przesunięciami
    cssEase: "linear", // Ruch liniowy (płynny)
    pauseOnHover: false, // Zatrzymanie na hover
  };

  return (
    <div className="carousel-container">
      <Slider {...settings}>
        {shuffledAnimeList.map((anime) => (
          <div
            key={anime._id} // Użycie `_id` jako klucza
            className="carousel-slide"
            onClick={() => navigate(`/anime/${anime._id}`)} // Przekazanie `_id` w URL
          >
            <img src={anime.imageUrl} alt={anime.title} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Carousel;
