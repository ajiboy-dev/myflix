import React, { useEffect, useState } from "react";
import {
  getTrendingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getNowPlayingMovies,
} from "./services/tmdbService";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import MovieGrid from "./components/MovieGrid";
import MovieModal from "./components/MovieModal";
import MovieDetails from "./pages/MovieDetails";
import SearchPage from "./pages/SearchPage";
import UserProfile from "./pages/UserProfile";
import TVShowsPage from "./pages/TVShowsPage";
import TVShowDetails from "./pages/TVShowDetails";
import PublicDomainPage from "./pages/PublicDomainPage";
import Loading from "./components/Loading";
import Footer from "./components/Footer";
import "./App.css";

function App() {
  const [view, setView] = useState("home");
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [nowPlaying, setNowPlaying] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [detailsMovieId, setDetailsMovieId] = useState(null);
  const [detailsTVShowId, setDetailsTVShowId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [t, p, tr, n] = await Promise.all([
          getTrendingMovies("week"),
          getPopularMovies(),
          getTopRatedMovies(),
          getNowPlayingMovies(),
        ]);
        setTrending(t);
        setPopular(p);
        setTopRated(tr);
        setNowPlaying(n);
      } catch (err) {
        setError("Failed to load movies. Please check your API key.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const goToDetails = (movieId) => {
    setSelectedMovie(null);
    setDetailsMovieId(movieId);
    setView("details");
  };
  const goToTVShowDetails = (showId) => {
    setDetailsTVShowId(showId);
    setView("tv-details");
  };
  const goHome = () => {
    setView("home");
    setDetailsMovieId(null);
    setDetailsTVShowId(null);
  };
  const goSearch = () => setView("search");
  const goProfile = () => setView("profile");
  const goTVShows = () => setView("tv-shows");
  const goPublicDomain = () => setView("public-domain");

  const handleMovieClick = (movie) => setSelectedMovie(movie);
  const handleCloseModal = () => setSelectedMovie(null);
  const handleTVShowClick = (show) => goToTVShowDetails(show.id);

  const heroMovie = trending.find((m) => m.backdrop_path) || trending[0];

  if (loading) return <Loading />;
  if (error)
    return (
      <div className="error-screen">
        <h2>⚠️ Error</h2>
        <p>{error}</p>
      </div>
    );

  return (
    <div className="App">
      <Navbar
        onSearchClick={goSearch}
        onLogoClick={goHome}
        onProfileClick={goProfile}
        onTVShowsClick={goTVShows}
        onPublicDomainClick={goPublicDomain}
        currentView={view}
      />

      {view === "details" && (
        <>
          <MovieDetails
            movieId={detailsMovieId}
            onBack={(newId) =>
              typeof newId === "number" ? goToDetails(newId) : goHome()
            }
          />
          <Footer />
        </>
      )}

      {view === "tv-details" && (
        <>
          <TVShowDetails
            showId={detailsTVShowId}
            onBack={(newId) =>
              typeof newId === "number" ? goToTVShowDetails(newId) : goTVShows()
            }
          />
          <Footer />
        </>
      )}

      {view === "search" && (
        <>
          <SearchPage onMovieClick={handleMovieClick} onBack={goHome} />
          <Footer />
        </>
      )}

      {view === "profile" && (
        <>
          <UserProfile onBack={goHome} />
          <Footer />
        </>
      )}

      {view === "tv-shows" && (
        <>
          <TVShowsPage onShowClick={handleTVShowClick} onBack={goHome} />
          <Footer />
        </>
      )}

      {view === "public-domain" && (
        <>
          <PublicDomainPage onBack={goHome} />
          <Footer />
        </>
      )}

      {view === "home" && (
        <>
          {heroMovie && (
            <Hero
              movie={{
                title: heroMovie.title || heroMovie.name,
                description: heroMovie.overview,
                backdropPath: heroMovie.backdrop_path,
              }}
              onPlay={() => goToDetails(heroMovie.id)}
            />
          )}
          <div className="main-content">
            <MovieGrid
              movies={trending}
              title="🔥 Trending This Week"
              onMovieClick={handleMovieClick}
            />
            <MovieGrid
              movies={nowPlaying}
              title="🎬 Now Playing"
              onMovieClick={handleMovieClick}
            />
            <MovieGrid
              movies={popular}
              title="🌟 Popular Movies"
              onMovieClick={handleMovieClick}
            />
            <MovieGrid
              movies={topRated}
              title="⭐ Top Rated"
              onMovieClick={handleMovieClick}
            />
          </div>
          <Footer />
        </>
      )}

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={handleCloseModal}
          onViewDetails={() => goToDetails(selectedMovie.id)}
        />
      )}
    </div>
  );
}

export default App;
