import React, { useEffect, useState } from "react";
import {
  getAdminStats,
  getAdminUsers,
  getAdminPosts,
  adminDeleteUser,
  adminDeletePost,
  adminCleanup,
} from "../utils/api";
import { Trash2, Users, FileText, AlertTriangle } from "react-feather";
import {MessageSquareText, SearchCheck} from "lucide-react"
import Navbar from "../components/Navbar";
import ConfirmDialog from "../components/ConfirmDialog";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCleanupDialog, setShowCleanupDialog] = useState(false);
const [cleanupLoading, setCleanupLoading] = useState(false);


  // Fetch admin data
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [statsData, usersData, postsData] = await Promise.all([
          getAdminStats(),
          getAdminUsers(),
          getAdminPosts(),
        ]);

        setStats(statsData || {});
        setUsers(Array.isArray(usersData) ? usersData : []);
        setPosts(Array.isArray(postsData) ? postsData : []);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  // Delete user handler
  const handleDeleteUser = async (userId) => {
    try {
      await adminDeleteUser(userId);
      setUsers(users.filter((u) => u._id !== userId));
    } catch (err) {
      console.error(err);
      alert("Failed to delete user.");
    }
  };

  // Delete post handler
  const handleDeletePost = async (postId) => {
   
    try {
      await adminDeletePost(postId);
      setPosts(posts.filter((p) => p._id !== postId));
    } catch (err) {
      console.error(err);
      alert("Failed to delete post.");
    }
  };

  
  // Cleanup all data (Danger Zone)
const handleCleanup = async () => {
  setCleanupLoading(true);
  try {
    await adminCleanup(); // call API function instead of fetch
    setUsers([]);
    setPosts([]);
    toast.success("All data cleaned up!");
    setShowCleanupDialog(false);
  } catch (err) {
    console.error(err);
    toast.error("Cleanup failed.");
  } finally {
    setCleanupLoading(false);
  }
};


  if (loading) return <p className="p-6">Loading admin dashboard...</p>;
  if (error) return <p className="p-6 text-red-500">Error: {error}</p>;

  

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          Admin Dashboard
        </h1>

       {/* Stats Section */}
<div className="mb-8">
  {/* Mobile Slider */}
  <div className="sm:hidden flex space-x-4 overflow-x-auto px-2 py-2 scrollbar-hide">
    {/* Each card */}
    {[{
      icon: <Users className="w-10 h-10 text-blue-500" />,
      value: stats.users || 0,
      label: "Total Users",
      bg: "from-blue-50 to-blue-100",
      text: "text-blue-600"
    },
    {
      icon: <FileText className="w-10 h-10 text-green-500" />,
      value: stats.totalPosts || 0,
      label: "Total Posts",
      bg: "from-green-50 to-green-100",
      text: "text-green-600"
    },
    {
      icon: <MessageSquareText className="w-10 h-10 text-yellow-500" />,
      value: stats.totalComments || 0,
      label: "Total Comments",
      bg: "from-yellow-50 to-yellow-100",
      text: "text-yellow-600"
    },
    {
      icon: <SearchCheck className="w-10 h-10 text-purple-500" />,
      value: stats.resolvedPosts || 0,
      label: "Resolved Posts",
      bg: "from-purple-50 to-purple-100",
      text: "text-purple-600"
    },
    {
      icon: <AlertTriangle className="w-10 h-10 text-red-500" />,
      value: stats.unresolvedPosts || 0,
      label: "Unresolved Posts",
      bg: "from-red-50 to-red-100",
      text: "text-red-600"
    }].map((stat, idx) => (
      <div
        key={idx}
        className={`flex-shrink-0 w-56 flex items-center p-4 bg-gradient-to-r ${stat.bg} rounded-xl shadow-lg transform transition duration-300 hover:scale-105`}
      >
        {stat.icon}
        <div className="ml-3">
          <p className={`text-2xl font-bold ${stat.text} transition duration-500 ease-in-out`}>{stat.value}</p>
          <p className="text-gray-500 text-sm">{stat.label}</p>
        </div>
      </div>
    ))}
  </div>

  {/* Desktop Grid */}
  <div className="hidden sm:grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
    {/* Repeat same cards as before */}
    <div className="flex items-center p-5 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl shadow-lg transform transition duration-300 hover:scale-105">
      <Users className="w-12 h-12 text-blue-500 mr-4" />
      <div>
        <p className="text-3xl font-bold text-blue-600">{stats.users || 0}</p>
        <p className="text-gray-500 text-sm">Total Users</p>
      </div>
    </div>
    <div className="flex items-center p-5 bg-gradient-to-r from-green-50 to-green-100 rounded-xl shadow-lg transform transition duration-300 hover:scale-105">
      <FileText className="w-12 h-12 text-green-500 mr-4" />
      <div>
        <p className="text-3xl font-bold text-green-600">{stats.totalPosts || 0}</p>
        <p className="text-gray-500 text-sm">Total Posts</p>
      </div>
    </div>
    <div className="flex items-center p-5 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl shadow-lg transform transition duration-300 hover:scale-105">
      <MessageSquareText className="w-12 h-12 text-yellow-500 mr-4" />
      <div>
        <p className="text-3xl font-bold text-yellow-600">{stats.totalComments || 0}</p>
        <p className="text-gray-500 text-sm">Total Comments</p>
      </div>
    </div>
    <div className="flex items-center p-5 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl shadow-lg transform transition duration-300 hover:scale-105">
      <SearchCheck className="w-12 h-12 text-purple-500 mr-4" />
      <div>
        <p className="text-3xl font-bold text-purple-600">{stats.resolvedPosts || 0}</p>
        <p className="text-gray-500 text-sm">Resolved Posts</p>
      </div>
    </div>
    <div className="flex items-center p-5 bg-gradient-to-r from-red-50 to-red-100 rounded-xl shadow-lg transform transition duration-300 hover:scale-105">
      <AlertTriangle className="w-12 h-12 text-red-500 mr-4" />
      <div>
        <p className="text-3xl font-bold text-red-600">{stats.unresolvedPosts || 0}</p>
        <p className="text-gray-500 text-sm">Unresolved Posts</p>
      </div>
    </div>
  </div>
</div>


<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         
         {/* User Management */}
  <div className="bg-white p-6 rounded-xl shadow-sm">
    <h2 className="text-2xl font-bold mb-4 flex items-center">
      <Users className="mr-2" />
      User Management
    </h2>
    <div className="space-y-3 custom-scrollbar overflow-y-auto max-h-[40vh]">
      {users.map((user) => (
        <div
          key={user._id}
          className="flex cursor-pointer items-center justify-between bg-gray-50 p-3 rounded-lg"
        >
          <div className="flex items-center">
            <div
              onClick={() => window.location.href = `/profile/${user._id}`}
              className="flex-shrink-0 w-12 h-12 rounded-full bg-[#E5E7EB] border-2 border-white shadow-lg overflow-hidden flex items-center justify-center mr-4"
            >
              {user.profilePic?.url ? (
                <img
                  src={user.profilePic.url}
                  alt={user.name || "User"}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <span className="text-2xl font-bold text-[#6A7282]">
                  {user.name?.[0]?.toUpperCase() || "U"}
                </span>
              )}
            </div>
            <div>
              <p className="font-bold flex items-center space-x-2">
                 <span>{ user.name || user.studentname || "Unnamed User"}</span>
                <span className="text-xs font-normal bg-gray-200 px-2 py-0.5 rounded-full">
                  {user.isAdmin ? "Admin" : "User"}
                </span>
              </p>
              <p className="text-sm text-gray-500">
                {user.college_year || "N/A"} - {user.department || "N/A"}
              </p>
            </div>
          </div>
          <button
            onClick={() => handleDeleteUser(user._id)}
            className="p-2 cursor-pointer text-gray-400 hover:text-red-500 hover:bg-red-100 rounded-full"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ))}
    </div>
  </div>

          {/* Post Management */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <FileText className="mr-2" />
              Post Management
            </h2>
            <div className="space-y-3   custom-scrollbar overflow-y-auto max-h-[40vh]">
              {posts.map((post) => (
                <div
                  key={post._id}
                  className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                >
                  <div className="flex items-center min-w-0">
                    <img
                      src={post.images?.[0]?.url || "https://thumbs.dreamstime.com/b/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available-236105299.jpg"}
                      alt=""
                      className="w-16 h-12 object-cover rounded-md mr-4 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-bold truncate">{post.title}</p>
                      <p className="text-sm text-gray-500">
                        by { post.userId?.studentname || post.userId?.name || "Unknown"} 
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeletePost(post._id)}
                    className="p-2 cursor-pointer text-gray-400 hover:text-red-500 hover:bg-red-100 rounded-full ml-4"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-xl shadow-sm mt-8">
          <h2 className="text-2xl font-bold text-red-800 mb-4 flex items-center">
            <AlertTriangle className="mr-2" />
            Danger Zone
          </h2>
          <p className="text-red-700 cursor-pointer mb-4">
            This action is irreversible. It will permanently delete all posts, comments and users from the database.
          </p>
          <button
             onClick={() => setShowCleanupDialog(true)}
            className="bg-red-600 cursor-pointer  text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
          >
            Clean Up
          </button>
        </div>
      </main>
      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={showCleanupDialog}
        title="Clean Up All Data"
         message="This action is irreversible. It will permanently delete all posts, comments and users from the database. Are you sure?"
         onConfirm={handleCleanup}
        onCancel={() => setShowCleanupDialog(false)}
        loading={cleanupLoading}
      />
    </>
  );
};

export default AdminDashboard;
