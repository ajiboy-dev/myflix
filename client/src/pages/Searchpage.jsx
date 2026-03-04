import React, { useState, useEffect, useCallback, useRef } from "react";
import { searchMovies, discoverMovies } from "../services/tmdbService";
import SearchFilters from "../components/SearchFilters";
import MovieCard from "../components/MovieCard";
import Loading from "../components/Loading";

const DEFAULT_FILTERS = {
  query: "",
  genreId: "",
  year: "",
  minRating: "",
  sortBy: "popularity.desc",
  page: 1,
};

const SearchPage = ({ onMovieClick, onBack }) => {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const debounceRef = useRef(null);

  // Fetch movies when filters change
  const fetchMovies = useCallback(async (currentFilters, append = false) => {
    if (!append) setLoading(true);
    else setLoadingMore(true);

    try {
      let results = [];
      let pages = 0;
      let total = 0;

      if (currentFilters.query.trim()) {
        // Text search
        const data = await searchMovies(
          currentFilters.query,
          currentFilters.page,
        );
        results = data.results || data;
        pages = data.total_pages || 1;
        total = data.total_results || results.length;

        // Apply client-side filters after text search
        if (currentFilters.minRating) {
          results = results.filter(
            (m) => m.vote_average >= parseFloat(currentFilters.minRating),
          );
        }
        if (currentFilters.year) {
          results = results.filter(
            (m) =>
              m.release_date?.startsWith(currentFilters.year) ||
              m.first_air_date?.startsWith(currentFilters.year),
          );
        }
        if (currentFilters.genreId) {
          results = results.filter((m) =>
            m.genre_ids?.includes(parseInt(currentFilters.genreId)),
          );
        }
      } else {
        // Discover / browse with filters
        const data = await discoverMovies({
          genreId: currentFilters.genreId,
          year: currentFilters.year,
          minRating: currentFilters.minRating,
          sortBy: currentFilters.sortBy,
          page: currentFilters.page,
        });
        results = data.results;
        pages = data.total_pages;
        total = data.total_results;
      }

      // Only show movies with posters
      results = results.filter((m) => m.poster_path);

      if (append) {
        setMovies((prev) => [...prev, ...results]);
      } else {
        setMovies(results);
      }
      setTotalPages(pages);
      setTotalResults(total);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // Debounce filter changes
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(
      () => {
        fetchMovies(filters, false);
      },
      filters.query ? 500 : 0,
    );
    return () => clearTimeout(debounceRef.current);
  }, [filters, fetchMovies]);

  const handleFilterChange = (newFilters) => {
    setFilters({ ...newFilters, page: 1 });
  };

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const handleLoadMore = () => {
    if (filters.page < totalPages) {
      const nextFilters = { ...filters, page: filters.page + 1 };
      setFilters(nextFilters);
      fetchMovies(nextFilters, true);
    }
  };

  return (
    <div className="search-page">
      {/* Page Header */}
      <div className="search-page-header">
        <button className="details-back-btn" onClick={onBack}>
          ← Back
        </button>
        <h1 className="search-page-title">
          <span className="search-title-accent">Browse</span> Movies
        </h1>
        <p className="search-page-subtitle">
          Search and filter from thousands of movies and TV shows
        </p>
      </div>

      {/* Filters */}
      <SearchFilters
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleReset}
        resultCount={totalResults}
        loading={loading}
      />

      {/* Results */}
      <div className="search-results">
        {loading ? (
          <Loading />
        ) : movies.length > 0 ? (
          <>
            <div className="search-movies-grid">
              {movies.map((movie, index) => (
                <div
                  key={`${movie.id}-${index}`}
                  className="search-card-wrap"
                  style={{ animationDelay: `${(index % 20) * 40}ms` }}
                >
                  <MovieCard movie={movie} onClick={onMovieClick} />
                </div>
              ))}
            </div>

            {/* Load More */}
            {filters.page < totalPages && (
              <div className="load-more-wrap">
                <button
                  className="load-more-btn"
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                >
                  {loadingMore ? (
                    <span className="load-more-spinner" />
                  ) : (
                    `Load More (Page ${filters.page + 1} of ${totalPages})`
                  )}
                </button>
              </div>
            )}
          </>
        ) : (
          !loading && (
            <div className="search-empty">
              <div className="search-empty-icon">🎬</div>
              <h3>No movies found</h3>
              <p>Try adjusting your filters or search for something else</p>
              <button className="btn btn-primary" onClick={handleReset}>
                Clear All Filters
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default SearchPage;
