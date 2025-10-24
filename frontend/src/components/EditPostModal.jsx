import React, { useState } from "react";
import { updatePost } from "../utils/api";
import toast from "react-hot-toast";

const EditPostModal = ({ post, closeModal, onUpdate }) => {
  // initialize images array: existing images as { url }
  const initialImages = (post.images || []).map((img) =>
    typeof img === "string" ? { url: img } : { url: img.url || img }
  );

  const [form, setForm] = useState({
    title: post.title || "",
    description: post.description || "",
    category: post.category || "personal item",
    itemType: post.itemType || "lost",
    tags: (post.tags && post.tags.join(", ")) || "",
    status: post.status || "unresolved",
    images: initialImages, // array of { url } and/or { file, url }
  });
  const [loading, setLoading] = useState(false);

  // Handle image file selection (keep previews)
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length + form.images.length > 3) {
      toast.error("You can have up to 3 images total.");
      return;
    }
    const previews = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setForm((prev) => ({ ...prev, images: [...prev.images, ...previews] }));
  };

  const removeImage = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.description.trim()) {
      toast.error("Please fill in required fields.");
      return;
    }

    setLoading(true);
    try {
      // Use FormData so we can send new files and keep existing image URLs
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("category", form.category);
      formData.append("itemType", form.itemType);
      formData.append("tags", form.tags);
      formData.append("status", form.status);

      // existing image URLs to keep
      const existingUrls = form.images.filter((i) => !i.file).map((i) => i.url);
      formData.append("existingImages", JSON.stringify(existingUrls));

      // new files
      form.images.forEach((img) => {
        if (img.file) formData.append("images", img.file);
      });

      await updatePost(post._id, formData);
      toast.success("✅ Post updated successfully!");
      onUpdate && onUpdate();
      closeModal();
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error(err.response?.data?.error || "Failed to update post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-40 p-4">
      <div className="bg-white w-full max-w-md sm:w-96 rounded-xl shadow-lg p-6 relative animate-slideUp">
        <button
          onClick={closeModal}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 transition"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold text-gray-900 text-center mb-4">
          Edit Post
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="relative">
            <input
              type="text"
              id="title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="peer w-full border border-gray-300 rounded-md p-3 placeholder-transparent focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
              placeholder=" "
              required
              disabled={loading}
            />
            <label
              htmlFor="title"
              className="absolute left-3 top-3 text-gray-500 text-sm transition-all 
                peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base 
                peer-focus:top-1 peer-focus:text-xs peer-focus:text-blue-600"
            >
              Item Title *
            </label>
          </div>

          {/* Description */}
          <div className="relative">
            <textarea
              id="description"
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="peer w-full border border-gray-300 rounded-md p-3 placeholder-transparent focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
              placeholder=" "
              required
              disabled={loading}
            ></textarea>
            <label
              htmlFor="description"
              className="absolute left-3 top-3 text-gray-500 text-sm transition-all 
                peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base 
                peer-focus:top-1 peer-focus:text-xs peer-focus:text-blue-600"
            >
              Description *
            </label>
          </div>

          {/* Category / Item Type */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full border border-gray-300 rounded-md p-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                disabled={loading}
              >
                <option value="personal item">Personal Item</option>
                <option value="document">Document</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Item Type
              </label>
              <select
                value={form.itemType}
                onChange={(e) => setForm({ ...form, itemType: e.target.value })}
                className="w-full border border-gray-300 rounded-md p-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                disabled={loading}
              >
                <option value="lost">Lost</option>
                <option value="found">Found</option>
              </select>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full border border-gray-300 rounded-md p-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
              disabled={loading}
            >
              <option value="unresolved">Unresolved</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Tags</label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              className="w-full border border-gray-300 rounded-md p-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
              placeholder="e.g. purse, pink, ID card"
              disabled={loading}
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm text-gray-600 mb-2">
              Upload Images (max 3)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="editFileUpload"
                disabled={loading}
              />
              <label
                htmlFor="editFileUpload"
                className={`cursor-pointer text-blue-600 font-medium ${
                  loading ? "opacity-60 pointer-events-none" : ""
                }`}
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
                      alt={`preview-${i}`}
                      className="object-cover w-full h-full"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 bg-black/60 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                      disabled={loading}
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
              className="w-full sm:w-auto px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`w-full sm:w-auto px-5 py-2 rounded-md text-white font-medium transition ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPostModal;
