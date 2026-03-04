import React, { useEffect, useState } from "react";
import { getGenres } from "../services/tmdbService";

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 40 }, (_, i) => CURRENT_YEAR - i);

const SORT_OPTIONS = [
  { value: "popularity.desc", label: "🔥 Most Popular" },
  { value: "vote_average.desc", label: "⭐ Highest Rated" },
  { value: "release_date.desc", label: "🆕 Newest First" },
  { value: "release_date.asc", label: "📅 Oldest First" },
  { value: "revenue.desc", label: "💰 Highest Revenue" },
];

const RATING_OPTIONS = [
  { value: "", label: "Any Rating" },
  { value: "9", label: "★ 9+" },
  { value: "8", label: "★ 8+" },
  { value: "7", label: "★ 7+" },
  { value: "6", label: "★ 6+" },
  { value: "5", label: "★ 5+" },
];

const SearchFilters = ({
  filters,
  onChange,
  onReset,
  resultCount,
  loading,
}) => {
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    getGenres().then(setGenres).catch(console.error);
  }, []);

  const handleChange = (key, value) => {
    onChange({ ...filters, [key]: value, page: 1 });
  };

  const activeFilterCount = [
    filters.genreId,
    filters.year,
    filters.minRating,
    filters.sortBy !== "popularity.desc",
  ].filter(Boolean).length;

  return (
    <div className="filters-panel">
      {/* Search Input */}
      <div className="filter-search-wrap">
        <span className="filter-search-icon">🔍</span>
        <input
          type="text"
          className="filter-search-input"
          placeholder="Search movies, TV shows..."
          value={filters.query}
          onChange={(e) => handleChange("query", e.target.value)}
        />
        {filters.query && (
          <button
            className="filter-clear-input"
            onClick={() => handleChange("query", "")}
          >
            ✕
          </button>
        )}
      </div>

      {/* Filter Row */}
      <div className="filters-row">
        {/* Genre */}
        <div className="filter-group">
          <label className="filter-label">Genre</label>
          <select
            className="filter-select"
            value={filters.genreId}
            onChange={(e) => handleChange("genreId", e.target.value)}
          >
            <option value="">All Genres</option>
            {genres.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>

        {/* Year */}
        <div className="filter-group">
          <label className="filter-label">Year</label>
          <select
            className="filter-select"
            value={filters.year}
            onChange={(e) => handleChange("year", e.target.value)}
          >
            <option value="">Any Year</option>
            {YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        {/* Min Rating */}
        <div className="filter-group">
          <label className="filter-label">Min Rating</label>
          <select
            className="filter-select"
            value={filters.minRating}
            onChange={(e) => handleChange("minRating", e.target.value)}
          >
            {RATING_OPTIONS.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div className="filter-group">
          <label className="filter-label">Sort By</label>
          <select
            className="filter-select"
            value={filters.sortBy}
            onChange={(e) => handleChange("sortBy", e.target.value)}
          >
            {SORT_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* Reset */}
        {activeFilterCount > 0 && (
          <button className="filter-reset-btn" onClick={onReset}>
            ✕ Reset ({activeFilterCount})
          </button>
        )}
      </div>

      {/* Active Filter Tags */}
      {activeFilterCount > 0 && (
        <div className="filter-tags">
          {filters.genreId && genres.find((g) => g.id == filters.genreId) && (
            <span className="filter-tag">
              {genres.find((g) => g.id == filters.genreId)?.name}
              <button onClick={() => handleChange("genreId", "")}>✕</button>
            </span>
          )}
          {filters.year && (
            <span className="filter-tag">
              {filters.year}
              <button onClick={() => handleChange("year", "")}>✕</button>
            </span>
          )}
          {filters.minRating && (
            <span className="filter-tag">
              ★ {filters.minRating}+
              <button onClick={() => handleChange("minRating", "")}>✕</button>
            </span>
          )}
          {filters.sortBy !== "popularity.desc" && (
            <span className="filter-tag">
              {SORT_OPTIONS.find((s) => s.value === filters.sortBy)?.label}
              <button onClick={() => handleChange("sortBy", "popularity.desc")}>
                ✕
              </button>
            </span>
          )}
        </div>
      )}

      {/* Results count */}
      <div className="filter-results-info">
        {loading ? (
          <span className="filter-loading-text">Searching...</span>
        ) : (
          <span>
            {resultCount > 0
              ? `${resultCount} result${resultCount !== 1 ? "s" : ""} found`
              : filters.query || activeFilterCount > 0
                ? "No results found"
                : ""}
          </span>
        )}
      </div>
    </div>
  );
};

export default SearchFilters;
