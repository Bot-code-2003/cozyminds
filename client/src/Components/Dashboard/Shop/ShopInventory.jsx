"use client";

import { useState, useCallback } from "react";
import { X, Star, Eye, Package, Mail } from "lucide-react";
import { shopItems } from "./ShopItems"; // Adjust the import path as needed

const ShopInventory = ({
  inventory,
  setActiveTab,
  isOneTimePurchase,
  activateMailTheme,
}) => {
  const [previewMailTheme, setPreviewMailTheme] = useState(null);
  const [showConceptModal, setShowConceptModal] = useState(false);
  const [selectedConceptPack, setSelectedConceptPack] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Map shop item IDs to CSS classes
  const getCardClass = useCallback((item) => {
    if (item.cardClass) {
      return item.cardClass;
    }
    if (item.isMailTheme) {
      return `card-${item.id}`;
    }
    if (item.isConceptPackGroup) {
      return `card-${item.parentPackId}`;
    }
    return `card-${item.id.replace("theme_", "")}`;
  }, []);

  // Group concept pack items
  const groupedInventory = inventory.reduce((acc, item) => {
    if (item.category === "conceptpack" && item.parentPack) {
      const existingGroupIndex = acc.findIndex(
        (group) =>
          group.isConceptPackGroup && group.parentPackId === item.parentPack
      );

      if (existingGroupIndex >= 0) {
        acc[existingGroupIndex].items.push(item);
      } else {
        const parentPackName = item.description?.includes("part of")
          ? item.description.split("part of")[1]?.trim()
          : "Concept Pack";

        const originalPack = inventory.find(
          (invItem) => invItem.id === item.parentPack
        );

        acc.push({
          id: `group-${item.parentPack}`,
          name: originalPack?.name || parentPackName,
          description:
            originalPack?.description || `Collection of concept images`,
          category: "conceptpack",
          isConceptPackGroup: true,
          parentPackId: item.parentPack,
          items: [item],
          story: originalPack?.story || "",
          featured: originalPack?.featured || null,
          cardClass: `card-${item.parentPack}`,
        });
      }
    } else if (item.category === "mailtheme") {
      acc.push({
        ...item,
        isMailTheme: true,
      });
    } else {
      acc.push(item);
    }
    return acc;
  }, []);

  const handleActivateMailTheme = useCallback(
    (theme) => {
      activateMailTheme(theme.id);
      alert(`${theme.name} has been activated! New mails will use this theme.`);
    },
    [activateMailTheme]
  );

  const handlePreviewMailTheme = useCallback((theme) => {
    setPreviewMailTheme(theme);
    setIsModalOpen(true);
  }, []);

  const closePreview = useCallback(() => {
    setPreviewMailTheme(null);
    setIsModalOpen(false);
  }, []);

  const openConceptModal = useCallback((conceptPack) => {
    const originalPack = shopItems.find(
      (item) => item.id === conceptPack.parentPackId
    );

    if (originalPack) {
      setSelectedConceptPack({
        ...conceptPack,
        conceptImages: originalPack.conceptImages || [],
        story: originalPack.story || conceptPack.story || "",
      });
    } else {
      setSelectedConceptPack(conceptPack);
    }

    setShowConceptModal(true);
  }, []);

  const closeConceptModal = useCallback(() => {
    setShowConceptModal(false);
    setSelectedConceptPack(null);
  }, []);

  // Handle keyboard navigation for modals
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") {
        closePreview();
        closeConceptModal();
      }
    },
    [closePreview, closeConceptModal]
  );

  return (
    <div>
      {inventory.length === 0 ? (
        <div className="text-center py-16 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border)]">
          <Package
            size={64}
            className="mx-auto text-[var(--text-secondary)] mb-4 opacity-50"
          />
          <h3 className="text-2xl font-medium text-[var(--text-primary)] mb-3">
            Your inventory is empty
          </h3>
          <p className="text-[var(--text-secondary)] mb-6 max-w-md mx-auto">
            Purchase items from the shop to customize your journaling experience
          </p>
          <button
            onClick={() => setActiveTab("shop")}
            className="px-6 py-2 bg-[var(--accent)] text-white rounded-md hover:bg-opacity-90 transition-all"
          >
            Browse Shop
          </button>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
              My Collection
            </h2>
            <p className="text-[var(--text-secondary)]">
              Items you've purchased from the Starlit Shop <br /> Write a new
              entry to use these items
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groupedInventory.map((item) => (
              <article
                key={item.id}
                className={`
                  relative group h-60 flex flex-col overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 
                  bg-white dark:bg-gray-800 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 
                  ${item.featuredStyle || ""} ${getCardClass(item)} 
                  ${item.isConceptPackGroup ? "cursor-pointer" : ""}
                `}
                onClick={() => {
                  if (item.isConceptPackGroup) {
                    openConceptModal(item);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label={item.name}
              >
                {/* Badges */}
                <div className="flex justify-between items-start z-10">
                  {/* Featured Badge */}
                  {item.featured && (
                    <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 bg-white/90 dark:bg-gray-900/90 text-gray-900 dark:text-white text-xs font-medium rounded-full backdrop-blur-sm">
                      {item.featured === "Exclusive" && (
                        <Star size={10} className="text-yellow-500" />
                      )}
                      {item.featured}
                    </div>
                  )}

                  {/* Category Badge */}
                  <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-gray-900/80 text-white text-xs font-medium rounded-full backdrop-blur-sm">
                    {item.isMailTheme ? "Mail Theme" : item.category}
                  </div>
                </div>

                {/* Concept Pack Group - Display grid of images */}
                {item.isConceptPackGroup &&
                  item.items &&
                  item.items.length > 0 && (
                    <div className="absolute inset-0 grid grid-cols-3 gap-0">
                      {item.items.slice(0, 3).map((conceptItem, index) => (
                        <div
                          key={index}
                          className={`relative overflow-hidden ${
                            conceptItem.cardClass || `card-${conceptItem.id}`
                          }`}
                        />
                      ))}
                      {Array.from({
                        length: Math.max(0, 3 - (item.items?.length || 0)),
                      }).map((_, index) => (
                        <div
                          key={`placeholder-${index}`}
                          className="relative overflow-hidden bg-gray-800"
                        />
                      ))}
                    </div>
                  )}

                {/* Emoji Display */}
                {item.isEmoji && (
                  <div className="flex-grow flex items-center justify-center">
                    <span
                      className="text-6xl transform group-hover:scale-110 transition-transform duration-300"
                      role="img"
                      aria-label={item.name}
                    >
                      {item.emoji || item.image}
                    </span>
                  </div>
                )}

                {/* Mail Theme Icon */}
                {item.isMailTheme && !item.isEmoji && (
                  <div className="flex-grow flex items-center justify-center">
                    <Mail size={40} className="text-white opacity-70" />
                  </div>
                )}

                {/* Content Area */}
                <div className="mt-auto p-4 flex flex-col items-center text-center z-10">
                  <h3 className="text-lg font-semibold text-white mb-2 drop-shadow-md line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-white/90 text-sm mb-4 drop-shadow-sm line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Action Buttons */}
                  {item.isMailTheme && (
                    <div className="flex justify-center items-center w-full gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePreviewMailTheme(item);
                        }}
                        className="flex items-center gap-1 px-3 py-2 bg-white/80 hover:bg-white/90 text-gray-900 text-sm font-medium rounded-md transition-all duration-200 backdrop-blur-sm"
                        aria-label={`Preview ${item.name}`}
                      >
                        <Eye size={14} />
                        Preview
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleActivateMailTheme(item);
                        }}
                        className="px-4 py-2 bg-blue-500/80 hover:bg-blue-500/90 text-white text-sm font-medium rounded-md transition-all duration-200 backdrop-blur-sm"
                        aria-label={`Activate ${item.name}`}
                      >
                        Activate
                      </button>
                    </div>
                  )}

                  {/* Inventory Count */}
                  {!isOneTimePurchase(item.category) &&
                    !item.isConceptPackGroup && (
                      <div className="mt-2 text-xs text-white/80 font-medium">
                        Owned: {item.quantity}
                      </div>
                    )}
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </article>
            ))}
          </div>

          {/* Concept Pack Modal */}
          {showConceptModal && selectedConceptPack && (
            <div
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999] p-4"
              onClick={closeConceptModal}
              onKeyDown={handleKeyDown}
              role="dialog"
              aria-modal="true"
              aria-labelledby="concept-modal-title"
            >
              <div
                className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2
                    id="concept-modal-title"
                    className="text-xl font-semibold text-gray-900 dark:text-white"
                  >
                    {selectedConceptPack.name}
                  </h2>
                  <button
                    onClick={closeConceptModal}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                    aria-label="Close concept pack preview"
                  >
                    <X size={20} className="text-gray-500 dark:text-gray-400" />
                  </button>
                </div>

                {/* Modal Content */}
                {selectedConceptPack.story && (
                  <div className="mb-8 p-6 bg-[var(--bg-primary)] rounded-lg border border-[var(--border)]">
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">
                      The Story
                    </h3>
                    <p className="text-[var(--text-secondary)] leading-relaxed text-sm">
                      {selectedConceptPack.story
                        .split("\n")
                        .map((line, idx) => (
                          <span key={idx}>
                            {line}
                            <br />
                          </span>
                        ))}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {(
                    selectedConceptPack.conceptImages ||
                    selectedConceptPack.items ||
                    []
                  ).map((image, index) => (
                    <div
                      key={index}
                      className={`rounded-lg overflow-hidden shadow-md ${
                        image.cardClass || `card-${image.id}`
                      }`}
                    >
                      <div className="w-full h-48" />
                      <div className="p-4 bg-[var(--bg-primary)]">
                        <h3 className="font-medium text-[var(--text-primary)] mb-2 text-sm">
                          {image.name}
                        </h3>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={closeConceptModal}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Mail Theme Preview Modal */}
          {isModalOpen && previewMailTheme && (
            <div
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999] p-4"
              onClick={closePreview}
              onKeyDown={handleKeyDown}
              role="dialog"
              aria-modal="true"
              aria-labelledby="mail-modal-title"
            >
              <div
                className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2
                    id="mail-modal-title"
                    className="text-xl font-semibold text-gray-900 dark:text-white"
                  >
                    {previewMailTheme.name} Preview
                  </h2>
                  <button
                    onClick={closePreview}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                    aria-label="Close preview"
                  >
                    <X size={20} className="text-gray-500 dark:text-gray-400" />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  {previewMailTheme.previewHtml ? (
                    <div
                      className={
                        previewMailTheme.cardClass ||
                        `card-${previewMailTheme.id}`
                      }
                      dangerouslySetInnerHTML={{
                        __html: previewMailTheme.previewHtml,
                      }}
                    />
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      Preview not available for this item.
                    </div>
                  )}
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={closePreview}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      handleActivateMailTheme(previewMailTheme);
                      closePreview();
                    }}
                    className="px-6 py-2 rounded-lg font-medium transition-all duration-200 bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    Activate
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ShopInventory;
