"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCoins } from "../../../context/CoinContext.jsx";
import { useDarkMode } from "../../../context/ThemeContext.jsx";

import Navbar from "../Navbar.jsx";
import { Package, Tag, BookOpen, Mail, Coins, Gift, Crown } from "lucide-react";
import ShopItem from "./ShopItem.jsx";
import ShopInventory from "./ShopInventory";
import ConceptPackItem from "./ConceptPackItem.jsx";

import { shopItems } from "./ShopItems.js";

const CozyShop = () => {
  const navigate = useNavigate();
  const {
    coins,
    inventory,
    purchaseItem,
    syncCoinsFromStorage,
    userData,
    updateUserData,
  } = useCoins();

  const { darkMode } = useDarkMode();
  const [notification, setNotification] = useState(null);
  const [activeTab, setActiveTab] = useState("shop");
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeMailTheme, setActiveMailTheme] = useState(null);
  const [previewMailTheme, setPreviewMailTheme] = useState(null);

  // Sync coins when component mounts
  useEffect(() => {
    syncCoinsFromStorage();
    if (userData && userData.activeMailTheme) {
      setActiveMailTheme(userData.activeMailTheme);
    }
  }, []);

  const isOneTimePurchase = (category) => {
    return ["theme", "badge", "conceptpack", "mailtheme"].includes(category);
  };

  const isItemSoldOut = (item) => {
    if (item.category === "conceptpack") {
      return inventory.some((invItem) => invItem.parentPack === item.id);
    }

    if (isOneTimePurchase(item.category)) {
      return inventory.some((i) => i.id === item.id);
    }

    return false;
  };

  const handlePurchase = async (item) => {
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

    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const getInventoryItemCount = (itemId) => {
    const item = inventory.find((i) => i.id === itemId);
    return item ? item.quantity : 0;
  };

  const handlePreviewMailTheme = (theme) => {
    setPreviewMailTheme(theme);
  };

  const activateMailTheme = async (themeId) => {
    try {
      if (userData) {
        const updatedUser = { ...userData, activeMailTheme: themeId };
        updateUserData(updatedUser);
        setActiveMailTheme(themeId);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error activating mail theme:", error);
      return false;
    }
  };

  // Filter items
  const filteredItems = (() => {
    let items = shopItems.filter((item) => {
      if (isOneTimePurchase(item.category) && isItemSoldOut(item)) {
        return false;
      }
      return true;
    });

    if (activeCategory !== "all") {
      switch (activeCategory) {
        case "exclusive":
          items = items.filter((item) => item.featured === "Exclusive");
          break;
        case "conceptpack":
          items = items.filter((item) => item.category === "conceptpack");
          break;
        case "mailtheme":
          items = items.filter((item) => item.category === "mailtheme");
          break;
        case "regular":
          items = items.filter(
            (item) =>
              !item.featured &&
              item.category !== "conceptpack" &&
              item.category !== "mailtheme"
          );
          break;
      }
    }

    return items;
  })();

  const categories = [
    { id: "all", name: "All", icon: <Package size={16} /> },
    { id: "exclusive", name: "Exclusive", icon: <Crown size={16} /> },
    { id: "conceptpack", name: "Concept Packs", icon: <BookOpen size={16} /> },
    { id: "mailtheme", name: "Mail Themes", icon: <Mail size={16} /> },
    { id: "regular", name: "Regular", icon: <Tag size={16} /> },
  ];

  if (!userData) {
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] text-gray-900 dark:text-gray-100">
      <Navbar />

      <div className="max-w-7xl mx-auto py-8 px-2 sm:px-0">
        {/* Compact Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center mb-6">Shop</h1>

          {/* Compact Top Bar */}
          <div className="flex items-center justify-between mb-6">
            {/* Compact Coins */}
            <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm">
              <Coins size={14} className="text-yellow-600" />
              <span className="font-medium">{coins.toLocaleString()}</span>
            </div>

            {/* Compact Tabs */}
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded p-0.5">
              <button
                className={`px-4 py-1 rounded text-sm font-medium transition-colors ${
                  activeTab === "shop"
                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    : "text-gray-600 dark:text-gray-400"
                }`}
                onClick={() => setActiveTab("shop")}
              >
                Shop
              </button>
              <button
                className={`px-4 py-1 rounded text-sm font-medium transition-colors ${
                  activeTab === "inventory"
                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    : "text-gray-600 dark:text-gray-400"
                }`}
                onClick={() => setActiveTab("inventory")}
              >
                Items
              </button>
            </div>
          </div>

          {/* Compact Categories */}
          {activeTab === "shop" && (
            <div className="flex flex-wrap gap-1 justify-center">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    activeCategory === category.id
                      ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Compact Notification */}
        {notification && (
          <div className="mb-4 max-w-md mx-auto">
            <div
              className={`p-3 rounded text-sm ${
                notification.type === "success"
                  ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800"
                  : "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800"
              }`}
            >
              {notification.message}
            </div>
          </div>
        )}

        {/* Shop Content */}
        {activeTab === "shop" && (
          <>
            {/* Simple Categories */}

            {/* Items */}
            <div>
              <h2 className="text-xl font-semibold mb-4">
                {activeCategory === "all"
                  ? "All Items"
                  : categories.find((c) => c.id === activeCategory)?.name}
              </h2>

              {filteredItems.length === 0 ? (
                <div className="text-center py-16">
                  <Gift size={48} className="text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    No items available
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Check back later for new items
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredItems.map((item) =>
                    item.category === "conceptpack" ? (
                      <ConceptPackItem
                        key={item.id}
                        item={item}
                        isItemSoldOut={isItemSoldOut}
                        handlePurchase={handlePurchase}
                        coins={coins}
                      />
                    ) : (
                      <ShopItem
                        key={item.id}
                        item={item}
                        isItemSoldOut={isItemSoldOut}
                        handlePurchase={handlePurchase}
                        coins={coins}
                        isOneTimePurchase={isOneTimePurchase}
                        getInventoryItemCount={getInventoryItemCount}
                        handlePreviewMailTheme={handlePreviewMailTheme}
                      />
                    )
                  )}
                </div>
              )}
            </div>
          </>
        )}

        {/* Inventory */}
        {activeTab === "inventory" && (
          <ShopInventory
            inventory={inventory}
            setActiveTab={setActiveTab}
            isOneTimePurchase={isOneTimePurchase}
            activateMailTheme={activateMailTheme}
          />
        )}
      </div>
    </div>
  );
};

export default CozyShop;
