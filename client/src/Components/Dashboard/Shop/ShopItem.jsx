"use client";

import { Star, Eye, X, Mail } from "lucide-react";
import { useState, useCallback } from "react";

const ShopItem = ({
  item,
  isItemSoldOut,
  handlePurchase,
  coins,
  isOneTimePurchase,
  getInventoryItemCount,
  handlePreviewMailTheme,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const soldOut = isItemSoldOut(item);
  const canAfford = coins >= item.price;
  const inventoryCount = getInventoryItemCount(item.id);
  const showInventoryCount =
    !soldOut && !isOneTimePurchase(item.category) && inventoryCount > 0;

  const openModal = useCallback((e) => {
    e.stopPropagation();
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const onPurchase = useCallback(() => {
    handlePurchase(item);
  }, [handlePurchase, item]);

  // Handle keyboard navigation for modal
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") {
        closeModal();
      }
    },
    [closeModal]
  );

  return (
    <>
      {/* Shop Item Card */}
      <article
        className={`
          relative group h-60 flex flex-col overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 
          bg-white dark:bg-gray-800 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer
          ${item.featuredStyle || ""} ${
          item.cardClass || `card-${item.id.replace("theme_", "")}`
        }
        `}
        role="button"
        tabIndex={0}
        aria-label={`${item.name} - ${item.price} coins`}
      >
        {/* Badges */}
        <div className="  flex justify-between items-start z-10">
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
            {item.category === "mailtheme" ? "Mail Theme" : item.category}
          </div>
        </div>

        {/* Emoji Display */}
        {item.isEmoji && (
          <div className="flex-grow flex items-center justify-center">
            <span
              className="text-6xl transform group-hover:scale-110 transition-transform duration-300"
              role="img"
              aria-label={item.name}
            >
              {item.image}
            </span>
          </div>
        )}

        {/* Mail Theme Icon */}
        {item.category === "mailtheme" && !item.isEmoji && (
          <div className="flex-grow flex items-center justify-center">
            <Mail size={40} />
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
          <div className="flex justify-center items-center w-full gap-2">
            {/* Preview Button for Mail Themes */}
            {item.category === "mailtheme" && (
              <button
                onClick={openModal}
                className="flex items-center gap-1 px-3 py-2 bg-white/80 hover:bg-white/90 text-gray-900 text-sm font-medium rounded-md transition-all duration-200 backdrop-blur-sm"
                aria-label={`Preview ${item.name}`}
              >
                <Eye size={14} />
                Preview
              </button>
            )}

            {/* Purchase/Owned Button */}
            {soldOut ? (
              <div className="px-4 py-2 bg-green-500/80 text-white text-sm font-medium rounded-md backdrop-blur-sm">
                ✓ Owned
              </div>
            ) : (
              <button
                onClick={onPurchase}
                disabled={!canAfford}
                className={`
                  px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 backdrop-blur-sm
                  ${
                    canAfford
                      ? "bg-blue-500/80 hover:bg-blue-500/90 text-white cursor-pointer hover:shadow-md"
                      : "bg-gray-500/60 text-white/70 cursor-not-allowed"
                  }
                `}
                aria-label={`Purchase ${item.name} for ${item.price} coins`}
              >
                🪙 {item.price.toLocaleString()}
              </button>
            )}
          </div>

          {/* Inventory Count */}
          {showInventoryCount && (
            <div className="mt-2 text-xs text-white/80 font-medium">
              Owned: {inventoryCount}
            </div>
          )}
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </article>

      {/* Preview Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999] p-4"
          onClick={closeModal}
          onKeyDown={handleKeyDown}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h2
                id="modal-title"
                className="text-xl font-semibold text-gray-900 dark:text-white"
              >
                {item.name} Preview
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                aria-label="Close preview"
              >
                <X size={20} className="text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="prose prose-sm max-w-none dark:prose-invert">
              {item.previewHtml ? (
                <div
                  className={item.cardClass || `card-${item.id}`}
                  dangerouslySetInnerHTML={{ __html: item.previewHtml }}
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
                onClick={closeModal}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200"
              >
                Close
              </button>
              {!soldOut && (
                <button
                  onClick={() => {
                    onPurchase();
                    closeModal();
                  }}
                  disabled={!canAfford}
                  className={`
                    px-6 py-2 rounded-lg font-medium transition-all duration-200
                    ${
                      canAfford
                        ? "bg-blue-500 hover:bg-blue-600 text-white"
                        : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    }
                  `}
                >
                  Purchase for 🪙 {item.price.toLocaleString()}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShopItem;
