import React, { useState, useEffect } from "react";
import AuthModal from "./AuthModal";
import PostFormModal from "./PostFormModal";
import NotificationPanel from "./NotificationDropdown";
import { getCurrentUser, logout } from "../utils/auth";
import { getNotifications } from "../utils/api";
import { Bell } from "lucide-react";

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

        <div className="flex items-center cursor-pointer gap-4 relative">
          {/* Add Item Button */}
          {user && (
            <button
              onClick={onPostClick}
              className="flex items-center cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition shadow-sm"
            >
              Add Post
            </button>
          )}

          {/* Notifications Button */}
          {user && (
            <div className="relative">
              <button
                title="Notifications"
                onClick={() => setShowNotifications((p) => !p)}
                className="relative focus:outline-none"
              >
                <Bell alt="Notifications" className="h-6 cursor-pointer w-6" />
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

          {/* Authentication */}
          {!user ? (
            <button
              onClick={() => setShowAuthModal(true)}
              className="border cursor-pointer border-gray-200 px-4 py-2 rounded-lg bg-blue-600 text-white  font-medium"
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
                  <div className="w-9 h-9 flex items-center justify-center cursor-pointer bg-gray-200 rounded-full text-gray-600 font-bold">
                    {user.studentname?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
              </button>

              {showUserDropdown && (
                <div className="absolute top-12  right-0 w-48 bg-white rounded-lg shadow-2xl z-20 border p-2 py-1 border-gray-100 overflow-hidden">

                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      window.location.href = "/profile/" + user._id;
                    }}
                    className="w-full cursor-pointer text-left flex items-center p-2 hover:bg-gray-100 rounded-md"
                  ><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user mr-2" aria-hidden="true"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    Profile
                  </button>

                  {user.isAdmin && (
                    <button
                      onClick={() => {
                        handleGoToAdmin();
                        setShowUserDropdown(false);
                      }}
                      className="w-full cursor-pointer text-left flex items-center p-2 hover:bg-gray-100 rounded-md"
                    ><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-users mr-2" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><path d="M16 3.128a4 4 0 0 1 0 7.744"></path><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><circle cx="9" cy="7" r="4"></circle></svg>
                      Admin Panel
                    </button>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full cursor-pointer text-left flex items-center p-2 text-red-600 hover:bg-red-50 rounded-md">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-log-out mr-2" aria-hidden="true"><path d="m16 17 5-5-5-5"></path><path d="M21 12H9"></path><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path></svg>
                    Logout
                  </button>
                </div>
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
