import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/Loading";

const UserProfile = ({ onBack }) => {
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setMessage({ type: "", text: "" });
  };

  const handlePasswordChange = (e) => {
    setPasswordData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setMessage({ type: "", text: "" });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch("http://localhost:5000/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      setMessage({ type: "success", text: "✅ Profile updated successfully!" });
      setEditMode(false);
      // Reload page to refresh user data
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      setMessage({
        type: "error",
        text: err.message || "Failed to update profile",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      setLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({
        type: "error",
        text: "Password must be at least 6 characters",
      });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/change-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      setMessage({
        type: "success",
        text: "✅ Password changed successfully!",
      });
      setChangePassword(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.message || "Failed to change password",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <Loading />;

  // Calculate account stats
  const memberSince = new Date(user.createdAt || Date.now()).toLocaleDateString(
    "en-US",
    {
      month: "long",
      year: "numeric",
    },
  );
  const favoritesCount = user.favorites?.length || 0;

  return (
    <div className="profile-page">
      <button className="details-back-btn" onClick={onBack}>
        ← Back
      </button>

      <div className="profile-container">
        {/* Header */}
        <div className="profile-header">
          <div className="profile-avatar-large">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="profile-header-info">
            <h1 className="profile-name">{user.name}</h1>
            <p className="profile-email">{user.email}</p>
            <p className="profile-member-since">Member since {memberSince}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="profile-stats">
          <div className="stat-card">
            <div className="stat-icon">❤️</div>
            <div className="stat-value">{favoritesCount}</div>
            <div className="stat-label">Favorites</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🎬</div>
            <div className="stat-value">0</div>
            <div className="stat-label">Watched</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-value">0</div>
            <div className="stat-label">Reviews</div>
          </div>
        </div>

        {/* Message */}
        {message.text && (
          <div className={`profile-message ${message.type}`}>
            {message.text}
          </div>
        )}

        {/* Edit Profile Section */}
        <div className="profile-section">
          <div className="profile-section-header">
            <h2>Profile Information</h2>
            {!editMode && (
              <button
                className="btn btn-secondary"
                onClick={() => setEditMode(true)}
              >
                ✏️ Edit
              </button>
            )}
          </div>

          {editMode ? (
            <form onSubmit={handleUpdateProfile} className="profile-form">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="profile-form-actions">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setEditMode(false);
                    setFormData({ name: user.name, email: user.email });
                    setMessage({ type: "", text: "" });
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-info-display">
              <div className="info-row">
                <span className="info-label">Name:</span>
                <span className="info-value">{user.name}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Email:</span>
                <span className="info-value">{user.email}</span>
              </div>
            </div>
          )}
        </div>

        {/* Change Password Section */}
        <div className="profile-section">
          <div className="profile-section-header">
            <h2>Security</h2>
            {!changePassword && (
              <button
                className="btn btn-secondary"
                onClick={() => setChangePassword(true)}
              >
                🔒 Change Password
              </button>
            )}
          </div>

          {changePassword ? (
            <form onSubmit={handleChangePassword} className="profile-form">
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                  minLength="6"
                />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                  minLength="6"
                />
              </div>
              <div className="profile-form-actions">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? "Changing..." : "Change Password"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setChangePassword(false);
                    setPasswordData({
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    });
                    setMessage({ type: "", text: "" });
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-info-display">
              <div className="info-row">
                <span className="info-label">Password:</span>
                <span className="info-value">••••••••</span>
              </div>
            </div>
          )}
        </div>

        {/* Danger Zone */}
        <div className="profile-section profile-danger-zone">
          <h2>Danger Zone</h2>
          <p className="danger-zone-text">
            Once you delete your account, there is no going back. Please be
            certain.
          </p>
          <button className="btn btn-danger">Delete Account</button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
