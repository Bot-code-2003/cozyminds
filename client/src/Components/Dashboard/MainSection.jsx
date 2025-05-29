"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  User,
  BookOpen,
  Sparkles,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import StreakCard from "../StreakCard";

const MainSection = ({
  darkMode,
  journalEntries,
  userData,
  wordCountStats,
  formatDate,
}) => {
  const quickActions = [
    {
      to: "/journaling-alt",
      icon: <Plus size={28} />,
      title: "New Entry",
      description: "Start writing today",
      gradient: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
    },
    {
      to: "/profile-settings",
      icon: <User size={28} />,
      title: "Profile",
      description: "Personalize your space",
      gradient: "linear-gradient(135deg, #f97316 0%, #facc15 100%)",
    },
    {
      to: "/collections",
      icon: <BookOpen size={28} />,
      title: "Library",
      description: "Revisit your stories",
      gradient: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
    },
  ];

  return (
    <main className="max-w-6xl mx-auto py-8 md:py-12">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12 text-center relative"
      >
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* <Sparkles size={120} className="text-[var(--accent)]" /> */}
          </motion.div>
        </div>
        <div className="relative">
          <h1 className="text-3xl md:text-5xl font-serif font-bold mb-3 bg-gradient-to-r from-[var(--accent)] to-[var(--text-primary)] bg-clip-text text-transparent">
            Welcome, {userData?.nickname || "Traveler"}
          </h1>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <AnimatePresence>
          {quickActions.map((action, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Link
                to={action.to}
                className="block relative p-6 bg-[var(--bg-secondary)] rounded-xl shadow-md overflow-hidden group"
              >
                {/* Gradient Background */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                  style={{ background: action.gradient }}
                />
                {/* Content */}
                <div className="relative flex flex-col gap-4">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-white"
                    style={{ background: action.gradient }}
                  >
                    {action.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-1">
                      {action.title}
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)]">
                      {action.description}
                    </p>
                  </div>
                </div>
                {/* Subtle Border Animation */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-[var(--accent)]/30 rounded-xl transition-all duration-300" />
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* StreakCard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <StreakCard
          journalEntries={journalEntries}
          wordCountStats={wordCountStats}
        />
      </motion.div>
    </main>
  );
};

export default MainSection;
