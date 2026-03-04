import React from "react";
import { getImageUrl } from "../services/tmdbService";

const TVShowCard = ({ show, onClick }) => {
  const title = show.name || show.original_name;
  const firstAir = show.first_air_date?.split("-")[0];
  const rating = show.vote_average?.toFixed(1);
  const imageUrl = getImageUrl(show.poster_path);

  return (
    <div className="movie-card tv-show-card" onClick={() => onClick(show)}>
      <img
        src={imageUrl}
        alt={title}
        className="movie-poster"
        onError={(e) => {
          e.target.src = "https://via.placeholder.com/500x750?text=No+Image";
        }}
      />
      <div className="movie-info">
        <h3 className="movie-title">{title}</h3>
        <div className="movie-meta">
          <span className="movie-year">{firstAir || "N/A"}</span>
          <span className="movie-rating">★ {rating}</span>
        </div>
      </div>
    </div>
  );
};

export default TVShowCard;
