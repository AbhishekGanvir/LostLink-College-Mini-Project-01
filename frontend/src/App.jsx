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
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
    <footer className="bg-gray-800 text-white mt-auto">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center">
                    <p>&copy; 2025 Lost & Found Platform. All rights reserved.</p>
                </div>
            </footer>
    </>
  );
}

export default App;
