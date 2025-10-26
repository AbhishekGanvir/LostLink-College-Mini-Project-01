import React, { useState } from "react";
import { X } from "react-feather";
import { loginUser, registerUser } from "../utils/auth";
import Loader from "./Loader";
import toast from "react-hot-toast";

export default function AuthModal({ onClose, onLoginSuccess }) {
  const [authView, setAuthView] = useState("login");
  const [Studentname, setStudentname] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [profileimg, setProfileimg] = useState(null);
  const [college_year, setCollege_year] = useState("");
  const [department, setDepartment] = useState("");
  const [loading, setLoading] = useState(false);

  const commonInputClass =
    "w-full  rounded-md bg-gray-700 border border-gray-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      if (authView === "login") {
        const result = await loginUser({ studentname: Studentname, password });
        toast.success(
          `Welcome back, ${result.user?.studentname || Studentname}!`
        );
        onLoginSuccess && onLoginSuccess();
        setTimeout(() => onClose && onClose(), 1000);
      } else {
        const result = await registerUser({
          name: Studentname,
          email,
          password,
          profilePicFile: profileimg,
          college_year,
          department,
        });
        toast.success(
          `Account created successfully. Welcome, ${
            result.user?.studentname || Studentname
          }!`
        );
        onLoginSuccess && onLoginSuccess();
        setTimeout(() => onClose && onClose(), 1000);
      }
    } catch (error) {
      console.error("Auth error:", error);
      toast.error(error.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 bg-opacity-60 flex items-center justify-center cursor-pointer z-50"
      onClick={() => onClose && onClose()}
    >
      <div
        className="bg-gray-900 text-white p-8 rounded-xl shadow-2xl w-full max-w-md relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 cursor-pointer text-gray-400 hover:text-white"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>

        {authView === "login" ? (
          <div>
            <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Student Name
                </label>
                <input
                  type="text"
                  className={commonInputClass}
                  onChange={(e) => setStudentname(e.target.value)}
                  value={Studentname}
                  placeholder="John Doe"
                  disabled={loading}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  className={commonInputClass}
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  placeholder="Pass@123"
                  disabled={loading}
                  required
                />
              </div>
              <button
                type="submit"
                className={`w-full cursor-pointer py-2 bg-blue-600 rounded-lg font-semibold transition-colors flex items-center justify-center ${
                  loading
                    ? "opacity-60 cursor-not-allowed"
                    : "hover:bg-blue-700"
                }`}
                disabled={loading}
              >
                {loading ? <Loader size={18} /> : "Login"}
              </button>
            </form>
            <p className="text-center cursor-pointer text-sm text-gray-400 mt-6">
              Don’t have an account?{" "}
              <button
                onClick={() => setAuthView("signup")}
                className="font-semibold text-blue-400 cursor-pointer hover:underline"
                disabled={loading}
              >
                Sign Up
              </button>
            </p>
          </div>
        ) : (
          <div>
            <h2 className="text-3xl font-bold text-center">Sign Up</h2>
            <form onSubmit={handleSubmit}  className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className={commonInputClass}
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  placeholder="Johndoe@gmail.com"
                  disabled={loading}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Student Name
                </label>
                <input
                  type="text"
                  className={commonInputClass}
                  onChange={(e) => setStudentname(e.target.value)}
                  value={Studentname}
                  placeholder="John Doe"
                  disabled={loading}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Profile Picture
                </label>
                <input
                  type="file"
                  onChange={(e) => setProfileimg(e.target.files[0])}
                  accept="image/*"
                  className={`${commonInputClass} file:mr-4 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200`}
                  disabled={loading}
                />
              </div>
             <div>
                <label className="block text-sm cursor-pointer font-medium text-gray-400 mb-1">
                  College Year
                </label>
                <select
                  className={commonInputClass}
                  onChange={(e) => setCollege_year(e.target.value)}
                  value={college_year}
                  disabled={loading}
                  required
                >
                  <option value="" disabled>Select year</option>
                  <option value="1st yr">1st yr</option>
                  <option value="2nd yr">2nd yr</option>
                  <option value="3rd yr">3rd yr</option>
                  <option value="4th yr">4th yr</option>
                </select>
              </div>

              <div>
                <label className="block cursor-pointer text-sm font-medium text-gray-400 mb-1">
                  Department
                </label>
                <select
                  className={commonInputClass}
                  onChange={(e) => setDepartment(e.target.value)}
                  value={department}
                  disabled={loading}
                  required
                >
                  <option value="" disabled>Select department</option>
                  <option value="B.tech CSE">B.tech CSE</option>
                  <option value="B.tech ENTC">B.tech ENTC</option>
                  <option value="B.tech CE">B.tech CE</option>
                  <option value="B.tech EE">B.tech EE </option>
                  <option value="B.tech ME">B.tech ME</option>
                </select>
              </div>

              <div>
                <label className="block required:not-empty text-sm font-medium text-gray-400 mb-1">
                  Create Password
                </label>
                <input
                  type="password"
                  className={commonInputClass}
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  placeholder="Create Password"
                  disabled={loading}
                  required
                />
              </div>
              <button
                type="submit"
                className={`w-full cursor-pointer py-2 bg-blue-600 rounded-lg font-semibold transition-colors flex items-center justify-center ${
                  loading
                    ? "opacity-60 cursor-not-allowed"
                    : "hover:bg-blue-700"
                }`}
                disabled={loading}
              >
                {loading ? (
                  <Loader size={18} />
                ) : (
                  "Create Account"
                )}
              </button>
            </form>
            <p className="text-center text-sm text-gray-400 mt-6">
              Already have an account?{" "}
              <button
                onClick={() => setAuthView("login")}
                className="font-semibold text-blue-400 cursor-pointer hover:underline"
                disabled={loading}
              >
                Login
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
