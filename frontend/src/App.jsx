import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import PostDetails from "./pages/PostDetails";

function App() {
  
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/post/:id" element={<PostDetails />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>

          <footer className="bg-gray-900 text-gray-300 mt-auto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col items-center justify-center">
          <p className="text-sm text-center md:text-base">
            &copy; 2025{" "}
            <a 
              href="https://github.com/AbhishekGanvir/LostLink-College-Mini-Project-01" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="font-semibold text-white hover:underline"
            >
              LostLink
            </a>
            . All rights reserved.
          </p>
        </div>
      </footer>

    </>
  );
}

export default App;
