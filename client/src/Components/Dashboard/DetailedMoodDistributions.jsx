"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Sun,
  Moon,
  ArrowLeft,
  Filter,
  BarChart2,
  PieChart,
  ChevronDown,
  LogOut,
} from "lucide-react";
import { useDarkMode } from "../../context/ThemeContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
  PieChart as RechartsPieChart,
  Pie,
  Legend,
} from "recharts";

const DetailedMoodDistributions = () => {
  const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });
  const { darkMode, setDarkMode } = useDarkMode();
  const [journalEntries, setJournalEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartType, setChartType] = useState("bar"); // 'bar' or 'pie'
  const [showFilters, setShowFilters] = useState(false);

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

  // Filter entries based on selected month and year
  useEffect(() => {
    let filtered = [...journalEntries];

    if (selectedMonth !== "all") {
      filtered = filtered.filter((entry) => {
        const entryDate = new Date(entry.date);
        return (
          entryDate.getMonth() === Number.parseInt(selectedMonth) &&
          entryDate.getFullYear() === selectedYear
        );
      });
    } else if (selectedYear) {
      filtered = filtered.filter((entry) => {
        const entryDate = new Date(entry.date);
        return entryDate.getFullYear() === selectedYear;
      });
    }

    setFilteredEntries(filtered);
  }, [journalEntries, selectedMonth, selectedYear]);

  // Get mood counts for chart
  const getMoodCounts = () => {
    const counts = {};
    moods.forEach((mood) => {
      counts[mood.name] = 0;
    });

    filteredEntries.forEach((entry) => {
      if (entry.mood) {
        counts[entry.mood] = (counts[entry.mood] || 0) + 1;
      }
    });

    return counts;
  };

  // Prepare data for Recharts
  const getMoodChartData = () => {
    const moodCounts = getMoodCounts();
    return moods
      .map((mood) => ({
        name: mood.name,
        emoji: mood.emoji,
        count: moodCounts[mood.name] || 0,
        color: mood.color,
      }))
      .filter((mood) => mood.count > 0); // Only include moods with entries
  };

  // Get available years from journal entries
  const getAvailableYears = () => {
    const years = new Set();
    journalEntries.forEach((entry) => {
      const year = new Date(entry.date).getFullYear();
      years.add(year);
    });
    return Array.from(years).sort((a, b) => b - a); // Sort descending
  };

  // Get mood trends by month
  const getMoodTrendsByMonth = () => {
    const monthlyData = {};

    // Initialize months
    for (let i = 0; i < 12; i++) {
      monthlyData[i] = {
        month: new Date(2000, i, 1).toLocaleString("default", {
          month: "short",
        }),
        Happy: 0,
        Sad: 0,
        Neutral: 0,
        Angry: 0,
        Anxious: 0,
        Tired: 0,
        Reflective: 0,
        Excited: 0,
      };
    }

    // Filter entries for selected year
    const yearEntries = journalEntries.filter(
      (entry) => new Date(entry.date).getFullYear() === selectedYear
    );

    // Count moods by month
    yearEntries.forEach((entry) => {
      if (entry.mood) {
        const month = new Date(entry.date).getMonth();
        monthlyData[month][entry.mood] += 1;
      }
    });

    return Object.values(monthlyData);
  };

  // Logout
  const handleLogout = () => {
    sessionStorage.removeItem("user");
    navigate("/");
  };

  // Custom tooltip for the bar chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div
          className={`p-3 ${
            darkMode ? "bg-[#333333]" : "bg-white"
          } shadow-lg border ${
            darkMode ? "border-[#444444]" : "border-[#EEEEEE]"
          }`}
        >
          <p className="font-medium flex items-center">
            <span className="mr-2">{data.emoji}</span>
            {data.name}
          </p>
          <p className="text-sm mt-1">
            <span className="font-medium">{data.count}</span> entries
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for the pie chart
  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const mood = moods.find((m) => m.name === data.name);

      return (
        <div
          className={`p-3 ${
            darkMode ? "bg-[#333333]" : "bg-white"
          } shadow-lg border ${
            darkMode ? "border-[#444444]" : "border-[#EEEEEE]"
          }`}
        >
          <p className="font-medium flex items-center">
            <span className="mr-2">{mood?.emoji}</span>
            {data.name}
          </p>
          <p className="text-sm mt-1">
            <span className="font-medium">{data.value}</span> entries (
            {((data.value / filteredEntries.length) * 100).toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom legend for pie chart
  const renderCustomLegend = (props) => {
    const { payload } = props;

    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry, index) => {
          const mood = moods.find((m) => m.name === entry.value);
          return (
            <div key={`item-${index}`} className="flex items-center">
              <div
                className="w-3 h-3 mr-2"
                style={{ backgroundColor: entry.color }}
              ></div>
              <span className="text-xs">
                {mood?.emoji} {entry.value}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  // Get month name
  const getMonthName = (monthIndex) => {
    return new Date(2000, monthIndex, 1).toLocaleString("default", {
      month: "long",
    });
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Mood Distribution Analysis
          </h1>
          <p className="opacity-70">
            Track your emotional patterns and gain insights into your mental
            well-being
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {/* <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center px-3 py-2 ${
                darkMode ? "bg-[#2A2A2A]" : "bg-white"
              } border ${darkMode ? "border-[#333333]" : "border-[#DDDDDD]"}`}
            >
              <Filter size={16} className="mr-2 opacity-70" />
              <span>Filters</span>
              <ChevronDown size={16} className="ml-2 opacity-70" />
            </button> */}

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number.parseInt(e.target.value))}
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
              {getAvailableYears().map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
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
              <option value="all">All Months</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i}>
                  {getMonthName(i)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setChartType("bar")}
              className={`px-3 py-2 flex items-center ${
                chartType === "bar"
                  ? darkMode
                    ? "bg-[#F4A261] text-[#1A1A1A]"
                    : "bg-[#E68A41] text-white"
                  : darkMode
                  ? "bg-[#2A2A2A] border-[#333333]"
                  : "bg-white border-[#DDDDDD]"
              } border`}
            >
              <BarChart2 size={16} className="mr-2" />
              Bar Chart
            </button>
            <button
              onClick={() => setChartType("pie")}
              className={`px-3 py-2 flex items-center ${
                chartType === "pie"
                  ? darkMode
                    ? "bg-[#F4A261] text-[#1A1A1A]"
                    : "bg-[#E68A41] text-white"
                  : darkMode
                  ? "bg-[#2A2A2A] border-[#333333]"
                  : "bg-white border-[#DDDDDD]"
              } border`}
            >
              <PieChart size={16} className="mr-2" />
              Pie Chart
            </button>
          </div>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div
            className={`${
              darkMode ? "bg-[#2A2A2A]" : "bg-white"
            } shadow-lg p-8 text-center`}
          >
            <p className="text-lg">Loading mood data...</p>
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

        {/* Chart */}
        {!isLoading && !error && (
          <div
            className={`${
              darkMode ? "bg-[#2A2A2A]" : "bg-white"
            } shadow-lg p-6 mb-8`}
          >
            <div className="mb-4">
              <h2 className="text-xl font-bold">
                {selectedMonth !== "all"
                  ? `Mood Distribution - ${getMonthName(
                      Number.parseInt(selectedMonth)
                    )} ${selectedYear}`
                  : `Mood Distribution - ${selectedYear}`}
              </h2>
              <p className="text-sm opacity-70 mt-1">
                Based on {filteredEntries.length} journal entries
              </p>
            </div>

            <div className="h-[400px] w-full">
              {filteredEntries.length > 0 ? (
                chartType === "bar" ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={getMoodChartData()}
                      margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke={darkMode ? "#333333" : "#EEEEEE"}
                      />
                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        axisLine={{ stroke: darkMode ? "#333333" : "#DDDDDD" }}
                      />
                      <YAxis
                        allowDecimals={false}
                        tickLine={false}
                        axisLine={{ stroke: darkMode ? "#333333" : "#DDDDDD" }}
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ fill: "transparent" }}
                      />
                      <Bar dataKey="count" radius={[2, 2, 0, 0]}>
                        {getMoodChartData().map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.color}
                            opacity={0.8}
                          />
                        ))}
                        <LabelList
                          dataKey="emoji"
                          position="top"
                          style={{ fontSize: "16px" }}
                          offset={10}
                        />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={getMoodChartData().map((item) => ({
                          name: item.name,
                          value: item.count,
                          color: item.color,
                        }))}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {getMoodChartData().map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.color}
                            opacity={0.8}
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomPieTooltip />} />
                      <Legend content={renderCustomLegend} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                )
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-center opacity-70">
                    No mood data available for the selected period
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Monthly Trends */}
        {!isLoading && !error && selectedMonth === "all" && (
          <div
            className={`${
              darkMode ? "bg-[#2A2A2A]" : "bg-white"
            } shadow-lg p-6 mb-8`}
          >
            <div className="mb-4">
              <h2 className="text-xl font-bold">
                Monthly Mood Trends - {selectedYear}
              </h2>
              <p className="text-sm opacity-70 mt-1">
                See how your moods have changed throughout the year
              </p>
            </div>

            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={getMoodTrendsByMonth()}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke={darkMode ? "#333333" : "#EEEEEE"}
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={{ stroke: darkMode ? "#333333" : "#DDDDDD" }}
                  />
                  <YAxis
                    allowDecimals={false}
                    tickLine={false}
                    axisLine={{ stroke: darkMode ? "#333333" : "#DDDDDD" }}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip />
                  <Legend />
                  {moods.map((mood) => (
                    <Bar
                      key={mood.name}
                      dataKey={mood.name}
                      stackId="a"
                      fill={mood.color}
                      opacity={0.8}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Insights */}
        {!isLoading && !error && filteredEntries.length > 0 && (
          <div
            className={`${
              darkMode ? "bg-[#2A2A2A]" : "bg-white"
            } shadow-lg p-6 mb-8`}
          >
            <h2 className="text-xl font-bold mb-4">Mood Insights</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                className={`p-4 ${darkMode ? "bg-[#333333]" : "bg-[#F8F1E9]"}`}
              >
                <h3 className="font-bold mb-2">Most Common Mood</h3>
                {getMoodChartData().length > 0 && (
                  <div className="flex items-center">
                    <span className="text-3xl mr-2">
                      {
                        getMoodChartData().sort((a, b) => b.count - a.count)[0]
                          .emoji
                      }
                    </span>
                    <div>
                      <p className="font-medium">
                        {
                          getMoodChartData().sort(
                            (a, b) => b.count - a.count
                          )[0].name
                        }
                      </p>
                      <p className="text-sm opacity-70">
                        {
                          getMoodChartData().sort(
                            (a, b) => b.count - a.count
                          )[0].count
                        }{" "}
                        entries (
                        {(
                          (getMoodChartData().sort(
                            (a, b) => b.count - a.count
                          )[0].count /
                            filteredEntries.length) *
                          100
                        ).toFixed(1)}
                        %)
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div
                className={`p-4 ${darkMode ? "bg-[#333333]" : "bg-[#F8F1E9]"}`}
              >
                <h3 className="font-bold mb-2">Mood Variety</h3>
                <p className="text-lg">
                  You've experienced {getMoodChartData().length} different moods
                </p>
                <p className="text-sm opacity-70 mt-1">
                  {getMoodChartData().length > 4
                    ? "Great emotional awareness! You're tracking a wide range of emotions."
                    : "Consider tracking more nuanced emotions to gain deeper insights."}
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DetailedMoodDistributions;
