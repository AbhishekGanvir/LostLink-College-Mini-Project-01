// src/utils/auth.js
const API = import.meta.env.VITE_API_URL || "https://localhost:3000/api";

export async function loginUser({ studentname, password }) {
  try {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentname, password }),
    });

    if (!res.ok) {
      const errorData = await res
        .json()
        .catch(() => ({ message: "Login failed" }));
      throw new Error(errorData.message || "Login failed");
    }

    const data = await res.json();
    const token = data.token;
    // backend may return user fields at top-level (not nested). Normalize:
    const user =
      data.user ||
      (() => {
        const { token, ...rest } = data;
        return rest;
      })();

    if (token) localStorage.setItem("ll_token", token);
    if (user) localStorage.setItem("ll_user", JSON.stringify(user));

    return { token, user };
  } catch (error) {
    console.error("Login Error:", error);
    throw error;
  }
}

export async function registerUser({
  name,
  email,
  password,
  profilePicFile,
  college_year,
  department,
}) {
  try {
    const form = new FormData();
    // backend expects 'studentname' and 'profilePic' (matches multer fields)
    form.append("studentname", name);
    form.append("email", email);
    form.append("password", password);
    if (profilePicFile) form.append("profilePic", profilePicFile);
    if (college_year) form.append("college_year", college_year);
    if (department) form.append("department", department);

    const res = await fetch(`${API}/auth/register`, {
      method: "POST",
      body: form,
    });

    if (!res.ok) {
      const errData = await res
        .json()
        .catch(() => ({ message: "Registration failed" }));
      throw new Error(errData.message || "Registration failed");
    }

    const data = await res.json();
    const token = data.token;
    const user =
      data.user ||
      (() => {
        const { token, ...rest } = data;
        return rest;
      })();

    if (token) localStorage.setItem("ll_token", token);
    if (user) localStorage.setItem("ll_user", JSON.stringify(user));

    return { token, user };
  } catch (error) {
    console.error("Registration Error:", error);
    
    throw error;
  }
}

export function logout() {
  localStorage.removeItem("ll_token");
  localStorage.removeItem("ll_user");
}

export function getCurrentUser() {
  const str = localStorage.getItem("ll_user");
  return str ? JSON.parse(str) : null;
}

export function getToken() {
  return localStorage.getItem("ll_token");
}
