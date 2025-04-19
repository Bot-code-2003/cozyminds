import { Link } from "react-router-dom";

// Mood definitions
const moods = [
  { emoji: "😄", name: "Happy", color: "#70B2C0" },
  { emoji: "😐", name: "Neutral", color: "#83C5BE" },
  { emoji: "😔", name: "Sad", color: "#7A82AB" },
  { emoji: "😡", name: "Angry", color: "#E07A5F" },
  { emoji: "😰", name: "Anxious", color: "#BC96E6" },
  { emoji: "🥱", name: "Tired", color: "#8D99AE" },
  { emoji: "🤔", name: "Reflective", color: "#81B29A" },
  { emoji: "🥳", name: "Excited", color: "#F9C74F" },
];

// Theme icon and text mapping
const themeDetails = {
  theme_forest: {
    icon: "🌲",
    dateIcon: "🍃",
    readMoreText: "Wander deeper",
  },
  theme_ocean: {
    icon: "🐠",
    dateIcon: "🫧",
    readMoreText: "Dive deeper",
  },
  theme_christmas: {
    icon: "🎄",
    dateIcon: "❄️",
    readMoreText: "Unwrap entry",
  },
  theme_halloween: {
    icon: "🎃",
    dateIcon: "👻",
    readMoreText: "Enter if you dare",
  },
  theme_pets: {
    icon: "🐶",
    dateIcon: "🐕",
    readMoreText: "Pet entry",
  },
};

const RecentJournals = ({ entries, darkMode, formatDate }) => {
  const getCardClass = (theme) => {
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

  const getThemeDetails = (theme) => {
    return (
      themeDetails[theme] || {
        icon: "📝",
        dateIcon: "📅",
        readMoreText: "Read more",
      }
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 mb-10 bg-[var(--bg-secondary)] border border-designer rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">
        Recent Journals
      </h2>

      {entries.length === 0 ? (
        <p className="text-[var(--text-secondary)] text-sm">
          No recent journal entries. Start writing to fill this space!
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {entries.map((entry) => {
            const moodData = moods.find((m) => m.name === entry.mood);
            const currentTheme = getThemeDetails(entry.theme);
            const cardClass = getCardClass(entry.theme);

            return (
              <Link
                to={`/journal/${entry._id}`}
                key={entry._id}
                className={`rounded-xl border text-white p-5 hover:shadow-md transition-all duration-200 ${cardClass}`}
              >
                {/* Theme icon indicator */}
                {entry.theme && (
                  <div className="absolute top-3 right-3 opacity-70">
                    <span
                      role="img"
                      aria-label="theme-icon"
                      className="text-lg"
                    >
                      {currentTheme.icon}
                    </span>
                  </div>
                )}

                {/* Title with decorative underline */}
                <h3 className="text-lg font-semibold mb-2 truncate relative">
                  {entry.title || "Untitled Entry"}
                  <span className="absolute bottom-0 left-0 w-16 h-0.5 bg-current opacity-60"></span>
                </h3>

                {/* Date with theme icon */}
                <p className="text-xs mb-3 flex items-center gap-1">
                  <span role="img" aria-label="date" className="text-xs">
                    {currentTheme.dateIcon}
                  </span>
                  {formatDate(entry.date)}
                </p>

                {/* Mood badge with enhanced styling */}
                <div className="flex gap-1">
                  {entry.mood && (
                    <span
                      className="inline-block text-xs font-medium text-white px-2 py-1 rounded-full mb-3 shadow-sm"
                      style={{
                        backgroundColor: moodData?.color || "#2e7d32",
                        border: "1px solid rgba(255,255,255,0.2)",
                      }}
                    >
                      {moodData?.emoji} {entry.mood}
                    </span>
                  )}

                  {/* Tags */}
                  {entry.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {entry.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-0.5 rounded bg-[var(--highlight)]  opacity-80 border border-current/20"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Content Preview with themed divider */}
                <div className="relative">
                  <div className="absolute left-0 top-0 w-1 h-full bg-current/30 rounded"></div>
                  <p className="text-sm line-clamp-3 opacity-90 pl-3">
                    {entry.content || "No content available."}
                  </p>
                </div>

                {/* Read more indicator with theme-specific text */}
                <div className="mt-3 text-xs font-medium flex items-center justify-end theme-accent">
                  <span>{currentTheme.readMoreText}</span>
                  <span className="ml-1">→</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecentJournals;
