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
import { getThemeDetails, getCardClass } from "./ThemeDetails";
import JournalCard from "./JorunalCard";

// Mood options with emojis, descriptions and colors
const MOODS = [
  {
    emoji: "😄",
    name: "Happy",
    description: "Feeling joyful and content",
    color: "#3EACA8",
  },
  {
    emoji: "😐",
    name: "Neutral",
    description: "Neither good nor bad",
    color: "#547AA5",
  },
  {
    emoji: "☹️",
    name: "Sad",
    description: "Feeling down or blue",
    color: "#6A67CE",
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
    color: "#9B72CF",
  },
  {
    emoji: "🥱",
    name: "Tired",
    description: "Low energy or exhausted",
    color: "#718EBC",
  },
  {
    emoji: "🤔",
    name: "Reflective",
    description: "Thoughtful and introspective",
    color: "#5D8A66",
  },
  {
    emoji: "🥳",
    name: "Excited",
    description: "Enthusiastic and energized",
    color: "#F2B147",
  },
];

const JournalEntries = () => {
  const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });
  const { collection } = useParams();
  const decodedCollection = decodeURIComponent(collection || "All");
  const navigate = useNavigate();
  const { darkMode } = useDarkMode();
  const { inventory } = useCoins();

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
          `/journals/${user._id}/collection/${decodedCollection}`
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
        await API.delete(`/journal/${id}`);
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

  // Empty state component
  const EmptyState = () => (
    <div className="p-8 text-center border border-[var(--border)] bg-[var(--bg-secondary)] rounded-xl">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--accent-light)] mb-4">
        <Calendar size={24} className="text-[var(--accent)]" />
      </div>
      <p className="text-[var(--text-primary)] text-lg font-medium mb-2">
        No entries found.
      </p>
      <p className="text-[var(--text-secondary)] mb-6">
        {journalEntries.length
          ? "Try adjusting your filters or search terms."
          : "Start journaling to create your first entry."}
      </p>
      <Link
        to="/journaling-alt"
        className="px-5 py-2.5 bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] rounded-md transition-all duration-300 shadow-md hover:shadow-lg"
      >
        New Entry
      </Link>
    </div>
  );

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
          <h2 className="text-xl font-bold relative inline-block">
            {decodedCollection} Collection
            <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-[var(--accent)] opacity-60 rounded-full"></span>
          </h2>
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
              className="w-full pl-10 pr-4 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
            />
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-3 py-2 border border-[var(--border)] rounded-md hover:bg-[var(--bg-secondary)]"
            >
              <Filter size={16} className="mr-2 opacity-70" />
              <span>Filters</span>
              <ChevronDown size={16} className="ml-2 opacity-70" />
            </button>

            <select
              value={filters.period}
              onChange={(e) => updateFilter("period", e.target.value)}
              className="px-3 py-2 border border-[var(--border)] rounded-md focus:outline-none appearance-none pr-8 text-[var(--text-secondary)]"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </select>

            <button
              onClick={toggleSortOrder}
              className="flex items-center px-3 py-2 border border-[var(--border)] rounded-md hover:bg-[var(--bg-secondary)]"
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
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] p-4 mb-6 rounded-lg animate-fadeIn">
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">Filter by Mood</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => updateFilter("mood", null)}
                  className={`px-3 py-1 text-xs rounded-full ${
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
                    className={`flex items-center px-3 py-1 text-xs rounded-full ${
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
                    className={`px-3 py-1 text-xs rounded-full ${
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
                      className={`flex items-center px-3 py-1 text-xs rounded-full ${
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
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--accent)]"></div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p className="text-lg font-medium mb-2">Error</p>
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
              <EmptyState />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentEntries.map((entry) => (
                  <JournalCard
                    key={entry._id}
                    entry={entry}
                    moods={MOODS}
                    formatDate={formatDate}
                    getThemeDetails={getThemeDetails}
                    getCardClass={getCardClass}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex items-center bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg overflow-hidden">
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

              <div className="mx-4 font-medium">
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
        className="md:hidden fixed bottom-6 right-6 w-12 h-12 bg-[var(--accent)] flex items-center justify-center rounded-full shadow-lg text-white"
      >
        <Calendar size={24} />
      </Link>
    </div>
  );
};

export default JournalEntries;
