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
        const user = JSON.parse(localStorage.getItem("user") || "null");

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
      localStorage.setItem("user", JSON.stringify(updatedUser));
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
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      try {
        await API.delete(`/user/${userData.id}`);
        localStorage.removeItem("user");
        navigate("/");
      } catch (err) {
        console.error("Error deleting account:", err);
        setError(
          err.response?.data?.message ||
            "Failed to delete account. Please try again."
        );
      }
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
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
      className={`min-h-screen ${
        darkMode
          ? "dark bg-[#1A1A1A] text-[#F8F1E9]"
          : "bg-[#F8F1E9] text-[#1A1A1A]"
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
              <div className="w-8 h-8 bg-[#F4A261] flex items-center justify-center text-[#1A1A1A] font-medium mr-2">
                {userData.nickname?.charAt(0).toUpperCase() || "U"}
              </div>
              <span>{userData.nickname || "User"}</span>
            </Link>
          )}

          <button
            onClick={toggleDarkMode}
            className="p-2 hover:text-[#F4A261] transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <Link
            to="/"
            className={`hidden md:flex items-center px-4 py-2 ${
              darkMode
                ? "bg-[#F4A261] text-[#1A1A1A]"
                : "bg-[#E68A41] text-white"
            } hover:opacity-90 transition-opacity`}
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
            } transition-colors`}
          >
            <LogOut size={18} />
            <span className="hidden md:inline ml-2">Logout</span>
          </button>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Header section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
          <p className="opacity-70">
            Manage your account information and preferences
          </p>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div
            className={`${
              darkMode ? "bg-[#2A2A2A]" : "bg-white"
            } shadow-lg p-8 text-center`}
          >
            <p className="text-lg">Loading profile data...</p>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div
            className={`mb-6 p-4 border-l-4 border-red-500 ${
              darkMode ? "bg-[#2A2A2A]" : "bg-white"
            } shadow-lg flex items-start`}
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
            } shadow-lg flex items-start`}
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
        <CozyStory />
        {/* <StreakCard /> */}

        {!isLoading && userData && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Account Stats */}
            <div className="md:col-span-3">
              <div
                className={`${
                  darkMode ? "bg-[#2A2A2A]" : "bg-white"
                } shadow-lg p-6 mb-6`}
              >
                <h2 className="text-xl font-bold mb-4">Account Statistics</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex flex-col">
                    <div className="flex items-center mb-2">
                      <Calendar size={18} className="mr-2 opacity-70" />
                      <span className="text-sm opacity-70">Total Entries</span>
                    </div>
                    <span className="text-2xl font-bold">
                      {stats.totalEntries}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-center mb-2">
                      <BarChart2 size={18} className="mr-2 opacity-70" />
                      <span className="text-sm opacity-70">Total Words</span>
                    </div>
                    <span className="text-2xl font-bold">
                      {stats.totalWords.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-center mb-2">
                      <Calendar size={18} className="mr-2 opacity-70" />
                      <span className="text-sm opacity-70">First Entry</span>
                    </div>
                    <span className="text-sm">
                      {formatDate(stats.firstEntryDate)}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-center mb-2">
                      <Clock size={18} className="mr-2 opacity-70" />
                      <span className="text-sm opacity-70">Last Entry</span>
                    </div>
                    <span className="text-sm">
                      {formatDate(stats.lastEntryDate)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* Profile Information */}
            <div className="md:col-span-2">
              <div
                className={`${
                  darkMode ? "bg-[#2A2A2A]" : "bg-white"
                } shadow-lg p-6 mb-6`}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Profile Information</h2>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className={`px-4 py-2 ${
                        darkMode
                          ? "bg-[#333333] hover:bg-[#444444]"
                          : "bg-[#EEEEEE] hover:bg-[#DDDDDD]"
                      } transition-colors`}
                    >
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
                  <div className="space-y-4">
                    <div className="flex flex-col">
                      <span className="text-sm opacity-70 mb-1">Nickname</span>
                      <span className="font-medium">
                        {userData.nickname || "Not set"}
                      </span>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-sm opacity-70 mb-1">Email</span>
                      <span className="font-medium">{userData.email}</span>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-sm opacity-70 mb-1">Age</span>
                      <span className="font-medium">
                        {userData.age || "Not set"}
                      </span>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-sm opacity-70 mb-1">Gender</span>
                      <span className="font-medium">
                        {userData.gender || "Not set"}
                      </span>
                    </div>

                    <div className="flex items-center">
                      <span className="text-sm opacity-70 mr-2">
                        Newsletter Subscription:
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 ${
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
                            ? "bg-[#333333] border-[#444444]"
                            : "bg-white border-[#DDDDDD]"
                        } border focus:outline-none`}
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
                            ? "bg-[#333333] border-[#444444]"
                            : "bg-white border-[#DDDDDD]"
                        } border focus:outline-none`}
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
                            ? "bg-[#333333] border-[#444444]"
                            : "bg-white border-[#DDDDDD]"
                        } border focus:outline-none`}
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
                            ? "bg-[#333333] border-[#444444]"
                            : "bg-white border-[#DDDDDD]"
                        } border focus:outline-none`}
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        {/* <option value="Other">Other</option> */}
                      </select>
                    </div>

                    <div className="flex items-center">
                      <input
                        id="subscribe"
                        type="checkbox"
                        checked={subscribe}
                        onChange={(e) => setSubscribe(e.target.checked)}
                        className="mr-2"
                      />
                      <label htmlFor="subscribe">Subscribe to newsletter</label>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSaving}
                        className={`px-4 py-2 ${
                          darkMode
                            ? "bg-[#F4A261] text-[#1A1A1A]"
                            : "bg-[#E68A41] text-white"
                        } hover:opacity-90 transition-opacity flex items-center`}
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
            </div>

            {/* Security Settings */}
            <div className="md:col-span-1">
              <div
                className={`${
                  darkMode ? "bg-[#2A2A2A]" : "bg-white"
                } shadow-lg p-6 mb-6`}
              >
                <h2 className="text-xl font-bold mb-4">Security</h2>

                {!isChangingPassword ? (
                  <button
                    onClick={() => setIsChangingPassword(true)}
                    className={`w-full px-4 py-2 mb-4 ${
                      darkMode
                        ? "bg-[#333333] hover:bg-[#444444]"
                        : "bg-[#EEEEEE] hover:bg-[#DDDDDD]"
                    } transition-colors flex items-center justify-center`}
                  >
                    <Lock size={18} className="mr-2" />
                    Change Password
                  </button>
                ) : (
                  <form
                    onSubmit={handleChangePassword}
                    className="space-y-4 mb-4"
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
                            ? "bg-[#333333] border-[#444444]"
                            : "bg-white border-[#DDDDDD]"
                        } border focus:outline-none`}
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
                            ? "bg-[#333333] border-[#444444]"
                            : "bg-white border-[#DDDDDD]"
                        } border focus:outline-none`}
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
                            ? "bg-[#333333] border-[#444444]"
                            : "bg-white border-[#DDDDDD]"
                        } border focus:outline-none`}
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
                            ? "bg-[#F4A261] text-[#1A1A1A]"
                            : "bg-[#E68A41] text-white"
                        } hover:opacity-90 transition-opacity flex items-center`}
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
                  <h3 className="font-bold mb-2">Danger Zone</h3>
                  <button
                    onClick={handleDeleteAccount}
                    className="w-full px-4 py-2 bg-red-500 text-white hover:bg-red-600 transition-colors flex items-center justify-center"
                  >
                    <Trash2 size={18} className="mr-2" />
                    Delete Account
                  </button>
                  <p className="text-xs opacity-70 mt-2">
                    This action cannot be undone. All your data will be
                    permanently deleted.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProfileSettings;
