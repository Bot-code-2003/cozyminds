"use client";

import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

// Configure Axios with base URL
const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });

export const CoinContext = createContext();

export const CoinProvider = ({ children }) => {
  const [coins, setCoins] = useState(0);
  const [inventory, setInventory] = useState([]);
  const [userData, setUserData] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showCoinPopup, setShowCoinPopup] = useState(false);
  const [coinsEarned, setCoinsEarned] = useState(0);

  // Function to sync user data from session storage
  const syncUserData = () => {
    const user = JSON.parse(sessionStorage.getItem("user") || "null");
    if (user) {
      setUserData(user);
      setCoins(user.coins || 0);
      setInventory(user.inventory || []);
      return user;
    }
    return null;
  };

  // Initialize user data
  useEffect(() => {
    syncUserData();
    setIsInitialized(true);
  }, []);

  // Add a listener for storage events to sync coins across tabs
  useEffect(() => {
    const handleStorageChange = () => {
      syncUserData();
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Add a listener for login events
  useEffect(() => {
    const handleLoginEvent = (event) => {
      // Access the coinsEarned from the event detail
      const { user, coinsEarned } = event.detail;
      console.log("Login event received:", event.detail);
      console.log("Coins earned from login:", coinsEarned);

      syncUserData();

      // Show coin popup if coins were earned during login
      if (coinsEarned && coinsEarned > 0) {
        console.log("Showing coin popup for", coinsEarned, "coins");
        setCoinsEarned(coinsEarned);
        setShowCoinPopup(true);

        // Hide popup after 3 seconds
        setTimeout(() => {
          setShowCoinPopup(false);
        }, 3000);
      }
    };

    window.addEventListener("user-logged-in", handleLoginEvent);
    return () => {
      window.removeEventListener("user-logged-in", handleLoginEvent);
    };
  }, []);

  const updateUserCoins = async (userId, coinsToAdd) => {
    try {
      const user = JSON.parse(sessionStorage.getItem("user") || "null");
      if (!user) return;

      const newCoins = (user.coins || 0) + coinsToAdd;

      const response = await API.put(`/user/${userId}`, {
        coins: newCoins,
        lastVisited: new Date(),
      });

      setCoins(newCoins);
      const updatedUser = { ...user, coins: newCoins, lastVisited: new Date() };
      sessionStorage.setItem("user", JSON.stringify(updatedUser));

      // Show popup for manually awarded coins too
      if (coinsToAdd > 0) {
        setCoinsEarned(coinsToAdd);
        setShowCoinPopup(true);

        // Hide popup after 3 seconds
        setTimeout(() => {
          setShowCoinPopup(false);
        }, 3000);
      }

      return newCoins;
    } catch (error) {
      console.error("Error updating coins:", error);
      return null;
    }
  };

  const purchaseItem = async (item) => {
    try {
      if (coins < item.price) {
        return { success: false, message: "Not enough coins" };
      }

      const user = JSON.parse(sessionStorage.getItem("user") || "null");
      if (!user) return { success: false, message: "User not logged in" };

      const newCoins = coins - item.price;
      const newInventory = [...inventory];
      const existingItem = newInventory.find((i) => i.id === item.id);

      if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
      } else {
        newInventory.push({ ...item, quantity: 1 });
      }

      const response = await API.put(`/user/${user._id}`, {
        coins: newCoins,
        inventory: newInventory,
      });

      setCoins(newCoins);
      setInventory(newInventory);
      const updatedUser = { ...user, coins: newCoins, inventory: newInventory };
      sessionStorage.setItem("user", JSON.stringify(updatedUser));

      return { success: true, message: "Item purchased successfully" };
    } catch (error) {
      console.error("Error purchasing item:", error);
      return { success: false, message: "Error purchasing item" };
    }
  };

  const syncCoinsFromStorage = () => {
    syncUserData();
  };

  // Function to manually trigger coin popup (for testing or other components)
  const showCoinAward = (amount) => {
    setCoinsEarned(amount);
    setShowCoinPopup(true);
    setTimeout(() => {
      setShowCoinPopup(false);
    }, 3000);
  };

  return (
    <CoinContext.Provider
      value={{
        coins,
        setCoins,
        inventory,
        setInventory,
        updateUserCoins,
        purchaseItem,
        syncCoinsFromStorage,
        isInitialized,
        showCoinPopup,
        coinsEarned,
        showCoinAward,
      }}
    >
      {children}
      {/* Global coin popup that can be shown from anywhere */}

      {showCoinPopup && (
        <div
          className="fixed top-10 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-100 via-yellow-50 to-white border border-yellow-400 text-yellow-800 px-6 py-3 rounded-xl shadow-xl flex items-center space-x-3 animate-fade-in"
          style={{
            zIndex: 99999,
          }}
        >
          <span className="text-2xl font-bold text-yellow-700">
            +{coinsEarned}
          </span>
          <span className="text-3xl">🪙</span>
          <span className="font-semibold text-sm opacity-80">
            Coins Earned!
          </span>
        </div>
      )}
    </CoinContext.Provider>
  );
};

export const useCoins = () => useContext(CoinContext);
