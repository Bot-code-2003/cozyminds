"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  Save,
  Trash2,
  Check,
  X,
  Lock,
  Calendar,
  BarChart2,
  Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDarkMode } from "../context/ThemeContext";
import StreakCard from "./StreakCard";

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
    subscribe: false,
  });
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [editing, setEditing] = useState(false);
  const [changingPwd, setChangingPwd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [stats, setStats] = useState({
    totalEntries: 0,
    totalWords: 0,
    first: null,
    last: null,
  });

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
          subscribe: user.subscribe || false,
        });
        const { data } = await API.get(`/user/journals/${user.id}`);
        const entries = data.journals || [];
        const words = entries.reduce((sum, e) => sum + (e.wordCount || 0), 0);
        const sorted = [...entries].sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );
        setStats({
          totalEntries: entries.length,
          totalWords: words,
          first: sorted[0]?.date,
          last: sorted[sorted.length - 1]?.date,
        });
      } catch (e) {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = {
        ...userData,
        ...form,
        age: form.age ? parseInt(form.age) : null,
      };
      await API.put(`/user/user/${userData.id}`, updated);
      sessionStorage.setItem("user", JSON.stringify(updated));
      setUserData(updated);
      setSuccess("Profile updated");
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
    if (passwords.new !== passwords.confirm)
      return setError("Passwords do not match");
    try {
      const res = await API.post("/user/verify-password", {
        userId: userData.id,
        password: passwords.current,
      });
      if (!res.data.valid) return setError("Incorrect current password");
      await API.put(`/user/user/${userData.id}/password`, {
        newPassword: passwords.new,
      });
      setSuccess("Password changed");
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
      await API.delete(`/user/user/${userData.id}`);
      sessionStorage.removeItem("user");
      navigate("/");
    } catch {
      setError("Delete failed");
    }
  };

  const formatDate = (d) => (d ? new Date(d).toLocaleDateString() : "N/A");

  return (
    <div
      className="min-h-screen px-6 py-12 max-w-5xl mx-auto font-sans space-y-12"
      style={{
        backgroundColor: "var(--bg-primary)",
        color: "var(--text-primary)",
      }}
    >
      <header className="flex flex-col gap-1 border-b border-[var(--accent)] pb-4">
        <h1 className="text-4xl font-bold leading-tight">
          Welcome back, {userData?.nickname || "User"}!
        </h1>
        <p className="text-secondary">
          Manage your profile, preferences, and more.
        </p>
      </header>

      {loading ? (
        <p className="animate-pulse text-center text-accent">Loading...</p>
      ) : (
        <form
          onSubmit={handleUpdate}
          className="grid grid-cols-1 md:grid-cols-2 gap-10"
        >
          <section className="card-cozy p-6 space-y-6 col-span-1">
            <h2 className="text-2xl font-bold">Profile Information</h2>
            {editing ? (
              <>
                {["nickname", "email", "age"].map((field) => (
                  <input
                    key={field}
                    type={
                      field === "email"
                        ? "email"
                        : field === "age"
                        ? "number"
                        : "text"
                    }
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    value={form[field]}
                    onChange={(e) =>
                      setForm({ ...form, [field]: e.target.value })
                    }
                    className="w-full p-2 border border-designer shadow-elegant"
                  />
                ))}
                <select
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
                  className="w-full p-2 border border-designer shadow-elegant"
                >
                  <option value="">Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                <label className="block">
                  <input
                    type="checkbox"
                    checked={form.subscribe}
                    onChange={(e) =>
                      setForm({ ...form, subscribe: e.target.checked })
                    }
                  />{" "}
                  Subscribe
                </label>
                <button type="submit" className="btn-cozy">
                  <Save size={16} className="mr-2" /> Save
                </button>
              </>
            ) : (
              <div className="space-y-2">
                {Object.entries(form).map(([k, v]) => (
                  <p key={k}>
                    <strong>{k.charAt(0).toUpperCase() + k.slice(1)}:</strong>{" "}
                    {v || "Not set"}
                  </p>
                ))}
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="btn-cozy mt-2"
                >
                  Edit
                </button>
              </div>
            )}
          </section>

          <section className="card-cozy p-6 space-y-6 col-span-1">
            <h2 className="text-2xl font-bold">Security Settings</h2>
            {changingPwd ? (
              <form onSubmit={handlePwdChange} className="space-y-3">
                {["current", "new", "confirm"].map((p) => (
                  <input
                    key={p}
                    type="password"
                    placeholder={`${
                      p.charAt(0).toUpperCase() + p.slice(1)
                    } Password`}
                    value={passwords[p]}
                    onChange={(e) =>
                      setPasswords({ ...passwords, [p]: e.target.value })
                    }
                    className="w-full p-2 border border-designer shadow-elegant"
                  />
                ))}
                <button type="submit" className="btn-cozy">
                  <Lock size={16} className="mr-2" /> Change Password
                </button>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setChangingPwd(true)}
                className="btn-cozy"
              >
                Change Password
              </button>
            )}

            <div>
              {!showDeleteConfirm ? (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="btn-cozy text-red-500"
                >
                  <Trash2 size={18} className="mr-2" /> Delete Account
                </button>
              ) : (
                <div className="mt-4 bg-red-100 p-4 dark:bg-red-900/20">
                  <p className="text-sm mb-2">
                    Are you sure? This cannot be undone.
                  </p>
                  <button
                    onClick={handleDelete}
                    className="btn-cozy bg-red-600 text-white"
                  >
                    Yes, Delete
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="ml-2 btn-cozy"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </section>

          <section className="md:col-span-2 card-cozy p-6 space-y-4 text-sm">
            <h2 className="text-2xl font-bold">Your Writing Stats</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Calendar size={16} className="inline mr-1 text-accent" />{" "}
                Entries: {stats.totalEntries}
              </div>
              <div>
                <BarChart2 size={16} className="inline mr-1 text-accent" />{" "}
                Words: {stats.totalWords}
              </div>
              <div>
                <Calendar size={16} className="inline mr-1 text-accent" />{" "}
                First: {formatDate(stats.first)}
              </div>
              <div>
                <Clock size={16} className="inline mr-1 text-accent" /> Last:{" "}
                {formatDate(stats.last)}
              </div>
            </div>
          </section>

          <section className="md:col-span-2 space-y-6">
            <StreakCard />
          </section>
        </form>
      )}
    </div>
  );
};

export default ProfileSettings;
