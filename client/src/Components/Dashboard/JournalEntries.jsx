"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  Calendar,
  Search,
  Filter,
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Tag,
  SortAsc,
  SortDesc,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDarkMode } from "../../context/ThemeContext";
import { useCoins } from "../../context/CoinContext";
import Navbar from "./Navbar";

// Mood options with emojis, descriptions and colors
const MOODS = [
  {
    emoji: "😄",
    name: "Happy",
    description: "Feeling joyful and content",
    color: "#70B2C0",
  },
  {
    emoji: "😐",
    name: "Neutral",
    description: "Neither good nor bad",
    color: "#83C5BE",
  },
  {
    emoji: "☹️",
    name: "Sad",
    description: "Feeling down or blue",
    color: "#7A82AB",
  },
  {
    emoji: "😡",
    name: "Angry",
    description: "Frustrated or irritated",
    color: "#E07A5F",
  },
  {
    emoji: "😰",
    name: "Anxious",
    description: "Worried or nervous",
    color: "#BC96E6",
  },
  {
    emoji: "🥱",
    name: "Tired",
    description: "Low energy or exhausted",
    color: "#8D99AE",
  },
  {
    emoji: "🤔",
    name: "Reflective",
    description: "Thoughtful and introspective",
    color: "#81B29A",
  },
  {
    emoji: "🥳",
    name: "Excited",
    description: "Enthusiastic and energized",
    color: "#F9C74F",
  },
];

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

const JournalEntries = () => {
  const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });
  const { collection } = useParams();
  const decodedCollection = decodeURIComponent(collection || "All");
  const navigate = useNavigate();
  const { darkMode } = useDarkMode();
  const { inventory } = useCoins();

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

  // State management
  const [journalEntries, setJournalEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [filters, setFilters] = useState({
    period: "all",
    query: "",
    mood: null,
    tag: null,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [sortOrder, setSortOrder] = useState("desc");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    entriesPerPage: 9,
  });
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user data and journal entries
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const user = JSON.parse(sessionStorage.getItem("user") || "null");
        setUserData(user);

        if (!user) {
          navigate("/login");
          return;
        }

        const response = await API.get(
          `/journal/journals/${user._id}/collection/${decodedCollection}`
        );
        const journals = response.data.journals || [];
        setJournalEntries(journals);
        setFilteredEntries(journals);
      } catch (err) {
        console.error("Error fetching journal entries:", err);
        setError("Failed to load journal entries. Please try again later.");
        setJournalEntries([]);
        setFilteredEntries([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate, decodedCollection]);

  // Filter and sort entries
  useEffect(() => {
    let filtered = [...journalEntries];
    const { period, query, mood, tag } = filters;

    // Apply filters
    if (query) {
      filtered = filtered.filter(
        (entry) =>
          entry.title?.toLowerCase().includes(query.toLowerCase()) ||
          entry.content?.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (mood) {
      filtered = filtered.filter((entry) => entry.mood === mood);
    }

    if (tag) {
      filtered = filtered.filter(
        (entry) => entry.tags && entry.tags.includes(tag)
      );
    }

    if (period !== "all") {
      const now = new Date();
      let startDate;

      switch (period) {
        case "today":
          startDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case "week":
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case "month":
          startDate = new Date(now.setMonth(now.getMonth() - 1));
          break;
        default:
          startDate = null;
      }

      if (startDate) {
        filtered = filtered.filter(
          (entry) => new Date(entry.date) >= startDate
        );
      }
    }

    // Sort by date
    filtered.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    setFilteredEntries(filtered);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  }, [journalEntries, filters, sortOrder]);

  // Helper functions
  const handleLogout = () => {
    sessionStorage.removeItem("user");
    navigate("/");
  };

  const deleteEntry = async (id) => {
    if (window.confirm("Are you sure you want to delete this journal entry?")) {
      try {
        await API.delete(`/journal/journal/${id}`);
        setJournalEntries((prevEntries) =>
          prevEntries.filter((entry) => entry._id !== id)
        );
      } catch (err) {
        console.error("Error deleting entry:", err);
        alert("Failed to delete entry. Please try again.");
      }
    }
  };

  const getAllTags = () => {
    const tags = new Set();
    journalEntries.forEach((entry) => {
      if (entry.tags && entry.tags.length) {
        entry.tags.forEach((tag) => tags.add(tag));
      }
    });
    return Array.from(tags);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getMoodDetail = (moodName, property) => {
    const mood = MOODS.find((m) => m.name === moodName);
    return mood ? mood[property] : property === "color" ? "#CCCCCC" : "😶";
  };

  const toggleSortOrder = () =>
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Pagination
  const { currentPage, entriesPerPage } = pagination;
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredEntries.slice(
    indexOfFirstEntry,
    indexOfLastEntry
  );
  const totalPages = Math.ceil(filteredEntries.length / entriesPerPage);

  const paginate = (pageNumber) => {
    setPagination((prev) => ({ ...prev, currentPage: pageNumber }));
  };

  const allTags = getAllTags();

  return (
    <div>
      {/* Top navigation bar */}
      <Navbar
        userData={userData}
        handleLogout={handleLogout}
        name="New Entry"
        link="/journaling-alt"
      />

      {/* Main content */}
      <main className="max-w-7xl mt-10 mb-20 mx-auto py-3 px-6 transition-colors duration-300">
        {/* Header section */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl mb-2">Journal Entries</h1>
          <p className="text-[var(--text-secondary)]">
            Browse and manage your journal entries
          </p>
        </div>

        {/* Back to collections button */}
        <Link
          to="/collections"
          className="flex items-center mb-6 text-[var(--accent)] hover:underline"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Collections
        </Link>

        <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between">
          <h2 className="text-xl font-bold">{decodedCollection} Collection</h2>
        </div>

        {/* Filters and search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="relative w-full md:w-64">
            <Search
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 opacity-70"
            />
            <input
              type="text"
              placeholder="Search entries..."
              value={filters.query}
              onChange={(e) => updateFilter("query", e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[var(--border)] focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-3 py-2 border border-[var(--border)]"
            >
              <Filter size={16} className="mr-2 opacity-70" />
              <span>Filters</span>
              <ChevronDown size={16} className="ml-2 opacity-70" />
            </button>

            <select
              value={filters.period}
              onChange={(e) => updateFilter("period", e.target.value)}
              className="px-3 py-2 border border-[var(--border)] focus:outline-none appearance-none pr-8 text-[var(--text-secondary)]"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </select>

            <button
              onClick={toggleSortOrder}
              className="flex items-center px-3 py-2 border border-[var(--border)]"
              title={sortOrder === "desc" ? "Newest first" : "Oldest first"}
            >
              {sortOrder === "desc" ? (
                <SortDesc size={16} className="mr-2 opacity-70" />
              ) : (
                <SortAsc size={16} className="mr-2 opacity-70" />
              )}
              <span className="hidden md:inline">
                {sortOrder === "desc" ? "Newest" : "Oldest"}
              </span>
            </button>
          </div>
        </div>

        {/* Expanded filters */}
        {showFilters && (
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] p-4 mb-6 animate-fadeIn">
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">Filter by Mood</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => updateFilter("mood", null)}
                  className={`px-3 py-1 text-xs border ${
                    !filters.mood
                      ? "bg-[var(--accent)] text-white"
                      : "bg-[var(--bg-secondary)] border border-[var(--border)]"
                  }`}
                >
                  All Moods
                </button>
                {MOODS.map((mood) => (
                  <button
                    key={mood.name}
                    onClick={() => updateFilter("mood", mood.name)}
                    className={`flex items-center px-3 py-1 text-xs border ${
                      filters.mood === mood.name
                        ? "bg-[var(--accent)] text-white"
                        : "bg-[var(--bg-secondary)] border-[var(--border)]"
                    }`}
                  >
                    <span className="mr-1">{mood.emoji}</span>
                    <span>{mood.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {allTags.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2">Filter by Tag</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => updateFilter("tag", null)}
                    className={`px-3 py-1 text-xs border ${
                      !filters.tag
                        ? "bg-[var(--accent)] text-white"
                        : "bg-[var(--bg-secondary)] border-[var(--border)]"
                    }`}
                  >
                    All Tags
                  </button>
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => updateFilter("tag", tag)}
                      className={`flex items-center px-3 py-1 text-xs border ${
                        filters.tag === tag
                          ? "bg-[var(--accent)] text-white"
                          : "bg-[var(--bg-secondary)] border-[var(--border)]"
                      }`}
                    >
                      <Tag size={12} className="mr-1 opacity-70" />
                      <span>{tag}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Loading state */}
        {isLoading && <p className="text-lg">Loading journal entries...</p>}

        {/* Error state */}
        {error && (
          <div>
            <p className="text-lg mb-2">Error</p>
            <p className="text-[var(--text-secondary)]">{error}</p>
          </div>
        )}

        {/* Journal entries */}
        {!isLoading && !error && (
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-4">
              Entries ({filteredEntries.length})
            </h2>
            {filteredEntries.length === 0 ? (
              <div className="p-6 text-center border border-[var(--border)] bg-[var(--bg-secondary)] rounded-xl">
                <p className="text-[var(--text-primary)] mb-2">
                  No entries found.
                </p>
                <p className="text-[var(--text-secondary)] mb-4">
                  {journalEntries.length
                    ? "Adjust filters or search."
                    : "Start journaling."}
                </p>
                <Link
                  to="/journaling-alt"
                  className="px-4 py-2 border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--text-primary)] rounded"
                >
                  New Entry
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentEntries.map((entry) => {
                  const moodData = MOODS.find((m) => m.name === entry.mood);
                  const currentTheme = getThemeDetails(entry.theme);
                  const cardClass = getCardClass(entry.theme);

                  return (
                    <Link
                      to={`/journal/${entry._id}`}
                      key={entry._id}
                      className={`rounded-xl border p-5 hover:shadow-md transition-all duration-200 ${cardClass}`}
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
                      <p className="text-xs  mb-3 flex items-center gap-1">
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
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex items-center">
              <button
                onClick={() => paginate(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`p-2 ${
                  currentPage === 1
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:text-[var(--accent)]"
                }`}
              >
                <ArrowLeft size={16} />
              </button>

              <div className="mx-4">
                Page {currentPage} of {totalPages}
              </div>

              <button
                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`p-2 ${
                  currentPage === totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:text-[var(--accent)]"
                }`}
              >
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Mobile action button */}
      <Link
        to="/journaling-alt"
        className="md:hidden fixed bottom-6 right-6 w-12 h-12 bg-[var(--accent)] flex items-center justify-center shadow-elegant"
      >
        <Calendar size={24} className="text-white" />
      </Link>
    </div>
  );
};

export default JournalEntries;
