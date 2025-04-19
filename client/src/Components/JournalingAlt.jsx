"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Save, Check, X, Tag, FolderPlus } from "lucide-react";
import { useDarkMode } from "../context/ThemeContext";
import { useCoins } from "../context/CoinContext";
import Navbar from "./Dashboard/Navbar";

const JournalingAlt = () => {
  const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });
  const { darkMode, setDarkMode } = useDarkMode();
  const { inventory } = useCoins();
  const [selectedMood, setSelectedMood] = useState(null);
  const [journalText, setJournalText] = useState("");
  const [journalTitle, setJournalTitle] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showMoodSelector, setShowMoodSelector] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [showTagSelector, setShowTagSelector] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [tagInput, setTagInput] = useState("");
  const [existingTags, setExistingTags] = useState([]);
  const [filteredTags, setFilteredTags] = useState([]);
  const [selectedCollections, setSelectedCollections] = useState(["All"]);
  const [collectionInput, setCollectionInput] = useState("");
  const [existingCollections, setExistingCollections] = useState(["All"]);
  const [showCollectionSelector, setShowCollectionSelector] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [availableThemes, setAvailableThemes] = useState([]);

  const navigate = useNavigate();
  const textareaRef = useRef(null);
  const titleRef = useRef(null);
  const tagInputRef = useRef(null);
  const moodSelectorRef = useRef(null);
  const collectionSelectorRef = useRef(null);
  const themeSelectorRef = useRef(null);

  const moods = [
    { emoji: "😄", name: "Happy", color: "#FFD166" },
    { emoji: "😐", name: "Neutral", color: "#A1D6DB" },
    { emoji: "😔", name: "Sad", color: "#3A95B2" },
    { emoji: "😡", name: "Angry", color: "#EF476F" },
    { emoji: "😰", name: "Anxious", color: "#9B59B6" },
    { emoji: "🥱", name: "Tired", color: "#6B7280" },
    { emoji: "🤔", name: "Reflective", color: "#2ECC71" },
    { emoji: "🥳", name: "Excited", color: "#F4A261" },
  ];

  // Theme details
  const themeDetails = {
    theme_forest: {
      name: "Forest Theme",
      icon: "🌲",
      description: "Serene forest visuals",
    },
    theme_ocean: {
      name: "Ocean Theme",
      icon: "🌊",
      description: "Tranquil ocean waves",
    },
    theme_christmas: {
      name: "Christmas Theme",
      icon: "🎄",
      description: "Festive Christmas theme",
    },
    theme_halloween: {
      name: "Halloween Theme",
      icon: "🎃",
      description: "Spooky Halloween theme",
    },
    theme_pets: {
      name: "Pets Theme",
      icon: "🐶",
      description: "Furry friends theme",
    },
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    window.location.href = "/";
  };

  // Fetch existing tags, collections, and set available themes from inventory
  useEffect(() => {
    const fetchExistingData = async () => {
      try {
        const userData = JSON.parse(sessionStorage.getItem("user"));
        if (!userData || !userData._id) return;

        // Get available themes from user inventory
        const themes = userData.inventory
          .filter((item) => item.category === "theme")
          .map((item) => ({
            id: item.id,
            name: themeDetails[item.id]?.name || item.name,
            icon: themeDetails[item.id]?.icon || item.image,
            description: themeDetails[item.id]?.description || item.description,
          }));

        setAvailableThemes(themes);

        const response = await API.get(`/journal/journals/${userData._id}`);
        const journals = response.data.journals || [];

        // Get unique tags
        const uniqueTags = [
          ...new Set(
            journals
              .flatMap((journal) => journal.tags || [])
              .map((tag) => tag.toUpperCase())
          ),
        ];
        setExistingTags(uniqueTags);
        setFilteredTags(uniqueTags);

        // Get unique collections (always include "All")
        const uniqueCollections = ["All"];

        journals.forEach((journal) => {
          if (journal.collections && Array.isArray(journal.collections)) {
            journal.collections.forEach((collection) => {
              if (
                collection !== "All" &&
                !uniqueCollections.includes(collection)
              ) {
                uniqueCollections.push(collection);
              }
            });
          }
        });

        setExistingCollections(uniqueCollections);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchExistingData();
  }, [inventory]);

  // Update word count and reset isSaved
  useEffect(() => {
    const words = journalText.trim()
      ? journalText.trim().split(/\s+/).length
      : 0;
    setWordCount(words);
    if (isSaved) setIsSaved(false); // Reset saved state on content change
  }, [journalText, journalTitle]);

  // Filter tags based on tagInput
  useEffect(() => {
    if (tagInput.trim()) {
      const matchedTags = existingTags.filter((tag) =>
        tag.toLowerCase().includes(tagInput.toLowerCase())
      );
      setFilteredTags(matchedTags);
    } else {
      setFilteredTags(existingTags); // Show all tags when input is empty
    }
  }, [tagInput, existingTags]);

  // Focus title on mount
  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  // Close selectors on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        moodSelectorRef.current &&
        !moodSelectorRef.current.contains(event.target)
      ) {
        setShowMoodSelector(false);
      }

      if (
        collectionSelectorRef.current &&
        !collectionSelectorRef.current.contains(event.target)
      ) {
        setShowCollectionSelector(false);
      }

      if (
        themeSelectorRef.current &&
        !themeSelectorRef.current.contains(event.target)
      ) {
        setShowCollectionSelector(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle save
  const handleSave = async () => {
    if (!journalTitle.trim() || !journalText.trim()) {
      setSaveError("Please add a title and content.");
      return;
    }

    if (!selectedMood) {
      setSaveError("Please select a mood.");
      return;
    }

    setIsSaving(true);
    setSaveError(null);
    try {
      const userData = JSON.parse(sessionStorage.getItem("user"));
      if (!userData || !userData._id) {
        setSaveError("User not found. Please log in.");
        setIsSaving(false);
        return;
      }
      const journalEntry = {
        userId: userData._id,
        title: journalTitle,
        mood: selectedMood,
        content: journalText,
        date: new Date(),
        wordCount,
        tags: selectedTags.map((tag) => tag.toUpperCase()),
        collections: selectedCollections,
        theme: selectedTheme, // Add selected theme to journal entry
      };
      await API.post("/journal/saveJournal", journalEntry);
      setIsSaved(true);
      setTimeout(() => navigate("/collections"), 1000);
    } catch (error) {
      setSaveError(error.response?.data?.message || "Failed to save journal.");
      setIsSaving(false);
    }
  };

  // Tag handling
  const addTag = (tag) => {
    const uppercaseTag = tag.toUpperCase();
    if (uppercaseTag.trim() && !selectedTags.includes(uppercaseTag)) {
      setSelectedTags([...selectedTags, uppercaseTag]);
    }
    setTagInput("");
    tagInputRef.current?.focus();
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      addTag(tagInput);
    }
  };

  const removeTag = (tag) =>
    setSelectedTags(selectedTags.filter((t) => t !== tag));

  // Collection handling
  const addCollection = (collection) => {
    if (
      collection.trim() &&
      collection !== "All" &&
      !selectedCollections.includes(collection)
    ) {
      setSelectedCollections([...selectedCollections, collection]);
      if (!existingCollections.includes(collection)) {
        setExistingCollections([...existingCollections, collection]);
      }
    }
    setCollectionInput("");
    setShowCollectionSelector(false);
  };

  const handleCollectionInputKeyDown = (e) => {
    if (e.key === "Enter" && collectionInput.trim()) {
      e.preventDefault();
      addCollection(collectionInput);
    }
  };

  const toggleCollection = (collection) => {
    if (collection === "All") return; // Can't remove "All"

    if (selectedCollections.includes(collection)) {
      setSelectedCollections(
        selectedCollections.filter((c) => c !== collection)
      );
    } else {
      setSelectedCollections([...selectedCollections, collection]);
    }
  };

  const selectedMoodColor = selectedMood
    ? moods.find((m) => m.name === selectedMood)?.color
    : "var(--accent)";

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans transition-colors duration-300">
      <Navbar handleLogout={handleLogout} name="Dashboard" link={"/"} />

      <main className="max-w-[95%] mx-auto px-4 py-6">
        {saveError && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border-l-4 border-red-500 rounded-md text-sm">
            {saveError}
          </div>
        )}

        <div className="flex flex-col lg:flex-row">
          {/* Main Journaling Area */}
          <div className="flex-grow bg-[var(--bg-secondary)] border-[var(--border)] relative shadow-[var(--shadow)] rounded-xl p-5">
            <input
              ref={titleRef}
              type="text"
              value={journalTitle}
              onChange={(e) => setJournalTitle(e.target.value)}
              placeholder="Entry Title"
              className="w-full border-none outline-none text-2xl font-semibold mb-3 bg-transparent text-[var(--text-primary)] placeholder-[var(--text-secondary)]"
            />

            <textarea
              ref={textareaRef}
              value={journalText}
              onChange={(e) => setJournalText(e.target.value)}
              placeholder="Write your thoughts..."
              className="w-full min-h-[450px] resize-none border-[var(--border)] rounded-md outline-none text-[var(--text-primary)] placeholder-[var(--text-secondary)] text-sm"
            />

            <div className="flex justify-between items-center mt-3 text-sm text-[var(--text-secondary)]">
              <span>
                {wordCount} {wordCount === 1 ? "word" : "words"}
              </span>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 bg-[var(--accent)] text-white rounded-md flex items-center text-sm hover:bg-[var(--accent)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaved ? (
                  <Check size={16} className="mr-2" />
                ) : isSaving ? (
                  <span className="mr-2 animate-spin">⏳</span>
                ) : (
                  <Save size={16} className="mr-2" />
                )}
                {isSaved ? "Saved" : isSaving ? "Saving..." : "Save Journal"}
              </button>
            </div>
          </div>

          {/* Side Panel for Mood, Tags, Collections, and Themes */}
          <div className="w-full bg-[var(--bg-navbar)] lg:w-[400px]">
            {/* Theme Selection Panel */}
            {availableThemes.length > 0 && (
              <div
                className="border-[var(--border)] shadow-[var(--shadow)] rounded-xl p-3 border-b"
                ref={themeSelectorRef}
              >
                <h3 className="text-sm font-medium mb-2 text-[var(--text-primary)] flex items-center">
                  <span className="mr-1.5 text-base">🎨</span>
                  Select Theme
                  {selectedTheme && (
                    <span className="ml-1.5 bg-[var(--accent)] text-white text-xs px-1.5 py-0.5 rounded-full">
                      {themeDetails[selectedTheme]?.name || "Custom"}
                    </span>
                  )}
                </h3>

                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    onClick={() => setSelectedTheme(null)}
                    className={`px-2 py-1.5 text-xs rounded-md flex items-center justify-center transition-colors ${
                      !selectedTheme
                        ? "bg-[var(--accent)] text-white"
                        : "bg-[var(--bg-secondary)] hover:bg-[var(--accent)] hover:text-white"
                    }`}
                  >
                    None
                  </button>

                  {availableThemes.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => setSelectedTheme(theme.id)}
                      className={`px-2 py-1.5 text-xs rounded-md flex items-center justify-center transition-colors ${
                        selectedTheme === theme.id
                          ? "bg-[var(--accent)] text-white"
                          : "bg-[var(--bg-secondary)] hover:bg-[var(--accent)] hover:text-white"
                      }`}
                    >
                      <span className="mr-1">{theme.icon}</span>
                      {theme.name.split(" ")[0]}
                    </button>
                  ))}
                </div>

                {selectedTheme && (
                  <div className="mt-2 text-xs text-[var(--text-secondary)] italic">
                    {themeDetails[selectedTheme]?.description || "Custom theme"}
                  </div>
                )}
              </div>
            )}

            {/* Collection Selection Panel */}
            <div
              className="border-[var(--border)] shadow-[var(--shadow)] rounded-xl p-3 border-b"
              ref={collectionSelectorRef}
            >
              <h3 className="text-sm font-medium mb-2 text-[var(--text-primary)] flex items-center">
                <FolderPlus size={14} className="mr-1.5" />
                Collections
                {selectedCollections.length > 1 && (
                  <span className="ml-1.5 bg-[var(--accent)] text-white text-xs px-1.5 py-0.5 rounded-full">
                    {selectedCollections.length - 1}
                  </span>
                )}
              </h3>

              <div className="flex items-center mb-2">
                <input
                  type="text"
                  value={collectionInput}
                  onChange={(e) => setCollectionInput(e.target.value)}
                  onKeyDown={handleCollectionInputKeyDown}
                  placeholder="Add new collection..."
                  className="flex-grow px-2 py-1.5 bg-[var(--bg-secondary)] text-[var(--text-primary)] border-[var(--border)] text-xs outline-none"
                />
                <button
                  onClick={() =>
                    collectionInput.trim() && addCollection(collectionInput)
                  }
                  className="px-2 py-1.5 bg-[var(--accent)] text-white rounded-r-md text-xs hover:bg-[var(--accent)] transition-colors"
                >
                  Add
                </button>
              </div>

              {selectedCollections.length > 1 && (
                <div className="mb-2">
                  <h4 className="text-xs text-[var(--text-secondary)] mb-1.5">
                    Selected:
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCollections
                      .filter((c) => c !== "All")
                      .map((collection) => (
                        <div
                          key={collection}
                          className="flex items-center px-2 py-0.5 bg-[var(--accent)] text-white text-xs rounded-full"
                        >
                          {collection}
                          <button
                            onClick={() => toggleCollection(collection)}
                            className="ml-1.5 hover:text-[var(--bg-primary)] transition-colors"
                            aria-label={`Remove ${collection} collection`}
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-3 gap-1.5">
                {existingCollections
                  .filter(
                    (c) => c !== "All" && !selectedCollections.includes(c)
                  )
                  .map((collection) => (
                    <button
                      key={collection}
                      onClick={() => toggleCollection(collection)}
                      className="px-2 py-1.5 text-xs rounded-md flex items-center justify-center transition-colors bg-[var(--bg-secondary)] hover:bg-[var(--accent)] hover:text-white"
                    >
                      {collection}
                    </button>
                  ))}
              </div>
            </div>

            {/* Mood Selection Panel */}
            <div
              className="shadow-[var(--shadow)] rounded-xl p-3 border-b border-[var(--border)]"
              ref={moodSelectorRef}
            >
              <h3 className="text-sm font-medium mb-2 text-[var(--text-primary)] flex items-center">
                <div
                  className="w-3 h-3 mr-1.5 rounded-full"
                  style={{ backgroundColor: selectedMoodColor }}
                ></div>
                Select Mood <span className="text-red-500 ml-1">*</span>
              </h3>
              <div className="grid grid-cols-4 gap-1.5">
                {moods.map((mood) => (
                  <button
                    key={mood.name}
                    onClick={() => {
                      setSelectedMood(mood.name);
                      setShowMoodSelector(false);
                    }}
                    className={`px-1 py-1.5 text-xs rounded-md flex flex-col items-center justify-center transition-colors ${
                      selectedMood === mood.name
                        ? "bg-[var(--accent)] text-white"
                        : "bg-[var(--bg-secondary)] hover:bg-[var(--accent)]"
                    }`}
                  >
                    <span className="text-base mb-0.5">{mood.emoji}</span>
                    <span>{mood.name}</span>
                  </button>
                ))}
              </div>
              {selectedMood && (
                <div className="mt-2 text-xs text-[var(--text-secondary)] italic">
                  Feeling {selectedMood.toLowerCase()}{" "}
                  {moods.find((m) => m.name === selectedMood)?.emoji}
                </div>
              )}
            </div>

            {/* Tags Panel */}
            <div className="border-[var(--border)] shadow-[var(--shadow)] rounded-xl p-3">
              <h3 className="text-sm font-medium mb-2 text-[var(--text-primary)] flex items-center">
                <Tag size={14} className="mr-1.5" />
                Tags
                {selectedTags.length > 0 && (
                  <span className="ml-1.5 bg-[var(--accent)] text-white text-xs px-1.5 py-0.5 rounded-full">
                    {selectedTags.length}
                  </span>
                )}
              </h3>
              <div className="flex items-center mb-2">
                <input
                  ref={tagInputRef}
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagInputKeyDown}
                  placeholder="Add a tag..."
                  className="flex-grow px-2 py-1.5 bg-[var(--bg-secondary)] text-[var(--text-primary)] border-[var(--border)] text-xs outline-none"
                />
                <button
                  onClick={() => tagInput.trim() && addTag(tagInput)}
                  className="px-2 py-1.5 bg-[var(--accent)] text-white rounded-r-md text-xs hover:bg-[var(--accent)] transition-colors"
                >
                  Add
                </button>
              </div>
              {selectedTags.length > 0 && (
                <div className="mb-2">
                  <h4 className="text-xs text-[var(--text-secondary)] mb-1.5">
                    Selected:
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedTags.map((tag) => (
                      <div
                        key={tag}
                        className="flex items-center px-2 py-0.5 bg-[var(--accent)] text-white text-xs rounded-full"
                      >
                        {tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="ml-1.5 hover:text-[var(--bg-primary)] transition-colors"
                          aria-label={`Remove ${tag} tag`}
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {filteredTags.length > 0 && (
                <div>
                  <h4 className="text-xs text-[var(--text-secondary)] mb-1.5">
                    {tagInput.trim() ? "Matching:" : "Suggested:"}
                  </h4>
                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                    {filteredTags
                      .filter((tag) => !selectedTags.includes(tag))
                      .map((tag) => (
                        <button
                          key={tag}
                          onClick={() => addTag(tag)}
                          className="px-2 py-0.5 text-xs bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-full hover:bg-[var(--bg-secondary)]/80 transition-colors"
                        >
                          {tag}
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default JournalingAlt;
