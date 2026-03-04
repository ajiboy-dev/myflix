import React from "react";

const Hero = ({ movie, onPlay }) => {
  const backdropUrl = movie?.backdropPath
    ? `https://image.tmdb.org/t/p/original${movie.backdropPath}`
    : "https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=1920";

  return (
    <div
      className="hero-section"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url(${backdropUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="hero-content">
        <h1>{movie?.title || "Welcome to MyFlix"}</h1>
        <p>
          {movie?.description
            ? movie.description.slice(0, 180) + "..."
            : "Unlimited movies, TV shows, and more. Watch anywhere. Cancel anytime."}
        </p>
        <div>
          <button className="btn btn-primary" onClick={onPlay}>
            ▶ Play
          </button>
          <button className="btn btn-secondary">ℹ More Info</button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
