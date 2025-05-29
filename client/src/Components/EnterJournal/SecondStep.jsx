"use client";

import { useState, useRef, useEffect } from "react";
import {
  Tag,
  X,
  Plus,
  FolderPlus,
  Hash,
  Heart,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

const SecondStep = ({
  // Tags props
  selectedTags,
  setSelectedTags,
  existingTags,
  // Mood props
  selectedMood,
  setSelectedMood,
  // Collections props
  selectedCollections,
  setSelectedCollections,
  existingCollections,
  // Navigation props
  onBack,
  onNext,
}) => {
  const [tagInput, setTagInput] = useState("");
  const [filteredTags, setFilteredTags] = useState([]);
  const [collectionInput, setCollectionInput] = useState("");
  const [showAllTags, setShowAllTags] = useState(false);
  const [showAllCollections, setShowAllCollections] = useState(false);
  const tagInputRef = useRef(null);

  // Filter tags based on tagInput
  useEffect(() => {
    if (tagInput.trim()) {
      const matchedTags = existingTags.filter((tag) =>
        tag.toLowerCase().includes(tagInput.toLowerCase())
      );
      setFilteredTags(matchedTags);
    } else {
      setFilteredTags(existingTags);
    }
  }, [tagInput, existingTags]);

  // Tags functions
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

  // Collections functions
  const addCollection = (collection) => {
    if (
      collection.trim() &&
      collection !== "All" &&
      !selectedCollections.includes(collection)
    ) {
      setSelectedCollections([...selectedCollections, collection]);
    }
    setCollectionInput("");
  };

  const handleCollectionInputKeyDown = (e) => {
    if (e.key === "Enter" && collectionInput.trim()) {
      e.preventDefault();
      addCollection(collectionInput);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleCollection = (collection) => {
    if (collection === "All") return;

    if (selectedCollections.includes(collection)) {
      setSelectedCollections(
        selectedCollections.filter((c) => c !== collection)
      );
    } else {
      setSelectedCollections([...selectedCollections, collection]);
    }
  };

  // Mood data
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

  const availableTags = filteredTags.filter(
    (tag) => !selectedTags.includes(tag)
  );
  const availableCollections = existingCollections.filter(
    (c) => c !== "All" && !selectedCollections.includes(c)
  );

  return (
    <div className="mx-auto space-y-8 max-w-7xl">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-black dark:text-white">
          Customize Your Entry
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Add mood, tags, and organize into collections
        </p>
      </div>

      {/* Mood Selector - Prominent placement */}
      <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border)] p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-pink-100 rounded-lg">
            <Heart className="w-5 h-5 text-pink-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
              How are you feeling?
            </h2>
            <p className="text-sm text-[var(--text-secondary)]">
              Select your current mood
            </p>
          </div>
        </div>

        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {moods.map((mood) => (
            <button
              key={mood.name}
              onClick={() => setSelectedMood(mood.name)}
              className={`group relative p-4 rounded-xl transition-all duration-300 ${
                selectedMood === mood.name
                  ? "ring-2 ring-offset-2 scale-105 shadow-lg"
                  : "hover:scale-105 hover:shadow-md"
              }`}
              style={{
                backgroundColor:
                  selectedMood === mood.name ? `${mood.color}15` : "",
                ringColor:
                  selectedMood === mood.name ? mood.color : "transparent",
                borderColor:
                  selectedMood === mood.name ? mood.color : "#e2e8f0",
                borderWidth: "2px",
              }}
            >
              <div className="flex flex-col items-center space-y-2">
                <span className="text-2xl transition-transform group-hover:scale-110">
                  {mood.emoji}
                </span>
                <span className="text-xs font-medium text-[var(--text-secondary)] text-center">
                  {mood.name}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Tags and Collections Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Tags Section */}
        <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border)] p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Hash className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                  Tags
                </h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  Label your entry
                </p>
              </div>
            </div>
            {selectedTags.length > 0 && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                {selectedTags.length}
              </span>
            )}
          </div>

          {/* Tag Input */}
          <div className="relative mb-4">
            <input
              ref={tagInputRef}
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagInputKeyDown}
              placeholder="Type a tag and press Enter..."
              className="w-full px-4 py-3 border border-[var(--border)] rounded-xl bg-transparent text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            {tagInput.trim() && (
              <button
                onClick={() => addTag(tagInput)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Selected Tags */}
          {selectedTags.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {selectedTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 text-white text-sm font-medium rounded-lg"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="hover:bg-blue-600 rounded p-0.5 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Available Tags */}
          {availableTags.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-[var(--text-secondary)]">
                  {tagInput.trim() ? "Matching tags" : "Suggested tags"}
                </h4>
                {availableTags.length > 6 && (
                  <button
                    onClick={() => setShowAllTags(!showAllTags)}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {showAllTags
                      ? "Show less"
                      : `+${availableTags.length - 6} more`}
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {(showAllTags ? availableTags : availableTags.slice(0, 6)).map(
                  (tag) => (
                    <button
                      key={tag}
                      onClick={() => addTag(tag)}
                      className="px-3 py-1.5 text-sm bg-blue-400 hover:bg-blue-500 text-white rounded-lg transition-colors"
                    >
                      {tag}
                    </button>
                  )
                )}
              </div>
            </div>
          )}
        </div>

        {/* Collections Section */}
        <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border)] p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FolderPlus className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                  Collections
                </h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  Organize your entries
                </p>
              </div>
            </div>
            {selectedCollections.length > 1 && (
              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                {selectedCollections.length - 1}
              </span>
            )}
          </div>

          {/* Collection Input */}
          <div className="relative mb-4">
            <input
              type="text"
              value={collectionInput}
              onChange={(e) => setCollectionInput(e.target.value)}
              onKeyDown={handleCollectionInputKeyDown}
              placeholder="Create new collection..."
              className="w-full px-4 py-3 border border-[var(--border)] rounded-xl bg-transparent text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            />
            {collectionInput.trim() && (
              <button
                onClick={() => addCollection(collectionInput)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Selected Collections */}
          {selectedCollections.length > 1 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {selectedCollections
                  .filter((c) => c !== "All")
                  .map((collection) => (
                    <span
                      key={collection}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-500 text-white text-sm font-medium rounded-lg"
                    >
                      {collection}
                      <button
                        onClick={() => toggleCollection(collection)}
                        className="hover:bg-green-600 rounded p-0.5 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
              </div>
            </div>
          )}

          {/* Available Collections */}
          {availableCollections.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-[var(--text-secondary)]">
                  Available collections
                </h4>
                {availableCollections.length > 6 && (
                  <button
                    onClick={() => setShowAllCollections(!showAllCollections)}
                    className="text-sm text-green-600 hover:text-green-700 font-medium"
                  >
                    {showAllCollections
                      ? "Show less"
                      : `+${availableCollections.length - 6} more`}
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {(showAllCollections
                  ? availableCollections
                  : availableCollections.slice(0, 6)
                ).map((collection) => (
                  <button
                    key={collection}
                    onClick={() => toggleCollection(collection)}
                    className="px-3 py-1.5 text-sm bg-green-400 hover:bg-green-500 text-white rounded-lg transition-colors"
                  >
                    {collection}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation - Consistent placement */}
      <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border)] p-6">
        <div className="flex justify-between items-center">
          <button
            onClick={onBack}
            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-xl flex items-center text-sm font-medium text-gray-700 dark:text-gray-200 hover:shadow-md transition-all duration-200 hover:scale-105"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back
          </button>

          <button
            onClick={onNext}
            disabled={!selectedMood}
            className="group px-6 py-3 bg-[var(--accent)] text-white rounded-xl flex items-center text-sm font-medium hover:bg-[var(--accent)]/90 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
          >
            Continue
            <ArrowRight
              size={16}
              className="ml-2 transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecondStep;
