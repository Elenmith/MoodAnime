import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "./Carousel.css";
import { useNavigate } from "react-router-dom";

const Carousel = ({ animeList, speed = 2000, autoplaySpeed = 3000 }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Debug logging
  console.log("🎠 Carousel received animeList:", animeList?.length || 0, "items");

  // Losowe sortowanie tablicy anime
  const shuffledAnimeList = [...animeList]
    .sort(() => Math.random() - 0.5)
    .slice(0, 20); // Zmniejszam do 20 anime dla lepszej wydajności

  console.log("🎠 Carousel shuffled list:", shuffledAnimeList?.length || 0, "items");

  useEffect(() => {
    // Krótkie opóźnienie żeby pokazać loading state
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [animeList]);

  const handleImageError = (e) => {
    // Zastąp uszkodzony obraz placeholderem
    e.target.src = 'https://via.placeholder.com/200x300/cccccc/666666?text=Anime';
  };

  // Poprawione ustawienia karuzeli
  const settings = {
    infinite: true,
    speed: 1000, // Wolniejsza animacja
    slidesToShow: 5,
    slidesToScroll: 1, // Przewijaj po 1 slajdzie
    autoplay: true,
    autoplaySpeed: 3000, // 3 sekundy między slajdami
    cssEase: "ease-in-out",
    pauseOnHover: true, // Zatrzymaj na hover
    dots: false,
    arrows: false,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  // Pokaż loading jeśli dane się jeszcze ładują
  if (isLoading) {
    return (
      <div className="carousel-loading">
        <div className="loading-spinner"></div>
        <p>Loading amazing anime...</p>
      </div>
    );
  }

  // Pokaż error jeśli nie ma danych
  if (!shuffledAnimeList || shuffledAnimeList.length === 0) {
    return (
      <div className="carousel-error">
        <p>No anime available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="carousel-container">
      <Slider {...settings}>
        {shuffledAnimeList.map((anime) => (
          <div
            key={anime._id}
            className="carousel-slide"
            onClick={() => navigate(`/anime/${anime._id}`)}
          >
            <img 
              src={anime.imageUrl} 
              alt={anime.title}
              onError={handleImageError}
              loading="lazy"
            />
            <div className="carousel-slide-overlay">
              <h3>{anime.title}</h3>
              <p className="rating">⭐ {anime.rating}</p>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Carousel;
