"use client";

import { useState, useEffect } from "react";
import { useDarkMode } from "../../context/ThemeContext";
import { useCoins } from "../../context/CoinContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import MainSection from "./MainSection";
import MoodDistribution from "./MoodDistribution";
import RecentJournals from "./RecentJournals";

const Dashboard = () => {
  const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });
  const { darkMode } = useDarkMode();
  const { setCoins, setInventory } = useCoins();
  const [journalEntries, setJournalEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage] = useState(6);

  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const moods = [
    {
      emoji: "😄",
      name: "Happy",
      description: "Feeling joyful and content",
      color: "#4FACFE",
    },
    {
      emoji: "😐",
      name: "Neutral",
      description: "Neither good nor bad",
      color: "#00F2FE",
    },
    {
      emoji: "😔",
      name: "Sad",
      description: "Feeling down or blue",
      color: "#6A7FDB",
    },
    {
      emoji: "😡",
      name: "Angry",
      description: "Frustrated or irritated",
      color: "#FF5E62",
    },
    {
      emoji: "😰",
      name: "Anxious",
      description: "Worried or nervous",
      color: "#B721FF",
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
      color: "#21D4FD",
    },
    {
      emoji: "🥳",
      name: "Excited",
      description: "Enthusiastic and energized",
      color: "#FBAB7E",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const user = JSON.parse(sessionStorage.getItem("user") || "null");
        if (!user) {
          navigate("/login");
          return;
        }

        // Set user data from session storage
        setUserData(user);
        setCoins(user.coins || 0);
        setInventory(user.inventory || []);

        // Fetch journal entries
        const response = await API.get(`/journals/${user._id}`);
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
  }, [navigate, setCoins, setInventory]);

  useEffect(() => {
    let filtered = [...journalEntries];
    if (searchQuery) {
      filtered = filtered.filter(
        (entry) =>
          entry.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          entry.content?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (selectedTag) {
      filtered = filtered.filter((entry) => entry.tags?.includes(selectedTag));
    }
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
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    setFilteredEntries(filtered);
    setCurrentPage(1);
  }, [journalEntries, searchQuery, selectedTag, selectedPeriod]);

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    window.location.href = "/";
  };

  const getWordCountStats = () => {
    if (!journalEntries.length) return { total: 0, average: 0, max: 0 };
    const total = journalEntries.reduce(
      (sum, entry) => sum + (entry.wordCount || 0),
      0
    );
    const average = Math.round(total / journalEntries.length);
    const max = Math.max(
      ...journalEntries.map((entry) => entry.wordCount || 0)
    );
    return { total, average, max };
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

  const wordCountStats = getWordCountStats();

  return (
    <div className="min-h-screen transition-colors duration-300 text-[var(--text-primary)] bg-[var(--bg-primary)]">
      <Navbar
        handleLogout={handleLogout}
        name="New Entry"
        link={"/journaling-alt"}
      />

      <div className="container mx-auto px-4 pb-12">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-pulse space-y-8 w-full max-w-7xl">
              <div className="h-12 bg-[var(--accent)]/20 rounded w-1/3"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="h-56 bg-[var(--accent)]/10 rounded"></div>
                <div className="h-56 bg-[var(--accent)]/10 rounded"></div>
                <div className="h-56 bg-[var(--accent)]/10 rounded"></div>
              </div>
              <div className="h-64 bg-[var(--accent)]/10 rounded"></div>
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="p-8 bg-[var(--bg-secondary)] rounded-lg shadow-lg text-center max-w-md">
              <h2 className="text-2xl mb-4">Unable to Load Dashboard</h2>
              <p className="text-[var(--text-secondary)] mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent)]/80 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        ) : (
          <>
            <MainSection
              darkMode={darkMode}
              journalEntries={journalEntries}
              userData={userData}
              wordCountStats={wordCountStats}
              formatDate={formatDate}
            />
            <MoodDistribution journalEntries={journalEntries} />
            <RecentJournals
              entries={filteredEntries.slice(0, 3)}
              darkMode={darkMode}
              formatDate={formatDate}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
