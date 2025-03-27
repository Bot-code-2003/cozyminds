"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  Sun,
  Moon,
  Calendar,
  Search,
  Filter,
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Tag,
  Trash2,
  Edit,
  Clock,
  LogOut,
  List,
  Grid,
  SortAsc,
  SortDesc,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDarkMode } from "../context/ThemeContext";

const JournalEntries = () => {
  const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });

  const { darkMode, setDarkMode } = useDarkMode();
  const [journalEntries, setJournalEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage] = useState(9);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [sortOrder, setSortOrder] = useState("desc"); // asc or desc

  const navigate = useNavigate();

  // Mood options with emojis, descriptions and colors
  const moods = [
    {
      emoji: "😄",
      name: "Happy",
      description: "Feeling joyful and content",
      color: "#FFB17A",
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

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

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

        // Fetch journal entries from the server
        const response = await API.get(`/journals/${user.id}`);
        setJournalEntries(response.data.journals || []);
        setFilteredEntries(response.data.journals || []);
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
  }, [navigate]);

  // Filter and sort entries
  useEffect(() => {
    let filtered = [...journalEntries];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (entry) =>
          entry.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          entry.content?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by mood
    if (selectedMood) {
      filtered = filtered.filter((entry) => entry.mood === selectedMood);
    }

    // Filter by tag
    if (selectedTag) {
      filtered = filtered.filter(
        (entry) => entry.tags && entry.tags.includes(selectedTag)
      );
    }

    // Filter by period
    if (selectedPeriod !== "all") {
      const now = new Date();
      let startDate;

      switch (selectedPeriod) {
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
    setCurrentPage(1); // Reset to first page when filters change
  }, [
    journalEntries,
    searchQuery,
    selectedMood,
    selectedTag,
    selectedPeriod,
    sortOrder,
  ]);

  // Logout
  const handleLogout = () => {
    sessionStorage.removeItem("user");
    navigate("/");
  };

  // Delete an entry
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
    navigate("/journal-entries");
  };

  // Get all unique tags from entries
  const getAllTags = () => {
    const tags = new Set();
    journalEntries.forEach((entry) => {
      if (entry.tags && entry.tags.length) {
        entry.tags.forEach((tag) => tags.add(tag));
      }
    });
    return Array.from(tags);
  };

  // Format date
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

  // Pagination
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredEntries.slice(
    indexOfFirstEntry,
    indexOfLastEntry
  );
  const totalPages = Math.ceil(filteredEntries.length / entriesPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Get mood color
  const getMoodColor = (moodName) => {
    return moods.find((m) => m.name === moodName)?.color || "#CCCCCC";
  };

  // Get mood emoji
  const getMoodEmoji = (moodName) => {
    return moods.find((m) => m.name === moodName)?.emoji || "😶";
  };

  // All tags
  const allTags = getAllTags();

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <div
      className={`min-h-screen ${
        darkMode
          ? "dark bg-[#1A1A1A] text-[#F8F1E9]"
          : "bg-[#F8F1E9] text-[#1A1A1A]"
      } font-sans transition-colors duration-300`}
    >
      {/* Top navigation bar */}
      <nav
        className={`w-full ${
          darkMode
            ? "bg-[#1A1A1A]/90 backdrop-blur-sm border-b border-[#333333]"
            : "bg-[#F8F1E9]/90 backdrop-blur-sm border-b border-[#DDDDDD]"
        } py-3 px-4 md:px-6 flex justify-between items-center sticky top-0 z-20`}
      >
        <Link to={"/"} className="flex items-center">
          <div className="text-lg font-bold tracking-wider">
            COZY
            <span
              className={`${darkMode ? "text-[#F4A261]" : "text-[#E68A41]"}`}
            >
              MINDS
            </span>
          </div>
        </Link>

        <div className="flex items-center space-x-2 md:space-x-4">
          {userData && (
            <Link
              to="/profile-settings"
              className="hidden md:flex items-center mr-4"
            >
              <div className="w-8 h-8 bg-[#F4A261] flex items-center justify-center text-[#1A1A1A] font-medium mr-2">
                {userData.nickname?.charAt(0).toUpperCase() || "U"}
              </div>
              <span>{userData.nickname || "User"}</span>
            </Link>
          )}

          <button
            onClick={toggleDarkMode}
            className="p-2 hover:text-[#F4A261] transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <Link
            to="/"
            className={`hidden md:flex items-center px-4 py-2 ${
              darkMode
                ? "bg-[#F4A261] text-[#1A1A1A]"
                : "bg-[#E68A41] text-white"
            } hover:opacity-90 transition-opacity`}
          >
            <ArrowLeft size={18} className="mr-2" />
            Back to Dashboard
          </Link>

          <button
            onClick={handleLogout}
            className={`flex items-center px-4 py-2 ${
              darkMode
                ? "border border-[#333333] hover:bg-[#2A2A2A]"
                : "border border-[#DDDDDD] hover:bg-white"
            } transition-colors`}
          >
            <LogOut size={18} />
            <span className="hidden md:inline ml-2">Logout</span>
          </button>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Journal Entries</h1>
            <p className="opacity-70">
              Browse and manage all your journal entries
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <Link
              to="/journaling-alt"
              className={`flex items-center px-4 py-2 ${
                darkMode
                  ? "bg-[#F4A261] text-[#1A1A1A]"
                  : "bg-[#E68A41] text-white"
              } hover:opacity-90 transition-opacity`}
            >
              <Calendar size={18} className="mr-2" />
              New Entry
            </Link>
          </div>
        </div>

        {/* Filters and search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="relative w-full md:w-64">
            <Search
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 opacity-70"
            />
            <input
              type="text"
              placeholder="Search entries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 ${
                darkMode
                  ? "bg-[#2A2A2A] border-[#333333]"
                  : "bg-white border-[#DDDDDD]"
              } border focus:outline-none`}
            />
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center px-3 py-2 ${
                darkMode ? "bg-[#2A2A2A]" : "bg-white"
              } border ${darkMode ? "border-[#333333]" : "border-[#DDDDDD]"}`}
            >
              <Filter size={16} className="mr-2 opacity-70" />
              <span>Filters</span>
              <ChevronDown size={16} className="ml-2 opacity-70" />
            </button>

            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className={`px-3 py-2 ${
                darkMode
                  ? "bg-[#2A2A2A] border-[#333333]"
                  : "bg-white border-[#DDDDDD]"
              } border focus:outline-none appearance-none pr-8 relative`}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 8px center",
              }}
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </select>

            <button
              onClick={toggleSortOrder}
              className={`flex items-center px-3 py-2 ${
                darkMode ? "bg-[#2A2A2A]" : "bg-white"
              } border ${darkMode ? "border-[#333333]" : "border-[#DDDDDD]"}`}
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

            <div className="flex border">
              <button
                onClick={() => setViewMode("grid")}
                className={`flex items-center px-3 py-2 ${
                  viewMode === "grid"
                    ? darkMode
                      ? "bg-[#333333]"
                      : "bg-[#EEEEEE]"
                    : darkMode
                    ? "bg-[#2A2A2A]"
                    : "bg-white"
                }`}
                title="Grid view"
              >
                <Grid size={16} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center px-3 py-2 ${
                  viewMode === "list"
                    ? darkMode
                      ? "bg-[#333333]"
                      : "bg-[#EEEEEE]"
                    : darkMode
                    ? "bg-[#2A2A2A]"
                    : "bg-white"
                }`}
                title="List view"
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Expanded filters */}
        {showFilters && (
          <div
            className={`${
              darkMode ? "bg-[#2A2A2A]" : "bg-white"
            } shadow-lg p-4 mb-6 animate-fadeIn`}
          >
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">Filter by Mood</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedMood(null)}
                  className={`px-3 py-1 text-xs ${
                    !selectedMood
                      ? darkMode
                        ? "bg-[#F4A261] text-[#1A1A1A]"
                        : "bg-[#1A1A1A] text-white"
                      : darkMode
                      ? "bg-[#333333]"
                      : "bg-[#EEEEEE]"
                  }`}
                >
                  All Moods
                </button>
                {moods.map((mood) => (
                  <button
                    key={mood.name}
                    onClick={() => setSelectedMood(mood.name)}
                    className={`flex items-center px-3 py-1 text-xs ${
                      selectedMood === mood.name
                        ? darkMode
                          ? "bg-[#F4A261] text-[#1A1A1A]"
                          : "bg-[#1A1A1A] text-white"
                        : darkMode
                        ? "bg-[#333333]"
                        : "bg-[#EEEEEE]"
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
                    onClick={() => setSelectedTag(null)}
                    className={`px-3 py-1 text-xs ${
                      !selectedTag
                        ? darkMode
                          ? "bg-[#F4A261] text-[#1A1A1A]"
                          : "bg-[#1A1A1A] text-white"
                        : darkMode
                        ? "bg-[#333333]"
                        : "bg-[#EEEEEE]"
                    }`}
                  >
                    All Tags
                  </button>
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(tag)}
                      className={`flex items-center px-3 py-1 text-xs ${
                        selectedTag === tag
                          ? darkMode
                            ? "bg-[#F4A261] text-[#1A1A1A]"
                            : "bg-[#1A1A1A] text-white"
                          : darkMode
                          ? "bg-[#333333]"
                          : "bg-[#EEEEEE]"
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
          <div
            className={`${
              darkMode ? "bg-[#2A2A2A]" : "bg-white"
            } shadow-lg p-8 text-center`}
          >
            <p className="text-lg">Loading journal entries...</p>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div
            className={`${
              darkMode ? "bg-[#2A2A2A]" : "bg-white"
            } shadow-lg p-8 text-center border-l-4 border-red-500`}
          >
            <p className="text-lg mb-2">Error</p>
            <p className="opacity-70">{error}</p>
          </div>
        )}

        {/* Journal entries */}
        {!isLoading && !error && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                All Entries ({filteredEntries.length})
              </h2>
              <div className="text-sm opacity-70">
                Showing {indexOfFirstEntry + 1} -{" "}
                {Math.min(indexOfLastEntry, filteredEntries.length)} of{" "}
                {filteredEntries.length}
              </div>
            </div>

            {filteredEntries.length === 0 ? (
              <div
                className={`${
                  darkMode ? "bg-[#2A2A2A]" : "bg-white"
                } shadow-lg p-8 text-center`}
              >
                <p className="text-lg mb-2">No journal entries found</p>
                <p className="opacity-70">
                  {journalEntries.length === 0
                    ? "Start journaling to see your entries here"
                    : "Try adjusting your filters or search query"}
                </p>
                <Link
                  to="/journaling-alt"
                  className={`inline-flex items-center mt-4 px-4 py-2 ${
                    darkMode
                      ? "bg-[#F4A261] text-[#1A1A1A]"
                      : "bg-[#E68A41] text-white"
                  } hover:opacity-90 transition-opacity`}
                >
                  <Calendar size={18} className="mr-2" />
                  New Entry
                </Link>
              </div>
            ) : viewMode === "grid" ? (
              // Grid view
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentEntries.map((entry) => (
                  <Link
                    to={`/journal/${entry._id}`}
                    key={entry._id}
                    className={`${
                      darkMode ? "bg-[#2A2A2A]" : "bg-white"
                    } shadow-lg p-6 flex flex-col h-full relative group overflow-hidden`}
                  >
                    {/* Mood indicator */}
                    {entry.mood && (
                      <div
                        className="absolute top-0 left-0 w-2 h-full"
                        style={{ backgroundColor: getMoodColor(entry.mood) }}
                      ></div>
                    )}

                    <div className="mb-2 flex justify-between items-start pl-3">
                      <h3 className="text-lg font-bold line-clamp-1 pr-6">
                        {entry.title}
                      </h3>
                      {entry.mood && (
                        <span className="text-xl" title={entry.mood}>
                          {getMoodEmoji(entry.mood)}
                        </span>
                      )}
                    </div>

                    <div className="text-sm opacity-70 mb-3 flex items-center pl-3">
                      <Calendar size={14} className="mr-1" />
                      <span>{formatDate(entry.date)}</span>
                    </div>

                    <p className="line-clamp-4 mb-4 flex-grow opacity-90 pl-3">
                      {entry.content}
                    </p>

                    <div className="mt-auto pl-3">
                      {/* Tags */}
                      {entry.tags && entry.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {entry.tags.map((tag) => (
                            <span
                              key={tag}
                              className={`text-xs px-2 py-0.5 ${
                                darkMode ? "bg-[#333333]" : "bg-[#EEEEEE]"
                              }`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex justify-between items-center text-xs opacity-70">
                        <div className="flex items-center">
                          <Clock size={14} className="mr-1" />
                          <span>{entry.wordCount} words</span>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="absolute bottom-4 right-2 flex space-x-1">
                      {/* <Link
                        to={`/journal/${entry._id}`}
                        className="p-1 hover:text-[#F4A261] transition-colors"
                        title="View entry"
                      >
                        <Edit size={16} />
                      </Link> */}
                      <button
                        onClick={() => deleteEntry(entry._id)}
                        className="p-1 hover:text-red-500 transition-colors"
                        title="Delete entry"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              // List view
              <div
                className={`${
                  darkMode ? "bg-[#2A2A2A]" : "bg-white"
                } shadow-lg`}
              >
                {currentEntries.map((entry, index) => (
                  <Link
                    to={`/journal/${entry._id}`}
                    key={entry._id}
                    className={`p-4 flex flex-col md:flex-row md:items-center gap-4 relative ${
                      index !== currentEntries.length - 1
                        ? `border-b ${
                            darkMode ? "border-[#333333]" : "border-[#EEEEEE]"
                          }`
                        : ""
                    }`}
                  >
                    {/* Mood indicator */}
                    {entry.mood && (
                      <div
                        className="absolute top-0 left-0 w-1 h-full"
                        style={{ backgroundColor: getMoodColor(entry.mood) }}
                      ></div>
                    )}

                    <div className="md:w-5/5 pl-3">
                      <div className="flex items-center">
                        {entry.mood && (
                          <span className="text-xl mr-2" title={entry.mood}>
                            {getMoodEmoji(entry.mood)}
                          </span>
                        )}
                        <h3 className="text-lg font-bold line-clamp-1">
                          {entry.title}
                        </h3>
                      </div>
                      <p className="line-clamp-2 opacity-90 mt-1">
                        {entry.content}
                      </p>
                    </div>

                    <div className="md:w-1/5">
                      {entry.tags && entry.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {entry.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className={`text-xs px-2 py-0.5 ${
                                darkMode ? "bg-[#333333]" : "bg-[#EEEEEE]"
                              }`}
                            >
                              {tag}
                            </span>
                          ))}
                          {entry.tags.length > 3 && (
                            <span className="text-xs opacity-70">
                              +{entry.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-center md:w-1/5">
                      <div className="text-sm opacity-70">
                        <Calendar size={14} className="inline mr-1" />
                        {formatDate(entry.date).split(",")[0]}
                      </div>

                      <div className="flex space-x-2">
                        {/* <Link
                          to={`/journal/${entry._id}`}
                          className="p-1 hover:text-[#F4A261] transition-colors"
                          title="View entry"
                        >
                          <Edit size={16} />
                        </Link> */}
                        <button
                          onClick={() => deleteEntry(entry._id)}
                          className="p-1 hover:text-red-500 transition-colors"
                          title="Delete entry"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </Link>
                ))}
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
                    : "hover:text-[#F4A261]"
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
                    : "hover:text-[#F4A261]"
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
        className={`md:hidden fixed bottom-6 right-6 w-14 h-14 ${
          darkMode ? "bg-[#F4A261]" : "bg-[#E68A41]"
        } flex items-center justify-center shadow-lg`}
      >
        <Calendar
          size={24}
          className={darkMode ? "text-[#1A1A1A]" : "text-white"}
        />
      </Link>

      {/* Custom CSS */}
      <style jsx>{`
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-4 {
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default JournalEntries;
