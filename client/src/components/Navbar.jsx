import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import AuthModal from "./AuthModal";
import ThemeToggle from "./ThemeToggle";
import MobileSidebar from "./MobileSidebar";

const Navbar = ({
  onSearchClick,
  onLogoClick,
  onProfileClick,
  onTVShowsClick,
  onPublicDomainClick,
  currentView,
}) => {
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header className={`app-header ${scrolled ? "scrolled" : ""}`}>
        <nav className="navbar">
          {/* Mobile Hamburger & Sidebar */}
          <MobileSidebar
            onSearchClick={onSearchClick}
            onLogoClick={onLogoClick}
            onProfileClick={onProfileClick}
            onTVShowsClick={onTVShowsClick}
            onPublicDomainClick={onPublicDomainClick}
            currentView={currentView}
          />

          {/* Logo */}
          <button
            className="logo"
            onClick={onLogoClick}
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            MYFLIX
          </button>

          {/* Desktop Nav Links */}
          <ul className="nav-links">
            <li>
              <button
                className={`nav-link-btn ${currentView === "home" ? "active" : ""}`}
                onClick={onLogoClick}
              >
                Home
              </button>
            </li>
            <li>
              <button
                className={`nav-link-btn ${currentView === "tv-shows" ? "active" : ""}`}
                onClick={onTVShowsClick}
              >
                TV Shows
              </button>
            </li>
            <li>
              <button
                className={`nav-link-btn ${currentView === "public-domain" ? "active" : ""}`}
                onClick={onPublicDomainClick}
              >
                Free Movies
              </button>
            </li>
            <li>
              <button
                className={`nav-link-btn ${currentView === "search" ? "active" : ""}`}
                onClick={onSearchClick}
              >
                Browse
              </button>
            </li>
            {user && (
              <li>
                <button className="nav-link-btn">My List ❤️</button>
              </li>
            )}
          </ul>

          {/* Desktop Auth */}
          <div className="nav-auth">
            <ThemeToggle />
            {user ? (
              <div
                className="user-menu"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <div className="user-avatar">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="user-name">{user.name}</span>
                {showDropdown && (
                  <div className="user-dropdown">
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        onProfileClick();
                        setShowDropdown(false);
                      }}
                    >
                      👤 My Profile
                    </button>
                    <p className="dropdown-email">{user.email}</p>
                    <hr className="dropdown-divider" />
                    <button onClick={logout} className="dropdown-logout">
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                className="btn btn-primary nav-signin-btn"
                onClick={() => setShowAuthModal(true)}
              >
                Sign In
              </button>
            )}
          </div>
        </nav>
      </header>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </>
  );
};

export default Navbar;
