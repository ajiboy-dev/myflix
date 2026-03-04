import axios from "axios";
// Use import.meta.env for Vite
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;

export const IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

const tmdb = axios.create({
  baseURL: BASE_URL,
  params: { api_key: API_KEY, language: "en-US" },
});

// ─── Movies ───────────────────────────────────────────
export const getTrendingMovies = async (tw = "week") =>
  (await tmdb.get(`/trending/movie/${tw}`)).data.results;
export const getPopularMovies = async (page = 1) =>
  (await tmdb.get("/movie/popular", { params: { page } })).data.results;
export const getTopRatedMovies = async (page = 1) =>
  (await tmdb.get("/movie/top_rated", { params: { page } })).data.results;
export const getNowPlayingMovies = async (page = 1) =>
  (await tmdb.get("/movie/now_playing", { params: { page } })).data.results;
export const getUpcomingMovies = async (page = 1) =>
  (await tmdb.get("/movie/upcoming", { params: { page } })).data.results;

export const getMovieDetails = async (movieId) => {
  const res = await tmdb.get(`/movie/${movieId}`, {
    params: { append_to_response: "videos,credits,similar" },
  });
  return res.data;
};

// ─── TV Shows ─────────────────────────────────────────
export const getTrendingTVShows = async (tw = "week") =>
  (await tmdb.get(`/trending/tv/${tw}`)).data.results;
export const getPopularTVShows = async (page = 1) =>
  (await tmdb.get("/tv/popular", { params: { page } })).data.results;
export const getTopRatedTVShows = async (page = 1) =>
  (await tmdb.get("/tv/top_rated", { params: { page } })).data.results;
export const getOnTheAirTVShows = async (page = 1) =>
  (await tmdb.get("/tv/on_the_air", { params: { page } })).data.results;
export const getAiringTodayTVShows = async (page = 1) =>
  (await tmdb.get("/tv/airing_today", { params: { page } })).data.results;

export const getTVShowDetails = async (tvId) => {
  const res = await tmdb.get(`/tv/${tvId}`, {
    params: { append_to_response: "videos,credits,similar,content_ratings" },
  });
  return res.data;
};

export const getTVShowSeason = async (tvId, seasonNumber) => {
  const res = await tmdb.get(`/tv/${tvId}/season/${seasonNumber}`);
  return res.data;
};

// ─── Search (returns full pagination object) ──────────
export const searchMovies = async (query, page = 1) => {
  if (!query.trim()) return { results: [], total_pages: 0, total_results: 0 };
  const res = await tmdb.get("/search/multi", { params: { query, page } });
  return {
    results: res.data.results,
    total_pages: res.data.total_pages,
    total_results: res.data.total_results,
  };
};

export const searchTVShows = async (query, page = 1) => {
  if (!query.trim()) return { results: [], total_pages: 0, total_results: 0 };
  const res = await tmdb.get("/search/tv", { params: { query, page } });
  return {
    results: res.data.results,
    total_pages: res.data.total_pages,
    total_results: res.data.total_results,
  };
};

// ─── Discover with filters ────────────────────────────
export const discoverMovies = async ({
  genreId = "",
  year = "",
  minRating = "",
  sortBy = "popularity.desc",
  page = 1,
} = {}) => {
  const params = {
    sort_by: sortBy,
    page,
    "vote_count.gte": 50,
    include_adult: false,
    include_video: false,
  };
  if (genreId) params.with_genres = genreId;
  if (year) params.primary_release_year = year;
  if (minRating) params["vote_average.gte"] = minRating;

  const res = await tmdb.get("/discover/movie", { params });
  return {
    results: res.data.results,
    total_pages: Math.min(res.data.total_pages, 500),
    total_results: res.data.total_results,
  };
};

export const discoverTVShows = async ({
  genreId = "",
  year = "",
  minRating = "",
  sortBy = "popularity.desc",
  page = 1,
} = {}) => {
  const params = {
    sort_by: sortBy,
    page,
    "vote_count.gte": 50,
    include_adult: false,
  };
  if (genreId) params.with_genres = genreId;
  if (year) params.first_air_date_year = year;
  if (minRating) params["vote_average.gte"] = minRating;

  const res = await tmdb.get("/discover/tv", { params });
  return {
    results: res.data.results,
    total_pages: Math.min(res.data.total_pages, 500),
    total_results: res.data.total_results,
  };
};

// ─── Genres ───────────────────────────────────────────
export const getGenres = async () =>
  (await tmdb.get("/genre/movie/list")).data.genres;
export const getTVGenres = async () =>
  (await tmdb.get("/genre/tv/list")).data.genres;

export const getMoviesByGenre = async (genreId, page = 1) => {
  const res = await tmdb.get("/discover/movie", {
    params: { with_genres: genreId, sort_by: "popularity.desc", page },
  });
  return res.data.results;
};

export const getTVShowsByGenre = async (genreId, page = 1) => {
  const res = await tmdb.get("/discover/tv", {
    params: { with_genres: genreId, sort_by: "popularity.desc", page },
  });
  return res.data.results;
};

// ─── Helpers ──────────────────────────────────────────
export const getImageUrl = (path, size = "w500") =>
  path
    ? `https://image.tmdb.org/t/p/${size}${path}`
    : "https://via.placeholder.com/500x750?text=No+Image";

export const getTrailerUrl = (videos) => {
  if (!videos?.results) return null;
  const t = videos.results.find(
    (v) => v.type === "Trailer" && v.site === "YouTube",
  );
  return t ? `https://www.youtube.com/watch?v=${t.key}` : null;
};
