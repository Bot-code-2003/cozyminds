"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Check, Save, Palette, Eye } from "lucide-react";
import { getThemeDetails, getCardClass } from "../Dashboard/ThemeDetails";
import JournalEntry from "./JournalEntryPreview";

const ThemeSelector = ({
  selectedTheme,
  setSelectedTheme,
  availableThemes,
  onBack,
  onSave,
  isSaving,
  isSaved,
  entryData,
}) => {
  // Default preview content if no entryData is provided
  const defaultPreviewContent = {
    title: "My Journal Entry",
    content:
      "This is a preview of how your journal entry will look with the selected theme. The styling changes based on your theme choice.",
    tags: ["Sample", "Preview"],
    mood: "Reflective",
    date: new Date().toISOString(),
    wordCount: 42,
    theme: selectedTheme,
  };

  // Use entryData if provided, otherwise use default preview content
  const previewData = {
    ...defaultPreviewContent,
    ...entryData,
    theme: selectedTheme, // Always use the currently selected theme for preview
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="mx-auto space-y-8 max-w-7xl">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-black dark:text-white">
          Choose Your Theme
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Select a visual style for your journal entry
        </p>
      </div>

      {/* Main grid layout for side-by-side display */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6">
        {/* Left side: Theme selection */}
        <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border)] p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Palette className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                  Available Themes
                </h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  Pick your visual style
                </p>
              </div>
            </div>
            {selectedTheme && (
              <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full">
                Selected
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {availableThemes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => setSelectedTheme(theme.id)}
                className={`group p-4 flex flex-col items-center justify-center rounded-xl transition-all duration-300 border-2 ${
                  selectedTheme === theme.id
                    ? "ring-2 ring-offset-2 ring-purple-500  transform scale-105 shadow-lg border-purple-500"
                    : "hover:bg-[var(--bg-primary)] hover:shadow-md hover:scale-105 border-[var(--border)] hover:border-purple-300"
                }`}
              >
                <span className="text-2xl mb-2 transition-transform duration-200 group-hover:scale-110">
                  {theme.icon}
                </span>
                <span className="text-sm font-medium text-[var(--text-primary)]">
                  {theme.name}
                </span>
              </button>
            ))}
          </div>

          <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
            <p className="text-sm text-purple-700 italic">
              💡 Select a theme to see how your entry will look
            </p>
          </div>
        </div>

        {/* Right side: Preview */}
        <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border)] p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Eye className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                Live Preview
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">
                See how your entry will appear
              </p>
            </div>
          </div>

          <div className="flex-grow">
            <div
              className={`w-full rounded-xl overflow-hidden shadow-lg transition-all duration-300 ${
                selectedTheme
                  ? getCardClass(selectedTheme)
                  : "border border-[var(--border)]"
              }`}
            >
              <JournalEntry
                isPreview={true}
                previewData={previewData}
                hideBackButton={true}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border)] p-6">
        <div className="flex justify-between items-center">
          <button
            onClick={onBack}
            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-xl flex items-center text-sm font-medium text-gray-700 hover:shadow-md transition-all duration-200 hover:scale-105"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back
          </button>

          <div className="flex items-center gap-4">
            {selectedTheme && (
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-green-700">
                  Theme selected
                </span>
              </div>
            )}

            <button
              onClick={onSave}
              disabled={isSaving}
              className="group px-6 py-3 bg-[var(--accent)] text-white rounded-xl flex items-center text-sm font-medium hover:bg-[var(--accent)]/90 transition-all duration-300 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isSaved ? (
                <Check size={16} className="mr-2" />
              ) : isSaving ? (
                <span className="mr-2 animate-spin">⏳</span>
              ) : (
                <Save
                  size={16}
                  className="mr-2 transition-transform duration-200 group-hover:scale-110"
                />
              )}
              {isSaved ? "Saved" : isSaving ? "Saving..." : "Save Journal"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeSelector;
