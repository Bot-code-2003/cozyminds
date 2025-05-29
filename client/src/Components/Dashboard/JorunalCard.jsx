import { useState } from "react";
import { Link } from "react-router-dom";

const JournalCard = ({
  entry,
  moods,
  formatDate,
  getThemeDetails,
  getCardClass,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const moodData = moods.find((m) => m.name === entry.mood);
  const currentTheme = getThemeDetails(entry.theme);
  const cardClass = getCardClass(entry.theme);

  return (
    <Link
      to={`/journal/${entry._id}`}
      className="group relative block rounded-2xl overflow-hidden border border-[var(--border)] transition-all duration-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: isHovered
          ? "translateY(-8px) scale(1.02)"
          : "translateY(0) scale(1)",
        boxShadow: isHovered
          ? "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)"
          : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      }}
    >
      {/* Top portion: Background image */}
      <div
        className={`relative w-full h-48 ${cardClass}`}
        style={{
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Animated background gradient */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `linear-gradient(135deg, ${
              moodData?.color || "var(--accent)"
            }15, ${moodData?.color || "var(--accent)"}05)`,
          }}
        />
      </div>

      {/* Bottom portion: Main content */}
      <div className="relative p-6 bg-[var(--bg-secondary)] flex flex-col min-h-[300px]">
        {/* Header with date and mood */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-xs font-medium text-[var(--text-secondary)]">
            <span className="text-sm">{currentTheme?.dateIcon || "📅"}</span>
            <span className="px-2 py-1 bg-[var(--bg-primary)] rounded-full">
              {formatDate(entry.date)}
            </span>
          </div>

          {entry.mood && (
            <div
              className="flex items-center gap-1 px-3 py-1 rounded-full text-white text-xs font-medium shadow-lg transform group-hover:scale-110 transition-transform duration-300"
              style={{
                backgroundColor: moodData?.color || "#6366f1",
                boxShadow: `0 4px 14px 0 ${moodData?.color || "#6366f1"}40`,
              }}
            >
              <span className="text-sm">{moodData?.emoji}</span>
              <span>{entry.mood}</span>
            </div>
          )}
        </div>

        {/* Title with enhanced styling */}
        <h3 className="text-xl font-bold mb-3 text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors duration-300 relative">
          {entry.title || "Untitled Entry"}
          <div className="absolute -bottom-1 left-0 h-0.5 bg-[var(--accent)] w-0 group-hover:w-full transition-all duration-500 ease-out" />
        </h3>

        {/* Tags with improved design */}
        {entry.tags && entry.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {entry.tags.slice(0, 3).map((tag, index) => (
              <span
                key={tag}
                className="text-xs px-3 py-1 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 transform group-hover:scale-105 transition-transform duration-300"
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                #{tag}
              </span>
            ))}
            {entry.tags.length > 3 && (
              <span className="text-xs px-3 py-1 rounded-full bg-[var(--bg-primary)] text-[var(--text-secondary)] border border-[var(--border)]">
                +{entry.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Content preview with enhanced styling */}
        <div className="flex-1">
          <div className="relative">
            <div
              className="absolute left-0 top-0 w-1 h-full rounded-full opacity-60"
              style={{ backgroundColor: moodData?.color || "var(--accent)" }}
            />
            <p className="text-sm text-[var(--text-secondary)] line-clamp-3 pl-4 leading-relaxed">
              {entry.content || "No content available."}
            </p>
          </div>
        </div>

        {/* Enhanced read more section */}
        <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
          <div className="text-xs text-[var(--text-secondary)]">
            {entry.wordCount ? `${entry.wordCount} words` : ""}
          </div>
          <div className="flex items-center text-[var(--accent)] font-medium text-sm group-hover:gap-2 transition-all duration-300">
            <span>{currentTheme?.readMoreText || "Read more"}</span>
            <span className="transform group-hover:translate-x-1 transition-transform duration-300">
              →
            </span>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-5 transform translate-x-16 -translate-y-16 group-hover:translate-x-12 group-hover:-translate-y-12 transition-transform duration-700">
        <div
          className="w-full h-full rounded-full"
          style={{ backgroundColor: moodData?.color || "var(--accent)" }}
        />
      </div>

      <div className="absolute bottom-0 left-0 w-24 h-24 opacity-5 transform -translate-x-12 translate-y-12 group-hover:-translate-x-8 group-hover:translate-y-8 transition-transform duration-700">
        <div
          className="w-full h-full rounded-full"
          style={{ backgroundColor: moodData?.color || "var(--accent)" }}
        />
      </div>
    </Link>
  );
};

export default JournalCard;
