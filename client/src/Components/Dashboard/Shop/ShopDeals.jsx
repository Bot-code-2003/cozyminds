"use client";

import { useState } from "react";
import {
  Gift,
  Tag,
  ArrowRight,
  Check,
  ShoppingBag,
  Percent,
} from "lucide-react";

const ShopDeals = ({ deals, shopItems, inventory, coins, handlePurchase }) => {
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);

  // Filter items based on deal type
  const getEligibleItems = (deal) => {
    if (deal.itemType === "exclusive") {
      return shopItems.filter(
        (item) =>
          item.featured === "Exclusive" &&
          !inventory.some((i) => i.id === item.id)
      );
    } else if (deal.itemType === "regular") {
      return shopItems.filter(
        (item) =>
          !item.featured &&
          !item.id.includes("pastel") &&
          !inventory.some((i) => i.id === item.id)
      );
    } else if (deal.itemType === "pastel") {
      return shopItems.filter(
        (item) =>
          item.id.includes("pastel") && !inventory.some((i) => i.id === item.id)
      );
    }
    return [];
  };

  const selectDeal = (deal) => {
    setSelectedDeal(deal);
    setSelectedItems([]);
  };

  const toggleItemSelection = (item) => {
    if (selectedItems.some((i) => i.id === item.id)) {
      setSelectedItems(selectedItems.filter((i) => i.id !== item.id));
    } else {
      if (selectedItems.length < selectedDeal.items) {
        setSelectedItems([...selectedItems, item]);
      }
    }
  };

  const isItemSelected = (itemId) => {
    return selectedItems.some((item) => item.id === itemId);
  };

  const handleDealPurchase = async () => {
    if (selectedItems.length !== selectedDeal.items) {
      return;
    }

    // Create a bundle item
    const bundleItem = {
      id: `bundle_${Date.now()}`,
      name: selectedDeal.name,
      description: `Bundle of ${selectedItems.length} items`,
      price: selectedDeal.price,
      category: "bundle",
      bundledItems: selectedItems,
    };

    await handlePurchase(bundleItem);
    setSelectedDeal(null);
    setSelectedItems([]);
  };

  return (
    <div>
      {selectedDeal ? (
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-[var(--text-primary)]">
                {selectedDeal.name}
              </h2>
              <p className="text-[var(--text-secondary)]">
                {selectedDeal.description}
              </p>
            </div>
            <button
              onClick={() => setSelectedDeal(null)}
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              Back to deals
            </button>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-[var(--text-primary)]">
                Select {selectedDeal.items} items:
              </h3>
              <div className="flex items-center">
                <span className="text-[var(--text-secondary)] line-through mr-2">
                  🪙 {selectedDeal.originalPrice}
                </span>
                <span className="text-[var(--accent)] font-bold">
                  🪙 {selectedDeal.price}
                </span>
              </div>
            </div>
            <div className="flex items-center mb-2">
              <div className="w-full bg-[var(--border)] h-2 rounded-full">
                <div
                  className="bg-[var(--accent)] h-2 rounded-full transition-all"
                  style={{
                    width: `${
                      (selectedItems.length / selectedDeal.items) * 100
                    }%`,
                  }}
                ></div>
              </div>
              <span className="ml-3 text-[var(--text-primary)] font-medium">
                {selectedItems.length}/{selectedDeal.items}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {getEligibleItems(selectedDeal).map((item) => (
              <div
                key={item.id}
                onClick={() => toggleItemSelection(item)}
                className={`border p-4 rounded-lg cursor-pointer transition-all ${
                  isItemSelected(item.id)
                    ? "border-[var(--accent)] bg-[var(--accent)]/10"
                    : "border-[var(--border)] hover:border-[var(--accent)]"
                }`}
              >
                <div className="flex items-start">
                  <div className="flex-grow">
                    <h4 className="font-medium text-[var(--text-primary)]">
                      {item.name}
                    </h4>
                    <p className="text-xs text-[var(--text-secondary)]">
                      {item.description}
                    </p>
                  </div>
                  <div className="ml-2">
                    {isItemSelected(item.id) ? (
                      <div className="w-6 h-6 rounded-full bg-[var(--accent)] flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full border border-[var(--border)]"></div>
                    )}
                  </div>
                </div>
                <div className="mt-2 flex items-center">
                  <span className="text-yellow-300 mr-1">🪙</span>
                  <span className="text-[var(--text-primary)]">
                    {item.price}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleDealPurchase}
              disabled={
                selectedItems.length !== selectedDeal.items ||
                coins < selectedDeal.price
              }
              className={`px-4 py-2 rounded-md transition-all flex items-center ${
                selectedItems.length === selectedDeal.items &&
                coins >= selectedDeal.price
                  ? "bg-[var(--accent)] cursor-pointer text-white hover:bg-opacity-90"
                  : "bg-gray-500 text-white bg-opacity-70 cursor-not-allowed"
              }`}
            >
              <ShoppingBag size={16} className="mr-2" />
              Purchase Bundle for 🪙 {selectedDeal.price}
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.map((deal) => (
            <div
              key={deal.id}
              className="border border-[var(--border)] rounded-lg overflow-hidden bg-[var(--bg-secondary)] hover:shadow-lg transition-all duration-300 relative"
            >
              <div className="absolute top-3 right-3 bg-[var(--accent)] text-white text-xs px-2 py-1 rounded-full z-10">
                {deal.category}
              </div>

              {deal.featured && (
                <div className="absolute top-3 left-3 bg-[var(--bg-secondary)] text-[var(--text-primary)] text-xs px-2 py-1 rounded-full z-10 flex items-center">
                  <Percent size={10} className="mr-1" />
                  {deal.featured}
                </div>
              )}

              <div className="p-6">
                <div className="flex items-center mb-2">
                  <Gift className="text-[var(--accent)] mr-2" size={20} />
                  <h3 className="text-xl font-semibold text-[var(--text-primary)]">
                    {deal.name}
                  </h3>
                </div>

                <p className="text-[var(--text-secondary)] mb-4">
                  {deal.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <span className="text-[var(--text-secondary)] line-through mr-2">
                      🪙 {deal.originalPrice}
                    </span>
                    <span className="text-[var(--accent)] font-bold">
                      🪙 {deal.price}
                    </span>
                  </div>
                  <div className="text-[var(--text-secondary)] text-sm">
                    Save 🪙 {deal.originalPrice - deal.price}
                  </div>
                </div>

                <button
                  onClick={() => selectDeal(deal)}
                  className="w-full py-2 bg-[var(--accent)] text-white rounded-md flex items-center justify-center hover:bg-opacity-90 transition-all"
                >
                  <Tag size={16} className="mr-2" />
                  Select {deal.items} Items
                  <ArrowRight size={16} className="ml-2" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShopDeals;
