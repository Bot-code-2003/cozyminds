"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BarChart2 } from "lucide-react";
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

  // Filter entries to only show current month
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
  }, [journalEntries]);

  // Mood options with emojis, descriptions, and colors
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

  // Get mood counts for chart
  const getMoodCounts = () => {
    const counts = {};
    moods.forEach((mood) => {
      counts[mood.name] = 0;
    });

    currentMonthEntries.forEach((entry) => {
      if (entry.mood) {
        counts[entry.mood] = (counts[entry.mood] || 0) + 1;
      }
    });

    return counts;
  };

  // Prepare data for Recharts
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

  // Custom tooltip for the bar chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className={`p-4 border shadow-elegant `}>
          <p className={` text-lg flex items-center`}>
            <span className="mr-3 text-2xl">{data.emoji}</span>
            {data.name}
          </p>
          <p
            className={`text-sm font-sans uppercase tracking-wide mt-2 text-[var(--text-secondary)]`}
          >
            <span className="font-medium">{data.count}</span> Entries
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-0 py-8 ">
      <div
        className={`p-6 border-designer bg-[var(--bg-secondary)] border shadow-elegant`}
      >
        <div>
          <div className="flex justify-between items-center mb-6 ">
            <h2 className={`text-2xl`}>
              {getCurrentMonthName()}'s Mood Summary
            </h2>
            <div className="flex items-center gap-4 ">
              <Link
                to="/mood-distributions"
                className={`px-3 py-1 border text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white flex items-center transition-colors duration-200`}
              >
                <BarChart2 size={16} className="mr-2" />
                Full Analysis
              </Link>
            </div>
          </div>

          <div className="h-[280px] w-full">
            {currentMonthEntries.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={getMoodChartData()}
                  margin={{ top: 30, right: 30, left: 20, bottom: 40 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke={"text-[var(--border)]"}
                  />
                  <XAxis
                    dataKey="name"
                    tick={false}
                    axisLine={{ stroke: "text-[var(--border)]" }}
                  />
                  <YAxis
                    allowDecimals={false}
                    tickLine={false}
                    axisLine={{ stroke: "text-[var(--border)]" }}
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: "transparent" }}
                  />
                  <Bar dataKey="count" className="cursor-pointer">
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
              <div className="h-full flex items-center justify-center">
                <p className={`text-sm italic text-[var(--text-secondary)]`}>
                  No mood data for {getCurrentMonthName()} yet...
                </p>
              </div>
            )}
          </div>

          <div
            className={`text-xs mt-4 text-center text-[var(--text-secondary)]`}
          >
            Based on {currentMonthEntries.length} entries this month. Click a
            bar to filter.
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoodDistribution;
