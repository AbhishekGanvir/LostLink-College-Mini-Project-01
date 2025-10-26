import React, { useState } from "react";
import { MessageSquare, Edit, Trash2 } from "lucide-react";
import CommentSection from "./CommentSection";
import ImageSlider from "./ImageSlider";
import EditPostModal from "./EditPostModal";
import { deletePost } from "../utils/api";
import toast from "react-hot-toast";
import ConfirmDialog from "./ConfirmDialog";

export const UnresolvedIcon = () => (
  <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block mr-1">
    <circle cx="4" cy="4" r="4" fill="#F59E0B" />
  </svg>
);

export const ResolvedIcon = () => (
  <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block mr-1">
    <circle cx="4" cy="4" r="4" fill="#10B981" />
  </svg>
);

const ItemCard = ({ item, currentUser, onUpdate, onDeleted }) => {
  const [showComments, setShowComments] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const safeItem = {
    studentname: "Anonymous",
    status: "UNRESOLVED",
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
    verificationStatus: item.userId?.verificationStatus, // ← add this
    isAdmin: item.userId?.isAdmin
  };

   

  const profilePicUrl =
    typeof safeItem.userId === "object"
      ? safeItem.userId.profilePic?.url
      : safeItem.userProfilePic?.url;


  const isResolved = safeItem.status?.toUpperCase() === "RESOLVED";
  
  const isLost = safeItem.itemType?.toUpperCase() === "FOUND";

    const ownerId = safeItem.userId?._id?.toString() || safeItem.userId?.toString();
const currentUserId = currentUser?._id?.toString();
const isOwner = currentUserId && ownerId && currentUserId === ownerId;

const isAdmin = currentUser?.isAdmin;
const canEdit = isOwner;          // owner can edit
const canDelete = isOwner || isAdmin; // owner or admin can delete






  const handleDelete = async () => {
    setLoading(true);
    try {
      await deletePost(safeItem._id);
      toast.success("Post deleted successfully!");
      setShowConfirm(false);
      onDeleted && onDeleted(safeItem._id);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white p-6 rounded-xl relative shadow-sm">
                  {/* Edit and delete */}
                {(canEdit || canDelete) && (
            <div className="absolute top-3 right-3 flex space-x-2">
              {canEdit && (
                <button
                  onClick={() => setShowEditModal(true)}
                  className="p-1.5 cursor-pointer rounded-full hover:bg-blue-100 text-blue-600 transition"
                  title="Edit Post"
                >
                  <Edit size={16} />
                </button>
              )}
              {canDelete && (
                <button
                  onClick={() => setShowConfirm(true)}
                  className="p-1.5 cursor-pointer rounded-full hover:bg-red-100 text-red-600 transition"
                  title="Delete Post"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          )}



        {/* Header */}
        <div
          onClick={() => (window.location.href = "/profile/" + (ownerId || ""))}
          className="flex items-start space-x-4 cursor-pointer"
        >
          <div className="flex-shrink-0">
            {profilePicUrl ? (
              <img
                src={profilePicUrl}
                alt={safeItem.studentname}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                {safeItem.studentname?.[0]?.toUpperCase() || "U"}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm flex items-center space-x-1">
              <span className="truncate">{safeItem.studentname}</span>
              {safeItem.verificationStatus && (
                <img
                  src="../src/assets/verify.png"
                  width={16}
                  alt="verified"
                  className="flex-shrink-0"
                  title="Verified"
                />
              )}
            </p>
            <p className="text-xs text-gray-500">
              {safeItem.isAdmin && (
    <span className="font-semibold text-blue-600 mr-1">Admin •</span>
  )}

              {safeItem.college_year} {safeItem.department && `• ${safeItem.department}`}
            </p>
            <div className="text-xs text-gray-500 flex items-center space-x-2 mt-1">
              <span className="flex items-center text-xs font-semibold">
                {isResolved ? <ResolvedIcon /> : <UnresolvedIcon />}
                {isResolved ? "RESOLVED" : "UNRESOLVED"}
              </span>
              <span>•</span>
              <span className="capitalize ">{safeItem.category}</span>
              <span className="text-gray-500">•</span>
              <span className={`font-semibold ${isLost ? "text-green-600" : "text-amber-600"}`}>
                {safeItem.itemType}
              </span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="mt-4">
          <h2 className="text-lg font-bold">{safeItem.title}</h2>
          <p className="text-gray-600 leading-relaxed mb-2 break-all whitespace-pre-wrap">{safeItem.description}</p>
          {safeItem.images?.length > 0 && <ImageSlider images={safeItem.images} />}
        </div>

        {/* Tags */}
        <div className="px-4 mt-2 pb-2 flex flex-wrap gap-2">
          {safeItem.tags?.length > 0 ? (
            safeItem.tags.map((tag, i) => (
              <span key={i} className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full font-medium">
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
              className="flex items-center cursor-pointer space-x-1 hover:text-gray-900 transition"
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
          <div className="border-t border-gray-100  bg-gray-50 p-4">
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

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={showConfirm}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
        loading={loading}
      />
    </>
  );
};

export default ItemCard;
