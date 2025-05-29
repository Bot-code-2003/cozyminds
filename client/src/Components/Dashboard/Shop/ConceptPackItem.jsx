"use client";

import { useState, useCallback } from "react";
import { X, Star, Package, Eye } from "lucide-react";

const ConceptPackItem = ({ item, isItemSoldOut, handlePurchase, coins }) => {
  const [showModal, setShowModal] = useState(false);
  const soldOut = isItemSoldOut(item);
  const canAfford = coins >= item.price;

  const openModal = useCallback(() => {
    setShowModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
  }, []);

  const onPurchase = useCallback(() => {
    handlePurchase(item);
    closeModal();
  }, [handlePurchase, item, closeModal]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") {
        closeModal();
      }
    },
    [closeModal]
  );

  // Safe image loading with fallback
  const handleImageError = (e) => {
    e.target.src = "/placeholder.svg?height=300&width=400";
  };

  return (
    <>
      {/* Concept Pack Card */}
      <article
        className="relative group h-60 flex flex-col overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer"
        onClick={openModal}
        role="button"
        tabIndex={0}
        aria-label={`View ${item.name} concept pack - ${item.price} coins`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openModal();
          }
        }}
      >
        {/* Background Images Grid */}
        <div className="absolute inset-0 grid grid-cols-3 gap-0">
          {[0, 1, 2].map((index) => (
            <div key={index} className="relative overflow-hidden">
              <img
                src={
                  item.conceptImages?.[index]?.image ||
                  "/placeholder.svg?height=300&width=400"
                }
                alt={`${item.name} preview ${index + 1}`}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={handleImageError}
                loading="lazy"
              />
            </div>
          ))}
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />

        {/* Badges */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10">
          {/* Featured Badge */}
          {item.featured && (
            <div className="flex items-center gap-1 px-2 py-1 bg-white/90 dark:bg-gray-900/90 text-gray-900 dark:text-white text-xs font-medium rounded-full backdrop-blur-sm">
              {item.featured === "Exclusive" && (
                <Star size={10} className="text-yellow-500" />
              )}
              {item.featured}
            </div>
          )}

          {/* Category Badge */}
          <div className="flex items-center gap-1 px-2 py-1 bg-purple-500/90 text-white text-xs font-medium rounded-full backdrop-blur-sm">
            <Package size={10} />
            Concept Pack
          </div>
        </div>

        {/* Content Area */}
        <div className="mt-auto p-4 flex flex-col items-center text-center z-20">
          <h3 className="text-xl font-semibold text-white mb-2 drop-shadow-lg line-clamp-1">
            {item.name}
          </h3>
          <p className="text-white/90 text-sm mb-3 drop-shadow-md line-clamp-2 leading-relaxed">
            {item.description}
          </p>

          {/* Price and Preview Button */}
          <div className="flex items-center justify-between w-full gap-3">
            <div className="flex items-center gap-1">
              <span className="text-yellow-300 text-lg">🪙</span>
              <span className="text-white font-semibold text-lg drop-shadow-md">
                {item.price.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 bg-white/20 text-white text-xs rounded-full backdrop-blur-sm">
              <Eye size={10} />
              Preview
            </div>
          </div>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </article>

      {/* Concept Pack Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999] p-4"
          onClick={closeModal}
          onKeyDown={handleKeyDown}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 z-10">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <Package
                      size={20}
                      className="text-purple-600 dark:text-purple-400"
                    />
                  </div>
                  <div>
                    <h2
                      id="modal-title"
                      className="text-2xl font-bold text-gray-900 dark:text-white"
                    >
                      {item.name}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Concept Pack
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                  aria-label="Close modal"
                >
                  <X size={24} className="text-gray-500 dark:text-gray-400" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Story Section */}
              <div className="mb-8 p-6 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="text-2xl">📖</span>
                  The Story
                </h3>
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  {item.story?.split("\n").map((line, idx) => (
                    <p
                      key={idx}
                      className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 last:mb-0"
                    >
                      {line}
                    </p>
                  ))}
                </div>
              </div>

              {/* Images Grid */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="text-2xl">🎨</span>
                  Concept Images
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {item.conceptImages?.map((image, index) => (
                    <div
                      key={index}
                      className="group rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-700"
                    >
                      <div className="relative overflow-hidden">
                        <img
                          src={
                            image.image ||
                            "/placeholder.svg?height=300&width=400"
                          }
                          alt={`${item.name} concept ${index + 1}`}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={handleImageError}
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                      </div>
                      <div className="p-4">
                        <h4 className="font-medium text-gray-900 dark:text-white line-clamp-1">
                          {image.name}
                        </h4>
                        {image.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                            {image.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-500 text-2xl">🪙</span>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {item.price.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    coins
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200"
                  >
                    Close
                  </button>
                  {soldOut ? (
                    <div className="px-6 py-3 bg-green-500 text-white rounded-lg font-medium flex items-center gap-2">
                      <span>✓</span>
                      Owned
                    </div>
                  ) : (
                    <button
                      onClick={onPurchase}
                      disabled={!canAfford}
                      className={`
                        px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2
                        ${
                          canAfford
                            ? "bg-purple-500 hover:bg-purple-600 text-white shadow-lg hover:shadow-xl"
                            : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                        }
                      `}
                      aria-label={`Purchase ${item.name} for ${item.price} coins`}
                    >
                      <Package size={16} />
                      {canAfford
                        ? "Purchase Concept Pack"
                        : "Insufficient Coins"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ConceptPackItem;
