import React, { useEffect, useState } from "react";
import { getMovieDetails, getImageUrl } from "../services/TmdbService";

const MovieModal = ({ movie, onClose, onViewDetails }) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await getMovieDetails(movie.id);
        setDetails(data);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [movie.id, onClose]);

  const backdropUrl = getImageUrl(
    movie.backdrop_path || movie.poster_path,
    "original",
  );
  const title = movie.title || movie.name;
  const releaseYear =
    movie.release_date?.split("-")[0] || movie.first_air_date?.split("-")[0];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>
        <div
          className="modal-backdrop"
          style={{ backgroundImage: `url(${backdropUrl})` }}
        >
          <div className="modal-backdrop-overlay">
            <h2 className="modal-title">{title}</h2>
            <div className="modal-actions">
              <button className="btn btn-primary" onClick={onViewDetails}>
                ▶ View Details & Trailer
              </button>
              <button className="btn btn-secondary">+ My List</button>
            </div>
          </div>
        </div>
        <div className="modal-body">
          {loading ? (
            <p style={{ color: "#808080" }}>Loading details...</p>
          ) : (
            <>
              <div className="modal-meta">
                <span className="modal-rating">
                  ★ {details?.vote_average?.toFixed(1)}
                </span>
                <span className="modal-year">{releaseYear}</span>
                {details?.runtime && (
                  <span className="modal-runtime">{details.runtime} min</span>
                )}
                {details?.status && (
                  <span className="modal-status">{details.status}</span>
                )}
              </div>
              <p className="modal-overview">{movie.overview}</p>
              {details?.genres?.length > 0 && (
                <div className="modal-genres">
                  <span className="modal-label">Genres: </span>
                  {details.genres.map((g) => (
                    <span key={g.id} className="genre-tag">
                      {g.name}
                    </span>
                  ))}
                </div>
              )}
              {details?.credits?.cast?.length > 0 && (
                <div className="modal-cast">
                  <span className="modal-label">Cast: </span>
                  <span className="modal-cast-names">
                    {details.credits.cast
                      .slice(0, 5)
                      .map((c) => c.name)
                      .join(", ")}
                  </span>
                </div>
              )}
              <button
                className="btn btn-primary"
                style={{ marginTop: "20px", width: "100%" }}
                onClick={onViewDetails}
              >
                See Full Details →
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieModal;
