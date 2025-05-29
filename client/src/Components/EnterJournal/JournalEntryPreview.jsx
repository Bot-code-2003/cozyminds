"use client";

import { useParams, Link } from "react-router-dom";
import { useDarkMode } from "../../context/ThemeContext";
import { Tag, BarChart2, ArrowLeft } from "lucide-react";
import { getCardClass, getThemeDetails } from "../Dashboard/ThemeDetails";

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

// Combined component that can be used both as a standalone page or preview
const JournalEntryPreview = ({
  isPreview = false,
  previewData = null,
  hideBackButton = false,
}) => {
  const { id } = useParams();
  const { darkMode } = useDarkMode();

  // If in preview mode, use previewData, otherwise the component operates as normal
  const entry = isPreview ? previewData : null;
  const loading = isPreview ? false : true;
  const error = isPreview ? null : null;

  // Format date function
  const formatDate = (dateString) => {
    if (isPreview && !dateString) {
      return "TODAY";
    }
    return new Date(dateString || Date.now())
      .toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
      .toUpperCase();
  };

  if (!isPreview && loading) {
    return (
      <div className="flex items-center justify-center">
        <div className="bg-[var(--bg-primary)] p-8 rounded-lg shadow-md">
          <p className="text-lg font-medium tracking-wide flex items-center gap-2">
            <span className="animate-spin">⟳</span> LOADING ENTRY...
          </p>
        </div>
      </div>
    );
  }

  if (!isPreview && (error || !entry)) {
    return (
      <div className="flex items-center justify-center ">
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
  const moodStyle = entry?.mood
    ? moodStyles[entry.mood] || moodStyles.default
    : moodStyles.default;

  // Get theme details
  const currentTheme = getThemeDetails(entry?.theme);

  // Container classes that adjust based on preview mode
  const containerClasses = isPreview
    ? "w-full"
    : " flex flex-col items-center px-4 sm:px-6 py-8 sm:py-12 relative overflow-hidden";

  const contentContainerClasses = isPreview
    ? "w-full"
    : "w-full max-w-4xl z-10";

  return (
    <div
      className={`${containerClasses} ${
        darkMode ? "bg-[#1A1A1A] text-[#F8F1E9]" : "bg-[#F8F1E9] text-[#1A1A1A]"
      } transition-colors duration-300 px-6 py-12 sm:px-20 sm:py-36 ${getCardClass(
        entry?.theme
      )}`}
    >
      {/* Theme-specific decorative elements - only shown in full view */}
      {!isPreview && (
        <>
          <div className="absolute top-0 left-0 w-full h-1/2 opacity-20 dark:opacity-10 transform -skew-y-12 pointer-events-none"></div>
          <div className="absolute bottom-0 right-0 w-full h-1/3 opacity-20 dark:opacity-10 transform skew-y-12 pointer-events-none"></div>
        </>
      )}

      {/* Main Content Container */}
      <div className={contentContainerClasses}>
        {/* Back Button - only shown in full view when not hidden */}
        {!isPreview && !hideBackButton && (
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-md bg-[var(--accent)]/90 hover:bg-[var(--accent)] transition-all duration-200 backdrop-blur-sm"
          >
            <ArrowLeft size={16} />
            <span className="text-sm font-medium tracking-wider">BACK</span>
          </Link>
        )}

        {/* Journal Container */}
        <div className="bg-[var(--bg-primary)]/80 backdrop-blur-sm rounded-xl shadow-lg border border-[var(--border)] overflow-hidden">
          {/* Theme Header Banner */}
          <div className="relative h-12 bg-[var(--accent)]/30 flex items-center justify-end px-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium tracking-wider opacity-70">
                {entry?.theme
                  ? entry.theme.replace("theme_", "").toUpperCase()
                  : "DEFAULT"}{" "}
                THEME
              </span>
              <span role="img" aria-label="theme-icon" className="text-2xl">
                {currentTheme?.icon || "📝"}
              </span>
            </div>
          </div>

          {/* Content Container */}
          <div className={isPreview ? "p-4" : "p-6 sm:p-8"}>
            {/* Header Section */}
            <div className="border-b border-[var(--border)] pb-6 mb-6">
              <h1
                className={`${
                  isPreview
                    ? "text-sm md:text-2xl"
                    : "text-3xl sm:text-4xl md:text-5xl"
                } font-bold tracking-wide mb-4`}
              >
                {(entry?.title || "UNTITLED").toUpperCase()}
              </h1>

              {/* Date & Stats Row */}
              <div className="flex flex-wrap gap-4 sm:gap-6 text-xs sm:text-sm opacity-80 tracking-wide">
                <div className="flex items-center gap-2 bg-[var(--bg-secondary)]/50 text-[var(--accent)] px-3 py-1 rounded-full">
                  <span>{currentTheme?.dateIcon || "📅"}</span>
                  <span>{formatDate(entry?.date)}</span>
                </div>
                <div className="flex items-center gap-2 bg-[var(--bg-secondary)]/50 text-[var(--accent)] px-3 py-1 rounded-full">
                  <BarChart2 size={14} />
                  <span>{entry?.wordCount || "0"} WORDS</span>
                </div>
              </div>
            </div>

            {/* Mood & Tags Section */}
            {(!isPreview ||
              entry?.mood ||
              (entry?.tags && entry.tags.length > 0)) && (
              <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6 mb-8">
                {/* Mood Badge */}
                {entry?.mood && (
                  <div>
                    <span
                      className={`inline-flex items-center gap-2 px-4 py-1.5 text-sm font-medium tracking-wide rounded-full ${moodStyle.bgColor} ${moodStyle.textColor} border ${moodStyle.borderColor}`}
                    >
                      <span>{moodStyle.emoji}</span>
                      <span>{entry.mood.toUpperCase()}</span>
                    </span>
                  </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {entry?.tags && entry.tags.length > 0
                    ? entry.tags.map((tag, index) => (
                        <span
                          key={index}
                          className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium tracking-wide rounded-full ${
                            darkMode
                              ? "bg-[#F8F1E9]/10 text-[#F8F1E9] border-[#F8F1E9]/20"
                              : "bg-[#1A1A1A]/10 text-[#1A1A1A] border-[#1A1A1A]/20"
                          } border`}
                        >
                          <Tag size={12} />
                          <span>{tag.toUpperCase()}</span>
                        </span>
                      ))
                    : !isPreview && (
                        <span className="text-xs opacity-60 tracking-wide py-1.5">
                          NO TAGS
                        </span>
                      )}
                </div>
              </div>
            )}

            {/* Journal Content */}
            <div className="relative">
              {/* Subtle decorative element */}
              <div className="absolute left-0 top-0 w-1 h-full bg-[var(--accent)]/30 rounded"></div>

              <div
                className={`pl-4 ${
                  isPreview ? "text-sm" : "text-lg"
                } leading-relaxed tracking-wide ${
                  darkMode ? "text-[#F8F1E9]/90" : "text-[#1A1A1A]/90"
                }`}
              >
                <p>{entry?.content || "No content available."}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JournalEntryPreview;
