"use client";

import { useState, useEffect } from "react";
import { useDarkMode } from "../../context/ThemeContext";
import { useLocation, Link } from "react-router-dom";
import storyData from "../../data/stories.json";

const CozyStory = () => {
  const { darkMode } = useDarkMode();
  const location = useLocation();
  const isHome = location.pathname === "/";

  // State to store user data and loading/error states
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [animate, setAnimate] = useState(false);

  // Default user data if nothing exists in localStorage
  const defaultUserData = {
    id: "67e505f4aa1c2142b1168a5e",
    nickname: "admin",
    email: "admin@gmail.com",
    age: 22,
    gender: "male",
    subscribe: true,
    currentStreak: 0,
    longestStreak: 0,
    storyVisitCount: 15,
    storiesCompleted: 1,
    lastVisited: "2025-03-26T18:30:00.000Z",
  };

  // Load user data from localStorage when component mounts
  useEffect(() => {
    const loadUserData = () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUserData(JSON.parse(storedUser));
        } else {
          // If no data exists, set default data and store it
          setUserData(defaultUserData);
          localStorage.setItem("user", JSON.stringify(defaultUserData));
        }
        setLoading(false);

        // Trigger animation after data loads
        setTimeout(() => setAnimate(true), 100);
      } catch (err) {
        setError(err?.message || "Failed to load user data from local storage");
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Get current story data based on user's progress
  const getCurrentStoryData = () => {
    if (!userData) return storyData.default;

    // Calculate current story and progress
    const completedStories = userData.storiesCompleted || 0;
    const currentStoryIndex = completedStories;
    const storyProgress = userData.storyVisitCount || 0;

    // If we have this story in our data
    if (storyData.stories[currentStoryIndex]) {
      const storyItem =
        storyData.stories[currentStoryIndex].items.find(
          (item) => storyProgress <= item.visitMax
        ) || storyData.stories[currentStoryIndex].items[0];
      return storyItem;
    }

    return storyData.default;
  };

  const currentStoryData = getCurrentStoryData();

  // Calculate story progress percentage
  const getStoryPercentage = () => {
    if (!userData) return 0;
    const storyProgress = userData.storyVisitCount || 0;
    return ((storyProgress % 30) / 30) * 100;
  };

  // Loading state
  if (loading) {
    return (
      <div
        className={`p-6 border transition-all duration-300 shadow-sm ${
          darkMode
            ? "bg-[#1F1F1F] border-[#333333] text-[#F8F1E9]"
            : "bg-[#FFFAF5] border-[#F0E6DD] text-[#5C4B3F]"
        }`}
      >
        <div className="flex items-center justify-center h-24">
          <div className="flex space-x-2">
            <div className="h-2 w-2 rounded-full bg-[#E9C19D] animate-bounce"></div>
            <div
              className="h-2 w-2 rounded-full bg-[#E9C19D] animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
            <div
              className="h-2 w-2 rounded-full bg-[#E9C19D] animate-bounce"
              style={{ animationDelay: "0.4s" }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div
        className={`p-6 border transition-all duration-300 shadow-sm ${
          darkMode
            ? "bg-[#2A2A2A] border-[#333333] text-[#F8F1E9]"
            : "bg-[#FFFFFF] border-[#F0E6DD] text-[#5C4B3F]"
        }`}
      >
        <div className="text-center py-4">
          <p className="text-sm opacity-70">Unable to load your journey</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`p-6 border transition-all duration-500 shadow-md ${
        darkMode
          ? "bg-[#2A2A2A] border-[#333333] text-[#F8F1E9]"
          : "bg-[#FFFFFF] border-[#F0E6DD] text-[#5C4B3F]"
      } ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
    >
      <div className="flex flex-col items-center text-center">
        {/* Library button for completed stories */}
        {userData?.storiesCompleted > 0 && (
          <div className="w-full mb-4">
            <Link
              to="/library"
              className={`text-xs px-3 py-1.5 ${
                darkMode ? "bg-[#333333]" : "bg-[#F0E6DD]"
              } hover:opacity-80 transition-opacity flex items-center justify-center w-full`}
            >
              View Story Library{" "}
              {userData.storiesCompleted > 0
                ? `(${userData.storiesCompleted} Completed)`
                : ""}
            </Link>
          </div>
        )}

        {/* Emoji with subtle floating animation */}
        <div
          className="text-6xl mb-5 transition-transform duration-1000 ease-in-out"
          style={{
            animation: "float 3s ease-in-out infinite",
            transform: `translateY(${animate ? "0px" : "10px"})`,
          }}
        >
          {currentStoryData.emoji}
        </div>

        {/* Story content with themed background */}
        <div
          className={`w-full p-4 mb-4 transition-all duration-500 ${
            currentStoryData.color
          } ${currentStoryData.borderColor} border ${
            animate ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
          style={{ transitionDelay: "0.2s" }}
        >
          <div className="mb-2">
            <div className="text-sm uppercase tracking-wide opacity-70">
              Visit {userData?.storyVisitCount % 30 || 0}
            </div>
            <h3 className="text-xl font-medium">{currentStoryData.title}</h3>
          </div>
          <p className="text-sm italic opacity-90">{currentStoryData.story}</p>
        </div>

        {/* Story progress visualization */}
        <div
          className="w-full mt-2 transition-all duration-500"
          style={{ transitionDelay: "0.4s" }}
        >
          {/* Progress bar */}
          <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-[#E9C19D] dark:bg-[#D4A373] transition-all duration-1000 ease-out"
              style={{ width: `${getStoryPercentage()}%` }}
            ></div>
          </div>

          {/* Visit indicators */}
          <div className="flex justify-between items-center text-xs opacity-70 px-1">
            <div>Start</div>
            <div>10 Visits</div>
            <div>20 Visits</div>
            <div>30 Visits</div>
          </div>

          {/* Story completion indicator */}
          {userData?.storiesCompleted > 0 && (
            <div className="mt-4 text-xs opacity-70 text-center">
              Stories Completed: {userData.storiesCompleted}
            </div>
          )}
        </div>
      </div>

      {/* Add subtle CSS animation */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-5px);
          }
          100% {
            transform: translateY(0px);
          }
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

export default CozyStory;
