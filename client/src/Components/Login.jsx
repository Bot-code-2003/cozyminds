"use client";

import { useState, useEffect } from "react";
import {
  Eye,
  EyeOff,
  Sun,
  Moon,
  ArrowRight,
  Mail,
  Lock,
  AlertCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDarkMode } from "../context/ThemeContext";
import axios from "axios";
import CozyLoadingScreen from "./ui/LoadingScreen"; // 👈 make sure this path is correct

const Login = ({ setUser }) => {
  const { darkMode, setDarkMode } = useDarkMode();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState(null);

  const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });
  const MIN_LOADING_TIME = 3000; // 10 seconds

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    if (error) {
      setError(null);
    }
  }, [loginEmail, loginPassword]);

  useEffect(() => {
    let interval;
    if (showLoadingScreen) {
      setLoadingProgress(0);
      interval = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 1;
        });
      }, MIN_LOADING_TIME / 100);
    }
    return () => clearInterval(interval);
  }, [showLoadingScreen]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setShowLoadingScreen(true);
    setError(null);

    const startTime = Date.now();
    let user = null;

    try {
      const response = await API.post("/login", {
        email: loginEmail,
        password: loginPassword,
      });

      user = {
        id: response.data.user._id,
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
      };

      setUser(user);
      sessionStorage.setItem("user", JSON.stringify(user));
    } catch (error) {
      setShowLoadingScreen(false);

      if (error.response?.status === 401) {
        setError("Invalid email or password. Please try again.");
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.request) {
        setError(
          "No response from server. Please check your internet connection."
        );
      } else {
        setError("An unexpected error occurred. Please try again later.");
      }
      return;
    }

    const elapsed = Date.now() - startTime;
    const remaining = MIN_LOADING_TIME - elapsed;
    if (remaining > 0) {
      await new Promise((res) => setTimeout(res, remaining));
    }

    setShowLoadingScreen(false);
    navigate("/");
  };

  return (
    <div
      className={`min-h-screen ${
        darkMode
          ? "dark bg-[#1A1A1A] text-[#F8F1E9]"
          : "bg-[#F8F1E9] text-[#1A1A1A]"
      } font-sans flex flex-col items-center justify-center p-8 relative overflow-hidden transition-colors duration-300`}
    >
      {/* New Cozy Loading Screen */}
      <CozyLoadingScreen
        isLoading={showLoadingScreen}
        progress={loadingProgress}
      />

      <button
        onClick={toggleDarkMode}
        className="absolute top-6 right-6 p-2 hover:text-[#F4A261] transition-colors z-10"
        aria-label="Toggle dark mode"
      >
        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <Link to="/" className="text-xl font-bold tracking-wider mb-12 z-10">
        COZY
        <span className={`${darkMode ? "text-[#F4A261]" : "text-[#E68A41]"}`}>
          MINDS
        </span>
      </Link>

      <div
        className={`w-full max-w-md ${
          darkMode ? "bg-[#2A2A2A]" : "bg-white"
        } shadow-sharp p-8 z-10`}
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
          <p className="opacity-70 text-sm">Sign in to continue your journey</p>
        </div>

        {error && (
          <div
            className={`mb-6 p-3 flex items-start rounded-md ${
              darkMode ? "bg-red-900/30 text-red-200" : "bg-red-50 text-red-600"
            }`}
          >
            <AlertCircle className="mr-2 h-5 w-5 flex-shrink-0" />
            <div className="text-sm">{error}</div>
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-4">
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
                } ${
                  error ? (darkMode ? "border-red-500" : "border-red-400") : ""
                } border text-current focus:outline-none focus:border-[#F4A261] transition-all duration-300`}
                placeholder="Your email"
                required
              />
            </div>
          </div>

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
                } ${
                  error ? (darkMode ? "border-red-500" : "border-red-400") : ""
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

          <div className="text-right">
            <button
              type="button"
              className="text-sm opacity-70 hover:opacity-100 focus:outline-none"
            >
              Forgot your password?
            </button>
          </div>

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

        <div className="mt-6 text-center">
          <p className="text-sm opacity-70">
            Don't have an account?{" "}
            <Link to="/signup" className="text-[#F4A261] hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>

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
