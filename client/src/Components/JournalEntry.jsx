"use client";

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDarkMode } from "../context/ThemeContext";
import { Tag, BarChart2, ArrowLeft } from "lucide-react";
import axios from "axios";

// Function to get card class based on theme
const getCardClass = (theme, darkMode) => {
  if (theme === "theme_forest") {
    return "card-forest";
  } else if (theme === "theme_ocean") {
    return "card-ocean";
  } else if (theme === "theme_christmas") {
    return "card-christmas";
  } else if (theme === "theme_halloween") {
    return "card-halloween";
  } else if (theme === "theme_pets") {
    return "card-pets";
  } else {
    return darkMode ? "card-dark" : "card-light";
  }
};

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

  if (loading) {
    return (
      <div>
        <p className="text-lg font-medium tracking-wide">LOADING ENTRY...</p>
      </div>
    );
  }

  if (error || !entry) {
    return (
      <div>
        <h2>{error ? "ERROR" : "NO ENTRY FOUND"}</h2>
        <p>
          {error || "This journal entry doesn't exist or has been removed."}
        </p>
        <Link to="/">
          <ArrowLeft size={16} />
          <span>BACK TO DASHBOARD</span>
        </Link>
      </div>
    );
  }

  // Get mood styling
  const moodStyle = entry.mood
    ? moodStyles[entry.mood] || moodStyles.default
    : moodStyles.default;

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-[#1A1A1A] text-[#F8F1E9]" : "bg-[#F8F1E9] text-[#1A1A1A]"
      } flex flex-col items-center px-6 py-12 relative overflow-hidden transition-colors duration-300 ${getCardClass(
        entry.theme,
        darkMode
      )}`}
    >
      {/* Theme-specific decorative elements */}
      <div className="absolute top-0 left-0 w-1/2 h-1/2 opacity-20 dark:opacity-10 transform -skew-y-12"></div>
      <div className="absolute bottom-0 right-0 w-1/2 h-1/3 opacity-20 dark:opacity-10 transform skew-y-12"></div>

      {/* Back Button */}
      <div className="w-full max-w-4xl flex justify-start mb-8 z-10">
        <Link
          to="/"
          className={`flex items-center space-x-2 px-4 py-2 bg-[var(--accent)] transition-all duration-200`}
        >
          <ArrowLeft size={16} />
          <span className="text-sm font-medium tracking-wider">BACK</span>
        </Link>
      </div>

      {/* Journal Container */}
      <div
        className={`w-full max-w-4xl bg-[var(--bg-primary)] p-8 shadow-sharp border-t-8 z-10`}
      >
        {/* Theme indicator */}
        {entry.theme && (
          <div className="absolute top-3 right-3 opacity-70">
            <span role="img" aria-label="theme-icon" className="text-2xl">
              {entry.theme === "theme_forest"
                ? "🌲"
                : entry.theme === "theme_ocean"
                ? "🌊"
                : entry.theme === "theme_christmas"
                ? "🎄"
                : entry.theme === "theme_halloween"
                ? "🎃"
                : entry.theme === "theme_pets"
                ? "🐶"
                : "📝"}
            </span>
          </div>
        )}

        {/* Header Section */}
        <div className="border-b border-[var(--border)] pb-6 mb-6">
          <h1 className="text-5xl font-bold tracking-[0.1em] mb-2">
            {entry.title.toUpperCase()}
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs opacity-60 tracking-wide">
            <div className="flex items-center space-x-2">
              <span className="mr-1">
                {entry.theme === "theme_forest"
                  ? "🍃"
                  : entry.theme === "theme_ocean"
                  ? "🫧"
                  : entry.theme === "theme_christmas"
                  ? "❄️"
                  : entry.theme === "theme_halloween"
                  ? "👻"
                  : entry.theme === "theme_pets"
                  ? "🐕"
                  : "📅"}
              </span>
              <span>
                {new Date(entry.date)
                  .toLocaleString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                  .toUpperCase()}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <BarChart2 size={14} />
              <span>{entry.wordCount} WORDS</span>
            </div>
          </div>
        </div>

        {/* Mood & Tags Section */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mb-8">
          <div>
            <span
              className={`inline-block px-4 py-1 text-sm font-medium tracking-wide ${moodStyle.bgColor} ${moodStyle.textColor} border ${moodStyle.borderColor}`}
            >
              {moodStyle.emoji} MOOD:{" "}
              {entry.mood ? entry.mood.toUpperCase() : "NOT SET"}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {entry.tags && entry.tags.length > 0 ? (
              entry.tags.map((tag, index) => (
                <span
                  key={index}
                  className={`flex items-center space-x-1 px-3 py-1 text-xs font-medium tracking-wide ${
                    darkMode
                      ? "bg-[#F8F1E9]/10 text-[#F8F1E9] border-[#F8F1E9]"
                      : "bg-[#1A1A1A]/10 text-[#1A1A1A] border-[#1A1A1A]"
                  } border`}
                >
                  <Tag size={12} />
                  <span>{tag.toUpperCase()}</span>
                </span>
              ))
            ) : (
              <span className="text-xs opacity-60 tracking-wide">NO TAGS</span>
            )}
          </div>
        </div>

        {/* Journal Content */}
        <div
          className={`text-lg leading-relaxed tracking-wide ${
            darkMode ? "text-[#F8F1E9]/90" : "text-[#1A1A1A]/90"
          }`}
        >
          <p>{entry.content}</p>
        </div>
      </div>
    </div>
  );
};

export default JournalEntry;
