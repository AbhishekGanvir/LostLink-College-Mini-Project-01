// src/utils/api.js
import axios from "axios";
import { getCurrentUser } from "./auth";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const apiClient = axios.create({
  baseURL: API,
});

// Add auth token to headers automatically
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("ll_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// --- Posts ---
export async function getAllPosts() {
  try {
    const res = await apiClient.get("/post");
    return res.data;
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function getPostById(id) {
  try {
    const res = await apiClient.get(`/post/${id}`);
    return res.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function getUserPosts(userId) {
  try {
    const res = await apiClient.get(`/post/user/${userId}`);
    return res.data;
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function createPost(formData) {
  try {
    const res = await apiClient.post("/post", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err) {
    console.error("Error creating post:", err);
    throw err;
  }
}

export async function updatePost(postId, data) {
  try {
    const res = await apiClient.put(`/post/${postId}`, data);
    return res.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function deletePost(postId) {
  try {
    const res = await apiClient.delete(`/post/${postId}`);
    return res.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// --- Comments ---
export async function addComment(postId, text) {
  const user = getCurrentUser();
  console.log(user); // ✅ gets the logged-in user

  if (!user) {
    throw new Error("User not logged in");
  }

  try {
    const res = await apiClient.post(`/post/${postId}/comment`, {
      postId,
      userId: user._id,
      studentname: user.name || user.studentname || "Unknown",
      text,
    });
    return res.data;
  } catch (err) {
    console.error("Error adding comment:", err);
    throw err;
  }
}

export async function getComments(postId) {
  try {
    const res = await apiClient.get(`/post/${postId}/comment`);
    return res.data;
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function deleteComment(postId, commentId) {
  try {
    const res = await apiClient.delete(`/post/${postId}/comment/${commentId}`);
    return res.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// --- Notifications ---
export async function getNotifications(userId) {
  try {
    const res = await apiClient.get(`/notification/user/${userId}`);
    return res.data;
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function markNotificationsViewed(userId) {
  try {
    const res = await apiClient.put(`/notification/user/${userId}/viewed`);
    return res.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function markNotificationViewed(notificationId) {
  try {
    const res = await apiClient.put(`/notification/${notificationId}/view`);
    return res.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function deleteNotification(notificationId) {
  try {
    const res = await apiClient.delete(`/notification/${notificationId}`);
    return res.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// --- Admin ---
export async function getAdminStats() {
  try {
    const res = await apiClient.get("/admin/stats");
    return res.data;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function getAdminUsers() {
  try {
    const res = await apiClient.get("/admin/users");
    return res.data;
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function adminDeleteUser(userId) {
  try {
    const res = await apiClient.delete(`/admin/users/${userId}`);
    return res.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function loginUser(studentname, password) {
  try {
    const res = await apiClient.post("/auth/login", { studentname, password });
    return res.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function getAllUsers() {
  try {
    const res = await apiClient.get("/admin/users");
    return res.data;
  } catch (err) {
    // Axios response can be HTML for 401/redirect
    if (err.response && err.response.status === 401) {
      return []; // silently ignore unauthorized
    }
    console.error(err);
    return [];
  }
}

export async function getUserById(userId) {
  try {
    const res = await apiClient.get(`/user/users/${userId}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching user:", err);
    return null;
  }
}
