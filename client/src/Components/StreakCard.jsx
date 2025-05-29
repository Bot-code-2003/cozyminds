"use client";

import { useState, useEffect } from "react";
import { useDarkMode } from "../context/ThemeContext";
import { Calendar, Flame, Target, PenTool, Award } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

  const stats = [
    {
      icon: <Flame size={24} />,
      value: currentStreak,
      label: "Current Streak",
      description: "Days in a row",
      color: "#ff6b6b",
      gradient: "linear-gradient(135deg, #ff6b6b, #ee5a24)",
      isHighlight: true,
    },
    {
      icon: <Target size={24} />,
      value: longestStreak,
      label: "Longest Streak",
      description: "Personal best",
      color: "#4ecdc4",
      gradient: "linear-gradient(135deg, #4ecdc4, #44a08d)",
    },
    {
      icon: <PenTool size={24} />,
      value: journalEntries.length,
      label: "Entries",
      description: "Stories written",
      color: "#45b7d1",
      gradient: "linear-gradient(135deg, #45b7d1, #96c93d)",
    },
    {
      icon: <Award size={24} />,
      value: wordCountStats?.total?.toLocaleString() || 0,
      label: "Words",
      description: "Total count",
      color: "#f9ca24",
      gradient: "linear-gradient(135deg, #f9ca24, #f0932b)",
    },
  ];

  if (loading || !userData) {
    return (
      <div className="p-5 bg-[var(--bg-secondary)] rounded-xl shadow-lg max-w-5xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="flex justify-between items-center">
            <div className="h-6 bg-[var(--accent)]/20 rounded w-2/5"></div>
            <div className="h-5 bg-[var(--accent)]/20 rounded w-1/4"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3">
                <div className="h-12 w-12 bg-[var(--accent)]/10 rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-5 bg-[var(--accent)]/10 rounded w-1/3"></div>
                  <div className="h-3 bg-[var(--accent)]/10 rounded w-1/4 mt-1"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-5 bg-[var(--bg-secondary)] rounded-xl shadow-lg max-w-5xl mx-auto text-center">
        <p className="text-[var(--text-secondary)] text-sm">
          Unable to load progress. Please refresh.
        </p>
      </div>
    );
  }

  return (
    <div className="relative p-5 bg-[var(--bg-secondary)] rounded-xl shadow-lg max-w-7xl mx-auto overflow-hidden">
      {/* Subtle decorative background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div
          className="absolute top-0 right-0 w-40 h-40 rounded-full md:w-48 md:h-48"
          style={{ background: stats[0].gradient }}
        />
      </div>

      <div className="relative">
        {/* Header */}
        <div className="mb-5 flex flex-col md:flex-row md:justify-between md:items-center gap-3">
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-[var(--text-primary)]">
              Your Writing Journey
            </h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Track your progress and milestones
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-[var(--accent)]/10 text-[var(--accent)] rounded-full text-sm">
            <Calendar size={16} />
            <span>{lastJournaled}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <AnimatePresence>
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`flex md:flex-col items-center md:items-start gap-3 p-3 rounded-lg ${
                  stat.isHighlight
                    ? "bg-[var(--accent)]/10"
                    : "bg-[var(--bg-primary)]"
                } border ${
                  stat.isHighlight
                    ? "border-[var(--accent)]/30"
                    : "border-[var(--border)]"
                }`}
              >
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-white"
                  style={{ background: stat.gradient }}
                >
                  {stat.icon}
                </div>
                <div className="flex-1">
                  <p
                    className={`text-xl md:text-2xl font-semibold ${
                      stat.isHighlight
                        ? "text-[var(--accent)]"
                        : "text-[var(--text-primary)]"
                    }`}
                  >
                    {stat.value}
                  </p>
                  <p className="text-sm font-medium text-[var(--text-primary)]">
                    {stat.label}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)]">
                    {stat.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default StreakCard;
