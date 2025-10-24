import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPostById, addComment, getComments } from "../utils/api";
import CommentSection from "../components/CommentSection";

const PostDetails = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch post & comments
  useEffect(() => {
    const fetchData = async () => {
      try {
        const postRes = await getPostById(id);
        setPost(postRes.data);

        const commentsRes = await getComments(id);
        setComments(commentsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Add new comment
  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const res = await addComment(id, { text: newComment });
      setComments([...comments, res.data]);
      setNewComment("");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <p className="text-center mt-10 text-gray-500">Loading post...</p>;
  }

  if (!post) {
    return <p className="text-center mt-10 text-red-500">Post not found</p>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
        <p className="text-gray-600 mb-4">{post.description}</p>

        <div className="flex gap-4 flex-wrap mb-4">
          {post.images?.map((img, index) => (
            <img
              key={index}
              src={img.url}
              alt="post"
              className="w-40 h-40 object-cover rounded-lg border"
            />
          ))}
        </div>

        <p className="text-sm text-gray-500">
          Category: <span className="font-medium">{post.category}</span>
        </p>
        <p className="text-sm text-gray-500">
          Posted by: <span className="font-medium">{post.user?.name}</span>
        </p>
      </div>

      {/* 💬 Comment Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-3">Comments</h3>

        {/* Existing Comments */}
        <CommentSection comments={comments} />

        {/* Add New Comment */}
        <div className="mt-4 flex gap-2">
          <input
            type="text"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-grow border p-2 rounded"
          />
          <button
            onClick={handleAddComment}
            className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
