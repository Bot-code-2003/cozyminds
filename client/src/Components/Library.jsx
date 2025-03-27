"use client";

import { useState, useEffect } from "react";
import { useDarkMode } from "../context/ThemeContext";
import { Link } from "react-router-dom";
import { ArrowLeft, Book, ChevronDown, ChevronUp } from "lucide-react";
import storyData from "../data/stories.json";

const Library = () => {
  const { darkMode } = useDarkMode();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedStory, setExpandedStory] = useState(null);

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

  // Fetch user data from localStorage when component mounts
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
      } catch (err) {
        setError(err?.message || "Failed to load user data from local storage");
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Toggle expanded story
  const toggleStory = (storyId) => {
    setExpandedStory(expandedStory === storyId ? null : storyId);
  };

  // Get completed stories
  const getCompletedStories = () => {
    if (!userData) return [];
    const completedStories = userData.storiesCompleted || 0;
    return storyData.stories.slice(0, completedStories);
  };

  // Get current story
  const getCurrentStory = () => {
    if (!userData) return null;
    const completedStories = userData.storiesCompleted || 0;
    return storyData.stories[completedStories] || null;
  };

  // Loading state
  if (loading) {
    return (
      <div
        className={`min-h-screen ${
          darkMode
            ? "bg-[#1A1A1A] text-[#F8F1E9]"
            : "bg-[#F8F1E9] text-[#1A1A1A]"
        } p-4 md:p-8`}
      >
        <div className="flex items-center justify-center h-64">
          <div className="flex space-x-2">
            <div className="h-3 w-3 rounded-full bg-[#E9C19D] animate-bounce"></div>
            <div
              className="h-3 w-3 rounded-full bg-[#E9C19D] animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
            <div
              className="h-3 w-3 rounded-full bg-[#E9C19D] animate-bounce"
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
        className={`min-h-screen ${
          darkMode
            ? "bg-[#1A1A1A] text-[#F8F1E9]"
            : "bg-[#F8F1E9] text-[#1A1A1A]"
        } p-4 md:p-8`}
      >
        <div className="max-w-4xl mx-auto">
          <Link
            to="/"
            className={`inline-flex items-center mb-6 text-sm ${
              darkMode ? "text-[#F4A261]" : "text-[#E68A41]"
            } hover:opacity-80`}
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Dashboard
          </Link>

          <div
            className={`p-8 text-center ${
              darkMode ? "bg-[#2A2A2A]" : "bg-white"
            } shadow-lg`}
          >
            <p className="text-lg mb-2">Unable to load your story library</p>
            <p className="opacity-70">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const completedStories = getCompletedStories();
  const currentStory = getCurrentStory();

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-[#1A1A1A] text-[#F8F1E9]" : "bg-[#F8F1E9] text-[#1A1A1A]"
      } p-4 md:p-8 transition-colors duration-300`}
    >
      <div className="max-w-4xl mx-auto">
        <Link
          to="/"
          className={`inline-flex items-center mb-6 text-sm ${
            darkMode ? "text-[#F4A261]" : "text-[#E68A41]"
          } hover:opacity-80`}
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Dashboard
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Story Library</h1>
          <p className="opacity-70">
            Explore your journey through all the stories you've completed
          </p>
        </div>

        {completedStories.length === 0 ? (
          <div
            className={`p-8 text-center ${
              darkMode ? "bg-[#2A2A2A]" : "bg-white"
            } shadow-lg`}
          >
            <Book size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg mb-2">Your library is empty</p>
            <p className="opacity-70 mb-4">
              Complete your first story to add it to your library
            </p>
            <Link
              to="/"
              className={`inline-flex items-center px-4 py-2 ${
                darkMode
                  ? "bg-[#F4A261] text-[#1A1A1A]"
                  : "bg-[#E68A41] text-white"
              } hover:opacity-90 transition-opacity`}
            >
              Continue Your Journey
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Completed Stories */}
            {completedStories.map((story, index) => (
              <div
                key={story.id}
                className={`${
                  darkMode ? "bg-[#2A2A2A]" : "bg-white"
                } shadow-lg overflow-hidden transition-all duration-300`}
              >
                <button
                  onClick={() => toggleStory(story.id)}
                  className="w-full p-6 flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <span className="text-4xl mr-4">
                      {story.items[9].emoji}
                    </span>
                    <div className="text-left">
                      <h3 className="text-xl font-medium">{story.title}</h3>
                      <p className="text-sm opacity-70">
                        Story {index + 1} - Completed
                      </p>
                    </div>
                  </div>
                  {expandedStory === story.id ? (
                    <ChevronUp size={20} className="opacity-70" />
                  ) : (
                    <ChevronDown size={20} className="opacity-70" />
                  )}
                </button>

                {/* Expanded story content */}
                {expandedStory === story.id && (
                  <div
                    className={`px-6 pb-6 pt-2 border-t ${
                      darkMode ? "border-[#333333]" : "border-[#F0E6DD]"
                    } animate-fadeIn`}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {story.items.map((item) => (
                        <div
                          key={item.visitMax}
                          className={`p-4 ${item.color} ${item.borderColor} border`}
                        >
                          <div className="flex items-center mb-2">
                            <span className="text-2xl mr-2">{item.emoji}</span>
                            <h4 className="font-medium">{item.title}</h4>
                          </div>
                          <p className="text-xs italic opacity-90">
                            {item.story}
                          </p>
                          <div className="text-xs mt-2 opacity-70 text-right">
                            Visit {item.visitMax}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Current Story */}
            {currentStory && (
              <div
                className={`${
                  darkMode ? "bg-[#2A2A2A]" : "bg-white"
                } shadow-lg p-6`}
              >
                <div className="flex items-center mb-4">
                  <span className="text-4xl mr-4">
                    {currentStory.items[0].emoji}
                  </span>
                  <div>
                    <h3 className="text-xl font-medium">
                      {currentStory.title}
                    </h3>
                    <p className="text-sm opacity-70">
                      Story {completedStories.length + 1} - In Progress (Visit{" "}
                      {userData?.storyVisitCount || 0}/30)
                    </p>
                  </div>
                </div>

                <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#E9C19D] dark:bg-[#D4A373] transition-all duration-1000 ease-out"
                    style={{
                      width: `${
                        ((userData?.storyVisitCount || 0) / 30) * 100
                      }%`,
                    }}
                  ></div>
                </div>

                <div className="mt-4 text-center">
                  <Link
                    to="/"
                    className={`inline-flex items-center px-4 py-2 ${
                      darkMode
                        ? "bg-[#F4A261] text-[#1A1A1A]"
                        : "bg-[#E68A41] text-white"
                    } hover:opacity-90 transition-opacity`}
                  >
                    Continue Your Journey
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add subtle CSS animation */}
      <style jsx>{`
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

export default Library;
