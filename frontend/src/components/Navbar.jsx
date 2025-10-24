import React, { useState, useEffect } from "react";
import bell from "../assets/bell.png";
import AuthModal from "./AuthModal";
import PostFormModal from "./PostFormModal";
import NotificationPanel from "./NotificationDropdown";
import { getCurrentUser, logout } from "../utils/auth";
import { getNotifications } from "../utils/api";

const Navbar = ({ onPostClick, searchQuery, setSearchQuery }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState(getCurrentUser());
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [pendingPost, setPendingPost] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    setUser(getCurrentUser());
  }, [showAuthModal]);

  useEffect(() => {
    async function fetchNotifications() {
      if (user?._id) {
        const data = await getNotifications(user._id);
        setNotifications(data);
      }
    }
    fetchNotifications();
  }, [user?._id]);

  const handleLogout = () => {
    logout();
    setUser(null);
    setShowUserDropdown(false);
    setShowNotifications(false);
  };

  const handleGoToAdmin = () => {
    window.location.href = "/admin";
  };

  const handleLoginSuccess = () => {
    setUser(getCurrentUser());
    if (pendingPost) {
      setPendingPost(false);
      setShowAuthModal(false);
      setShowPostModal(true);
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16 relative">
        {/* Logo */}
        <h1
          onClick={() => (window.location.href = "/")}
          className="text-2xl font-bold text-blue-700 cursor-pointer select-none"
        >
          LostLink
        </h1>

        {/* Search Field */}
        <div className="flex-1 max-w-lg mx-8 hidden md:block">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search lost items..."
            className="w-full px-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border border-transparent focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-4 relative">
          {/* Add Item Button */}
          {user && (
            <button
              onClick={onPostClick}
              className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition shadow-sm"
            >
              + Add Item
            </button>
          )}

          {/* Authentication */}
          {!user ? (
            <button
              onClick={() => setShowAuthModal(true)}
              className="border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-100 font-medium"
            >
              Login
            </button>
          ) : (
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown((p) => !p)}
                className="flex items-center space-x-2"
              >
                {user.profilePic?.url ? (
                  <img
                    src={user.profilePic.url}
                    alt={user.studentname || "User"}
                    className="w-9 h-9 rounded-full border-2 border-transparent hover:border-blue-500"
                  />
                ) : (
                  <div className="w-9 h-9 flex items-center justify-center bg-gray-200 rounded-full text-gray-600 font-bold">
                    {user.studentname?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
              </button>

              {showUserDropdown && (
                <div className="absolute top-12 right-0 w-48 bg-white rounded-lg shadow-2xl z-20 border border-gray-100 overflow-hidden">
                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      window.location.href = "/profile/" + user._id;
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Profile
                  </button>

                  {user.isAdmin && (
                    <button
                      onClick={() => {
                        handleGoToAdmin();
                        setShowUserDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Admin Panel
                    </button>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Notifications Button */}
          {user && (
            <div className="relative">
              <button
                title="Notifications"
                onClick={() => setShowNotifications((p) => !p)}
                className="relative focus:outline-none"
              >
                <img src={bell} alt="Notifications" className="h-5 w-5" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 rounded-full w-3 h-3 animate-pulse" />
                )}
              </button>

              {showNotifications && (
                <NotificationPanel
                  userId={user?._id}
                  onClose={() => setShowNotifications(false)}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Auth Modals */}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
      {showPostModal && (
        <PostFormModal closeModal={() => setShowPostModal(false)} />
      )}
    </header>
  );
};

export default Navbar;
