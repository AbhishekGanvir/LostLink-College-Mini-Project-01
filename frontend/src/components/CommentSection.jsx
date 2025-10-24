import React, { useEffect, useState } from "react";
import { getComments, addComment, deleteComment } from "../utils/api";
import { getCurrentUser } from "../utils/auth";
import Loader from "./Loader";
import { UserStar, Trash } from "lucide-react";

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
      console.log("Loaded comments:", data);
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
      alert("Could not add comment.");
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

  return (
    <div className="mt-4 pt-4 space-y-4">
      {loading ? (
        <div className="flex justify-center py-4">
          <Loader />
        </div>
      ) : comments.length > 0 ? (
        comments.map((c) => (
          <div
            key={c._id}
            className="flex items-start space-x-3 bg-gray-50 p-3 rounded-lg"
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

            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <p className="font-semibold text-sm flex items-center space-x-1">
                  <span>{c.studentname}</span>

                  {/* Admin badge 
                  
                  
                  */}
                  {c.isAdmin && (
                    <UserStar
                      size={14}
                      className="text-blue-600"
                      title="Admin User"
                    />
                  )}
                </p>
                {user?._id === c.userId && (
                  <button
                    onClick={() => handleDelete(c._id)}
                    className="text-xs text-red-500 hover:underline flex items-center"
                    disabled={deletingId === c._id}
                  >
                    {deletingId === c._id ? (
                      <Loader size={14} />
                    ) : (
                      <Trash size={20} className="mr-1" />
                    )}
                  </button>
                )}
              </div>
              <p className="text-gray-700 text-sm">{c.text}</p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-500 text-center">No comments yet.</p>
      )}

      <form onSubmit={handleSubmit} className="flex items-start space-x-3">
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
        <div className="flex-1">
          <textarea
            rows="1"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a comment..."
            className="w-full px-3 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            disabled={adding}
          />
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 flex items-center justify-center"
              disabled={adding}
            >
              {adding ? <Loader size={16} /> : "Comment"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CommentSection;
