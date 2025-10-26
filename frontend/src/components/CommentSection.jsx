import React, { useEffect, useState } from "react";
import { getComments, addComment, deleteComment } from "../utils/api";
import { getCurrentUser } from "../utils/auth";
import Loader from "./Loader";
import {  Trash } from "lucide-react";
import { Trash2 } from "react-feather";

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const user = getCurrentUser();
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await getComments(postId);
      setComments(data);
      setLoading(false);
    }
    load();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      setAdding(true);
      const created = await addComment(postId, text.trim());
      setComments((prev) => [...prev, created.comment || created]);
      setText("");
      setAdding(false);
    } catch (err) {
      setAdding(false);
      console.error(err);
      
    }
  };

  const handleDelete = async (commentId) => {
    try {
      setDeletingId(commentId);
      await deleteComment(postId, commentId);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      setDeletingId(null);
    } catch (err) {
      setDeletingId(null);
      console.error("Error deleting comment:", err);
    }
  };

  const isVerifiedAdmin =
    user?.isAdmin === true ;
  const isVerified =
    user?.verificationStatus === true ;
    

  return (
    <div className=" space-y-2">
      {/* Add new Comment */}
      <form onSubmit={handleSubmit} className="flex items-start space-x-2">
        <div className="flex-shrink-0 w-10 h-10">
          {user?.profilePic?.url ? (
            <img
              src={user.profilePic.url}
              alt={user.studentname || "You"}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-full text-blue-600 font-bold">
              {user?.studentname?.[0]?.toUpperCase() || "U"}
            </div>
          )}
        </div>

        <div className="flex-1 flex items-center space-x-2">
          <textarea
            rows="1"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (text.trim() && !adding) handleSubmit(e);
              }
            }}
           placeholder={user ? "Add a comment" : "Login to add a comment"}
            className={`flex-1 px-3 py-2 text-left rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none overflow-hidden ${
        user ? "bg-gray-100" : "bg-gray-200 cursor-not-allowed"
      }`}
            disabled={!user || adding}
            style={{
              minHeight: "4s0px",
              maxHeight: "150px",
              transition: "height 0.2s ease",
            }}
          />
          <button
            type="submit"
            className={`px-3 py-2 rounded-md text-sm flex items-center justify-center ${
        user
          ? "bg-blue-600 text-white hover:bg-blue-700"
          : "bg-gray-400 text-gray-200 cursor-not-allowed"
      }`}
            disabled={!user || adding || !text.trim()}
          >
            {adding ? <Loader size={16} /> : "Comment"}
          </button>
        </div>

      </form>
      {loading ? (
        <div className="flex  justify-center py-4">
          <Loader />
        </div>
      ) : comments.length > 0 ? (
        comments.map((c) => {
         
          const canDelete = user?._id === c.userId || isVerifiedAdmin;

          return (
            <div
              key={c._id}
              className="flex cursor-pointer items-start space-x-3 bg-gray-50 p-3 rounded-lg break-words"
            >
              {c.userProfilePic?.url ? (
                <img
                  src={c.userProfilePic.url}
                  alt={c.studentname || "User"}
                  className="flex-shrink-0 w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full font-bold text-gray-700">
                  {c.studentname?.[0]?.toUpperCase() || "?"}
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <p className="font-semibold text-sm flex items-center space-x-1 ">
                    
                    <span  className="truncate">{c.studentname}</span>

                    {/* Verified badge only for admins and evryone can see them verify by user  */}
                      { c.verificationStatus&& (
                        <img src="../verify.png" width={16} alt="verified" className="  flex-shrink-0" title="Verified" />
                         
                       )}

                  </p>

                  {canDelete && (
                    <button
                      onClick={() => handleDelete(c._id)}
                      className=" p-2 rounded-full cursor-pointer text-gray-400 hover:text-red-500 hover:bg-red-100  flex items-center"
                      disabled={deletingId === c._id}
                    >
                      {deletingId === c._id ? (
                        <Loader size={14} />
                      ) : (
                        <Trash size={18}  />
                      )}
                    </button>
                  )}
                </div>

                {/* Fixed comment text: breaks long strings */}
                <p className="text-gray-700 text-sm break-all whitespace-pre-wrap">
                  {c.text}
                </p>
              </div>
            </div>
          );
        })
      ) : (
        <p className="text-sm text-gray-500 text-center">No comments yet.</p>
      )}

      
    </div>
  );
};

export default CommentSection;
