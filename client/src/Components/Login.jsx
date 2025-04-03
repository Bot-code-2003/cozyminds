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
import CozyLoadingScreen from "./ui/LoadingScreen";

const Login = ({ setUser }) => {
  const { darkMode, setDarkMode } = useDarkMode();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState(null);
  const [isHovering, setIsHovering] = useState(false);

  const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });
  const MIN_LOADING_TIME = 3000; // 3 seconds

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
      className={`min-h-screen text-black dark:text-white ${
        darkMode
          ? "dark bg-gradient-to-b from-[#1A1A1A] to-[#2A2A2A]"
          : "bg-gradient-to-b from-[#F8F1E9] to-[#F0E6DD]"
      } font-sans flex flex-col items-center justify-center p-8 relative overflow-hidden transition-colors duration-300`}
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-[#F4A261] to-transparent opacity-10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-tl from-[#F4A261] to-transparent opacity-10 rounded-full translate-x-1/2 translate-y-1/2"></div>

        {/* Floating shapes */}
        <div className="shape-1 absolute top-[20%] right-[15%] w-16 h-16 border-2 border-[#F4A261] opacity-20 animate-float-slow"></div>
        <div className="shape-2 absolute bottom-[30%] left-[10%] w-12 h-12 bg-[#F4A261] opacity-10 animate-float-medium"></div>
        <div className="shape-3 absolute top-[60%] right-[25%] w-8 h-8 border border-[#F4A261] opacity-15 animate-float-fast"></div>

        {/* Light beams */}
        <div className="absolute top-1/4 left-1/3 w-[300px] h-[30px] bg-[#F4A261] opacity-5 rotate-45 blur-xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[40px] bg-[#F4A261] opacity-5 -rotate-45 blur-xl"></div>
      </div>

      {/* Cozy Loading Screen */}
      <CozyLoadingScreen
        isLoading={showLoadingScreen}
        progress={loadingProgress}
      />

      <button
        onClick={toggleDarkMode}
        className="absolute top-6 right-6 p-2 hover:text-[#F4A261] transition-colors z-10 bg-opacity-20 hover:bg-opacity-30 bg-white dark:bg-black dark:bg-opacity-20 rounded-full"
        aria-label="Toggle dark mode"
      >
        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <Link
        to="/"
        className="text-3xl font-bold tracking-wider mb-12 z-10 animate-fade-in relative"
      >
        <span className="relative">
          COZY
          <span className={`${darkMode ? "text-[#F4A261]" : "text-[#E68A41]"}`}>
            MINDS
          </span>
          <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#F4A261] to-transparent"></span>
        </span>
      </Link>

      <div
        className={`w-full max-w-md ${
          darkMode ? "bg-[#2A2A2A]" : "bg-white"
        } shadow-sharp p-8 z-10 animate-slide-up relative overflow-hidden`}
      >
        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden">
          <div
            className={`absolute top-0 right-0 w-40 h-40 -rotate-45 translate-x-20 -translate-y-20 ${
              darkMode ? "bg-[#333333]" : "bg-[#F0E6DD]"
            }`}
          ></div>
        </div>

        <div className="text-center mb-8 relative">
          <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
          <p className="opacity-70 text-sm">Sign in to continue your journey</p>
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-gradient-to-r from-transparent via-[#F4A261] to-transparent"></div>
        </div>

        {error && (
          <div
            className={`mb-6 p-4 flex items-start rounded-md ${
              darkMode
                ? "bg-red-900/30 text-red-200 border-l-4 border-red-500"
                : "bg-red-50 text-red-600 border-l-4 border-red-400"
            } animate-shake`}
          >
            <AlertCircle className="mr-3 h-5 w-5 flex-shrink-0" />
            <div className="text-sm">{error}</div>
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-5">
          <div className="relative">
            <label className="block text-sm font-medium mb-1">Email</label>
            <div className="relative">
              <div
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 opacity-70 transition-colors ${
                  loginEmail ? "text-[#F4A261]" : ""
                }`}
              >
                <Mail size={18} />
              </div>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className={`w-full px-4 py-3 pl-10 ${
                  darkMode
                    ? "bg-[#1A1A1A] border-[#333333] focus:bg-[#222222]"
                    : "bg-[#F8F1E9] border-[#D9D9D9] focus:bg-white"
                } ${
                  error
                    ? darkMode
                      ? "border-red-500"
                      : "border-red-400"
                    : loginEmail
                    ? darkMode
                      ? "border-[#F4A261]"
                      : "border-[#E68A41]"
                    : ""
                } border text-current focus:outline-none focus:border-[#F4A261] focus:ring-2 focus:ring-[#F4A261]/20 transition-all duration-300 shadow-sm`}
                placeholder="Your email"
                required
              />
            </div>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <div
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 opacity-70 transition-colors ${
                  loginPassword ? "text-[#F4A261]" : ""
                }`}
              >
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className={`w-full px-4 py-3 pl-10 ${
                  darkMode
                    ? "bg-[#1A1A1A] border-[#333333] focus:bg-[#222222]"
                    : "bg-[#F8F1E9] border-[#D9D9D9] focus:bg-white"
                } ${
                  error
                    ? darkMode
                      ? "border-red-500"
                      : "border-red-400"
                    : loginPassword
                    ? darkMode
                      ? "border-[#F4A261]"
                      : "border-[#E68A41]"
                    : ""
                } border text-current focus:outline-none focus:border-[#F4A261] focus:ring-2 focus:ring-[#F4A261]/20 transition-all duration-300 shadow-sm`}
                placeholder="Your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 opacity-70 hover:opacity-100 transition-opacity"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="text-right">
            <button
              type="button"
              className="text-sm opacity-70 hover:opacity-100 focus:outline-none hover:text-[#F4A261] transition-colors"
            >
              Forgot your password?
            </button>
          </div>

          <button
            type="submit"
            className={`w-full px-6 py-3 mt-8 ${
              darkMode
                ? "bg-gradient-to-r from-[#F4A261] to-[#E68A41] text-[#1A1A1A]"
                : "bg-gradient-to-r from-[#1A1A1A] to-[#2A2A2A] text-white"
            } hover:opacity-90 transition-all duration-300 flex items-center justify-center space-x-2 group relative overflow-hidden shadow-lg`}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <span className="relative z-10 font-medium">Sign In</span>
            <ArrowRight
              size={16}
              className={`relative z-10 transition-transform duration-300 ${
                isHovering ? "translate-x-1" : ""
              }`}
            />
            <div className="absolute inset-0 bg-[#F4A261]/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm opacity-70">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-[#F4A261] hover:underline font-medium"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>

      <style jsx>{`
        .shadow-sharp {
          box-shadow: 8px 8px 0px rgba(0, 0, 0, 0.1);
        }
        .dark .shadow-sharp {
          box-shadow: 8px 8px 0px rgba(255, 255, 255, 0.05);
        }

        /* Animations */
        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }

        @keyframes float-medium {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(-5deg);
          }
        }

        @keyframes float-fast {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(10deg);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          10%,
          30%,
          50%,
          70%,
          90% {
            transform: translateX(-5px);
          }
          20%,
          40%,
          60%,
          80% {
            transform: translateX(5px);
          }
        }

        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }

        .animate-float-medium {
          animation: float-medium 6s ease-in-out infinite;
        }

        .animate-float-fast {
          animation: float-fast 4s ease-in-out infinite;
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Login;
