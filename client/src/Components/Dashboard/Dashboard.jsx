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
      color: "#70B2C0",
    },
    {
      emoji: "😐",
      name: "Neutral",
      description: "Neither good nor bad",
      color: "#83C5BE",
    },
    {
      emoji: "😔",
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
        const response = await API.get(`/journal/journals/${user._id}`);
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
    <div
      className={`min-h-screen transition-colors duration-300 text-primary bg-[var(--bg-primary)]`}
    >
      <Navbar
        handleLogout={handleLogout}
        name="New Entry"
        link={"/journaling-alt"}
      />
      <MainSection
        darkMode={darkMode}
        journalEntries={journalEntries}
        userData={userData}
        wordCountStats={wordCountStats}
        formatDate={formatDate}
      />
      <MoodDistribution journalEntries={journalEntries} />
      {isLoading && (
        <div>
          <p>Loading journal entries...</p>
        </div>
      )}
      {error && (
        <div>
          <p>Error</p>
          <p className="opacity-70">{error}</p>
        </div>
      )}
      {!isLoading && !error && (
        <RecentJournals
          entries={filteredEntries.slice(0, 3)}
          darkMode={darkMode}
          formatDate={formatDate}
        />
      )}
    </div>
  );
};

export default Dashboard;
