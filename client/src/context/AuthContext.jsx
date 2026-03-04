/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

const API_URL = "http://localhost:5000/api/auth";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("myflix_token"));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from token on app start
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get(`${API_URL}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch {
        // Token expired or invalid — clear it
        localStorage.removeItem("myflix_token");
        setToken(null);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [token]);

  const register = async (name, email, password) => {
    setError(null);
    const res = await axios.post(`${API_URL}/register`, {
      name,
      email,
      password,
    });
    localStorage.setItem("myflix_token", res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
  };

  const login = async (email, password) => {
    setError(null);
    const res = await axios.post(`${API_URL}/login`, { email, password });
    localStorage.setItem("myflix_token", res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
  };

  const logout = () => {
    localStorage.removeItem("myflix_token");
    setToken(null);
    setUser(null);
  };

  const addFavorite = async (movie) => {
    const res = await axios.post(
      `${API_URL}/favorites`,
      {
        movieId: movie.id,
        title: movie.title || movie.name,
        poster: movie.poster_path,
        rating: movie.vote_average,
      },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    setUser((prev) => ({ ...prev, favorites: res.data.favorites }));
  };

  const removeFavorite = async (movieId) => {
    const res = await axios.delete(`${API_URL}/favorites/${movieId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUser((prev) => ({ ...prev, favorites: res.data.favorites }));
  };

  const isFavorite = (movieId) => {
    return user?.favorites?.some((f) => f.movieId === movieId) || false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        setError,
        register,
        login,
        logout,
        addFavorite,
        removeFavorite,
        isFavorite,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
