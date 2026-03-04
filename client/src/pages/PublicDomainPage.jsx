import React, { useState, useEffect } from "react";
import Loading from "../components/Loading";

const PublicDomainPage = ({ onBack }) => {
  const [movies, setMovies] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    fetchPublicDomainMovies();
  }, []);

  const fetchPublicDomainMovies = async () => {
    try {
      setLoading(true);
      // Fetch from Internet Archive API
      const response = await fetch(
        "http://localhost:5000/api/public-domain/movies",
      );
      const data = await response.json();
      setMovies(data.movies || []);
      setFeatured(data.featured || []);
    } catch (error) {
      console.error("Error fetching public domain movies:", error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: "all", label: "All Movies", icon: "🎬" },
    { id: "classics", label: "Classics", icon: "🎭" },
    { id: "silent", label: "Silent Era", icon: "🤐" },
    { id: "scifi", label: "Sci-Fi", icon: "🚀" },
    { id: "horror", label: "Horror", icon: "👻" },
    { id: "western", label: "Western", icon: "🤠" },
  ];

  const filteredMovies =
    selectedCategory === "all"
      ? movies
      : movies.filter((m) => m.category === selectedCategory);

  if (loading) return <Loading />;

  return (
    <div className="public-domain-page">
      <button className="details-back-btn" onClick={onBack}>
        ← Back
      </button>

      {/* Header */}
      <div className="pd-header">
        <h1 className="pd-title">
          <span className="pd-title-accent">Public Domain</span> Movies
        </h1>
        <p className="pd-subtitle">
          Timeless classics that are completely free and legal to watch and
          download
        </p>
        <div className="pd-info-banner">
          <span className="pd-info-icon">ℹ️</span>
          <p>
            All movies here are in the public domain (pre-1928 or copyright
            expired). You can watch, download, and share them freely and
            legally.
          </p>
        </div>
      </div>

      {/* Featured Section */}
      {featured.length > 0 && (
        <section className="pd-featured-section">
          <h2 className="pd-section-title">⭐ Featured Classics</h2>
          <div className="pd-featured-grid">
            {featured.map((movie, index) => (
              <div key={index} className="pd-featured-card">
                <img
                  src={
                    movie.thumbnail ||
                    "https://via.placeholder.com/400x600?text=Classic+Film"
                  }
                  alt={movie.title}
                  className="pd-featured-poster"
                />
                <div className="pd-featured-overlay">
                  <h3>{movie.title}</h3>
                  <p>{movie.year}</p>
                  <div className="pd-featured-actions">
                    <a
                      href={movie.watchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                    >
                      ▶ Watch Free
                    </a>
                    <a
                      href={movie.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-download"
                    >
                      ⬇ Download
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Category Filter */}
      <div className="pd-categories">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`pd-category-btn ${selectedCategory === cat.id ? "active" : ""}`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            <span className="pd-category-icon">{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Movies Grid */}
      <section className="pd-movies-section">
        <h2 className="pd-section-title">
          {selectedCategory === "all"
            ? "All Public Domain Movies"
            : categories.find((c) => c.id === selectedCategory)?.label}
        </h2>

        {filteredMovies.length > 0 ? (
          <div className="pd-movies-grid">
            {filteredMovies.map((movie, index) => (
              <div key={index} className="pd-movie-card">
                <img
                  src={
                    movie.thumbnail ||
                    "https://via.placeholder.com/300x450?text=Classic+Film"
                  }
                  alt={movie.title}
                  className="pd-movie-poster"
                />
                <div className="pd-movie-info">
                  <h3 className="pd-movie-title">{movie.title}</h3>
                  <p className="pd-movie-year">{movie.year}</p>
                  <p className="pd-movie-duration">{movie.duration || "N/A"}</p>
                  <div className="pd-movie-actions">
                    <a
                      href={movie.watchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pd-watch-btn"
                    >
                      ▶ Watch
                    </a>
                    <a
                      href={movie.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pd-download-btn"
                    >
                      ⬇
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="pd-empty">
            <p>No movies found in this category</p>
          </div>
        )}
      </section>

      {/* Info Footer */}
      <div className="pd-footer-info">
        <h3>About Public Domain Movies</h3>
        <p>
          Public domain movies are films whose copyright has expired or were
          never copyrighted. In the United States, works published before 1928
          are in the public domain.
        </p>
        <p>
          These films are hosted on <strong>Archive.org</strong>, a nonprofit
          library providing free access to historical and cultural content.
        </p>
        <a
          href="https://archive.org/details/movies"
          target="_blank"
          rel="noopener noreferrer"
          className="pd-archive-link"
        >
          Browse more on Internet Archive →
        </a>
      </div>
    </div>
  );
};

export default PublicDomainPage;
