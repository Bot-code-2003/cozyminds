"use client";

import { useState } from "react";
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
} from "lucide-react";

const AuthPageSplit = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [subscribe, setSubscribe] = useState(true);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    console.log("Login:", { email: loginEmail, password: loginPassword });

    // Show success animation on button
    const button = e.target.querySelector('button[type="submit"]');
    const originalText = button.innerHTML;
    button.innerHTML = "Success!";

    setTimeout(() => {
      button.innerHTML = originalText;
    }, 2000);
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    console.log("Signup:", {
      nickname,
      email,
      password,
      age,
      gender,
      subscribe,
    });

    // Show success animation on button
    const button = e.target.querySelector('button[type="submit"]');
    const originalText = button.innerHTML;
    button.innerHTML = "Account Created!";

    setTimeout(() => {
      button.innerHTML = originalText;
    }, 2000);
  };

  return (
    <div
      className={`min-h-screen ${
        isDarkMode
          ? "dark bg-[#1A1A1A] text-[#F8F1E9]"
          : "bg-[#F8F1E9] text-[#1A1A1A]"
      } font-sans flex flex-col md:flex-row items-stretch relative overflow-hidden transition-colors duration-300`}
    >
      {/* Dark Mode Toggle */}
      <button
        onClick={toggleDarkMode}
        className="absolute top-6 right-6 p-2 hover:text-[#F4A261] transition-colors z-10"
        aria-label="Toggle dark mode"
      >
        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      {/* Login Section */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8 md:p-12 relative">
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
              stroke={isDarkMode ? "#F8F1E9" : "#1A1A1A"}
              strokeWidth="2"
            />
            <rect
              x="40"
              y="40"
              width="40"
              height="40"
              stroke={isDarkMode ? "#F8F1E9" : "#1A1A1A"}
              strokeWidth="2"
            />
          </svg>
        </div>

        {/* Logo */}
        <div className="text-xl font-bold tracking-wider mb-12 z-10">
          COZY
          <span
            className={`${isDarkMode ? "text-[#F4A261]" : "text-[#E68A41]"}`}
          >
            MINDS
          </span>
        </div>

        {/* Login Form */}
        <div
          className={`w-full max-w-md ${
            isDarkMode ? "bg-[#2A2A2A]" : "bg-white"
          } shadow-sharp p-8 z-10`}
        >
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
            <p className="opacity-70 text-sm">
              Sign in to continue your journey
            </p>
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
                    isDarkMode
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
                    isDarkMode
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
                isDarkMode
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
        </div>

        {/* Mobile Sign Up Link */}
        <div className="mt-6 text-center md:hidden">
          <p className="text-sm opacity-70">
            Don't have an account?
            <a
              href="#signup-section"
              className="ml-2 text-[#F4A261] hover:underline"
            >
              Sign Up
            </a>
          </p>
        </div>
      </div>

      {/* Signup Section */}
      <div
        id="signup-section"
        className="w-full md:w-1/2 flex flex-col items-center justify-center p-8 md:p-12 relative bg-[#1A1A1A] text-[#F8F1E9] dark:bg-[#F8F1E9] dark:text-[#1A1A1A]"
      >
        {/* Gradient Accent */}
        <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-gradient-to-tl from-[#A9D6E5] to-transparent opacity-50 dark:opacity-20 transition-opacity duration-300"></div>

        {/* SVG Decorative Element */}
        <div className="absolute bottom-20 right-10 opacity-10 dark:opacity-5">
          <svg
            width="150"
            height="150"
            viewBox="0 0 150 150"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="75"
              cy="75"
              r="50"
              stroke={!isDarkMode ? "#F8F1E9" : "#1A1A1A"}
              strokeWidth="2"
            />
            <circle
              cx="75"
              cy="75"
              r="25"
              stroke={!isDarkMode ? "#F8F1E9" : "#1A1A1A"}
              strokeWidth="2"
            />
          </svg>
        </div>

        {/* Signup Form */}
        <div
          className={`w-full max-w-md ${
            !isDarkMode ? "bg-[#2A2A2A]" : "bg-white"
          } shadow-sharp-inverse p-8 z-10`}
        >
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">Create Account</h1>
            <p className="opacity-70 text-sm">
              Join us for daily mental clarity
            </p>
          </div>

          <form onSubmit={handleSignupSubmit} className="space-y-4">
            {/* Nickname */}
            <div className="relative">
              <label className="block text-sm font-medium mb-1">Nickname</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 opacity-70">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className={`w-full px-4 py-3 pl-10 ${
                    !isDarkMode
                      ? "bg-[#1A1A1A] border-[#333333]"
                      : "bg-[#F8F1E9] border-[#D9D9D9]"
                  } border text-current focus:outline-none focus:border-[#F4A261] transition-all duration-300`}
                  placeholder="Your nickname"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="relative">
              <label className="block text-sm font-medium mb-1">Email</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 opacity-70">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-3 pl-10 ${
                    !isDarkMode
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-4 py-3 pl-10 ${
                    !isDarkMode
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

            {/* Age */}
            <div className="relative">
              <label className="block text-sm font-medium mb-1">Age</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 opacity-70">
                  <Calendar size={18} />
                </div>
                <input
                  type="number"
                  min="13"
                  max="120"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className={`w-full px-4 py-3 pl-10 ${
                    !isDarkMode
                      ? "bg-[#1A1A1A] border-[#333333]"
                      : "bg-[#F8F1E9] border-[#D9D9D9]"
                  } border text-current focus:outline-none focus:border-[#F4A261] transition-all duration-300`}
                  placeholder="Your age"
                  required
                />
              </div>
            </div>

            {/* Gender/Sex */}
            <div className="relative">
              <label className="block text-sm font-medium mb-1">Gender</label>
              <div className="relative">
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className={`w-full px-4 py-3 pl-10 appearance-none ${
                    !isDarkMode
                      ? "bg-[#1A1A1A] border-[#333333]"
                      : "bg-[#F8F1E9] border-[#D9D9D9]"
                  } border text-current focus:outline-none focus:border-[#F4A261] transition-all duration-300`}
                  required
                >
                  <option value="" disabled>
                    Select gender
                  </option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="non-binary">Non-binary</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 opacity-70">
                  <User size={18} />
                </div>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 opacity-70 pointer-events-none">
                  <ChevronDown size={16} />
                </div>
              </div>
            </div>

            {/* Subscribe Checkbox */}
            <div className="relative">
              <label className="flex items-center space-x-2 cursor-pointer">
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
                        : !isDarkMode
                        ? "border-[#333333]"
                        : "border-[#D9D9D9]"
                    } w-5 h-5 flex flex-shrink-0 justify-center items-center`}
                  >
                    {subscribe && (
                      <svg
                        className="fill-current w-3 h-3 text-white pointer-events-none"
                        viewBox="0 0 20 20"
                      >
                        <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-sm">
                  Subscribe to motivational emails
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full px-6 py-3 mt-6 ${
                !isDarkMode
                  ? "bg-[#F4A261] text-[#1A1A1A]"
                  : "bg-[#1A1A1A] text-white"
              } hover:opacity-90 transition-all duration-300 flex items-center justify-center space-x-2 group`}
            >
              <span>Create Account</span>
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </form>
        </div>

        {/* Mobile Login Link */}
        <div className="mt-6 text-center md:hidden">
          <p className="text-sm opacity-70">
            Already have an account?
            <a href="#" className="ml-2 text-[#F4A261] hover:underline">
              Sign In
            </a>
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

        .shadow-sharp-inverse {
          box-shadow: 6px 6px 0px rgba(255, 255, 255, 0.1);
        }

        .dark .shadow-sharp-inverse {
          box-shadow: 6px 6px 0px rgba(0, 0, 0, 0.05);
        }

        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
};

export default AuthPageSplit;
