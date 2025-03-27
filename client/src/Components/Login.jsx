"use client";

import { useState } from "react";
import { Eye, EyeOff, Sun, Moon, ArrowRight, Mail, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDarkMode } from "../context/ThemeContext";
import axios from "axios";
const Login = () => {
  const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });

  // const [darkMode, setdarkMode] = useState(false);
  const { darkMode, setDarkMode } = useDarkMode();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const toggleDarkMode = () => {
    // setdarkMode(!darkMode);
    // document.documentElement.classList.toggle("dark");
    setDarkMode(!darkMode);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    console.log("Login:", { email: loginEmail, password: loginPassword });

    try {
      const response = await API.post("/login", {
        email: loginEmail,
        password: loginPassword,
      });

      console.log("Login successful:", response.data);

      localStorage.setItem(
        "user",
        JSON.stringify({
          id: response.data.user._id, // Assuming backend returns the user object
          nickname: response.data.user.nickname,
          email: response.data.user.email,
          age: response.data.user.age,
          gender: response.data.user.gender,
          subscribe: response.data.user.subscribe,
          currentStreak: response.data.user.currentStreak,
          longestStreak: response.data.user.longestStreak,
          lastJournaled: response.data.user.lastJournaled,
          storyVisitCount: response.data.user.storyVisitCount,
          storiesCompleted: response.data.user.storiesCompleted,
          lastVisited: response.data.user.lastVisited,
        })
      );
      window.location.href = "/";
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div
      className={`min-h-screen ${
        darkMode
          ? "dark bg-[#1A1A1A] text-[#F8F1E9]"
          : "bg-[#F8F1E9] text-[#1A1A1A]"
      } font-sans flex flex-col items-center justify-center p-8 relative overflow-hidden transition-colors duration-300`}
    >
      {/* Dark Mode Toggle */}
      <button
        onClick={toggleDarkMode}
        className="absolute top-6 right-6 p-2 hover:text-[#F4A261] transition-colors z-10"
        aria-label="Toggle dark mode"
      >
        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      {/* Gradient Accent */}
      <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-[#FFD7BA] to-transparent opacity-70 dark:opacity-20 transition-opacity duration-300"></div>

      {/* SVG Decorative Element */}
      <div className="absolute top-20 left-10 opacity-10 dark:opacity-5">
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="20"
            y="20"
            width="80"
            height="80"
            stroke={darkMode ? "#F8F1E9" : "#1A1A1A"}
            strokeWidth="2"
          />
          <rect
            x="40"
            y="40"
            width="40"
            height="40"
            stroke={darkMode ? "#F8F1E9" : "#1A1A1A"}
            strokeWidth="2"
          />
        </svg>
      </div>

      {/* Logo */}
      <Link to="/" className="text-xl font-bold tracking-wider mb-12 z-10">
        COZY
        <span className={`${darkMode ? "text-[#F4A261]" : "text-[#E68A41]"}`}>
          MINDS
        </span>
      </Link>

      {/* Login Form */}
      <div
        className={`w-full max-w-md ${
          darkMode ? "bg-[#2A2A2A]" : "bg-white"
        } shadow-sharp p-8 z-10`}
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
          <p className="opacity-70 text-sm">Sign in to continue your journey</p>
        </div>

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          {/* Email */}
          <div className="relative">
            <label className="block text-sm font-medium mb-1">Email</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 opacity-70">
                <Mail size={18} />
              </div>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className={`w-full px-4 py-3 pl-10 ${
                  darkMode
                    ? "bg-[#1A1A1A] border-[#333333]"
                    : "bg-[#F8F1E9] border-[#D9D9D9]"
                } border text-current focus:outline-none focus:border-[#F4A261] transition-all duration-300`}
                placeholder="Your email"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 opacity-70">
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className={`w-full px-4 py-3 pl-10 ${
                  darkMode
                    ? "bg-[#1A1A1A] border-[#333333]"
                    : "bg-[#F8F1E9] border-[#D9D9D9]"
                } border text-current focus:outline-none focus:border-[#F4A261] transition-all duration-300`}
                placeholder="Your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 opacity-70 hover:opacity-100"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <button
              type="button"
              className="text-sm opacity-70 hover:opacity-100 focus:outline-none"
            >
              Forgot your password?
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full px-6 py-3 mt-6 ${
              darkMode
                ? "bg-[#F4A261] text-[#1A1A1A]"
                : "bg-[#1A1A1A] text-white"
            } hover:opacity-90 transition-all duration-300 flex items-center justify-center space-x-2 group`}
          >
            <span>Sign In</span>
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
        </form>

        {/* Signup Link */}
        <div className="mt-6 text-center">
          <p className="text-sm opacity-70">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-[#F4A261] hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>

      {/* Custom CSS */}
      <style jsx>{`
        .shadow-sharp {
          box-shadow: 6px 6px 0px rgba(0, 0, 0, 0.1);
        }
        .dark .shadow-sharp {
          box-shadow: 6px 6px 0px rgba(255, 255, 255, 0.05);
        }
      `}</style>
    </div>
  );
};

export default Login;
