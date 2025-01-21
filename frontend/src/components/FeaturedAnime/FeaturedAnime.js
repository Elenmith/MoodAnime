import React from "react";
import "./FeaturedAnime.css";

const FeaturedAnime = ({ loading, featuredAnime }) => {
  return (
    <div>
      {loading ? (
        <p>Loading featured anime...</p>
      ) : (
        featuredAnime && (
          <div className="featured-anime">
            <img src={featuredAnime.imageUrl} alt={featuredAnime.title} />
            <div className="featured-anime-desc">
              <h2>{featuredAnime.title}</h2>
              <p>{featuredAnime.description}</p>
              <p>Moods: {featuredAnime.moods}</p>
              <p>Rating: {featuredAnime.rating} ⭐</p>
              <p className="featured-anime-description">
                Description: {featuredAnime.synopsis}{" "}
              </p>
              <p>Duration: {featuredAnime.duration || "Unknown"}</p>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default FeaturedAnime;
