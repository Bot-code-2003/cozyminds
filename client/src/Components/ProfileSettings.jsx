"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  Sun,
  Moon,
  Lock,
  Save,
  LogOut,
  ArrowLeft,
  Trash2,
  AlertCircle,
  Check,
  X,
  Calendar,
  BarChart2,
  Clock,
  User,
  Settings,
  Shield,
  BarChartIcon as ChartBar,
  BookOpen,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDarkMode } from "../context/ThemeContext";
import StreakCard from "./StreakCard";
import CozyStory from "./Dashboard/CozyStory";

const ProfileSettings = () => {
  const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });
  const { darkMode, setDarkMode } = useDarkMode();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [stats, setStats] = useState({
    totalEntries: 0,
    totalWords: 0,
    firstEntryDate: null,
    lastEntryDate: null,
  });

  // Form states
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [subscribe, setSubscribe] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const navigate = useNavigate();

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  // Load user data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const user = JSON.parse(sessionStorage.getItem("user") || "null");

        if (!user) {
          navigate("/login");
          return;
        }

        setUserData(user);
        setNickname(user.nickname || "");
        setEmail(user.email || "");
        setAge(user.age || "");
        setGender(user.gender || "");
        setSubscribe(user.subscribe || false);

        // Fetch user stats
        try {
          const response = await API.get(`/journals/${user.id}`);
          const journals = response.data.journals || [];

          if (journals.length > 0) {
            // Sort by date
            const sortedJournals = [...journals].sort(
              (a, b) => new Date(a.date) - new Date(b.date)
            );
            const totalWords = journals.reduce(
              (sum, entry) => sum + (entry.wordCount || 0),
              0
            );

            setStats({
              totalEntries: journals.length,
              totalWords: totalWords,
              firstEntryDate: sortedJournals[0].date,
              lastEntryDate: sortedJournals[sortedJournals.length - 1].date,
            });
          }
        } catch (err) {
          console.error("Error fetching user stats:", err);
        }
      } catch (err) {
        console.error("Error loading user data:", err);
        setError("Failed to load user data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // Handle form submission
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const updatedUser = {
        ...userData,
        nickname,
        email,
        age: age ? Number.parseInt(age) : null,
        gender,
        subscribe,
      };

      // Update user in the database
      await API.put(`/user/${userData.id}`, updatedUser);

      // Update local storage
      sessionStorage.setItem("user", JSON.stringify(updatedUser));
      setUserData(updatedUser);

      setSuccess("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(
        err.response?.data?.message ||
          "Failed to update profile. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Handle password change
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      setIsSaving(false);
      return;
    }

    try {
      // Verify current password
      const verifyResponse = await API.post("/verify-password", {
        userId: userData.id,
        password: currentPassword,
      });

      if (!verifyResponse.data.valid) {
        setError("Current password is incorrect.");
        setIsSaving(false);
        return;
      }

      // Update password
      await API.put(`/user/${userData.id}/password`, {
        newPassword,
      });

      setSuccess("Password changed successfully!");
      setIsChangingPassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Error changing password:", err);
      setError(
        err.response?.data?.message ||
          "Failed to change password. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    try {
      await API.delete(`/user/${userData.id}`);
      sessionStorage.removeItem("user");
      navigate("/");
    } catch (err) {
      console.error("Error deleting account:", err);
      setError(
        err.response?.data?.message ||
          "Failed to delete account. Please try again."
      );
    }
  };

  // Logout
  const handleLogout = () => {
    sessionStorage.removeItem("user");
    navigate("/");
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div
      className={`min-h-screen text-black dark:text-white ${
        darkMode
          ? "dark bg-gradient-to-b from-[#1A1A1A] to-[#2A2A2A]"
          : "bg-gradient-to-b from-[#F8F1E9] to-[#F0E6DD]"
      } font-sans transition-colors duration-300`}
    >
      {/* Top navigation bar */}
      <nav
        className={`w-full ${
          darkMode
            ? "bg-[#1A1A1A]/90 backdrop-blur-sm border-b border-[#333333]"
            : "bg-[#F8F1E9]/90 backdrop-blur-sm border-b border-[#DDDDDD]"
        } py-3 px-4 md:px-6 flex justify-between items-center sticky top-0 z-20`}
      >
        <Link to={"/"} className="flex items-center">
          <div className="text-lg font-bold tracking-wider">
            COZY
            <span
              className={`${darkMode ? "text-[#F4A261]" : "text-[#E68A41]"}`}
            >
              MINDS
            </span>
          </div>
        </Link>

        <div className="flex items-center space-x-2 md:space-x-4">
          {userData && (
            <Link
              to="/profile-settings"
              className="hidden md:flex items-center mr-4"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-[#F4A261] to-[#E68A41] flex items-center justify-center text-[#1A1A1A] font-medium mr-2 shadow-md">
                {userData.nickname?.charAt(0).toUpperCase() || "U"}
              </div>
              <span>{userData.nickname || "User"}</span>
            </Link>
          )}

          <button
            onClick={toggleDarkMode}
            className="p-2 hover:text-[#F4A261] transition-colors bg-opacity-20 hover:bg-opacity-30 bg-white dark:bg-black dark:bg-opacity-20 "
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <Link
            to="/"
            className={`hidden md:flex items-center px-4 py-2 ${
              darkMode
                ? "bg-gradient-to-r from-[#F4A261] to-[#E68A41] text-[#1A1A1A]"
                : "bg-gradient-to-r from-[#E68A41] to-[#F4A261] text-white"
            } hover:opacity-90 transition-opacity transform hover:translate-y-[-2px] transition-transform duration-300 shadow-md`}
          >
            <ArrowLeft size={18} className="mr-2" />
            Back to Dashboard
          </Link>

          <button
            onClick={handleLogout}
            className={`flex items-center px-4 py-2 ${
              darkMode
                ? "border border-[#333333] hover:bg-[#2A2A2A]"
                : "border border-[#DDDDDD] hover:bg-white"
            } transition-colors transform hover:translate-y-[-2px] transition-transform duration-300 shadow-sm`}
          >
            <LogOut size={18} />
            <span className="hidden md:inline ml-2">Logout</span>
          </button>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Header section */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold mb-2 relative inline-block">
            Profile Settings
            <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#F4A261] to-transparent"></span>
          </h1>
          <p className="opacity-70">
            Manage your account information and preferences
          </p>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div
            className={`${
              darkMode ? "bg-[#2A2A2A]" : "bg-white"
            } shadow-lg p-8 text-center animate-pulse `}
          >
            <p className="text-lg">Loading profile data...</p>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div
            className={`mb-6 p-4 border-l-4 border-red-500 ${
              darkMode ? "bg-[#2A2A2A]" : "bg-white"
            } shadow-lg flex items-start animate-slide-in `}
          >
            <AlertCircle size={20} className="text-red-500 mr-3 mt-0.5" />
            <div>
              <h3 className="font-bold">Error</h3>
              <p className="opacity-90">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="ml-auto p-1 hover:text-red-500 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Success message */}
        {success && (
          <div
            className={`mb-6 p-4 border-l-4 border-green-500 ${
              darkMode ? "bg-[#2A2A2A]" : "bg-white"
            } shadow-lg flex items-start animate-slide-in `}
          >
            <Check size={20} className="text-green-500 mr-3 mt-0.5" />
            <div>
              <h3 className="font-bold">Success</h3>
              <p className="opacity-90">{success}</p>
            </div>
            <button
              onClick={() => setSuccess(null)}
              className="ml-auto p-1 hover:text-green-500 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Tab navigation */}
        <div className="flex mb-6 border-b overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-2 font-medium transition-colors flex items-center ${
              activeTab === "profile"
                ? darkMode
                  ? "border-b-2 border-[#F4A261] text-[#F4A261]"
                  : "border-b-2 border-[#E68A41] text-[#E68A41]"
                : "text-gray-500"
            }`}
          >
            <User size={16} className="mr-2" />
            Profile
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`px-4 py-2 font-medium transition-colors flex items-center ${
              activeTab === "security"
                ? darkMode
                  ? "border-b-2 border-[#F4A261] text-[#F4A261]"
                  : "border-b-2 border-[#E68A41] text-[#E68A41]"
                : "text-gray-500"
            }`}
          >
            <Shield size={16} className="mr-2" />
            Security
          </button>
          <button
            onClick={() => setActiveTab("stats")}
            className={`px-4 py-2 font-medium transition-colors flex items-center ${
              activeTab === "stats"
                ? darkMode
                  ? "border-b-2 border-[#F4A261] text-[#F4A261]"
                  : "border-b-2 border-[#E68A41] text-[#E68A41]"
                : "text-gray-500"
            }`}
          >
            <ChartBar size={16} className="mr-2" />
            Statistics
          </button>
          <button
            onClick={() => setActiveTab("story")}
            className={`px-4 py-2 font-medium transition-colors flex items-center ${
              activeTab === "story"
                ? darkMode
                  ? "border-b-2 border-[#F4A261] text-[#F4A261]"
                  : "border-b-2 border-[#E68A41] text-[#E68A41]"
                : "text-gray-500"
            }`}
          >
            <BookOpen size={16} className="mr-2" />
            Your Story
          </button>
        </div>

        {!isLoading && userData && (
          <div className="animate-fade-in">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div
                className={`${
                  darkMode ? "bg-[#2A2A2A]" : "bg-white"
                } shadow-lg p-6 mb-6  relative overflow-hidden`}
              >
                {/* Decorative corner accent */}
                <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden">
                  <div
                    className={`absolute top-0 right-0 w-40 h-40 -rotate-45 translate-x-20 -translate-y-20 ${
                      darkMode ? "bg-[#333333]" : "bg-[#F0E6DD]"
                    }`}
                  ></div>
                </div>

                <div className="flex justify-between items-center mb-6 relative">
                  <h2 className="text-xl font-bold">Profile Information</h2>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className={`px-4 py-2 ${
                        darkMode
                          ? "bg-[#333333] hover:bg-[#444444]"
                          : "bg-[#EEEEEE] hover:bg-[#DDDDDD]"
                      } transition-colors transform hover:translate-y-[-2px] transition-transform duration-300 shadow-sm flex items-center`}
                    >
                      <Settings size={16} className="mr-2" />
                      Edit Profile
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsEditing(false)}
                      className="text-sm opacity-70 hover:opacity-100 transition-opacity"
                    >
                      Cancel
                    </button>
                  )}
                </div>

                {!isEditing ? (
                  <div className="space-y-6 ">
                    <div className="flex items-center p-4 bg-opacity-5 bg-black dark:bg-opacity-10 dark:bg-white ">
                      <div className="w-20 h-20 bg-gradient-to-br from-[#F4A261] to-[#E68A41] flex items-center justify-center text-[#1A1A1A] font-bold text-3xl mr-6 shadow-md">
                        {userData.nickname?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div>
                        <h3 className="text-2xl text-white dark:text-black font-bold">
                          {userData.nickname || "User"}
                        </h3>
                        <p className="text-sm opacity-70">{userData.email}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      <div className="flex flex-col">
                        <span className="text-sm opacity-70 mb-1">
                          Nickname
                        </span>
                        <span className="text-white dark:text-black font-medium p-3 bg-opacity-5 bg-black dark:bg-opacity-10 dark:bg-white ">
                          {userData.nickname || "Not set"}
                        </span>
                      </div>

                      <div className="flex flex-col">
                        <span className="text-sm opacity-70 mb-1">Email</span>
                        <span className="font-medium text-white dark:text-black p-3 bg-opacity-5 bg-black dark:bg-opacity-10 dark:bg-white ">
                          {userData.email}
                        </span>
                      </div>

                      <div className="flex flex-col">
                        <span className="text-sm opacity-70 mb-1">Age</span>
                        <span className="font-medium text-white dark:text-black p-3 bg-opacity-5 bg-black dark:bg-opacity-10 dark:bg-white ">
                          {userData.age || "Not set"}
                        </span>
                      </div>

                      <div className="flex flex-col">
                        <span className="text-sm opacity-70 mb-1">Gender</span>
                        <span className="font-medium text-white dark:text-black p-3 bg-opacity-5 bg-black dark:bg-opacity-10 dark:bg-white ">
                          {userData.gender
                            ? userData.gender.charAt(0).toUpperCase() +
                              userData.gender.slice(1)
                            : "Not set"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center mt-4 p-4 bg-opacity-5 bg-black dark:bg-opacity-10 dark:bg-white ">
                      <span className="text-sm text-white dark:text-black opacity-70 mr-2">
                        Newsletter Subscription:
                      </span>
                      <span
                        className={`text-xs px-3 py-1  ${
                          userData.subscribe
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200"
                        }`}
                      >
                        {userData.subscribe ? "Subscribed" : "Not Subscribed"}
                      </span>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div className="flex flex-col">
                      <label
                        className="text-sm opacity-70 mb-1"
                        htmlFor="nickname"
                      >
                        Nickname
                      </label>
                      <input
                        id="nickname"
                        type="text"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        className={`px-3 py-2 ${
                          darkMode
                            ? "bg-[#1A1A1A] border-[#444444]"
                            : "bg-[#F8F1E9] border-[#DDDDDD]"
                        } border focus:outline-none focus:ring-2 focus:ring-[#F4A261]/20  shadow-sm`}
                      />
                    </div>

                    <div className="flex flex-col">
                      <label
                        className="text-sm opacity-70 mb-1"
                        htmlFor="email"
                      >
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`px-3 py-2 ${
                          darkMode
                            ? "bg-[#1A1A1A] border-[#444444]"
                            : "bg-[#F8F1E9] border-[#DDDDDD]"
                        } border focus:outline-none focus:ring-2 focus:ring-[#F4A261]/20  shadow-sm`}
                        required
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-sm opacity-70 mb-1" htmlFor="age">
                        Age
                      </label>
                      <input
                        id="age"
                        type="number"
                        min="13"
                        max="120"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        className={`px-3 py-2 ${
                          darkMode
                            ? "bg-[#1A1A1A] border-[#444444]"
                            : "bg-[#F8F1E9] border-[#DDDDDD]"
                        } border focus:outline-none focus:ring-2 focus:ring-[#F4A261]/20  shadow-sm`}
                      />
                    </div>

                    <div className="flex flex-col">
                      <label
                        className="text-sm opacity-70 mb-1"
                        htmlFor="gender"
                      >
                        Gender
                      </label>
                      <select
                        id="gender"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className={`px-3 py-2 ${
                          darkMode
                            ? "bg-[#1A1A1A] border-[#444444]"
                            : "bg-[#F8F1E9] border-[#DDDDDD]"
                        } border focus:outline-none focus:ring-2 focus:ring-[#F4A261]/20  shadow-sm`}
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>

                    <div className="flex items-center">
                      <input
                        id="subscribe"
                        type="checkbox"
                        checked={subscribe}
                        onChange={(e) => setSubscribe(e.target.checked)}
                        className="mr-2 h-4 w-4 accent-[#F4A261]"
                      />
                      <label htmlFor="subscribe">Subscribe to newsletter</label>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSaving}
                        className={`px-4 py-2 ${
                          darkMode
                            ? "bg-gradient-to-r from-[#F4A261] to-[#E68A41] text-[#1A1A1A]"
                            : "bg-gradient-to-r from-[#E68A41] to-[#F4A261] text-white"
                        } hover:opacity-90 transition-opacity flex items-center transform hover:translate-y-[-2px] transition-transform duration-300 shadow-md `}
                      >
                        {isSaving ? (
                          <>
                            <span className="mr-2 animate-spin">⏳</span>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save size={18} className="mr-2" />
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div
                className={`${
                  darkMode ? "bg-[#2A2A2A]" : "bg-white"
                } shadow-lg p-6 mb-6  relative overflow-hidden`}
              >
                {/* Decorative corner accent */}
                <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden">
                  <div
                    className={`absolute top-0 right-0 w-40 h-40 -rotate-45 translate-x-20 -translate-y-20 ${
                      darkMode ? "bg-[#333333]" : "bg-[#F0E6DD]"
                    }`}
                  ></div>
                </div>

                <h2 className="text-xl font-bold mb-6 relative inline-block">
                  Security Settings
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#F4A261] to-transparent"></span>
                </h2>

                {!isChangingPassword ? (
                  <button
                    onClick={() => setIsChangingPassword(true)}
                    className={`w-full px-4 py-3 mb-6 ${
                      darkMode
                        ? "bg-[#333333] hover:bg-[#444444]"
                        : "bg-[#EEEEEE] hover:bg-[#DDDDDD]"
                    } transition-colors flex items-center justify-center transform hover:translate-y-[-2px] transition-transform duration-300 shadow-md `}
                  >
                    <Lock size={18} className="mr-2" />
                    Change Password
                  </button>
                ) : (
                  <form
                    onSubmit={handleChangePassword}
                    className="space-y-4 mb-6 p-4 bg-opacity-5 bg-black dark:bg-opacity-10 dark:bg-white "
                  >
                    <div className="flex flex-col">
                      <label
                        className="text-sm opacity-70 mb-1"
                        htmlFor="currentPassword"
                      >
                        Current Password
                      </label>
                      <input
                        id="currentPassword"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className={`px-3 py-2 ${
                          darkMode
                            ? "bg-[#1A1A1A] border-[#444444]"
                            : "bg-[#F8F1E9] border-[#DDDDDD]"
                        } border focus:outline-none focus:ring-2 focus:ring-[#F4A261]/20  shadow-sm`}
                        required
                      />
                    </div>

                    <div className="flex flex-col">
                      <label
                        className="text-sm opacity-70 mb-1"
                        htmlFor="newPassword"
                      >
                        New Password
                      </label>
                      <input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className={`px-3 py-2 ${
                          darkMode
                            ? "bg-[#1A1A1A] border-[#444444]"
                            : "bg-[#F8F1E9] border-[#DDDDDD]"
                        } border focus:outline-none focus:ring-2 focus:ring-[#F4A261]/20  shadow-sm`}
                        required
                        minLength={6}
                      />
                    </div>

                    <div className="flex flex-col">
                      <label
                        className="text-sm opacity-70 mb-1"
                        htmlFor="confirmPassword"
                      >
                        Confirm New Password
                      </label>
                      <input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`px-3 py-2 ${
                          darkMode
                            ? "bg-[#1A1A1A] border-[#444444]"
                            : "bg-[#F8F1E9] border-[#DDDDDD]"
                        } border focus:outline-none focus:ring-2 focus:ring-[#F4A261]/20  shadow-sm`}
                        required
                      />
                    </div>

                    <div className="flex justify-between pt-2">
                      <button
                        type="button"
                        onClick={() => setIsChangingPassword(false)}
                        className="text-sm opacity-70 hover:opacity-100 transition-opacity"
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        disabled={isSaving}
                        className={`px-4 py-2 ${
                          darkMode
                            ? "bg-gradient-to-r from-[#F4A261] to-[#E68A41] text-[#1A1A1A]"
                            : "bg-gradient-to-r from-[#E68A41] to-[#F4A261] text-white"
                        } hover:opacity-90 transition-opacity flex items-center transform hover:translate-y-[-2px] transition-transform duration-300 shadow-md `}
                      >
                        {isSaving ? (
                          <>
                            <span className="mr-2 animate-spin">⏳</span>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save size={18} className="mr-2" />
                            Change Password
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}

                <div className="border-t pt-6">
                  <h3 className="font-bold mb-4 text-red-500 dark:text-red-400">
                    Danger Zone
                  </h3>
                  {!showDeleteConfirm ? (
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="w-full px-4 py-3 bg-red-500 text-white hover:bg-red-600 transition-colors flex items-center justify-center shadow-md "
                    >
                      <Trash2 size={18} className="mr-2" />
                      Delete Account
                    </button>
                  ) : (
                    <div className="p-4 bg-red-500/10 dark:bg-red-900/20 ">
                      <p className="text-sm mb-4 text-red-600 dark:text-red-400">
                        Are you sure you want to delete your account? This
                        action cannot be undone and all your data will be
                        permanently deleted.
                      </p>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => setShowDeleteConfirm(false)}
                          className="px-4 py-2 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:opacity-90 transition-colors "
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleDeleteAccount}
                          className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 transition-colors "
                        >
                          Yes, Delete My Account
                        </button>
                      </div>
                    </div>
                  )}
                  <p className="text-xs opacity-70 mt-2">
                    This action cannot be undone. All your data will be
                    permanently deleted.
                  </p>
                </div>
              </div>
            )}

            {/* Stats Tab */}
            {activeTab === "stats" && (
              <div
                className={`${
                  darkMode ? "bg-[#2A2A2A]" : "bg-white"
                } shadow-lg p-6 mb-6  relative overflow-hidden`}
              >
                {/* Decorative corner accent */}
                <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden">
                  <div
                    className={`absolute top-0 right-0 w-40 h-40 -rotate-45 translate-x-20 -translate-y-20 ${
                      darkMode ? "bg-[#333333]" : "bg-[#F0E6DD]"
                    }`}
                  ></div>
                </div>

                <h2 className="text-xl font-bold mb-6 relative inline-block">
                  Account Statistics
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#F4A261] to-transparent"></span>
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-white dark:text-black">
                  <div className="flex flex-col p-4 bg-opacity-5 bg-black dark:bg-opacity-10 dark:bg-white  shadow-sm transform hover:translate-y-[-2px] transition-transform duration-300">
                    <div className="flex items-center mb-2">
                      <Calendar size={18} className="mr-2 text-[#F4A261]" />
                      <span className="text-sm opacity-70 ">Total Entries</span>
                    </div>
                    <span className="text-3xl font-bold">
                      {stats.totalEntries}
                    </span>
                  </div>

                  <div className="flex flex-col p-4 bg-opacity-5 bg-black dark:bg-opacity-10 dark:bg-white  shadow-sm transform hover:translate-y-[-2px] transition-transform duration-300">
                    <div className="flex items-center mb-2">
                      <BarChart2 size={18} className="mr-2 text-[#F4A261]" />
                      <span className="text-sm opacity-70">Total Words</span>
                    </div>
                    <span className="text-3xl font-bold">
                      {stats.totalWords.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex flex-col p-4 bg-opacity-5 bg-black dark:bg-opacity-10 dark:bg-white  shadow-sm transform hover:translate-y-[-2px] transition-transform duration-300">
                    <div className="flex items-center mb-2">
                      <Calendar size={18} className="mr-2 text-[#F4A261]" />
                      <span className="text-sm opacity-70">First Entry</span>
                    </div>
                    <span className="text-sm font-medium">
                      {formatDate(stats.firstEntryDate)}
                    </span>
                  </div>

                  <div className="flex flex-col p-4 bg-opacity-5 bg-black dark:bg-opacity-10 dark:bg-white  shadow-sm transform hover:translate-y-[-2px] transition-transform duration-300">
                    <div className="flex items-center mb-2">
                      <Clock size={18} className="mr-2 text-[#F4A261]" />
                      <span className="text-sm opacity-70">Last Entry</span>
                    </div>
                    <span className="text-sm font-medium">
                      {formatDate(stats.lastEntryDate)}
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <StreakCard />
                </div>
              </div>
            )}

            {/* Story Tab */}
            {activeTab === "story" && (
              <div className="mb-6">
                <CozyStory />
              </div>
            )}
          </div>
        )}
      </main>

      {/* Custom CSS */}
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }

        .animate-slide-in {
          animation: slideIn 0.3s ease-in-out;
        }

        .animate-pulse {
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
      `}</style>
    </div>
  );
};

export default ProfileSettings;
