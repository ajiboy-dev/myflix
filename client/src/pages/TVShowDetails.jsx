import React, { useEffect, useState } from "react";
import {
  getTVShowDetails,
  getTVShowSeason,
  getImageUrl,
  getTrailerUrl,
} from "../services/tmdbService";
import TrailerPlayer from "../components/TrailerPlayer";
import Loading from "../components/Loading";

const TVShowDetails = ({ showId, onBack }) => {
  const [show, setShow] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [seasonData, setSeasonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingSeason, setLoadingSeason] = useState(false);
  const [error, setError] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [trailerUrl, setTrailerUrl] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        window.scrollTo(0, 0);
        const data = await getTVShowDetails(showId);
        setShow(data);
        setTrailerUrl(getTrailerUrl(data.videos));
        if (data.seasons?.length > 0) {
          setSelectedSeason(data.seasons[0].season_number);
        }
      } catch (err) {
        setError("Failed to load TV show details.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [showId]);

  useEffect(() => {
    if (!show || selectedSeason === null) return;
    const fetchSeason = async () => {
      try {
        setLoadingSeason(true);
        const data = await getTVShowSeason(showId, selectedSeason);
        setSeasonData(data);
      } catch (err) {
        console.error("Error fetching season:", err);
      } finally {
        setLoadingSeason(false);
      }
    };
    fetchSeason();
  }, [showId, selectedSeason, show]);

  if (loading) return <Loading />;
  if (error) return <div className="details-error">{error}</div>;
  if (!show) return null;

  const backdropUrl = getImageUrl(show.backdrop_path, "original");
  const posterUrl = getImageUrl(show.poster_path, "w500");
  const rating = show.vote_average?.toFixed(1);
  const firstAir = show.first_air_date?.split("-")[0];
  const lastAir = show.last_air_date?.split("-")[0];
  const cast = show.credits?.cast?.slice(0, 8) || [];
  const crew =
    show.credits?.crew
      ?.filter((c) =>
        ["Creator", "Executive Producer", "Director"].includes(c.job),
      )
      .slice(0, 4) || [];
  const similar = show.similar?.results?.slice(0, 6) || [];
  const contentRating =
    show.content_ratings?.results?.find((r) => r.iso_3166_1 === "US")?.rating ||
    "N/A";

  return (
    <div className="details-page tv-show-details-page">
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
          <img src={posterUrl} alt={show.name} className="details-poster" />
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
          <h1 className="details-title">{show.name}</h1>

          {show.tagline && <p className="details-tagline">"{show.tagline}"</p>}

          {/* Badges */}
          <div className="details-badges">
            <span className="badge badge-rating">★ {rating}</span>
            <span className="badge badge-year">
              {firstAir}
              {lastAir !== firstAir ? ` - ${lastAir}` : ""}
            </span>
            <span className="badge badge-runtime">
              {show.number_of_seasons} Season
              {show.number_of_seasons !== 1 ? "s" : ""}
            </span>
            <span className="badge badge-runtime">
              {show.number_of_episodes} Episode
              {show.number_of_episodes !== 1 ? "s" : ""}
            </span>
            {contentRating !== "N/A" && (
              <span className="badge badge-status">{contentRating}</span>
            )}
            {show.status && (
              <span className="badge badge-status">{show.status}</span>
            )}
          </div>

          {/* Genres */}
          {show.genres?.length > 0 && (
            <div className="details-genres">
              {show.genres.map((g) => (
                <span key={g.id} className="genre-pill">
                  {g.name}
                </span>
              ))}
            </div>
          )}

          {/* Tabs */}
          <div className="details-tabs">
            {["overview", "seasons", "cast", "crew", "similar"].map((tab) => (
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
                <p className="details-overview">{show.overview}</p>
                <div className="details-stats">
                  {show.vote_count > 0 && (
                    <div className="stat-item">
                      <span className="stat-label">Votes</span>
                      <span className="stat-value">
                        {show.vote_count.toLocaleString()}
                      </span>
                    </div>
                  )}
                  {show.original_language && (
                    <div className="stat-item">
                      <span className="stat-label">Language</span>
                      <span className="stat-value">
                        {show.original_language.toUpperCase()}
                      </span>
                    </div>
                  )}
                  {show.networks?.length > 0 && (
                    <div className="stat-item">
                      <span className="stat-label">Network</span>
                      <span className="stat-value">
                        {show.networks[0].name}
                      </span>
                    </div>
                  )}
                  {show.type && (
                    <div className="stat-item">
                      <span className="stat-label">Type</span>
                      <span className="stat-value">{show.type}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Seasons & Episodes */}
            {activeTab === "seasons" && (
              <div className="seasons-tab">
                <div className="season-selector">
                  {show.seasons?.map((season) => (
                    <button
                      key={season.id}
                      className={`season-btn ${selectedSeason === season.season_number ? "active" : ""}`}
                      onClick={() => setSelectedSeason(season.season_number)}
                    >
                      {season.name}
                    </button>
                  ))}
                </div>

                {loadingSeason ? (
                  <p style={{ color: "#808080", marginTop: "20px" }}>
                    Loading episodes...
                  </p>
                ) : seasonData ? (
                  <div className="episodes-list">
                    <h3 className="season-title">{seasonData.name}</h3>
                    {seasonData.overview && (
                      <p className="season-overview">{seasonData.overview}</p>
                    )}
                    <div className="episodes">
                      {seasonData.episodes?.map((ep) => (
                        <div key={ep.id} className="episode-card">
                          <img
                            src={getImageUrl(ep.still_path, "w300")}
                            alt={ep.name}
                            className="episode-still"
                            onError={(e) => {
                              e.target.src =
                                "https://via.placeholder.com/300x169?text=No+Image";
                            }}
                          />
                          <div className="episode-info">
                            <div className="episode-header">
                              <span className="episode-number">
                                E{ep.episode_number}
                              </span>
                              <h4 className="episode-name">{ep.name}</h4>
                              {ep.vote_average > 0 && (
                                <span className="episode-rating">
                                  ★ {ep.vote_average.toFixed(1)}
                                </span>
                              )}
                            </div>
                            <p className="episode-overview">
                              {ep.overview || "No description available."}
                            </p>
                            {ep.air_date && (
                              <p className="episode-air-date">
                                Aired:{" "}
                                {new Date(ep.air_date).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="no-data">No episode data available.</p>
                )}
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
                  similar.map((s) => (
                    <div
                      key={s.id}
                      className="similar-card"
                      onClick={() => onBack(s.id)}
                    >
                      <img
                        src={getImageUrl(s.poster_path)}
                        alt={s.name}
                        className="similar-poster"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/200x300?text=No+Image";
                        }}
                      />
                      <p className="similar-title">{s.name}</p>
                      <p className="similar-rating">
                        ★ {s.vote_average?.toFixed(1)}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="no-data">No similar shows found.</p>
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
          title={show.name}
          onClose={() => setShowTrailer(false)}
        />
      )}
    </div>
  );
};

export default TVShowDetails;
