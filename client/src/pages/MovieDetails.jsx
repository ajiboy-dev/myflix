import React, { useEffect, useState } from "react";
import {
  getMovieDetails,
  getImageUrl,
  getTrailerUrl,
} from "../services/TmdbService";
import TrailerPlayer from "../components/TrailerPlayer";
import Loading from "../components/Loading";

const MovieDetails = ({ movieId, onBack }) => {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [trailerUrl, setTrailerUrl] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        window.scrollTo(0, 0);
        const data = await getMovieDetails(movieId);
        setMovie(data);
        setTrailerUrl(getTrailerUrl(data.videos));
      } catch (err) {
        setError("Failed to load movie details.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [movieId]);

  if (loading) return <Loading />;
  if (error) return <div className="details-error">{error}</div>;
  if (!movie) return null;

  const backdropUrl = getImageUrl(movie.backdrop_path, "original");
  const posterUrl = getImageUrl(movie.poster_path, "w500");
  const releaseYear = movie.release_date?.split("-")[0];
  const rating = movie.vote_average?.toFixed(1);
  const hours = Math.floor(movie.runtime / 60);
  const minutes = movie.runtime % 60;
  const runtime = movie.runtime ? `${hours}h ${minutes}m` : "N/A";
  const cast = movie.credits?.cast?.slice(0, 8) || [];
  const crew =
    movie.credits?.crew
      ?.filter((c) => ["Director", "Producer", "Screenplay"].includes(c.job))
      .slice(0, 4) || [];
  const similar = movie.similar?.results?.slice(0, 6) || [];

  return (
    <div className="details-page">
      {/* Back Button */}
      <button className="details-back-btn" onClick={onBack}>
        ← Back
      </button>

      {/* Hero Backdrop */}
      <div
        className="details-hero"
        style={{ backgroundImage: `url(${backdropUrl})` }}
      >
        <div className="details-hero-overlay" />
      </div>

      {/* Main Content */}
      <div className="details-content">
        {/* Left: Poster */}
        <div className="details-poster-wrap">
          <img src={posterUrl} alt={movie.title} className="details-poster" />
          {trailerUrl && (
            <button
              className="trailer-btn"
              onClick={() => setShowTrailer(true)}
            >
              ▶ Watch Trailer
            </button>
          )}
          {!trailerUrl && (
            <div className="no-trailer">No trailer available</div>
          )}
        </div>

        {/* Right: Info */}
        <div className="details-info">
          <h1 className="details-title">{movie.title}</h1>

          {movie.tagline && (
            <p className="details-tagline">"{movie.tagline}"</p>
          )}

          {/* Badges */}
          <div className="details-badges">
            <span className="badge badge-rating">★ {rating}</span>
            <span className="badge badge-year">{releaseYear}</span>
            <span className="badge badge-runtime">{runtime}</span>
            {movie.status && (
              <span className="badge badge-status">{movie.status}</span>
            )}
            {movie.adult && <span className="badge badge-adult">18+</span>}
          </div>

          {/* Genres */}
          {movie.genres?.length > 0 && (
            <div className="details-genres">
              {movie.genres.map((g) => (
                <span key={g.id} className="genre-pill">
                  {g.name}
                </span>
              ))}
            </div>
          )}

          {/* Tabs */}
          <div className="details-tabs">
            {["overview", "cast", "crew", "similar"].map((tab) => (
              <button
                key={tab}
                className={`tab-btn ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {/* Overview */}
            {activeTab === "overview" && (
              <div className="tab-overview">
                <p className="details-overview">{movie.overview}</p>

                <div className="details-stats">
                  {movie.budget > 0 && (
                    <div className="stat-item">
                      <span className="stat-label">Budget</span>
                      <span className="stat-value">
                        ${movie.budget.toLocaleString()}
                      </span>
                    </div>
                  )}
                  {movie.revenue > 0 && (
                    <div className="stat-item">
                      <span className="stat-label">Revenue</span>
                      <span className="stat-value">
                        ${movie.revenue.toLocaleString()}
                      </span>
                    </div>
                  )}
                  {movie.vote_count > 0 && (
                    <div className="stat-item">
                      <span className="stat-label">Votes</span>
                      <span className="stat-value">
                        {movie.vote_count.toLocaleString()}
                      </span>
                    </div>
                  )}
                  {movie.original_language && (
                    <div className="stat-item">
                      <span className="stat-label">Language</span>
                      <span className="stat-value">
                        {movie.original_language.toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Cast */}
            {activeTab === "cast" && (
              <div className="cast-grid">
                {cast.length > 0 ? (
                  cast.map((person) => (
                    <div key={person.id} className="cast-card">
                      <img
                        src={getImageUrl(person.profile_path, "w185")}
                        alt={person.name}
                        className="cast-photo"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/100x150?text=?";
                        }}
                      />
                      <div className="cast-info">
                        <p className="cast-name">{person.name}</p>
                        <p className="cast-character">{person.character}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="no-data">No cast information available.</p>
                )}
              </div>
            )}

            {/* Crew */}
            {activeTab === "crew" && (
              <div className="crew-list">
                {crew.length > 0 ? (
                  crew.map((person, i) => (
                    <div key={i} className="crew-item">
                      <span className="crew-job">{person.job}</span>
                      <span className="crew-name">{person.name}</span>
                    </div>
                  ))
                ) : (
                  <p className="no-data">No crew information available.</p>
                )}
              </div>
            )}

            {/* Similar */}
            {activeTab === "similar" && (
              <div className="similar-grid">
                {similar.length > 0 ? (
                  similar.map((m) => (
                    <div
                      key={m.id}
                      className="similar-card"
                      onClick={() => onBack(m.id)}
                    >
                      <img
                        src={getImageUrl(m.poster_path)}
                        alt={m.title}
                        className="similar-poster"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/200x300?text=No+Image";
                        }}
                      />
                      <p className="similar-title">{m.title}</p>
                      <p className="similar-rating">
                        ★ {m.vote_average?.toFixed(1)}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="no-data">No similar movies found.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Trailer Modal */}
      {showTrailer && trailerUrl && (
        <TrailerPlayer
          url={trailerUrl}
          title={movie.title}
          onClose={() => setShowTrailer(false)}
        />
      )}
    </div>
  );
};

export default MovieDetails;
