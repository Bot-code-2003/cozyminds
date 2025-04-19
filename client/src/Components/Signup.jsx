// Refactored Signup.jsx (simplified, uses CSS vars)

"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Sun, Moon } from "lucide-react";
import { useDarkMode } from "../context/ThemeContext";

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });

const Signup = ({ setUser }) => {
  const { darkMode, setDarkMode } = useDarkMode();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nickname: "",
    email: "",
    password: "",
    age: "",
    gender: "",
    subscribe: false,
  });
  const [error, setError] = useState(null);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await API.post("/signup", form);
      const user = res.data.user;
      setUser(user);
      sessionStorage.setItem("user", JSON.stringify(user));
      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.message || "Signup failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg-primary)] text-[var(--text-primary)] px-4">
      <button
        onClick={toggleDarkMode}
        className="absolute top-4 right-4 p-2 text-[var(--accent)]"
        aria-label="Toggle dark mode"
      >
        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <h1 className="text-3xl font-bold mb-6">Create Account</h1>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-[var(--bg-secondary)] border border-[var(--border)] p-6 space-y-4 shadow-md"
      >
        {error && <div className="text-red-500 text-sm">{error}</div>}

        <input
          type="text"
          name="nickname"
          placeholder="Nickname"
          value={form.nickname}
          onChange={handleChange}
          required
          className="w-full p-3 border border-[var(--border)] bg-transparent focus:outline-none"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full p-3 border border-[var(--border)] bg-transparent focus:outline-none"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full p-3 border border-[var(--border)] bg-transparent focus:outline-none"
        />

        <input
          type="number"
          name="age"
          placeholder="Age"
          value={form.age}
          onChange={handleChange}
          required
          min="13"
          className="w-full p-3 border border-[var(--border)] bg-transparent focus:outline-none"
        />

        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          required
          className="w-full p-3 border border-[var(--border)] bg-transparent focus:outline-none"
        >
          <option value="" disabled>
            Select Gender
          </option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        <label className="flex items-center space-x-2 text-sm">
          <input
            type="checkbox"
            name="subscribe"
            checked={form.subscribe}
            onChange={handleChange}
          />
          <span>Subscribe to motivational emails</span>
        </label>

        <button
          type="submit"
          className="w-full p-3 bg-[var(--accent)] text-[var(--bg-primary)] hover:opacity-90 transition"
        >
          Create Account
        </button>

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-[var(--accent)] underline">
            Log In
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
