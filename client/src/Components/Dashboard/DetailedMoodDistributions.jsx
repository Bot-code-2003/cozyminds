"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import axios from "axios";
import { BarChart2, PieChart } from "lucide-react";
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
  const { darkMode } = useDarkMode();
  const [journalEntries, setJournalEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartType, setChartType] = useState("bar");
  const [showFilters, setShowFilters] = useState(false);

  const navigate = useNavigate();

  // Mood options with emojis, descriptions, and colors
  const moods = [
    {
      emoji: "😄",
      name: "Happy",
      description: "Joyful and content",
      color: "#70B2C0",
    },
    {
      emoji: "😐",
      name: "Neutral",
      description: "Neither good nor bad",
      color: "#83C5BE",
    },
    { emoji: "😔", name: "Sad", description: "Down or blue", color: "#7A82AB" },
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
      description: "Thoughtful",
      color: "#81B29A",
    },
    {
      emoji: "🥳",
      name: "Excited",
      description: "Enthusiastic",
      color: "#F9C74F",
    },
  ];

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
    moods.forEach((mood) => (counts[mood.name] = 0));
    filteredEntries.forEach((entry) => {
      if (entry.mood) counts[entry.mood] = (counts[entry.mood] || 0) + 1;
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
      .filter((mood) => mood.count > 0);
  };

  // Get available years from journal entries
  const getAvailableYears = () => {
    const years = new Set();
    journalEntries.forEach((entry) =>
      years.add(new Date(entry.date).getFullYear())
    );
    return Array.from(years).sort((a, b) => b - a);
  };

  // Get mood trends by month
  const getMoodTrendsByMonth = () => {
    const monthlyData = {};
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
    const yearEntries = journalEntries.filter(
      (entry) => new Date(entry.date).getFullYear() === selectedYear
    );
    yearEntries.forEach((entry) => {
      if (entry.mood)
        monthlyData[new Date(entry.date).getMonth()][entry.mood] += 1;
    });
    return Object.values(monthlyData);
  };

  // Logout
  const handleLogout = () => {
    sessionStorage.removeItem("user");
    navigate("/");
  };

  // Custom tooltip for bar chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div
          className={`p-4 ${
            darkMode ? "bg-[#252525] " : "bg-[#f0f0f0] "
          } border shadow-elegant`}
        >
          <p
            className={`font-serif text-lg flex items-center ${
              darkMode ? "text-[#f0f0f0]" : "text-[#333333]"
            }`}
          >
            <span className="mr-3 text-2xl">{data.emoji}</span>
            {data.name}
          </p>
          <p
            className={`text-sm font-sans uppercase tracking-wide mt-2 ${
              darkMode ? "text-[#aaaaaa]" : "text-[#666666]"
            }`}
          >
            <span className="font-medium">{data.count}</span> Entries
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for pie chart
  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const mood = moods.find((m) => m.name === data.name);
      return (
        <div
          className={`p-4 ${
            darkMode ? "bg-[#252525] " : "bg-[#f0f0f0] "
          } border shadow-elegant`}
        >
          <p
            className={`font-serif text-lg flex items-center ${
              darkMode ? "text-[#f0f0f0]" : "text-[#333333]"
            }`}
          >
            <span className="mr-3 text-2xl">{mood?.emoji}</span>
            {data.name}
          </p>
          <p
            className={`text-sm font-sans uppercase tracking-wide mt-2 ${
              darkMode ? "text-[#aaaaaa]" : "text-[#666666]"
            }`}
          >
            <span className="font-medium">{data.value}</span> Entries (
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
      <div className="flex flex-wrap justify-center gap-4 mt-6">
        {payload.map((entry, index) => {
          const mood = moods.find((m) => m.name === entry.value);
          return (
            <div key={`item-${index}`} className="flex items-center">
              <div
                className="w-4 h-4 mr-2"
                style={{ backgroundColor: entry.color }}
              ></div>
              <span
                className={`text-sm ${
                  darkMode ? "text-[#aaaaaa]" : "text-[#666666]"
                }`}
              >
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
        darkMode ? "bg-[#1a1a1a]" : "bg-[#f8f8f8]"
      } font-sans transition-colors duration-300`}
    >
      {/* Top navigation bar */}
      <Navbar
        handleLogout={handleLogout}
        name="New Entry"
        link="/journaling-alt"
      />

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header section */}
        <div className="mb-8">
          <h1
            className={`text-3xl font-serif ${
              darkMode ? "text-text" : "text-text"
            }`}
          >
            Mood Analysis
          </h1>
          <p
            className={`mt-2 text-sm ${
              darkMode ? "text-secondary-custom" : "text-secondary-custom"
            }`}
          >
            Visualize your emotional patterns
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex flex-wrap gap-4 w-full md:w-auto">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number.parseInt(e.target.value))}
              className={`px-3 py-2 text-sm ${
                darkMode
                  ? "bg-card border border-border text-text"
                  : "bg-card border border-border text-text"
              } border focus:outline-none appearance-none pr-8 rounded-lg`}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='${
                  darkMode ? "%23aaaaaa" : "%23666666"
                }' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
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
              className={`px-3 py-2 text-sm ${
                darkMode
                  ? "bg-card border border-border text-text"
                  : "bg-card border border-border text-text"
              } border focus:outline-none appearance-none pr-8 rounded-lg`}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='${
                  darkMode ? "%23aaaaaa" : "%23666666"
                }' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
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
          <div className="flex gap-4">
            <button
              onClick={() => setChartType("bar")}
              className={`px-3 py-2 flex items-center text-sm border rounded-lg ${
                chartType === "bar"
                  ? darkMode
                    ? "bg-accent text-white"
                    : "bg-accent text-white"
                  : darkMode
                  ? "bg-card border border-border text-text"
                  : "bg-card border border-border text-text"
              } transition-colors duration-200`}
            >
              <BarChart2 size={16} className="mr-2" />
              Bar Chart
            </button>
            <button
              onClick={() => setChartType("pie")}
              className={`px-3 py-2 flex items-center text-sm border rounded-lg ${
                chartType === "pie"
                  ? darkMode
                    ? "bg-accent text-white"
                    : "bg-accent text-white"
                  : darkMode
                  ? "bg-card border border-border text-text"
                  : "bg-card border border-border text-text"
              } transition-colors duration-200`}
            >
              <PieChart size={16} className="mr-2" />
              Pie Chart
            </button>
          </div>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div
            className={`p-6 ${
              darkMode ? "bg-[#252525] " : "bg-[#f0f0f0] "
            } border shadow-elegant text-center`}
          >
            <p
              className={`text-lg ${
                darkMode ? "text-[#f0f0f0]" : "text-[#333333]"
              } animate-pulse`}
            >
              Loading data...
            </p>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div
            className={`p-6 ${
              darkMode ? "bg-[#252525] " : "bg-[#f0f0f0] "
            } border shadow-elegant text-center`}
          >
            <p
              className={`text-lg ${
                darkMode ? "text-[#f0f0f0]" : "text-[#333333]"
              }`}
            >
              Error
            </p>
            <p
              className={`text-sm mt-2 ${
                darkMode ? "text-[#aaaaaa]" : "text-[#666666]"
              }`}
            >
              {error}
            </p>
          </div>
        )}

        {/* Chart */}
        {!isLoading && !error && (
          <div
            className={`p-6 mb-8 ${
              darkMode ? "bg-card" : "bg-card"
            } border shadow-elegant rounded-xl`}
          >
            <div>
              <div className="mb-4">
                <h2
                  className={`text-xl ${darkMode ? "text-text" : "text-text"}`}
                >
                  {selectedMonth !== "all"
                    ? `${getMonthName(
                        Number.parseInt(selectedMonth)
                      )} ${selectedYear}`
                    : `${selectedYear} Overview`}
                </h2>
                <p
                  className={`text-sm mt-1 ${
                    darkMode ? "text-secondary-custom" : "text-secondary-custom"
                  }`}
                >
                  Based on {filteredEntries.length} entries
                </p>
              </div>
              <div className="h-[400px] w-full">
                {filteredEntries.length > 0 ? (
                  chartType === "bar" ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={getMoodChartData()}
                        margin={{ top: 30, right: 30, left: 20, bottom: 40 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke={darkMode ? "var(--border)" : "var(--border)"}
                        />
                        <XAxis
                          dataKey="name"
                          tick={{
                            fill: darkMode
                              ? "var(--text-secondary)"
                              : "var(--text-secondary)",
                            fontSize: 12,
                          }}
                          tickLine={false}
                          axisLine={{
                            stroke: darkMode
                              ? "var(--border)"
                              : "var(--border)",
                          }}
                        />
                        <YAxis
                          allowDecimals={false}
                          tickLine={false}
                          axisLine={{
                            stroke: darkMode
                              ? "var(--border)"
                              : "var(--border)",
                          }}
                          tick={{
                            fill: darkMode
                              ? "var(--text-secondary)"
                              : "var(--text-secondary)",
                            fontSize: 12,
                          }}
                        />
                        <Tooltip
                          content={<CustomTooltip />}
                          cursor={{ fill: "transparent" }}
                        />
                        <Bar dataKey="count" radius={[5, 5, 0, 0]}>
                          {getMoodChartData().map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={entry.color}
                              opacity={1}
                            />
                          ))}
                          <LabelList
                            dataKey="emoji"
                            position="top"
                            style={{ fontSize: "20px" }}
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
                          outerRadius={140}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {getMoodChartData().map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={entry.color}
                              opacity={1}
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
                    <p
                      className={`text-sm italic ${
                        darkMode
                          ? "text-secondary-custom"
                          : "text-secondary-custom"
                      }`}
                    >
                      No mood data available for this period...
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Monthly Trends */}
        {!isLoading && !error && selectedMonth === "all" && (
          <div
            className={`p-6 mb-8 ${
              darkMode ? "bg-[#252525] " : "bg-[#f0f0f0] "
            } border shadow-elegant`}
          >
            <div>
              <div className="mb-4">
                <h2
                  className={`text-xl ${
                    darkMode ? "text-[#f0f0f0]" : "text-[#333333]"
                  }`}
                >
                  {selectedYear} Monthly Trends
                </h2>
                <p
                  className={`text-sm mt-1 ${
                    darkMode ? "text-[#aaaaaa]" : "text-[#666666]"
                  }`}
                >
                  Mood distribution across months
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
                      stroke={darkMode ? "#333333" : "#e0e0e0"}
                    />
                    <XAxis
                      dataKey="month"
                      tick={{
                        fill: darkMode ? "#aaaaaa" : "#666666",
                        fontSize: 12,
                      }}
                      tickLine={false}
                      axisLine={{ stroke: darkMode ? "#333333" : "#e0e0e0" }}
                    />
                    <YAxis
                      allowDecimals={false}
                      tickLine={false}
                      axisLine={{ stroke: darkMode ? "#333333" : "#e0e0e0" }}
                      tick={{
                        fill: darkMode ? "#aaaaaa" : "#666666",
                        fontSize: 12,
                      }}
                    />
                    <Tooltip />
                    <Legend />
                    {moods.map((mood) => (
                      <Bar
                        key={mood.name}
                        dataKey={mood.name}
                        stackId="a"
                        fill={mood.color}
                        opacity={1}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Insights */}
        {!isLoading && !error && filteredEntries.length > 0 && (
          <div
            className={`p-6 ${
              darkMode ? "bg-card" : "bg-card"
            } border shadow-elegant rounded-xl`}
          >
            <div>
              <h2
                className={`text-xl mb-4 ${
                  darkMode ? "text-text" : "text-text"
                }`}
              >
                Mood Insights
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div
                  className={`p-4 ${
                    darkMode
                      ? "bg-bg border border-border"
                      : "bg-bg border border-border"
                  } border rounded-lg`}
                >
                  <h3
                    className={`text-lg mb-2 ${
                      darkMode ? "text-text" : "text-text"
                    }`}
                  >
                    Dominant Mood
                  </h3>
                  {getMoodChartData().length > 0 && (
                    <div className="flex items-center">
                      <span className="text-3xl mr-3">
                        {
                          getMoodChartData().sort(
                            (a, b) => b.count - a.count
                          )[0].emoji
                        }
                      </span>
                      <div>
                        <p
                          className={`text-lg ${
                            darkMode ? "text-text" : "text-text"
                          }`}
                        >
                          {
                            getMoodChartData().sort(
                              (a, b) => b.count - a.count
                            )[0].name
                          }
                        </p>
                        <p
                          className={`text-sm ${
                            darkMode
                              ? "text-secondary-custom"
                              : "text-secondary-custom"
                          }`}
                        >
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
                  className={`p-4 ${
                    darkMode
                      ? "bg-bg border border-border"
                      : "bg-bg border border-border"
                  } border rounded-lg`}
                >
                  <h3
                    className={`text-lg mb-2 ${
                      darkMode ? "text-text" : "text-text"
                    }`}
                  >
                    Mood Variety
                  </h3>
                  <p
                    className={`text-lg ${
                      darkMode ? "text-text" : "text-text"
                    }`}
                  >
                    {getMoodChartData().length} different moods
                  </p>
                  <p
                    className={`text-sm mt-1 ${
                      darkMode
                        ? "text-secondary-custom"
                        : "text-secondary-custom"
                    }`}
                  >
                    {getMoodChartData().length > 4
                      ? "You've experienced a wide range of emotions."
                      : "Consider tracking more mood variations."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DetailedMoodDistributions;
