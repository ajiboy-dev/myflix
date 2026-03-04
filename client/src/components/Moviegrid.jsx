import React from "react";
import MovieCard from "./MovieCard";

const MovieGrid = ({ movies, title, onMovieClick }) => {
  if (!movies || movies.length === 0) {
    return (
      <div className="movies-section">
        <h2 className="section-title">{title}</h2>
        <p style={{ paddingLeft: "50px", color: "#808080" }}>
          No movies available
        </p>
      </div>
    );
  }

  return (
    <div className="movies-section">
      <h2 className="section-title">{title}</h2>
      <div className="movies-grid">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} onClick={onMovieClick} />
        ))}
      </div>
    </div>
  );
};

export default MovieGrid;
