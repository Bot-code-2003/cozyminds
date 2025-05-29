"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  Save,
  Trash2,
  Check,
  X,
  Lock,
  User,
  Mail,
  Calendar,
  ChevronLeft,
  Eye,
  EyeOff,
  Shield,
  Settings,
  AlertTriangle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDarkMode } from "../context/ThemeContext";
import Navbar from "./Dashboard/Navbar";

const ProfileSettings = () => {
  const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });
  const { darkMode } = useDarkMode();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [form, setForm] = useState({
    nickname: "",
    email: "",
    age: "",
    gender: "",
  });
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [editing, setEditing] = useState(false);
  const [changingPwd, setChangingPwd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(sessionStorage.getItem("user") || "null");
        if (!user) return navigate("/login");
        setUserData(user);
        setForm({
          nickname: user.nickname || "",
          email: user.email || "",
          age: user.age || "",
          gender: user.gender || "",
        });
      } catch (e) {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    // Auto-clear messages after 5 seconds
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [navigate, error, success]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = {
        ...userData,
        ...form,
        age: form.age ? Number.parseInt(form.age) : null,
      };

      await API.put(`/user/${userData._id}`, updated);
      sessionStorage.setItem("user", JSON.stringify(updated));
      setUserData(updated);
      setSuccess("Profile updated successfully");
      setEditing(false);
    } catch (e) {
      setError("Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handlePwdChange = async (e) => {
    e.preventDefault();
    setSaving(true);
    if (passwords.new !== passwords.confirm) {
      setSaving(false);
      return setError("Passwords do not match");
    }
    try {
      const res = await API.post("/verify-password", {
        userId: userData._id,
        password: passwords.current,
      });
      if (!res.data.valid) {
        setSaving(false);
        return setError("Incorrect current password");
      }
      await API.put(`/user/${userData._id}/password`, {
        newPassword: passwords.new,
      });
      setSuccess("Password changed successfully");
      setPasswords({ current: "", new: "", confirm: "" });
      setChangingPwd(false);
    } catch (e) {
      setError("Password update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await API.delete(`/user/${userData._id}`);
      sessionStorage.removeItem("user");
      setSuccess("Account deleted successfully");
      setTimeout(() => navigate("/"), 1500);
    } catch {
      setError("Delete failed");
    }
  };

  const cancelEditing = () => {
    if (userData) {
      setForm({
        nickname: userData.nickname || "",
        email: userData.email || "",
        age: userData.age || "",
        gender: userData.gender || "",
      });
    }
    setEditing(false);
  };

  const cancelPasswordChange = () => {
    setPasswords({ current: "", new: "", confirm: "" });
    setShowPasswords({ current: false, new: false, confirm: false });
    setChangingPwd(false);
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <div className="min-h-screen dark:bg-[#1A1A1A] dark:text-[#F8F1E9] bg-[#f3f9fc] text-[#1A1A1A] font-sans transition-colors duration-300">
      {/* Gradient Accents */}
      <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-[#8fa9af] to-transparent opacity-70 dark:opacity-20 transition-opacity duration-300"></div>

      {/* Grid Pattern Background */}
      <div className="absolute inset-0 z-0 opacity-5 dark:opacity-10 pointer-events-none">
        <div className="absolute inset-0 grid grid-cols-12 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="h-full border-r border-black dark:border-white"
            ></div>
          ))}
        </div>
        <div className="absolute inset-0 grid grid-rows-12 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="w-full border-b border-black dark:border-white"
            ></div>
          ))}
        </div>
      </div>

      <Navbar />

      <div className="relative z-10 max-w-6xl mx-auto p-6 sm:p-8">
        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center mb-6">
            <div>
              <div className="inline-block mb-2 px-3 py-1 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] text-xs font-medium tracking-wider">
                ACCOUNT SETTINGS
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
                <span className="relative">
                  Profile <span className="text-[#5999a8]">Settings</span>
                  <svg
                    className="absolute -bottom-2 left-0 w-full h-2 text-[#5999a8]"
                    viewBox="0 0 100 10"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0,5 Q25,0 50,5 T100,5"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                    />
                  </svg>
                </span>
              </h1>
              <p className="text-lg opacity-80 mt-4 font-medium">
                Welcome back, {userData?.nickname || "User"}! Manage your
                profile and account settings.
              </p>
            </div>
          </div>
        </header>

        {/* Alert Messages */}
        {(error || success) && (
          <div
            className={`mb-8 p-4 rounded-2xl border-2 flex justify-between items-center ${
              error
                ? "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 border-red-500"
                : "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-500"
            }`}
          >
            <div className="flex items-center">
              {error ? (
                <X size={18} className="mr-3 text-red-500" />
              ) : (
                <Check size={18} className="mr-3 text-green-500" />
              )}
              <span className="font-medium">{error || success}</span>
            </div>
            <button
              onClick={() => (error ? setError(null) : setSuccess(null))}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-[#5999a8] border-t-transparent rounded-full animate-spin mb-6"></div>
            <p className="text-lg font-medium text-[#5999a8]">
              Loading your profile...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Profile Information Section */}
            <section className="border-2 border-[#1A1A1A] dark:border-[#F8F1E9] rounded-2xl p-8 bg-white/50 dark:bg-[#2A2A2A]/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] rounded-2xl bg-[#5999a8]/10 dark:bg-[#5999a8]/20">
                  <User size={24} />
                </div>
                <h2 className="text-2xl font-bold tracking-tight">
                  Profile Information
                </h2>
              </div>

              {editing ? (
                <form onSubmit={handleUpdate} className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium opacity-80">
                      Nickname
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                        <User size={16} />
                      </div>
                      <input
                        type="text"
                        placeholder="Enter your nickname"
                        value={form.nickname}
                        onChange={(e) =>
                          setForm({ ...form, nickname: e.target.value })
                        }
                        className="w-full p-3 pl-10 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] bg-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5999a8] transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium opacity-80">
                      Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                        <Mail size={16} />
                      </div>
                      <input
                        type="email"
                        placeholder="Enter your email"
                        value={form.email}
                        onChange={(e) =>
                          setForm({ ...form, email: e.target.value })
                        }
                        className="w-full p-3 pl-10 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] bg-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5999a8] transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium opacity-80">
                      Age
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                        <Calendar size={16} />
                      </div>
                      <input
                        type="number"
                        placeholder="Enter your age"
                        value={form.age}
                        onChange={(e) =>
                          setForm({ ...form, age: e.target.value })
                        }
                        className="w-full p-3 pl-10 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] bg-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5999a8] transition-all"
                        min="13"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium opacity-80">
                      Gender
                    </label>
                    <select
                      value={form.gender}
                      onChange={(e) =>
                        setForm({ ...form, gender: e.target.value })
                      }
                      className="w-full p-3 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] bg-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5999a8] transition-all"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer-not-to-say">
                        Prefer not to say
                      </option>
                    </select>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-6">
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex items-center justify-center px-6 py-3 bg-[#1A1A1A] dark:bg-[#F8F1E9] text-[#F8F1E9] dark:text-[#1A1A1A] rounded-lg hover:opacity-90 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? (
                        <>
                          <div className="w-4 h-4 border-2 border-t-current border-r-transparent border-b-transparent border-l-transparent animate-spin mr-2"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save size={16} className="mr-2" />
                          Save Changes
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={cancelEditing}
                      className="flex items-center justify-center px-6 py-3 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] rounded-lg hover:bg-[#5999a8]/10 dark:hover:bg-[#5999a8]/20 transition-all duration-300 font-medium"
                    >
                      <X size={16} className="mr-2" />
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] rounded-lg p-6 bg-[#5999a8]/5 dark:bg-[#5999a8]/10">
                    {[
                      { label: "Nickname", value: form.nickname || "Not set" },
                      { label: "Email", value: form.email || "Not set" },
                      { label: "Age", value: form.age || "Not set" },
                      {
                        label: "Gender",
                        value: form.gender
                          ? form.gender.charAt(0).toUpperCase() +
                            form.gender.slice(1).replace("-", " ")
                          : "Not set",
                      },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center py-2"
                      >
                        <span className="text-sm font-medium opacity-70">
                          {item.label}:
                        </span>
                        <span className="font-semibold">{item.value}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setEditing(true)}
                    className="flex items-center justify-center w-full px-6 py-3 bg-[#1A1A1A] dark:bg-[#F8F1E9] text-[#F8F1E9] dark:text-[#1A1A1A] rounded-lg hover:opacity-90 transition-all duration-300 font-medium"
                  >
                    <Settings size={16} className="mr-2" />
                    Edit Profile
                  </button>
                </div>
              )}
            </section>

            {/* Security Settings Section */}
            <section className="border-2 border-[#1A1A1A] dark:border-[#F8F1E9] rounded-2xl p-8 bg-white/50 dark:bg-[#2A2A2A]/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] rounded-2xl bg-[#5999a8]/10 dark:bg-[#5999a8]/20">
                  <Shield size={24} />
                </div>
                <h2 className="text-2xl font-bold tracking-tight">
                  Security Settings
                </h2>
              </div>

              {changingPwd ? (
                <form onSubmit={handlePwdChange} className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium opacity-80">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.current ? "text" : "password"}
                        placeholder="Enter your current password"
                        value={passwords.current}
                        onChange={(e) =>
                          setPasswords({
                            ...passwords,
                            current: e.target.value,
                          })
                        }
                        className="w-full p-3 pr-12 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] bg-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5999a8] transition-all"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("current")}
                        className="absolute top-1/2 right-3 transform -translate-y-1/2 hover:opacity-70 transition-opacity"
                      >
                        {showPasswords.current ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium opacity-80">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.new ? "text" : "password"}
                        placeholder="Enter your new password"
                        value={passwords.new}
                        onChange={(e) =>
                          setPasswords({ ...passwords, new: e.target.value })
                        }
                        className="w-full p-3 pr-12 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] bg-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5999a8] transition-all"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("new")}
                        className="absolute top-1/2 right-3 transform -translate-y-1/2 hover:opacity-70 transition-opacity"
                      >
                        {showPasswords.new ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium opacity-80">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.confirm ? "text" : "password"}
                        placeholder="Confirm your new password"
                        value={passwords.confirm}
                        onChange={(e) =>
                          setPasswords({
                            ...passwords,
                            confirm: e.target.value,
                          })
                        }
                        className={`w-full p-3 pr-12 border-2 ${
                          passwords.confirm &&
                          passwords.new !== passwords.confirm
                            ? "border-red-500 focus:ring-red-500"
                            : "border-[#1A1A1A] dark:border-[#F8F1E9] focus:ring-[#5999a8]"
                        } bg-transparent rounded-lg focus:outline-none focus:ring-2 transition-all`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("confirm")}
                        className="absolute top-1/2 right-3 transform -translate-y-1/2 hover:opacity-70 transition-opacity"
                      >
                        {showPasswords.confirm ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                    {passwords.confirm &&
                      passwords.new !== passwords.confirm && (
                        <p className="text-red-500 text-xs mt-1">
                          Passwords do not match
                        </p>
                      )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-6">
                    <button
                      type="submit"
                      disabled={
                        saving ||
                        (passwords.confirm &&
                          passwords.new !== passwords.confirm)
                      }
                      className="flex items-center justify-center px-6 py-3 bg-[#1A1A1A] dark:bg-[#F8F1E9] text-[#F8F1E9] dark:text-[#1A1A1A] rounded-lg hover:opacity-90 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? (
                        <>
                          <div className="w-4 h-4 border-2 border-t-current border-r-transparent border-b-transparent border-l-transparent animate-spin mr-2"></div>
                          Changing...
                        </>
                      ) : (
                        <>
                          <Lock size={16} className="mr-2" />
                          Change Password
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={cancelPasswordChange}
                      className="flex items-center justify-center px-6 py-3 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] rounded-lg hover:bg-[#5999a8]/10 dark:hover:bg-[#5999a8]/20 transition-all duration-300 font-medium"
                    >
                      <X size={16} className="mr-2" />
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setChangingPwd(true)}
                  className="flex items-center justify-center w-full px-6 py-3 bg-[#1A1A1A] dark:bg-[#F8F1E9] text-[#F8F1E9] dark:text-[#1A1A1A] rounded-lg hover:opacity-90 transition-all duration-300 font-medium mb-8"
                >
                  <Lock size={16} className="mr-2" />
                  Change Password
                </button>
              )}

              {/* Danger Zone */}
              <div className="border-t-2 border-red-500 pt-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 border-2 border-red-500 rounded-2xl bg-red-50 dark:bg-red-900/20">
                    <AlertTriangle size={20} className="text-red-500" />
                  </div>
                  <h3 className="text-xl font-bold text-red-600 dark:text-red-400">
                    Danger Zone
                  </h3>
                </div>

                {!showDeleteConfirm ? (
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="flex items-center justify-center w-full px-6 py-3 bg-white dark:bg-[#2A2A2A] text-red-500 border-2 border-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300 font-medium"
                  >
                    <Trash2 size={16} className="mr-2" />
                    Delete Account
                  </button>
                ) : (
                  <div className="p-6 border-2 border-red-500 rounded-lg bg-red-50 dark:bg-red-900/20">
                    <div className="flex items-start gap-3 mb-4">
                      <AlertTriangle
                        size={20}
                        className="text-red-500 mt-0.5 flex-shrink-0"
                      />
                      <div>
                        <h4 className="font-bold text-red-800 dark:text-red-300 mb-2">
                          Are you absolutely sure?
                        </h4>
                        <p className="text-sm text-red-700 dark:text-red-400 leading-relaxed">
                          This action cannot be undone. This will permanently
                          delete your account and remove all your data from our
                          servers.
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={handleDelete}
                        className="flex items-center justify-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 font-medium"
                      >
                        <Trash2 size={16} className="mr-2" />
                        Yes, Delete My Account
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="flex items-center justify-center px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 font-medium"
                      >
                        <X size={16} className="mr-2" />
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSettings;
