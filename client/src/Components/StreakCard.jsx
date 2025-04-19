"use client";

import { useState, useEffect } from "react";
import { useDarkMode } from "../context/ThemeContext";
import { Calendar } from "lucide-react";

const StreakCard = ({ journalEntries = [], wordCountStats = {} }) => {
  const { darkMode } = useDarkMode();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    const loadUserData = () => {
      try {
        const storedUser = sessionStorage.getItem("user");
        if (storedUser) {
          setUserData(JSON.parse(storedUser));
        } else {
          setUserData(defaultUserData);
          sessionStorage.setItem("user", JSON.stringify(defaultUserData));
        }
        setLoading(false);
      } catch (err) {
        setError(err?.message || "Failed to load user data from local storage");
        setLoading(false);
      }
    };
    loadUserData();
  }, []);

  const currentStreak = userData?.currentStreak || 0;
  const longestStreak = userData?.longestStreak || 0;
  const lastJournaled = userData?.lastVisited
    ? new Date(userData.lastVisited).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : "N/A";

  if (loading || !userData) {
    return (
      <div
        className={`p-6 h-full bg-[var(--bg-secondary)] border-[var(--accent)] border-designer shadow-elegant flex items-center justify-center`}
      >
        <p
          className={`text-sm font-sans uppercase tracking-wide text-[var(--text-secondary)]`}
        >
          Loading...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`p-6 h-full bg-[var(--bg-secondary)] border-[var(--accent)] border-designer shadow-elegant flex items-center justify-center`}
      >
        <p
          className={`text-sm font-sans uppercase tracking-wide text-[var(--text-secondary)]`}
        >
          Error loading data
        </p>
      </div>
    );
  }

  return (
    <div
      className={`p-6 h-full bg-[var(--bg-secondary)] border-[var(--accent)] text-[var(--text-primary)] border-designer shadow-elegant`}
    >
      <div className="flex flex-col">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <h3
            className={`text-sm font-sans uppercase tracking-wide text-[var(--text-secondary)]`}
          >
            Streak
          </h3>
          <div
            className={`text-xs px-3 py-1 border border-[var(--accent)] text-[var(--accent)] flex items-center`}
          >
            <Calendar size={12} className="mr-1.5" />
            Last visited {lastJournaled}
          </div>
        </div>

        {/* Single Row Stats Section */}
        <div className="flex justify-between text-center">
          {/* Current Streak */}
          <div>
            <p className="text-4xl font-serif text-[var(--accent)]">
              {currentStreak}
            </p>
            <span
              className={`text-sm font-sans uppercase tracking-wide text-[var(--text-secondary)]`}
            >
              Current
            </span>
          </div>

          {/* Divider */}
          <div className="h-16 w-px bg-[var(--accent)]/20"></div>

          {/* Longest Streak */}
          <div>
            <p className="text-4xl font-serif text-[var(--text-primary)]">
              {longestStreak}
            </p>
            <span
              className={`text-sm font-sans uppercase tracking-wide text-[var(--text-secondary)]`}
            >
              Longest
            </span>
          </div>

          {/* Divider */}
          <div className="h-16 w-px bg-[var(--accent)]/20"></div>

          {/* Entries */}
          <div>
            <p className={`text-4xl font-serif text-[var(--text-primary)]`}>
              {journalEntries.length}
            </p>
            <span
              className={`text-sm font-sans uppercase tracking-wide text-[var(--text-secondary)]`}
            >
              Entries
            </span>
          </div>

          {/* Divider */}
          <div className="h-16 w-px bg-[var(--accent)]/20"></div>

          {/* Words */}
          <div>
            <p className={`text-4xl font-serif text-[var(--text-primary)]`}>
              {wordCountStats?.total?.toLocaleString() || 0}
            </p>
            <span
              className={`text-sm font-sans uppercase tracking-wide text-[var(--text-secondary)]`}
            >
              Words
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreakCard;
