// JournalEntry.jsx
"use client";

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDarkMode } from "../context/ThemeContext";
import { Tag, BarChart2, ArrowLeft } from "lucide-react";
import axios from "axios";
import { getCardClass, getThemeDetails } from "./Dashboard/ThemeDetails";

// Mood styling configurations
const moodStyles = {
  Happy: {
    bgColor: "bg-green-500/20",
    textColor: "text-green-500",
    borderColor: "border-green-500",
    emoji: "😄",
  },
  Neutral: {
    bgColor: "bg-blue-400/20",
    textColor: "text-blue-400",
    borderColor: "border-blue-400",
    emoji: "😐",
  },
  Sad: {
    bgColor: "bg-blue-600/20",
    textColor: "text-blue-600",
    borderColor: "border-blue-600",
    emoji: "😔",
  },
  Angry: {
    bgColor: "bg-red-500/20",
    textColor: "text-red-500",
    borderColor: "border-red-500",
    emoji: "😡",
  },
  Anxious: {
    bgColor: "bg-purple-500/20",
    textColor: "text-purple-500",
    borderColor: "border-purple-500",
    emoji: "😰",
  },
  Tired: {
    bgColor: "bg-gray-500/20",
    textColor: "text-gray-500",
    borderColor: "border-gray-500",
    emoji: "🥱",
  },
  Reflective: {
    bgColor: "bg-green-600/20",
    textColor: "text-green-600",
    borderColor: "border-green-600",
    emoji: "🤔",
  },
  Excited: {
    bgColor: "bg-yellow-500/20",
    textColor: "text-yellow-500",
    borderColor: "border-yellow-500",
    emoji: "🥳",
  },
  default: {
    bgColor: "bg-[#F4A261]/20",
    textColor: "text-[#F4A261]",
    borderColor: "border-[#F4A261]",
    emoji: "😶",
  },
};

const JournalEntry = () => {
  const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });
  const { id } = useParams();
  const { darkMode } = useDarkMode();
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJournalEntry = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await API.get(`/journal/${id}`);
        console.log("Journal entry:", response.data.journal);
        setEntry(response.data.journal);
      } catch (err) {
        console.error("Error fetching journal entry:", err);
        setError("Failed to load journal entry. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchJournalEntry();
  }, [id]);

  // Format date function
  const formatDate = (dateString) => {
    return new Date(dateString)
      .toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
      .toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-[var(--bg-primary)] p-8 rounded-lg shadow-md">
          <p className="text-lg font-medium tracking-wide flex items-center gap-2">
            <span className="animate-spin">⟳</span> LOADING ENTRY...
          </p>
        </div>
      </div>
    );
  }

  if (error || !entry) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-[var(--bg-primary)] p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <h2 className="text-xl font-bold mb-4">
            {error ? "ERROR" : "NO ENTRY FOUND"}
          </h2>
          <p className="mb-6 opacity-80">
            {error || "This journal entry doesn't exist or has been removed."}
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent)] rounded-md transition-all duration-200"
          >
            <ArrowLeft size={16} />
            <span className="font-medium">BACK TO DASHBOARD</span>
          </Link>
        </div>
      </div>
    );
  }

  // Get mood styling
  const moodStyle = entry.mood
    ? moodStyles[entry.mood] || moodStyles.default
    : moodStyles.default;

  // Get theme details
  const currentTheme = getThemeDetails(entry.theme);

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-[#1A1A1A] text-[#F8F1E9]" : "bg-[#F8F1E9] text-[#1A1A1A]"
      } flex flex-col items-center px-4 sm:px-6 py-8 sm:py-12 relative overflow-hidden transition-colors duration-300 ${getCardClass(
        entry.theme
      )}`}
    >
      {/* Theme-specific decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1/2 opacity-20 dark:opacity-10 transform -skew-y-12 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-full h-1/3 opacity-20 dark:opacity-10 transform skew-y-12 pointer-events-none"></div>

      {/* Main Content Container */}
      <div className="w-full max-w-5xl z-10">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-md bg-[var(--accent)]/90 hover:bg-[var(--accent)] transition-all duration-200 backdrop-blur-sm"
        >
          <ArrowLeft size={16} />
          <span className="text-sm font-medium tracking-wider">BACK</span>
        </Link>

        {/* Journal Container */}
        <div className="bg-[var(--bg-primary)]/70 backdrop-blur-sm rounded-xl shadow-lg border border-[var(--border)] overflow-hidden">
          {/* Theme Header Banner */}
          <div className="relative h-12 bg-[var(--accent)]/60 flex items-center justify-end px-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium tracking-wider opacity-70">
                {entry.theme
                  ? entry.theme.replace("theme_", "").toUpperCase()
                  : "DEFAULT"}{" "}
                THEME
              </span>
              <span role="img" aria-label="theme-icon" className="text-2xl">
                {currentTheme.icon}
              </span>
            </div>
          </div>

          {/* Content Container */}
          <div className="p-4 sm:p-6 md:p-8">
            {/* Header Section */}
            <div className="border-b border-[var(--border)] pb-4 sm:pb-6 mb-4 sm:mb-6">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-wide mb-4 break-words">
                {entry.title.toUpperCase()}
              </h1>

              {/* Date & Stats Row */}
              <div className="flex flex-wrap gap-2 sm:gap-4 text-xs opacity-80 tracking-wide">
                <div className="flex items-center gap-2 bg-[var(--bg-secondary)]/50 text-[var(--accent)] px-2 sm:px-3 py-1 rounded-full">
                  <span>{currentTheme.dateIcon}</span>
                  <span className="truncate max-w-[180px] sm:max-w-none">
                    {formatDate(entry.date)}
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-[var(--bg-secondary)]/50 text-[var(--accent)] px-2 sm:px-3 py-1 rounded-full">
                  <BarChart2 size={14} />
                  <span>{entry.wordCount} WORDS</span>
                </div>
              </div>
            </div>

            {/* Mood & Tags Section */}
            <div className="flex flex-col gap-3 mb-6 sm:mb-8">
              {/* Mood Badge */}
              {entry.mood && (
                <div>
                  <span
                    className={`inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 text-sm font-medium tracking-wide rounded-full ${moodStyle.bgColor} ${moodStyle.textColor} border ${moodStyle.borderColor}`}
                  >
                    <span>{moodStyle.emoji}</span>
                    <span>{entry.mood.toUpperCase()}</span>
                  </span>
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {entry.tags && entry.tags.length > 0 ? (
                  entry.tags.map((tag, index) => (
                    <span
                      key={index}
                      className={`inline-flex items-center gap-1 px-2 sm:px-3 py-1 text-xs font-medium tracking-wide rounded-full ${
                        darkMode
                          ? "bg-[#F8F1E9]/10 text-[#F8F1E9] border-[#F8F1E9]/20"
                          : "bg-[#1A1A1A]/10 text-[#1A1A1A] border-[#1A1A1A]/20"
                      } border`}
                    >
                      <Tag size={12} />
                      <span>{tag.toUpperCase()}</span>
                    </span>
                  ))
                ) : (
                  <span className="text-xs opacity-60 tracking-wide py-1.5">
                    NO TAGS
                  </span>
                )}
              </div>
            </div>

            {/* Journal Content */}
            <div className="relative">
              {/* Subtle decorative element */}
              <div className="absolute left-0 top-0 w-1 h-full bg-[var(--accent)]/30 rounded"></div>

              <div
                className={`pl-3 sm:pl-4 text-base sm:text-lg leading-relaxed tracking-wide max-h-[200px] sm:max-h-[300px] overflow-y-auto ${
                  darkMode ? "text-[#F8F1E9]/90" : "text-[#1A1A1A]/90"
                }`}
              >
                <p>{entry.content}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JournalEntry;
