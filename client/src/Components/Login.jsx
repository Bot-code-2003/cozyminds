"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Sun, Moon } from "lucide-react";
import { useDarkMode } from "../context/ThemeContext";

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });

const Login = ({ setUser }) => {
  const { darkMode, setDarkMode } = useDarkMode();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await API.post("/login", form);
      const { user, coinsEarned } = res.data;

      console.log("Login successful, coins earned:", coinsEarned);

      // Make sure coinsEarned is a number
      const coinsEarnedNum = parseInt(coinsEarned || 0, 10);

      setUser(user);
      sessionStorage.setItem("user", JSON.stringify(user));

      // Dispatch the login event with coinsEarned detail
      window.dispatchEvent(
        new CustomEvent("user-logged-in", {
          detail: {
            user,
            coinsEarned: coinsEarnedNum,
          },
        })
      );

      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed. Try again.");
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

      <h1 className="text-3xl font-bold mb-6">Welcome Back</h1>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-[var(--bg-secondary)] border border-[var(--border)] p-6 space-y-4 shadow-md"
      >
        {error && <div className="text-red-500 text-sm">{error}</div>}

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

        <button
          type="submit"
          className="w-full p-3 bg-[var(--accent)] text-[var(--bg-primary)] hover:opacity-90 transition"
        >
          Sign In
        </button>

        <p className="text-sm text-center mt-4">
          Don't have an account?{" "}
          <Link to="/signup" className="text-[var(--accent)] underline">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
