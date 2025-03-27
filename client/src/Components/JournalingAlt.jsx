"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Sun,
  Moon,
  Save,
  Calendar,
  X,
  ChevronDown,
  ChevronUp,
  Tag,
  Check,
  PenLine,
  Bookmark,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useDarkMode } from "../context/ThemeContext";

const JournalingAlt = () => {
  const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });
  const { darkMode, setDarkMode } = useDarkMode();
  const [selectedMood, setSelectedMood] = useState(null);
  const [journalText, setJournalText] = useState("");
  const [journalTitle, setJournalTitle] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentDate, setCurrentDate] = useState("");
  const [showMoodSelector, setShowMoodSelector] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [showTagSelector, setShowTagSelector] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [tagInput, setTagInput] = useState("");
  const [existingTags, setExistingTags] = useState([]);
  const [filteredTags, setFilteredTags] = useState([]);
  const [charCount, setCharCount] = useState(0);

  const navigate = useNavigate();
  const textareaRef = useRef(null);
  const titleRef = useRef(null);
  const tagInputRef = useRef(null);

  const moods = [
    { emoji: "😄", name: "Happy", color: "#FFB17A" },
    { emoji: "😐", name: "Neutral", color: "#83C5BE" },
    { emoji: "😔", name: "Sad", color: "#7A82AB" },
    { emoji: "😡", name: "Angry", color: "#E07A5F" },
    { emoji: "😰", name: "Anxious", color: "#BC96E6" },
    { emoji: "🥱", name: "Tired", color: "#8D99AE" },
    { emoji: "🤔", name: "Reflective", color: "#81B29A" },
    { emoji: "🥳", name: "Excited", color: "#F9C74F" },
  ];

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Fetch existing tags from journal entries
  useEffect(() => {
    const fetchExistingTags = async () => {
      try {
        const userData = JSON.parse(sessionStorage.getItem("user"));
        if (!userData || !userData.id) return;

        const response = await API.get(`/journals/${userData.id}`);
        const journals = response.data.journals || [];

        // Extract unique tags from all journal entries
        const uniqueTags = new Set();
        journals.forEach((journal) => {
          if (journal.tags && Array.isArray(journal.tags)) {
            journal.tags.forEach((tag) => uniqueTags.add(tag.toUpperCase()));
          }
        });

        setExistingTags(Array.from(uniqueTags));
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    fetchExistingTags();
  }, []);

  // Filter tags based on input
  useEffect(() => {
    if (!tagInput.trim()) {
      setFilteredTags([]);
      return;
    }

    const regex = new RegExp(tagInput, "i");
    const filtered = existingTags.filter((tag) => regex.test(tag));
    setFilteredTags(filtered);
  }, [tagInput, existingTags]);

  useEffect(() => {
    const words = journalText.trim() ? journalText.trim().split(/\s+/) : [];
    setWordCount(words.length);
    setCharCount(journalText.length);
  }, [journalText]);

  useEffect(() => {
    const now = new Date();
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    setCurrentDate(now.toLocaleDateString("en-US", options));
  }, []);

  const handleSave = async () => {
    if (!journalTitle.trim() || !journalText.trim()) {
      setSaveError("Please add a title and some content to your journal entry");
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      // Get user data from sessionStorage
      const userData = JSON.parse(sessionStorage.getItem("user"));

      if (!userData || !userData.id) {
        setSaveError("User not found. Please log in again.");
        setIsSaving(false);
        return;
      }

      // Convert all tags to uppercase for consistency
      const uppercaseTags = selectedTags.map((tag) => tag.toUpperCase());

      const journalEntry = {
        userId: userData.id,
        title: journalTitle,
        mood: selectedMood,
        content: journalText,
        date: new Date(),
        wordCount,
        tags: uppercaseTags,
      };

      await API.post("/saveJournal", journalEntry);

      setIsSaved(true);

      // Navigate to home after successful save
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      console.error("Error saving journal:", error);
      setSaveError(
        error.response?.data?.message || "Failed to save journal entry"
      );
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.focus();
    }
  }, []);

  const addTag = (tag) => {
    const uppercaseTag = tag.toUpperCase();
    if (!selectedTags.includes(uppercaseTag) && uppercaseTag.trim() !== "") {
      setSelectedTags([...selectedTags, uppercaseTag]);
    }
    setTagInput("");
    if (tagInputRef.current) {
      tagInputRef.current.focus();
    }
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      addTag(tagInput);
    }
  };

  const removeTag = (tagToRemove) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== tagToRemove));
  };

  const selectedMoodColor = selectedMood
    ? moods.find((m) => m.name === selectedMood)?.color
    : darkMode
    ? "#F4A261"
    : "#E68A41";

  return (
    <div
      className={`min-h-screen ${
        darkMode
          ? "dark bg-[#1A1A1A] text-[#F8F1E9]"
          : "bg-[#F8F1E9] text-[#1A1A1A]"
      } font-sans transition-colors duration-300`}
    >
      {/* Background pattern */}
      <div className="fixed inset-0 z-0 opacity-5 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25px 25px, ${
              darkMode ? "#ffffff" : "#000000"
            } 2%, transparent 0%), radial-gradient(circle at 75px 75px, ${
              darkMode ? "#ffffff" : "#000000"
            } 2%, transparent 0%)`,
            backgroundSize: "100px 100px",
          }}
        ></div>
      </div>

      <nav
        className={`w-full ${
          darkMode
            ? "bg-[#1A1A1A]/90 backdrop-blur-sm border-b border-[#333333]"
            : "bg-[#F8F1E9]/90 backdrop-blur-sm border-b border-[#DDDDDD]"
        } py-4 px-6 flex justify-between items-center sticky top-0 z-20 shadow-md`}
      >
        <Link to="/" className="flex items-center">
          <div className="text-xl font-bold tracking-tight">
            COZY
            <span
              className={`${darkMode ? "text-[#F4A261]" : "text-[#E68A41]"}`}
            >
              MINDS
            </span>
          </div>
        </Link>
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center text-sm opacity-80">
            <Calendar size={16} className="mr-2" />
            {currentDate}
          </div>
          <button
            onClick={toggleDarkMode}
            className="p-2 hover:text-[#F4A261] transition-colors duration-200"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`px-4 py-2 flex items-center ${
              darkMode
                ? "bg-[#F4A261] text-[#1A1A1A] hover:bg-[#F4A261]/90"
                : "bg-[#E68A41] text-white hover:bg-[#E68A41]/90"
            } transition-all duration-200 transform ${
              isSaved ? "scale-105" : ""
            }`}
          >
            {isSaved ? (
              <Check size={16} className="mr-2" />
            ) : isSaving ? (
              <span className="mr-2 animate-spin">⏳</span>
            ) : (
              <Save size={16} className="mr-2" />
            )}
            {isSaved ? "Saved" : isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-10 relative z-10">
        {saveError && (
          <div className="mb-6 p-4 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200 border-l-4 border-red-500 animate-slide-in">
            {saveError}
          </div>
        )}

        <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div className="flex flex-wrap gap-3">
            {/** Mood Toggle */}
            <div className="relative">
              <button
                onClick={() => setShowMoodSelector(!showMoodSelector)}
                className={`flex items-center px-4 py-2 ${
                  darkMode
                    ? "bg-[#2A2A2A] hover:bg-[#333333]"
                    : "bg-white hover:bg-[#F8F1E9]"
                } border ${
                  darkMode ? "border-[#333333]" : "border-[#DDDDDD]"
                } transition-colors duration-200 shadow-sm hover:shadow`}
              >
                <div
                  className="w-3 h-3 mr-2 rounded-full"
                  style={{ backgroundColor: selectedMoodColor }}
                ></div>
                <span className="mr-2 font-medium text-sm">Mood</span>
                {selectedMood && (
                  <span className="text-lg">
                    {moods.find((m) => m.name === selectedMood)?.emoji}
                  </span>
                )}
                {showMoodSelector ? (
                  <ChevronUp size={16} className="ml-2 opacity-70" />
                ) : (
                  <ChevronDown size={16} className="ml-2 opacity-70" />
                )}
              </button>
            </div>

            {/** Tags Toggle */}
            <div className="relative">
              <button
                onClick={() => setShowTagSelector(!showTagSelector)}
                className={`flex items-center px-4 py-2 ${
                  darkMode
                    ? "bg-[#2A2A2A] hover:bg-[#333333]"
                    : "bg-white hover:bg-[#F8F1E9]"
                } border ${
                  darkMode ? "border-[#333333]" : "border-[#DDDDDD]"
                } transition-colors duration-200 shadow-sm hover:shadow`}
              >
                <Tag size={16} className="mr-2 opacity-70" />
                <span className="font-medium text-sm">Tags</span>
                {selectedTags.length > 0 && (
                  <span className="ml-2 bg-[#F4A261] text-[#1A1A1A] text-xs px-2 py-0.5 rounded-sm">
                    {selectedTags.length}
                  </span>
                )}
                {showTagSelector ? (
                  <ChevronUp size={16} className="ml-2 opacity-70" />
                ) : (
                  <ChevronDown size={16} className="ml-2 opacity-70" />
                )}
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            <div
              className={`flex items-center px-4 py-2 ${
                darkMode ? "bg-[#2A2A2A]" : "bg-white"
              } border ${
                darkMode ? "border-[#333333]" : "border-[#DDDDDD]"
              } shadow-sm`}
            >
              <PenLine size={16} className="mr-2 opacity-70" />
              <span className="font-medium text-sm">
                {charCount} {charCount === 1 ? "char" : "chars"}
              </span>
            </div>

            <div
              className={`flex items-center px-4 py-2 ${
                darkMode ? "bg-[#2A2A2A]" : "bg-white"
              } border ${
                darkMode ? "border-[#333333]" : "border-[#DDDDDD]"
              } shadow-sm`}
            >
              <Bookmark size={16} className="mr-2 opacity-70" />
              <span className="font-medium text-sm">
                {wordCount} {wordCount === 1 ? "word" : "words"}
              </span>
            </div>
          </div>
        </div>

        {/** Mood options */}
        {showMoodSelector && (
          <div
            className={`mb-4 ${
              darkMode
                ? "bg-[#2A2A2A] border-[#333333]"
                : "bg-white border-[#DDDDDD]"
            } border shadow-lg z-10 animate-fade-in`}
          >
            <div className="grid grid-cols-4 p-3 gap-3">
              {moods.map((mood) => (
                <button
                  key={mood.name}
                  onClick={() => {
                    setSelectedMood(mood.name);
                    setShowMoodSelector(false);
                  }}
                  className={`p-2 text-xl flex flex-col items-center ${
                    selectedMood === mood.name
                      ? darkMode
                        ? "bg-[#333333]"
                        : "bg-[#F8F1E9]"
                      : ""
                  } hover:${
                    darkMode ? "bg-[#333333]" : "bg-[#F8F1E9]"
                  } transition-colors duration-150 rounded`}
                >
                  <span>{mood.emoji}</span>
                  <span className="text-xs mt-1">{mood.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/** Tag options */}
        {showTagSelector && (
          <div
            className={`mt-4 mb-4 ${
              darkMode
                ? "bg-[#2A2A2A] border-[#333333]"
                : "bg-white border-[#DDDDDD]"
            } border shadow-lg z-10 animate-fade-in`}
          >
            <div className="p-3">
              <div className="flex mb-3">
                <input
                  ref={tagInputRef}
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagInputKeyDown}
                  placeholder="Type a tag and press Enter"
                  className={`flex-grow px-3 py-2 ${
                    darkMode
                      ? "bg-[#333333] text-[#F8F1E9]"
                      : "bg-[#EEEEEE] text-[#1A1A1A]"
                  } outline-none`}
                />
                <button
                  onClick={() => addTag(tagInput)}
                  disabled={!tagInput.trim()}
                  className={`px-3 py-2 ${
                    darkMode
                      ? "bg-[#F4A261] text-[#1A1A1A]"
                      : "bg-[#E68A41] text-white"
                  } ${!tagInput.trim() ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  Add
                </button>
              </div>

              {filteredTags.length > 0 && (
                <div className="mb-3">
                  <div className="text-sm opacity-70 mb-1">Suggestions:</div>
                  <div className="flex flex-wrap gap-2">
                    {filteredTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => addTag(tag)}
                        className={`px-3 py-1 text-sm ${
                          darkMode
                            ? "bg-[#333333] hover:bg-[#444444]"
                            : "bg-[#EEEEEE] hover:bg-[#DDDDDD]"
                        } transition-colors duration-150`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {existingTags.length > 0 && (
                <div>
                  <div className="text-sm opacity-70 mb-1">Existing tags:</div>
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                    {existingTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => addTag(tag)}
                        className={`px-3 py-1 text-sm ${
                          selectedTags.includes(tag)
                            ? "bg-[#F4A261] text-[#1A1A1A]"
                            : darkMode
                            ? "bg-[#333333] hover:bg-[#444444]"
                            : "bg-[#EEEEEE] hover:bg-[#DDDDDD]"
                        } transition-colors duration-150`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div
          className={`${
            darkMode
              ? "bg-[#2A2A2A] border-[#333333]"
              : "bg-white border-[#DDDDDD]"
          } border shadow-lg p-6 transition-all duration-300 relative`}
        >
          {/* Decorative corner elements */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#F4A261]"></div>
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#F4A261]"></div>
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#F4A261]"></div>
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#F4A261]"></div>

          <input
            ref={titleRef}
            type="text"
            value={journalTitle}
            onChange={(e) => setJournalTitle(e.target.value)}
            placeholder="Entry Title"
            className={`w-full border-none outline-none text-3xl font-bold mb-6 ${
              darkMode
                ? "bg-[#2A2A2A] text-[#F8F1E9]"
                : "bg-white text-[#1A1A1A]"
            } placeholder-opacity-50 focus:placeholder-opacity-30 transition-all`}
          />

          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6 animate-fade-in">
              {selectedTags.map((tag) => (
                <div
                  key={tag}
                  className={`flex items-center px-3 py-1 ${
                    darkMode ? "bg-[#333333]" : "bg-[#EEEEEE]"
                  } text-sm hover:shadow-sm transition-shadow`}
                >
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="ml-2 opacity-70 hover:opacity-100 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {selectedMood && (
            <div className="mb-6 flex items-center text-sm opacity-70 animate-fade-in">
              <div
                className="w-3 h-3 mr-2 rounded-full"
                style={{ backgroundColor: selectedMoodColor }}
              ></div>
              Feeling {selectedMood.toLowerCase()}
              <span className="ml-2 text-lg">
                {moods.find((m) => m.name === selectedMood)?.emoji}
              </span>
            </div>
          )}

          <textarea
            ref={textareaRef}
            value={journalText}
            onChange={(e) => setJournalText(e.target.value)}
            placeholder="Start writing your thoughts..."
            className={`w-full min-h-[450px] resize-none border-none outline-none ${
              darkMode
                ? "bg-[#2A2A2A] text-[#F8F1E9]"
                : "bg-white text-[#1A1A1A]"
            } text-lg leading-relaxed placeholder-opacity-50 focus:placeholder-opacity-30 transition-all`}
          ></textarea>
        </div>
      </main>

      <div className="md:hidden fixed bottom-6 left-6 text-sm opacity-70 bg-[#2A2A2A] px-3 py-1 rounded-full shadow-md">
        {currentDate}
      </div>

      <style jsx>{`
        textarea::-webkit-scrollbar {
          display: none;
        }
        textarea {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default JournalingAlt;
