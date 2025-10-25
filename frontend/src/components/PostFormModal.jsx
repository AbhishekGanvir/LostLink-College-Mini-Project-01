import React, { useState } from "react";
import { createPost } from "../utils/api";
import { getCurrentUser } from "../utils/auth";
import toast from "react-hot-toast";
import {X} from "lucide-react"

const PostFormModal = ({ closeModal }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "personal item", // matches backend enum
    itemType: "LOST", // matches backend enum
    tags: "",
    images: [],
  });
  const [loading, setLoading] = useState(false);

  // Handle image upload
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + form.images.length > 3) {
      toast.error("You can upload up to 3 images only.");
      return;
    }

    const previews = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setForm({ ...form, images: [...form.images, ...previews] });
  };

  const removeImage = (index) => {
    setForm({
      ...form,
      images: form.images.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = getCurrentUser();
    if (!user) {
      toast.error("Please log in first.");
      return;
    }

    if (!form.title.trim() || !form.description.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("category", form.category); // personal item | document
      formData.append("itemType", form.itemType); // lost | found
      formData.append("tags", form.tags);

      // User info
      formData.append("studentname", user.studentname);
      formData.append("userId", user._id);
      formData.append("department", user.department || "Unknown");
      formData.append("college_year", user.college_year || "N/A");

      form.images.forEach((img) => formData.append("images", img.file));

      await createPost(formData);
      toast.success("✅ Post created successfully!");

      setForm({
        title: "",
        description: "",
        category: "personal item",
        itemType: "LOST",
        tags: "",
        images: [],
      });
      closeModal();
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error(err.response?.data?.error || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 bg-opacity-70 flex items-center justify-center  z-50">
      <div className="bg-gray-800 text-white p-8 rounded-xl shadow-2xl w-full max-w-lg relative">
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-gray-400 cursor-pointer hover:text-white"
        >
          <X size={24} />
        </button>

        <h2 className="text-3xl font-bold mb-6  text-center">
          Create  Post
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          {/* Title */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-400 mb-1">Post Title</label>
            <input
              type="text"
              id="title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200"
              placeholder=" "
              required
            />
          </div>

          {/* Description */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-400 mb-1">Details</label>
            <textarea
              id="description"
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200"
              placeholder=" "
              required
            ></textarea>
            
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200"
            >
              <option value="Personal Item">Personal Item</option>
              <option value="Document">Document</option>
            </select>
          </div>

          {/* Item Type */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Item Type
            </label>
            <select
              value={form.itemType}
              onChange={(e) => setForm({ ...form, itemType: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200"
            >
              <option value="LOST">Lost</option>
              <option value="FOUND">Found</option>
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Tags</label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              className="w-full border border-gray-300 rounded-md p-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
              placeholder="e.g. Phone, ID card"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Upload Images (max 3)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="fileUpload"
              />
              <label
                htmlFor="fileUpload"
                className="cursor-pointer text-blue-600 font-medium"
              >
                Click to add images
              </label>
              <p className="text-xs text-gray-500 mt-1">
                (PNG, JPG up to 5MB each)
              </p>
            </div>

            {form.images.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {form.images.map((img, i) => (
                  <div
                    key={i}
                    className="relative w-20 h-20 rounded-md overflow-hidden group"
                  >
                    <img
                      src={img.url}
                      alt="preview"
                      className="object-cover w-full h-full"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 bg-black/60 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center opacity-0 cursor-pointer group-hover:opacity-100 transition"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-center pt-2 gap-2 sm:gap-0">
            <button
              type="button"
              onClick={closeModal}
              className="w-full sm:w-auto px-4 py-2 rounded-md border border-gray-300 cursor-pointer text-gray-400 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`w-full sm:w-auto px-5 py-2 rounded-md text-white font-medium cursor-pointer transition ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Posting..." : "Add Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostFormModal;
