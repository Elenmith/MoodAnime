import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "./Carousel.css";
import { useNavigate } from "react-router-dom";

const Carousel = ({ animeList, speed = 2000, autoplaySpeed = 3000 }) => {
  const navigate = useNavigate();
  const [loadedImages, setLoadedImages] = useState(0);
  const [totalImages, setTotalImages] = useState(0);

  // Losowe sortowanie tablicy anime
  const shuffledAnimeList = [...animeList]
    .sort(() => Math.random() - 0.5)
    .slice(0, 50);

  useEffect(() => {
    setTotalImages(shuffledAnimeList.length);
  }, [shuffledAnimeList.length]);

  const handleImageLoad = () => {
    setLoadedImages(prev => prev + 1);
  };

  const handleImageError = (e) => {
    // Zastąp uszkodzony obraz placeholderem
    e.target.src = 'https://via.placeholder.com/200x300/cccccc/666666?text=Anime';
  };

  // Responsywne ustawienia karuzeli
  const settings = {
    infinite: true,
    speed: 40000,
    slidesToShow: 5,
    slidesToScroll: 20,
    autoplay: true,
    autoplaySpeed: 0,
    cssEase: "linear",
    pauseOnHover: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 15,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 10,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 5,
        }
      }
    ]
  };

  // Pokaż loading jeśli obrazy się jeszcze ładują
  if (loadedImages < totalImages && totalImages > 0) {
    return (
      <div className="carousel-loading">
        <div className="loading-spinner"></div>
        <p>Loading images... {loadedImages}/{totalImages}</p>
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
              onLoad={handleImageLoad}
              onError={handleImageError}
              loading="lazy"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Carousel;
