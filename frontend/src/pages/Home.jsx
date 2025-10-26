import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import RightPanel from "../components/RightPanel";
import ItemCard from "../components/ItemCard";
import PostFormModal from "../components/PostFormModal";
import { getAllPosts } from "../utils/api";
import { getCurrentUser } from "../utils/auth";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const currentUser = getCurrentUser(); // fetch logged-in user
  const [openModal, setOpenModal] = useState(false);
  const [filter, setFilter] = useState("all");
  const [category, setCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    document.title = "Lostlink - Home";
    async function loadPosts() {
      try {
        const data = await getAllPosts();
        setPosts(data || []);
      } catch (error) {
        console.error("Error loading posts:", error);
      }
    }
    loadPosts();
  }, []);

  const filteredPosts = posts
    // Exclude resolved posts
    .filter((p) => p.status?.toLowerCase() !== "resolved")
    // Apply type/category/search filters
    .filter((p) => {
      const matchType = filter === "all" || p.itemType === filter;
      const matchCat =
        category === "all" || p.category?.toLowerCase() === category;
      const query = searchQuery.toLowerCase();
      const matchSearch =
        !query ||
        p.title?.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query) ||
        p.studentname?.toLowerCase().includes(query) ||
        p.tags?.some((t) => t.toLowerCase().includes(query));

      return matchType && matchCat && matchSearch;
    });

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-800 flex flex-col">
      <Navbar
        onPostClick={() => setOpenModal(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full  lg:w-1/4 space-y-6">
          <Sidebar
            selectedFilter={filter}
            onFilterChange={setFilter}
            category={category}
            onCategoryChange={setCategory}
          />
        </aside>

        {/* Posts Section */}
        <section className="flex-1 space-y-6 custom-scrollbar overflow-y-auto max-h-[80vh]">
          {filteredPosts.length === 0 ? (
            <div className="bg-white shadow-sm rounded-xl p-6 text-center text-gray-500">
              No items found matching your filters.
            </div>
          ) : (
            filteredPosts.map((item) => <ItemCard key={item._id} item={item} currentUser={currentUser}  />)
          )}
        </section>

        {/* Right Side Panel */}
        <aside className="hidden lg:block lg:w-1/4 space-y-6">
          <RightPanel />
        </aside>
      </main>

      {openModal && <PostFormModal closeModal={() => setOpenModal(false)} />}
    </div>
  );
};

export default Home;
