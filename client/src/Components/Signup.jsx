"use client";
import axios from "axios";

import { useState, useEffect } from "react";
import {
  Eye,
  EyeOff,
  Sun,
  Moon,
  ArrowRight,
  Mail,
  Lock,
  User,
  Calendar,
  ChevronDown,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDarkMode } from "../context/ThemeContext";
import LoadingScreen from "./ui/LoadingScreen";

const Signup = () => {
  const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });
  const { darkMode, setDarkMode } = useDarkMode();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [subscribe, setSubscribe] = useState(true);
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [dataFetched, setDataFetched] = useState(false);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [isHovering, setIsHovering] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Effect to handle navigation after both conditions are met
  useEffect(() => {
    if (dataFetched && minTimeElapsed) {
      setShowLoadingScreen(false);
      navigate("/");
    }
  }, [dataFetched, minTimeElapsed, navigate]);

  // Effect to handle minimum time elapsed
  useEffect(() => {
    if (showLoadingScreen) {
      const timer = setTimeout(() => {
        setMinTimeElapsed(true);
      }, 2000); // Minimum 2 seconds

      return () => clearTimeout(timer);
    }
  }, [showLoadingScreen]);

  // Clear errors when user modifies inputs
  useEffect(() => {
    if (error) {
      setError(null);
    }

    // Clear specific field errors when that field changes
    const newFieldErrors = { ...fieldErrors };
    if (nickname && newFieldErrors.nickname) delete newFieldErrors.nickname;
    if (email && newFieldErrors.email) delete newFieldErrors.email;
    if (password && newFieldErrors.password) delete newFieldErrors.password;
    if (age && newFieldErrors.age) delete newFieldErrors.age;
    if (gender && newFieldErrors.gender) delete newFieldErrors.gender;

    if (
      Object.keys(newFieldErrors).length !== Object.keys(fieldErrors).length
    ) {
      setFieldErrors(newFieldErrors);
    }
  }, [nickname, email, password, age, gender]);

  const handleSignupSubmit = async (e) => {
    e.preventDefault();

    // Check if all fields are filled
    if (!nickname || !email || !password || !age || !gender) {
      setError("Please fill in all required fields.");
      return;
    }

    setShowLoadingScreen(true);
    setDataFetched(false);
    setMinTimeElapsed(false);
    setError(null);
    setFieldErrors({});

    try {
      const response = await API.post("/signup", {
        nickname,
        email,
        password,
        age,
        gender,
        subscribe,
      });

      console.log("Signup successful:", response.data);

      const user = {
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

      sessionStorage.setItem("user", JSON.stringify(user));
      setUserData(user);
      setDataFetched(true); // Mark data as fetched
    } catch (error) {
      console.error(
        "Signup Error:",
        error.response ? error.response.data : error.message
      );
      setShowLoadingScreen(false);

      // Handle different types of errors
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response.status === 409) {
          setError(
            "This email is already registered. Please use a different email or try logging in."
          );
          setFieldErrors({ ...fieldErrors, email: true });
        } else if (error.response.status === 400) {
          // Handle validation errors
          if (error.response.data && error.response.data.errors) {
            const validationErrors = {};
            let errorMessage = "Please correct the following issues:";

            error.response.data.errors.forEach((err) => {
              validationErrors[err.field] = true;
              errorMessage += `\n• ${err.message}`;
            });

            setFieldErrors(validationErrors);
            setError(errorMessage);
          } else if (error.response.data && error.response.data.message) {
            setError(error.response.data.message);
          } else {
            setError(
              "Invalid information provided. Please check your details and try again."
            );
          }
        } else if (error.response.data && error.response.data.message) {
          setError(error.response.data.message);
        } else {
          setError("Signup failed. Please try again later.");
        }
      } else if (error.request) {
        // The request was made but no response was received
        setError(
          "No response from server. Please check your internet connection."
        );
      } else {
        // Something happened in setting up the request that triggered an Error
        setError("An unexpected error occurred. Please try again later.");
      }
    }
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
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#F4A261] to-transparent opacity-10 rounded-full translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-[#F4A261] to-transparent opacity-10 rounded-full -translate-x-1/2 translate-y-1/2"></div>

        {/* Animated decorative elements */}
        <div className="absolute top-[15%] left-[20%] w-20 h-1 bg-[#F4A261] opacity-20 animate-pulse"></div>
        <div className="absolute bottom-[25%] right-[15%] w-20 h-1 bg-[#F4A261] opacity-20 animate-pulse delay-300"></div>
        <div className="absolute top-[40%] right-[10%] w-1 h-20 bg-[#F4A261] opacity-20 animate-pulse delay-150"></div>
        <div className="absolute bottom-[40%] left-[10%] w-1 h-20 bg-[#F4A261] opacity-20 animate-pulse delay-450"></div>

        {/* Floating elements */}
        <div className="absolute top-[30%] left-[30%] w-4 h-4 rounded-full bg-[#F4A261] opacity-10 animate-float-slow"></div>
        <div className="absolute bottom-[20%] right-[25%] w-6 h-6 rounded-full bg-[#F4A261] opacity-15 animate-float-medium"></div>
        <div className="absolute top-[60%] left-[15%] w-8 h-8 rounded-full bg-[#F4A261] opacity-10 animate-float-fast"></div>
      </div>

      {/* Loading Screen */}
      <LoadingScreen
        isLoading={showLoadingScreen}
        setIsLoading={setShowLoadingScreen}
        duration={2000}
      />

      {/* Dark Mode Toggle */}
      <button
        onClick={toggleDarkMode}
        className="absolute top-6 right-6 p-2 hover:text-[#F4A261] transition-colors z-10 bg-opacity-20 hover:bg-opacity-30 bg-white dark:bg-black dark:bg-opacity-20 rounded-full"
        aria-label="Toggle dark mode"
      >
        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      {/* Logo with animation */}
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

      {/* Signup Form with animation */}
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
          <h1 className="text-2xl font-bold mb-2">Create Account</h1>
          <p className="opacity-70 text-sm">Join us for daily mental clarity</p>
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-gradient-to-r from-transparent via-[#F4A261] to-transparent"></div>
        </div>

        {/* Error Message */}
        {error && (
          <div
            className={`mb-6 p-4 flex items-start rounded-md ${
              darkMode
                ? "bg-red-900/30 text-red-200 border-l-4 border-red-500"
                : "bg-red-50 text-red-600 border-l-4 border-red-400"
            } animate-shake`}
          >
            <AlertCircle className="mr-3 h-5 w-5 flex-shrink-0 mt-0.5" />
            <div className="text-sm whitespace-pre-line">{error}</div>
          </div>
        )}

        <form onSubmit={handleSignupSubmit} className="space-y-5">
          {/* Nickname */}
          <div className="relative">
            <label className="block text-sm font-medium mb-1">
              Nickname <span className="text-red-500">*</span>
            </label>
            <div className="relative group">
              <div
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 opacity-70 group-focus-within:text-[#F4A261] transition-colors ${
                  nickname ? "text-[#F4A261]" : ""
                }`}
              >
                <User size={18} />
              </div>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className={`w-full px-4 py-3 pl-10 ${
                  darkMode
                    ? "bg-[#1A1A1A] border-[#333333] focus:bg-[#222222]"
                    : "bg-[#F8F1E9] border-[#D9D9D9] focus:bg-white"
                } ${
                  fieldErrors.nickname
                    ? darkMode
                      ? "border-red-500"
                      : "border-red-400"
                    : nickname
                    ? darkMode
                      ? "border-[#F4A261]"
                      : "border-[#E68A41]"
                    : ""
                } border text-current focus:outline-none focus:border-[#F4A261] focus:ring-2 focus:ring-[#F4A261]/20 transition-all duration-300 shadow-sm`}
                placeholder="Your nickname"
                required
              />
              {fieldErrors.nickname && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500">
                  <AlertCircle size={16} />
                </div>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="relative">
            <label className="block text-sm font-medium mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <div className="relative group">
              <div
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 opacity-70 group-focus-within:text-[#F4A261] transition-colors ${
                  email ? "text-[#F4A261]" : ""
                }`}
              >
                <Mail size={18} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-3 pl-10 ${
                  darkMode
                    ? "bg-[#1A1A1A] border-[#333333] focus:bg-[#222222]"
                    : "bg-[#F8F1E9] border-[#D9D9D9] focus:bg-white"
                } ${
                  fieldErrors.email
                    ? darkMode
                      ? "border-red-500"
                      : "border-red-400"
                    : email
                    ? darkMode
                      ? "border-[#F4A261]"
                      : "border-[#E68A41]"
                    : ""
                } border text-current focus:outline-none focus:border-[#F4A261] focus:ring-2 focus:ring-[#F4A261]/20 transition-all duration-300 shadow-sm`}
                placeholder="Your email"
                required
              />
              {fieldErrors.email && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500">
                  <AlertCircle size={16} />
                </div>
              )}
            </div>
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-sm font-medium mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative group">
              <div
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 opacity-70 group-focus-within:text-[#F4A261] transition-colors ${
                  password ? "text-[#F4A261]" : ""
                }`}
              >
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-3 pl-10 ${
                  darkMode
                    ? "bg-[#1A1A1A] border-[#333333] focus:bg-[#222222]"
                    : "bg-[#F8F1E9] border-[#D9D9D9] focus:bg-white"
                } ${
                  fieldErrors.password
                    ? darkMode
                      ? "border-red-500"
                      : "border-red-400"
                    : password
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
              {fieldErrors.password && (
                <div className="absolute right-8 top-1/2 transform -translate-y-1/2 text-red-500">
                  <AlertCircle size={16} />
                </div>
              )}
            </div>
          </div>

          {/* Age */}
          <div className="relative">
            <label className="block text-sm font-medium mb-1">
              Age <span className="text-red-500">*</span>
            </label>
            <div className="relative group">
              <div
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 opacity-70 group-focus-within:text-[#F4A261] transition-colors ${
                  age ? "text-[#F4A261]" : ""
                }`}
              >
                <Calendar size={18} />
              </div>
              <input
                type="number"
                min="13"
                max="120"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className={`w-full px-4 py-3 pl-10 ${
                  darkMode
                    ? "bg-[#1A1A1A] border-[#333333] focus:bg-[#222222]"
                    : "bg-[#F8F1E9] border-[#D9D9D9] focus:bg-white"
                } ${
                  fieldErrors.age
                    ? darkMode
                      ? "border-red-500"
                      : "border-red-400"
                    : age
                    ? darkMode
                      ? "border-[#F4A261]"
                      : "border-[#E68A41]"
                    : ""
                } border text-current focus:outline-none focus:border-[#F4A261] focus:ring-2 focus:ring-[#F4A261]/20 transition-all duration-300 shadow-sm`}
                placeholder="Your age"
                required
              />
              {fieldErrors.age && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500">
                  <AlertCircle size={16} />
                </div>
              )}
            </div>
          </div>

          {/* Gender */}
          <div className="relative">
            <label className="block text-sm font-medium mb-1">
              Gender <span className="text-red-500">*</span>
            </label>
            <div className="relative group">
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className={`w-full px-4 py-3 pl-10 appearance-none ${
                  darkMode
                    ? "bg-[#1A1A1A] border-[#333333] focus:bg-[#222222]"
                    : "bg-[#F8F1E9] border-[#D9D9D9] focus:bg-white"
                } ${
                  fieldErrors.gender
                    ? darkMode
                      ? "border-red-500"
                      : "border-red-400"
                    : gender
                    ? darkMode
                      ? "border-[#F4A261]"
                      : "border-[#E68A41]"
                    : ""
                } border text-current focus:outline-none focus:border-[#F4A261] focus:ring-2 focus:ring-[#F4A261]/20 transition-all duration-300 shadow-sm`}
                required
              >
                <option value="" disabled>
                  Select gender
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              <div
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 opacity-70 group-focus-within:text-[#F4A261] transition-colors ${
                  gender ? "text-[#F4A261]" : ""
                }`}
              >
                <User size={18} />
              </div>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 opacity-70 pointer-events-none">
                <ChevronDown size={16} />
              </div>
              {fieldErrors.gender && (
                <div className="absolute right-8 top-1/2 transform -translate-y-1/2 text-red-500">
                  <AlertCircle size={16} />
                </div>
              )}
            </div>
          </div>

          {/* Subscribe Checkbox */}
          <div className="relative">
            <label className="flex items-center space-x-2 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={subscribe}
                  onChange={() => setSubscribe(!subscribe)}
                  className="opacity-0 absolute h-5 w-5"
                />
                <div
                  className={`border ${
                    subscribe
                      ? "bg-[#F4A261] border-[#F4A261]"
                      : darkMode
                      ? "border-[#333333]"
                      : "border-[#D9D9D9]"
                  } w-5 h-5 flex flex-shrink-0 justify-center items-center transition-colors duration-200 group-hover:border-[#F4A261]`}
                >
                  {subscribe && <CheckCircle className="w-3 h-3 text-white" />}
                </div>
              </div>
              <span className="text-sm">Subscribe to motivational emails</span>
            </label>
          </div>

          {/* Submit Button */}
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
            <span className="relative z-10 font-medium">Create Account</span>
            <ArrowRight
              size={16}
              className={`relative z-10 transition-transform duration-300 ${
                isHovering ? "translate-x-1" : ""
              }`}
            />
            <div className="absolute inset-0 bg-[#F4A261]/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-sm opacity-70">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#F4A261] hover:underline font-medium"
            >
              Log In
            </Link>
          </p>
        </div>
      </div>

      {/* Custom CSS */}
      <style jsx>{`
        .shadow-sharp {
          box-shadow: 8px 8px 0px rgba(0, 0, 0, 0.1);
        }
        .dark .shadow-sharp {
          box-shadow: 8px 8px 0px rgba(255, 255, 255, 0.05);
        }
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }

        /* Animations */
        @keyframes pulse {
          0%,
          100% {
            opacity: 0.1;
          }
          50% {
            opacity: 0.3;
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

        .animate-pulse {
          animation: pulse 4s ease-in-out infinite;
        }

        .delay-150 {
          animation-delay: 0.15s;
        }

        .delay-300 {
          animation-delay: 0.3s;
        }

        .delay-450 {
          animation-delay: 0.45s;
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

        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }

        .animate-float-medium {
          animation: float-medium 6s ease-in-out infinite;
        }

        .animate-float-fast {
          animation: float-fast 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Signup;
