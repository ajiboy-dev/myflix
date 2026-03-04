import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const MobileSidebar = ({
  onSearchClick,
  onLogoClick,
  onProfileClick,
  onTVShowsClick,
  onPublicDomainClick,
  currentView,
}) => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  // Close sidebar when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [currentView]);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleNavClick = (callback) => {
    callback();
    setIsOpen(false);
  };

  return (
    <>
      {/* Hamburger Button */}
      <button
        className={`hamburger-btn ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`mobile-sidebar ${isOpen ? "open" : ""}`}>
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <button onClick={onLogoClick} className="sidebar-logo">
            MYFLIX
          </button>
          <button
            className="sidebar-close-btn"
            onClick={() => setIsOpen(false)}
          >
            ✕
          </button>
        </div>

        {/* User Section */}
        {user && (
          <div className="sidebar-user-section">
            <div className="sidebar-user-avatar">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="sidebar-user-info">
              <p className="sidebar-user-name">{user.name}</p>
              <p className="sidebar-user-email">{user.email}</p>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="sidebar-nav">
          <button
            className={`sidebar-nav-item ${currentView === "home" ? "active" : ""}`}
            onClick={() => handleNavClick(onLogoClick)}
          >
            <span className="sidebar-nav-icon">🏠</span>
            Home
          </button>

          <button
            className={`sidebar-nav-item ${currentView === "tv-shows" ? "active" : ""}`}
            onClick={() => handleNavClick(onTVShowsClick)}
          >
            <span className="sidebar-nav-icon">📺</span>
            TV Shows
          </button>

          <button
            className={`sidebar-nav-item ${currentView === "public-domain" ? "active" : ""}`}
            onClick={() => handleNavClick(onPublicDomainClick)}
          >
            <span className="sidebar-nav-icon">🎬</span>
            Free Movies
          </button>

          <button
            className={`sidebar-nav-item ${currentView === "search" ? "active" : ""}`}
            onClick={() => handleNavClick(onSearchClick)}
          >
            <span className="sidebar-nav-icon">🔍</span>
            Browse
          </button>

          {user && (
            <button
              className="sidebar-nav-item"
              onClick={() => handleNavClick(() => {})}
            >
              <span className="sidebar-nav-icon">❤️</span>
              My List
            </button>
          )}

          {user && (
            <button
              className={`sidebar-nav-item ${currentView === "profile" ? "active" : ""}`}
              onClick={() => handleNavClick(onProfileClick)}
            >
              <span className="sidebar-nav-icon">👤</span>
              My Profile
            </button>
          )}
        </nav>

        {/* Auth Section */}
        <div className="sidebar-auth-section">
          {user ? (
            <button
              className="sidebar-logout-btn"
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
            >
              🚪 Sign Out
            </button>
          ) : (
            <button
              className="sidebar-signin-btn"
              onClick={() => setIsOpen(false)}
            >
              🔐 Sign In
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="sidebar-footer">
          <p>&copy; 2024 MyFlix</p>
          <p>All rights reserved</p>
        </div>
      </div>
    </>
  );
};

export default MobileSidebar;
