"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCoins } from "../../context/CoinContext";
import { useDarkMode } from "../../context/ThemeContext";
import Navbar from "./Navbar";
import {
  ShoppingCart,
  Package,
  Tag,
  Star,
  Shield,
  Sparkles,
} from "lucide-react";

const CozyShop = () => {
  const navigate = useNavigate();
  const { coins, inventory, purchaseItem, syncCoinsFromStorage } = useCoins();
  const { darkMode } = useDarkMode();
  const [notification, setNotification] = useState(null);
  const [activeTab, setActiveTab] = useState("shop");
  const [activeCategory, setActiveCategory] = useState("all");
  const [animateCoins, setAnimateCoins] = useState(false);

  // Sync coins when component mounts
  useEffect(() => {
    syncCoinsFromStorage();
  }, []);

  // Shop items with enhanced descriptions and categories
  const shopItems = [
    {
      id: "theme_forest",
      name: "Forest Theme",
      description:
        "Transform your journal with serene forest visuals and calming nature sounds",
      price: 50,
      image: "🌲",
      category: "theme",
      featured: true,
    },
    {
      id: "theme_ocean",
      name: "Ocean Theme",
      description:
        "Immerse yourself in tranquil ocean waves and coastal ambiance",
      price: 50,
      image: "🌊",
      category: "theme",
    },
    {
      id: "theme_christmas",
      name: "Christmas Theme",
      description:
        "Celebrate the festive season with this festive Christmas-themed theme",
      price: 50,
      image: "🎄",
      category: "theme",
    },
    {
      id: "theme_halloween",
      name: "Halloween Theme",
      description:
        "Scare your friends and family with this spooky Halloween-themed theme",
      price: 50,
      image: "🎃",
      category: "theme",
    },
    {
      id: "theme_pets",
      name: "Pets Theme",
      description:
        "Immerse yourself in the warmth and companionship of your furry friends",
      price: 50,
      image: "🐶",
      category: "theme",
    },
  ];

  // Categories for filtering
  const categories = [
    { id: "all", name: "All Items", icon: Tag },
    { id: "theme", name: "Themes", icon: Sparkles },
    { id: "sticker", name: "Stickers", icon: Star },
    { id: "badge", name: "Badges", icon: Shield },
  ];

  // Filter items based on active category
  const filteredItems =
    activeCategory === "all"
      ? shopItems
      : shopItems.filter((item) => item.category === activeCategory);

  // Add a function to check if an item is a one-time purchase
  const isOneTimePurchase = (category) => {
    // Items like themes and badges should only be purchased once
    return ["theme", "badge"].includes(category);
  };

  const isItemSoldOut = (item) => {
    // For one-time purchase items, check if the user already owns it
    if (isOneTimePurchase(item.category)) {
      return inventory.some((i) => i.id === item.id);
    }
    return false;
  };

  const handlePurchase = async (item) => {
    // Check if the item is already owned and is a one-time purchase
    if (isItemSoldOut(item)) {
      setNotification({
        type: "error",
        message: "You already own this item!",
      });

      setTimeout(() => {
        setNotification(null);
      }, 3000);

      return;
    }

    // Animate coins before purchase
    setAnimateCoins(true);
    setTimeout(() => setAnimateCoins(false), 500);

    const result = await purchaseItem(item);

    if (result.success) {
      setNotification({
        type: "success",
        message: `Successfully purchased ${item.name}!`,
      });
    } else {
      setNotification({
        type: "error",
        message: result.message,
      });
    }

    // Clear notification after 3 seconds
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const getInventoryItemCount = (itemId) => {
    const item = inventory.find((i) => i.id === itemId);
    return item ? item.quantity : 0;
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
              Cozy Shop
            </h1>
            <p className="text-[var(--text-secondary)]">
              Enhance your journaling experience with unique items
            </p>
          </div>
          <div
            className={`flex items-center px-5 py-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg shadow-sm transition-all ${
              animateCoins ? "scale-110" : ""
            }`}
          >
            <span className="text-yellow-300 mr-2 text-2xl">🪙</span>
            <span className="text-[var(--text-primary)] text-xl font-medium">
              {coins}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[var(--border)] mb-6">
          <button
            className={`px-4 py-3 font-medium transition-colors ${
              activeTab === "shop"
                ? "text-[var(--accent)] border-b-2 border-[var(--accent)]"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
            onClick={() => setActiveTab("shop")}
          >
            <ShoppingCart className="inline mr-2" size={16} />
            Shop
          </button>
          <button
            className={`px-4 py-3 font-medium transition-colors ${
              activeTab === "inventory"
                ? "text-[var(--accent)] border-b-2 border-[var(--accent)]"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
            onClick={() => setActiveTab("inventory")}
          >
            <Package className="inline mr-2" size={16} />
            My Items
          </button>
        </div>

        {/* Notification */}
        {notification && (
          <div
            className={`mb-6 p-4 rounded-md shadow-md transition-all duration-300 ease-in-out ${
              notification.type === "success"
                ? "bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-200 border-l-4 border-green-500"
                : "bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-200 border-l-4 border-red-500"
            }`}
          >
            {notification.type === "success" ? (
              <div className="flex items-center">
                <Sparkles className="mr-2" size={18} />
                {notification.message}
              </div>
            ) : (
              notification.message
            )}
          </div>
        )}

        {/* Shop Items */}
        {activeTab === "shop" && (
          <>
            {/* Category filters */}
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeCategory === category.id
                      ? "bg-[var(--accent)] text-white shadow-md"
                      : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]/80"
                  }`}
                >
                  <category.icon size={14} className="mr-1.5" />
                  {category.name}
                </button>
              ))}
            </div>

            {/* All items grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => {
                const soldOut = isItemSoldOut(item);
                return (
                  <div
                    key={item.id}
                    className="border border-[var(--border)] rounded-lg overflow-hidden bg-[var(--bg-secondary)] hover:shadow-md transition-all duration-300 relative group"
                  >
                    {item.featured && activeCategory !== "all" && (
                      <div className="absolute top-3 right-3 bg-[var(--accent)] text-white text-xs px-2 py-1 rounded-full z-10">
                        Featured
                      </div>
                    )}
                    <div className="p-6 flex flex-col items-center">
                      <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                        {item.image}
                      </div>
                      <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                        {item.name}
                      </h3>
                      <p className="text-[var(--text-secondary)] text-sm mb-4 text-center">
                        {item.description}
                      </p>
                      <div className="flex justify-between items-center w-full mt-auto">
                        <div className="flex items-center">
                          <span className="text-yellow-300 mr-1">🪙</span>
                          <span className="text-[var(--text-primary)]">
                            {item.price}
                          </span>
                        </div>
                        {soldOut ? (
                          <span className="px-4 py-2 rounded-md bg-gray-300 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                            Owned
                          </span>
                        ) : (
                          <button
                            onClick={() => handlePurchase(item)}
                            disabled={coins < item.price}
                            className={`px-4 py-2 rounded-md transition-all ${
                              coins >= item.price
                                ? "bg-[var(--accent)] text-white hover:bg-opacity-90 hover:shadow-md"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700"
                            }`}
                          >
                            Buy
                          </button>
                        )}
                      </div>
                      {!soldOut &&
                        !isOneTimePurchase(item.category) &&
                        getInventoryItemCount(item.id) > 0 && (
                          <div className="mt-2 text-sm text-[var(--text-secondary)]">
                            Owned: {getInventoryItemCount(item.id)}
                          </div>
                        )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Inventory */}
        {activeTab === "inventory" && (
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
                  Purchase items from the shop to customize your journaling
                  experience
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
                    Items you've purchased from the Cozy Shop
                  </p>
                </div>

                {/* Themes Section */}
                {inventory.filter((item) => item.category === "theme").length >
                  0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4 flex items-center">
                      <Sparkles className="mr-2" size={16} />
                      Themes
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {inventory
                        .filter((item) => item.category === "theme")
                        .map((item) => (
                          <div
                            key={item.id}
                            className="border border-[var(--border)] rounded-lg overflow-hidden bg-[var(--bg-secondary)] hover:shadow-md transition-all duration-300"
                          >
                            <div className="p-6 flex flex-col items-center">
                              <div className="text-6xl mb-4 hover:animate-pulse">
                                {item.image}
                              </div>
                              <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                                {item.name}
                              </h3>
                              <p className="text-[var(--text-secondary)] text-sm mb-4 text-center">
                                {item.description}
                              </p>
                              <p className="text-sm text-[var(--text-secondary)]">
                                Use this theme when creating a new journal entry
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Other Items Section */}
                {inventory.filter((item) => item.category !== "theme").length >
                  0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4 flex items-center">
                      <Star className="mr-2" size={16} />
                      Other Items
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {inventory
                        .filter((item) => item.category !== "theme")
                        .map((item) => (
                          <div
                            key={item.id}
                            className="border border-[var(--border)] rounded-lg overflow-hidden bg-[var(--bg-secondary)] hover:shadow-md transition-all duration-300"
                          >
                            <div className="p-6 flex flex-col items-center">
                              <div className="text-6xl mb-4 hover:animate-pulse">
                                {item.image}
                              </div>
                              <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                                {item.name}
                              </h3>
                              <p className="text-[var(--text-secondary)] text-sm mb-4 text-center">
                                {item.description}
                              </p>
                              {!isOneTimePurchase(item.category) && (
                                <div className="mt-2 px-3 py-1 bg-[var(--bg-primary)] rounded-full text-sm text-[var(--text-secondary)]">
                                  Quantity: {item.quantity}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CozyShop;
