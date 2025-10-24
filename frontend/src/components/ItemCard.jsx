import React, { useState, useEffect } from "react";
import { MessageSquare, UserStar, Edit, Trash2 } from "lucide-react";
import CommentSection from "./CommentSection";
import ImageSlider from "./ImageSlider";
import EditPostModal from "./EditPostModal";
import { deletePost } from "../utils/api";
import toast from "react-hot-toast";

const ItemCard = ({ item, currentUser, onUpdate }) => {
  const [showComments, setShowComments] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const safeItem = {
    studentname: "Anonymous",
    status: "unresolved",
    category: "General",
    itemType: "Item",
    title: "No Title Provided",
    description: "No description available.",
    college_year: "",
    department: "",
    images: [],
    tags: [],
    commentCount: 0,
    views: 0,
    ...item,
  };

  // normalize owner id (supports userId as object or string)
  const ownerId =
    safeItem.userId && typeof safeItem.userId === "object"
      ? safeItem.userId._id || safeItem.userId.id
      : safeItem.userId;

  const profilePicUrl =
    typeof safeItem.userId === "object"
      ? safeItem.userId.profilePic?.url
      : safeItem.userProfilePic?.url;

  const statusColor =
    safeItem.status === "resolved" ? "text-green-500" : "text-amber-500";
  const statusLabel =
    safeItem.status === "resolved" ? "RESOLVED" : "UNRESOLVED";

  const isUserAdmin =
    (typeof safeItem.userId === "object" && safeItem.userId.isAdmin) ||
    safeItem.isAdmin ||
    false;

  const isOwner =
    !!currentUser &&
    (currentUser._id === ownerId ||
      currentUser.id === ownerId ||
      currentUser._id === safeItem.userId);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await deletePost(safeItem._id);
      toast.success("Post deleted successfully!");
      onUpdate && onUpdate(); // Refresh parent list
    } catch (err) {
      toast.error("Failed to delete post.");
      console.error(err);
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 overflow-hidden relative">
        {/* Edit/Delete Buttons (Top Right) */}
        {isOwner && (
          <div className="absolute top-3 right-3 flex space-x-2">
            <button
              onClick={() => setShowEditModal(true)}
              className="p-1.5 rounded-full hover:bg-blue-100 text-blue-600 transition"
              title="Edit Post"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={handleDelete}
              className="p-1.5 rounded-full hover:bg-red-100 text-red-600 transition"
              title="Delete Post"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}

        {/* Header */}
        <div
          onClick={() => (window.location.href = "/profile/" + (ownerId || ""))}
          className="flex items-start space-x-3 p-4 border-b border-gray-100 cursor-pointer"
        >
          <div className="flex-shrink-0">
            {profilePicUrl ? (
              <img
                src={profilePicUrl}
                alt={safeItem.studentname}
                className="w-10 h-10 rounded-full object-cover border border-gray-200"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold">
                {safeItem.studentname?.[0]?.toUpperCase() || "U"}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 truncate flex items-center space-x-2">
              <span>{safeItem.studentname}</span>
              {isUserAdmin && <UserStar size={16} className="text-blue-600" />}
            </p>
            <p className="text-xs text-gray-500">
              {safeItem.college_year}{" "}
              {safeItem.department && `• ${safeItem.department}`}
            </p>
            <div className="text-xs mt-1 flex items-center space-x-2 font-semibold">
              <span className={statusColor}>{statusLabel}</span>
              <span className="text-gray-400">•</span>
              <span className="text-blue-600 uppercase">
                {safeItem.itemType}
              </span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-500 capitalize">
                {safeItem.category}
              </span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-4">
          <h2 className="text-lg font-bold text-gray-800 mb-2">
            {safeItem.title}
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-3">
            {safeItem.description}
          </p>
          {safeItem.images?.length > 0 && (
            <ImageSlider images={safeItem.images} />
          )}
        </div>

        {/* Tags */}
        <div className="px-4 pb-2 flex flex-wrap gap-2">
          {safeItem.tags?.length > 0 ? (
            safeItem.tags.map((tag, i) => (
              <span
                key={i}
                className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full font-medium"
              >
                #{tag}
              </span>
            ))
          ) : (
            <span className="text-gray-400 text-xs italic">No tags</span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowComments((prev) => !prev)}
              className="flex items-center space-x-1 hover:text-gray-900 transition"
              aria-label="Toggle comments"
            >
              <MessageSquare size={14} />
              <span>{safeItem.commentCount} Comments</span>
            </button>
          </div>

          <p className="text-xs text-gray-400">
            {new Date(safeItem.createdAt).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>

        {showComments && (
          <div className="border-t border-gray-100 bg-gray-50 p-4">
            <CommentSection postId={safeItem._id} currentUser={currentUser} />
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <EditPostModal
          post={safeItem}
          closeModal={() => setShowEditModal(false)}
          onUpdate={onUpdate}
        />
      )}
    </>
  );
};

export default ItemCard;
