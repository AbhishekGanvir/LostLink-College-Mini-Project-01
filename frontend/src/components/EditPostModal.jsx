import React, { useState } from "react";
import { updatePost } from "../utils/api";
import toast from "react-hot-toast";
import { X } from "lucide-react";

const EditPostModal = ({ post, closeModal, onUpdate }) => {
  // existing images: always have { url, publicId }
  const initialImages = (post.images || []).map((img) => ({
    url: img.url || img,
    publicId: img.publicId || "",
  }));

  const [form, setForm] = useState({
    title: post.title || "",
    description: post.description || "",
    category: post.category || "personal item",
    itemType: post.itemType || "LOST",
    tags: (post.tags && post.tags.join(", ")) || "",
    status: post.status || "UNRESOLVED",
    images: initialImages,
  });

  const [loading, setLoading] = useState(false);

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
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("category", form.category);
      formData.append("itemType", form.itemType.toUpperCase());
      formData.append("tags", form.tags);
      formData.append("status", form.status.toUpperCase());

      // existing images (with url + publicId)
      const existingImages = form.images
        .filter((i) => !i.file)
        .map((i) => ({ url: i.url, publicId: i.publicId || "" }));
      formData.append("existingImages", JSON.stringify(existingImages));

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
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-gray-800 text-white p-8 rounded-xl shadow-2xl w-full max-w-lg relative">
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-gray-400 cursor-pointer hover:text-white"
        >
          <X size={24} />
        </button>

        <h2 className="text-3xl font-bold mb-6 text-center">Edit Post</h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 max-h-[70vh] overflow-y-auto pr-2"
        >
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Post Title
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-200"
              disabled={loading}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Details
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-200"
              disabled={loading}
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Status
            </label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-200"
              disabled={loading}
            >
              <option value="UNRESOLVED">Unresolved</option>
              <option value="RESOLVED">Resolved</option>
            </select>
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
                      className="absolute top-1 right-1 bg-black/60 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition"
                      disabled={loading}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 rounded-md border border-gray-400 text-gray-400"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-5 py-2 rounded-md text-white font-medium ${
                loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
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
