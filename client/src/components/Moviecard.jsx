import React from "react";
import { getImageUrl } from "../services/TmdbService.js";

const MovieCard = ({ movie, onClick }) => {
  const title = movie.title || movie.name;
  const releaseYear =
    movie.release_date?.split("-")[0] ||
    movie.first_air_date?.split("-")[0] ||
    "N/A";
  const rating = movie.vote_average?.toFixed(1) || "N/A";
  const imageUrl = getImageUrl(movie.poster_path);

  return (
    <div className="movie-card" onClick={() => onClick(movie)}>
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
          <span className="movie-year">{releaseYear}</span>
          <span className="movie-rating">★ {rating}</span>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
