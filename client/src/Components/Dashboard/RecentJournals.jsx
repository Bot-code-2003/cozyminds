import { Link } from "react-router-dom";
import { getCardClass, getThemeDetails } from "./ThemeDetails.js";
import { useState } from "react";
import JournalCard from "./JorunalCard.jsx";

// Mood definitions with improved color palette
const moods = [
  { emoji: "😄", name: "Happy", color: "#3EACA8" },
  { emoji: "😐", name: "Neutral", color: "#547AA5" },
  { emoji: "😔", name: "Sad", color: "#6A67CE" },
  { emoji: "😡", name: "Angry", color: "#E07A5F" },
  { emoji: "😰", name: "Anxious", color: "#9B72CF" },
  { emoji: "🥱", name: "Tired", color: "#718EBC" },
  { emoji: "🤔", name: "Reflective", color: "#5D8A66" },
  { emoji: "🥳", name: "Excited", color: "#F2B147" },
];

const RecentJournals = ({ entries, darkMode, formatDate }) => {
  // Empty state component
  const EmptyState = () => (
    <div className="grid place-items-center py-16 text-center">
      <div className="w-24 h-24 mb-6 grid place-items-center rounded-full bg-[var(--highlight)] opacity-70">
        <svg
          className="w-12 h-12 text-[var(--text-primary)]"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 18H6V4h2v8l2.5-1.5L13 12V4h5v16z" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold mb-2 text-[var(--text-primary)]">
        No journal entries yet
      </h3>
      <p className="text-[var(--text-secondary)] max-w-md mb-6">
        Capture your thoughts and reflections to see them displayed here.
      </p>
      <Link
        to="/new"
        className="inline-grid grid-flow-col gap-2 items-center bg-[var(--accent)] hover:bg-opacity-90 transition-all duration-200 text-white px-6 py-2 rounded-lg font-medium shadow-sm"
        aria-label="Create your first journal entry"
      >
        <span className="text-lg">+</span> Create First Entry
      </Link>
    </div>
  );

  return (
    <section className="max-w-6xl mx-auto py-8">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-[var(--text-primary)]">
          Recent Journals
        </h2>
        <p className="text-[var(--text-secondary)] mt-1 text-sm sm:text-base">
          {entries.length > 0
            ? `You have ${entries.length} journal ${
                entries.length === 1 ? "entry" : "entries"
              }`
            : "Begin your journaling journey today"}
        </p>
      </header>

      {entries.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
          {entries.map((entry) => (
            <JournalCard
              key={entry._id}
              entry={entry}
              moods={moods}
              formatDate={formatDate}
              getThemeDetails={getThemeDetails}
              getCardClass={getCardClass}
              className="h-full transition-transform duration-200 hover:scale-105"
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default RecentJournals;
