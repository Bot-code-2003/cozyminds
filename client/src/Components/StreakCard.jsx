"use client";

import { useState, useEffect } from "react";
import { useDarkMode } from "../context/ThemeContext";
import { useLocation } from "react-router-dom";

const StreakCard = () => {
  const { darkMode } = useDarkMode();
  const location = useLocation();
  const isHome = location.pathname === "/";

  // State to store user data and loading/error states
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Default user data if nothing exists in localStorage
  const defaultUserData = {
    id: "67e505f4aa1c2142b1168a5e",
    nickname: "admin",
    email: "admin@gmail.com",
    age: 22,
    gender: "male",
    subscribe: true,
    currentStreak: 0,
    longestStreak: 0,
    storyVisitCount: 15,
    storiesCompleted: 1,
    lastVisited: "2025-03-26T18:30:00.000Z",
  };

  // Load user data from localStorage when component mounts
  useEffect(() => {
    const loadUserData = () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUserData(JSON.parse(storedUser));
        } else {
          // If no data exists, set default data and store it
          setUserData(defaultUserData);
          localStorage.setItem("user", JSON.stringify(defaultUserData));
        }
        setLoading(false);
      } catch (err) {
        setError(err?.message || "Failed to load user data from local storage");
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Extract data with fallback values
  const currentStreak = userData?.currentStreak || 0;
  const longestStreak = userData?.longestStreak || 0;
  const lastJournaled = userData?.lastVisited
    ? new Date(userData.lastVisited).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : "N/A";

  // Loading state
  if (loading) {
    return (
      <div
        className={`p-6 border shadow-lg ${
          darkMode
            ? "bg-[#2A2A2A] border-[#333333] text-[#F8F1E9]"
            : "bg-white border-[#F0E6DD] text-[#5C4B3F]"
        }`}
      >
        <div className="text-center">
          <p className="text-sm opacity-70">Loading...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div
        className={`p-6 border shadow-lg ${
          darkMode
            ? "bg-[#2A2A2A] border-[#333333] text-[#F8F1E9]"
            : "bg-white border-[#F0E6DD] text-[#5C4B3F]"
        }`}
      >
        <div className="text-center">
          <p className="text-sm opacity-70">Error loading streak</p>
        </div>
      </div>
    );
  }

  // Home route design - informative and styled like stats card
  if (isHome) {
    return (
      <div
        className={`p-6 border shadow-lg h-full ${
          darkMode
            ? "bg-[#2A2A2A] border-[#333333] text-[#F8F1E9]"
            : "bg-white border-[#F0E6DD] text-[#5C4B3F]"
        }`}
      >
        <div className="flex flex-col items-center text-center">
          <h3 className="text-sm opacity-70 mb-1">Your Writing Streak</h3>
          <div className="flex justify-between w-full mb-4">
            <div>
              <p className="text-3xl font-bold text-[#E9C19D] dark:text-[#D4A373]">
                {currentStreak}
              </p>
              <span className="text-sm opacity-70">Current Streak</span>
            </div>
            <div>
              <p className="text-3xl font-bold">{longestStreak}</p>
              <span className="text-sm opacity-70">Longest Streak</span>
            </div>
          </div>
          {currentStreak > 0 && (
            <p className="text-sm opacity-70">Last entry: {lastJournaled}</p>
          )}
          {currentStreak === 0 && (
            <p className="text-sm opacity-70">Start journaling today!</p>
          )}
        </div>
      </div>
    );
  }

  // Other routes - informative and styled like stats card
  return (
    <div
      className={`p-6 border shadow-lg ${
        darkMode
          ? "bg-[#2A2A2A] border-[#333333] text-[#F8F1E9]"
          : "bg-white border-[#F0E6DD] text-[#5C4B3F]"
      }`}
    >
      <div className="flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-sm opacity-70 mb-1">Your Writing Streak</h3>
          </div>
          <div
            className={`text-sm px-2 py-1 border ${
              darkMode
                ? "bg-[#2A2A2A] border-[#444444]"
                : "bg-white border-[#E6DDD3]"
            }`}
          >
            {lastJournaled}
          </div>
        </div>
        <div className="flex justify-between text-center">
          <div>
            <p className="text-3xl font-bold text-[#E9C19D] dark:text-[#D4A373]">
              {currentStreak}
            </p>
            <span className="text-sm opacity-70">Current</span>
          </div>
          <div>
            <p className="text-3xl font-bold">{longestStreak}</p>
            <span className="text-sm opacity-70">Longest</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreakCard;
