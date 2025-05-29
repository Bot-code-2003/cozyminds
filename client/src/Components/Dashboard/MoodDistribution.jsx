"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BarChart2, Calendar } from "lucide-react";
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
} from "recharts";

const MoodDistribution = ({ journalEntries }) => {
  const { darkMode } = useDarkMode();
  const [currentMonthEntries, setCurrentMonthEntries] = useState([]);
  const [animationKey, setAnimationKey] = useState(0);

  // Filter entries for current month
  useEffect(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const filtered = journalEntries.filter((entry) => {
      const entryDate = new Date(entry.date);
      return (
        entryDate.getMonth() === currentMonth &&
        entryDate.getFullYear() === currentYear
      );
    });

    setCurrentMonthEntries(filtered);
    setAnimationKey((prev) => prev + 1);
  }, [journalEntries]);

  // Mood options
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

  // Get mood counts
  const getMoodCounts = () => {
    const counts = {};
    moods.forEach((mood) => (counts[mood.name] = 0));
    currentMonthEntries.forEach((entry) => {
      if (entry.mood) counts[entry.mood] = (counts[entry.mood] || 0) + 1;
    });
    return counts;
  };

  // Prepare chart data
  const getMoodChartData = () => {
    const moodCounts = getMoodCounts();
    return moods.map((mood) => ({
      name: mood.name,
      emoji: mood.emoji,
      count: moodCounts[mood.name] || 0,
      color: mood.color,
    }));
  };

  // Get current month name
  const getCurrentMonthName = () => {
    return new Date().toLocaleString("default", { month: "long" });
  };

  // Simplified tooltip for mobile
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="p-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg shadow-md">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{data.emoji}</span>
            <span className="font-medium text-[var(--text-primary)]">
              {data.name}: {data.count} {data.count === 1 ? "entry" : "entries"}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  const totalEntries = currentMonthEntries.length;
  const dominantMood = getMoodChartData().reduce(
    (prev, current) => (prev.count > current.count ? prev : current),
    { count: 0 }
  );

  return (
    <div className="max-w-6xl mx-auto py-6">
      <div className="p-6 bg-[var(--bg-secondary)] rounded-2xl shadow-md">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">
            {getCurrentMonthName()} Mood
          </h2>
          {totalEntries > 0 && (
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              {totalEntries} {totalEntries === 1 ? "entry" : "entries"}
              {dominantMood.count > 0 && (
                <>
                  {" "}
                  • Mostly {dominantMood.emoji}{" "}
                  {dominantMood.name.toLowerCase()}
                </>
              )}
            </p>
          )}
        </div>

        {/* Chart */}
        <div className="h-[300px] w-full mb-6">
          {totalEntries > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                key={animationKey}
                data={getMoodChartData()}
                margin={{ top: 30, right: 10, left: -10, bottom: 30 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke={
                    darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"
                  }
                />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fill: "var(--text-secondary)" }}
                  angle={-45}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "var(--text-secondary)" }}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "transparent" }}
                />
                <Bar
                  dataKey="count"
                  radius={[4, 4, 0, 0]}
                  animationDuration={800}
                >
                  {getMoodChartData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
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
            <div className="h-full flex flex-col items-center justify-center text-center">
              <Calendar
                size={40}
                className="text-[var(--text-secondary)] opacity-50 mb-4"
              />
              <p className="text-[var(--text-secondary)] mb-4">
                No mood data for {getCurrentMonthName()}
              </p>
              <Link
                to="/journaling-alt"
                className="flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent)]/80 transition-all"
              >
                <span>Start Journaling</span>
                <span>→</span>
              </Link>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {totalEntries > 0 && (
          <div className="flex justify-center">
            <Link
              to="/mood-distributions"
              className="flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent)]/80 transition-all"
            >
              <BarChart2 size={16} />
              <span>View Full Analysis</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoodDistribution;
