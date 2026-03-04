import React, { useState, useEffect } from "react";
import {
  getTrendingTVShows,
  getPopularTVShows,
  getTopRatedTVShows,
  getOnTheAirTVShows,
  getAiringTodayTVShows,
} from "../services/tmdbService";

import TVShowCard from "../components/TVShowCard";
import Loading from "../components/Loading";

const TVShowsPage = ({ onShowClick, onBack }) => {
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [onTheAir, setOnTheAir] = useState([]);
  const [airingToday, setAiringToday] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [tr, pop, top, air, today] = await Promise.all([
          getTrendingTVShows("week"),
          getPopularTVShows(),
          getTopRatedTVShows(),
          getOnTheAirTVShows(),
          getAiringTodayTVShows(),
        ]);
        setTrending(tr);
        setPopular(pop);
        setTopRated(top);
        setOnTheAir(air);
        setAiringToday(today);
      } catch (err) {
        console.error("Error fetching TV shows:", err);
        setError("Failed to load TV shows.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) return <Loading />;
  if (error)
    return (
      <div className="error-screen">
        <h2>⚠️ Error</h2>
        <p>{error}</p>
      </div>
    );

  return (
    <div className="tv-shows-page">
      <button className="details-back-btn" onClick={onBack}>
        ← Back
      </button>

      <div className="tv-shows-header">
        <h1 className="tv-shows-title">
          <span className="tv-title-accent">TV</span> Shows
        </h1>
        <p className="tv-shows-subtitle">
          Discover thousands of series, from trending hits to timeless classics
        </p>
      </div>

      <div className="tv-shows-content">
        {airingToday.length > 0 && (
          <section className="tv-section">
            <h2 className="tv-section-title">📺 Airing Today</h2>
            <div className="tv-shows-grid">
              {airingToday.map((show) => (
                <TVShowCard key={show.id} show={show} onClick={onShowClick} />
              ))}
            </div>
          </section>
        )}

        <section className="tv-section">
          <h2 className="tv-section-title">🔥 Trending This Week</h2>
          <div className="tv-shows-grid">
            {trending.map((show) => (
              <TVShowCard key={show.id} show={show} onClick={onShowClick} />
            ))}
          </div>
        </section>

        <section className="tv-section">
          <h2 className="tv-section-title">📡 On The Air</h2>
          <div className="tv-shows-grid">
            {onTheAir.map((show) => (
              <TVShowCard key={show.id} show={show} onClick={onShowClick} />
            ))}
          </div>
        </section>

        <section className="tv-section">
          <h2 className="tv-section-title">🌟 Popular Shows</h2>
          <div className="tv-shows-grid">
            {popular.map((show) => (
              <TVShowCard key={show.id} show={show} onClick={onShowClick} />
            ))}
          </div>
        </section>

        <section className="tv-section">
          <h2 className="tv-section-title">⭐ Top Rated</h2>
          <div className="tv-shows-grid">
            {topRated.map((show) => (
              <TVShowCard key={show.id} show={show} onClick={onShowClick} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default TVShowsPage;
