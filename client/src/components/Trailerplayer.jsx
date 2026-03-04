import React, { useEffect } from "react";

const TrailerPlayer = ({ url, title, onClose }) => {
  // Extract YouTube video ID from URL
  const getVideoId = (url) => {
    const match = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    );
    return match ? match[1] : null;
  };

  const videoId = getVideoId(url);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Prevent background scroll when trailer is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  if (!videoId) {
    return (
      <div className="trailer-overlay" onClick={onClose}>
        <div className="trailer-modal">
          <p>Trailer not available.</p>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="trailer-overlay" onClick={onClose}>
      <div className="trailer-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="trailer-header">
          <h3 className="trailer-title">🎬 {title} — Official Trailer</h3>
          <button className="trailer-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* YouTube Embed */}
        <div className="trailer-video-wrap">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
            title={`${title} Trailer`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="trailer-iframe"
          />
        </div>

        {/* Footer */}
        <div className="trailer-footer">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="trailer-yt-link"
          >
            Watch on YouTube ↗
          </a>
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrailerPlayer;
