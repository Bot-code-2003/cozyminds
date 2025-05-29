"use client";

import { useRef, useEffect } from "react";
import { ArrowRight, PenTool, FileText } from "lucide-react";

const JournalEditor = ({
  journalTitle,
  setJournalTitle,
  journalText,
  setJournalText,
  wordCount,
  onNext,
}) => {
  const titleRef = useRef(null);
  const textareaRef = useRef(null);

  // Focus title on mount
  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="mx-auto space-y-8 max-w-7xl">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-black dark:text-white">
          Write Your Entry
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Capture your thoughts and experiences
        </p>
      </div>

      {/* Main Editor Card */}
      <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border)] p-6">
        {/* Title Section */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <PenTool className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                Entry Title
              </h2>
              <p className="text-sm text-[var(--text-secondary)]">
                Give your entry a memorable title
              </p>
            </div>
          </div>

          <input
            ref={titleRef}
            type="text"
            value={journalTitle}
            onChange={(e) => setJournalTitle(e.target.value)}
            placeholder="What's on your mind today?"
            className="w-full px-4 py-3 text-xl font-semibold border border-[var(--border)] rounded-xl bg-transparent text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        {/* Content Section */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                Your Thoughts
              </h2>
              <p className="text-sm text-[var(--text-secondary)]">
                Express yourself freely
              </p>
            </div>
          </div>

          <textarea
            ref={textareaRef}
            value={journalText}
            onChange={(e) => setJournalText(e.target.value)}
            placeholder="Start writing your thoughts, experiences, or reflections..."
            className="w-full min-h-[350px] resize-none border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)] placeholder-[var(--text-secondary)] text-base leading-relaxed bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        {/* Footer with word count and status */}
        <div className="flex justify-between items-center pt-4 border-t border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[var(--accent)] rounded-full opacity-60"></div>
              <span className="text-sm font-medium text-[var(--text-secondary)]">
                {wordCount} {wordCount === 1 ? "word" : "words"}
              </span>
            </div>
            {(journalTitle.trim() || journalText.trim()) && (
              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                Draft ready
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Navigation - Consistent placement */}
      <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border)] p-6">
        <div className="flex justify-end">
          <button
            onClick={onNext}
            disabled={!journalTitle.trim() && !journalText.trim()}
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

export default JournalEditor;
