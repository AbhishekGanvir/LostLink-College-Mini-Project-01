import React, { useEffect, useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import { getUserPosts, getUserById } from "../utils/api";
import { getCurrentUser } from "../utils/auth";
import { Edit, PlusCircle, Filter, } from "lucide-react";
import ItemCard from "../components/ItemCard";
import Navbar from "../components/Navbar";
import PostFormModal from "../components/PostFormModal";
import toast from "react-hot-toast";
import EditProfile from "../components/EditProfileModal";

const Profile = () => {
  const { id } = useParams();
   const navigate = useNavigate();
  const [viewedUser, setViewedUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const [userPosts, setUserPosts] = useState([]);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filter, setFilter] = useState("all"); // all, found, lost, resolved, unresolved

  const isOwnProfile = currentUser?._id === id;

  useEffect(() => {
    async function fetchProfileData() {
      try {
        setLoading(true);
       

        const userData = await getUserById(id);
        if (!userData) {
          setError("User not found.");
         // ❌ Instead of setError — show toast and redirect
          toast.error("Please log in to see profile");
          navigate("/login");
          return;
        }
        setViewedUser(userData);
        document.title = `Lostlink - ${
          userData ? userData.studentname : "Profile"
        }`;

        const postsData = await getUserPosts(id);
        setUserPosts(postsData);
      } catch (err) {
        console.error("Error loading profile data:", err);
        setError("Failed to load user profile.");
        setViewedUser(null);
        setUserPosts([]);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchProfileData();
  }, [id,navigate]);

  // helper to refresh posts (used after creating a new post)
  async function refreshPosts() {
    try {
      const postsData = await getUserPosts(id);
      setUserPosts(postsData);
    } catch (err) {
      console.error("Failed to refresh posts:", err);
    }
  }

  // filtering posts based on status
  const filteredPosts = userPosts.filter((post) => {
    if (filter === "all") return true;
    if (filter === "FOUND") return post.itemType === "FOUND";
    if (filter === "LOST") return post.itemType === "LOST";
    if (filter === "RESOLVED") return post.status === "RESOLVED";
    if (filter === "UNRESOLVED")
      return post.status === "UNRESOLVED";
    return true;
  });

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-gray-500 text-lg">Loading profile...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-red-600 text-lg font-semibold">{error}</p>
      </div>
    );

  return (
    <>
      <Navbar
  onPostClick={() => setShowPostModal(true)}
/>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        {/* ==== User Info Header ==== */}
        <div className="bg-gradient-to-r from-indigo-700 to-purple-500
 p-6 rounded-xl shadow-lg flex flex-col md:flex-row items-center md:items-start gap-6 mb-10">
          <div className="flex-shrink-0 w-32 h-32 rounded-full bg-[#E5E7EB] border-4 border-white shadow-lg overflow-hidden flex items-center justify-center">
            {viewedUser.profilePic?.url ? (
              <img
                src={viewedUser.profilePic.url}
                alt={viewedUser.studentname}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <span className="text-7xl font-bold text-[#6A7282]  rounded-full">
                {viewedUser.studentname?.[0]?.toUpperCase() || "U"}
              </span>
            )}
          </div>
           <div>
          <h2 className="text-4xl font-bold text-white  capitalize flex items-center space-x-1">
             <span className="truncate capitalize">{viewedUser.studentname}</span>
             { viewedUser.verificationStatus&& (
           <img src="../src/assets/verify.png" width={28} alt="verified" className="  flex-shrink-0 mt-2.5 ml-1.5" title="Verified" />
                         
                       )}
          </h2>

          <p className="text-[#E5E7EB] mt-1 text-sm">
            { viewedUser.verificationStatus&& (
             <span className="  mr-1">Admin •</span>
            ) }
            {viewedUser.college_year}{" "}
            {viewedUser.department && `• ${viewedUser.department}`}
          </p>

          {isOwnProfile && (
  <div className="flex space-x-4 mt-4 justify-center md:justify-start">
    <button
      onClick={() => setShowEditProfile(true)}
      className="flex items-center cursor-pointer bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors"
    >
      <Edit size={16} className="mr-2" />
      Edit Profile
    </button>

    <button
      onClick={() => setShowPostModal(true)}
      className="flex items-center cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
    >
      <PlusCircle size={16} className="mr-2" />
      Create Post
    </button>
  </div>
)}
        </div>
         </div>



        {/* ==== Layout Grid ==== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* ==== Sidebar ==== */}
          <aside className="lg:col-span-3">
            <div className="bg-gray-900 text-white p-5 rounded-xl shadow-sm space-y-3">
              <h3 className="font-bold text-lg mb-2 text-center border-b border-gray-700 pb-2">
                User Stats
              </h3>

              <div className="bg-gray-700 p-3 rounded-lg text-center">
                <p className="font-bold text-xl">Total Posts</p>
                <p className="text-2xl">{userPosts.length}</p>
              </div>

                      <div className="bg-gray-700 p-3 rounded-lg text-center">
              <p className="font-bold text-xl">Unresolved</p>
              <p className="text-2xl">
              {userPosts.filter((p) => p.status?.toUpperCase() === "UNRESOLVED").length}
              </p>
              </div>

              <div className="bg-gray-700 p-3 rounded-lg text-center">
              <p className="font-bold text-xl">Resolved</p>
              <p className="text-2xl">
              {userPosts.filter((p) => p.status?.toUpperCase() === "RESOLVED").length}
              </p>
              </div>


              <div className="bg-gray-700 p-3 rounded-lg text-center break-words">
                <p className="font-bold text-xl">Email</p>
                <p className="text-sm">{viewedUser.email}</p>
              </div>
            </div>
          </aside>

          {/* ==== Posts Section ==== */}
          <div className="lg:col-span-9">
            <div className="flex justify-between items-center  mb-3">
              <h3 className="text-2xl font-bold">Posts</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-3 py-1 rounded-md border cursor-pointer text-sm font-semibold ${
                    filter === "all"
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter("FOUND")}
                  className={`px-3 py-1 rounded-md border cursor-pointer text-sm font-semibold ${
                    filter === "FOUND"
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300"
                  }`}
                >
                  Found
                </button>
                <button
                  onClick={() => setFilter("LOST")}
                  className={`px-3 py-1 rounded-md border cursor-pointer text-sm font-semibold ${
                    filter === "LOST"
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300"
                  }`}
                >
                  Lost
                </button>
                <button
                  onClick={() => setFilter("RESOLVED")}
                  className={`px-3 py-1 rounded-md border cursor-pointer hidden sm:block text-sm font-semibold ${
                    filter === "RESOLVED"
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300"
                  }`}
                >
                  Resolved
                </button>
                <button
                  onClick={() => setFilter("UNRESOLVED")}
                  className={`px-3 py-1 rounded-md hidden sm:block cursor-pointer border text-sm font-semibold ${
                    filter === "UNRESOLVED"
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300"
                  }`}
                >
                  Unresolved
                </button>
              </div>
            </div>

            {/* Use your ItemCard for posts */}
            <div className="flex-1 space-y-6 custom-scrollbar border-[#E5E7EB] border-1 rounded-md  overflow-y-auto max-h-[55vh]">
              {filteredPosts.length > 0 ? (
                filteredPosts.map(
                  (post) => (
                    console.log(post),
                    (
                      <ItemCard
                        key={post._id}
                        item={post}
                        currentUser={currentUser}
                      />
                    )
                  )
                )
              ) : (
                <p className="text-center text-gray-500 py-10 bg-white rounded-xl shadow-sm">
                  No posts found.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
         {showEditProfile && (
  <EditProfile
    onClose={() => setShowEditProfile(false)}
    onUpdateSuccess={async () => {
      setShowEditProfile(false);
      // refresh profile data
      const userData = await getUserById(id);
      setViewedUser(userData);
      await refreshPosts();
    }}
  />
)}

      {showPostModal && (
        <PostFormModal
          closeModal={async () => {
            setShowPostModal(false);
            await refreshPosts();
          }}
        />
      )}
    </>
  );
};

export default Profile;