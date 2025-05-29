"use client";

import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Sun,
  Moon,
  Plus,
  ChevronDown,
  Mail,
  ShoppingBag,
  User,
  Settings,
  LogOut,
  Coins,
  Menu,
  X,
  Star,
} from "lucide-react";
import InGameMail from "./Mail/InGameMail";
import axios from "axios";
import { useDarkMode } from "../../context/ThemeContext";
import { useCoins } from "../../context/CoinContext.jsx";

// Configure API
const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });

const Navbar = ({
  name = "New Entry",
  link = "/journaling-alt",
  // coins = 0,
  // isInitialized = false,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mailModalOpen, setMailModalOpen] = useState(false);
  const [mails, setMails] = useState([]);
  const [hasUnreadMails, setHasUnreadMails] = useState(false);
  const [userData, setUserData] = useState(null);
  const dropdownRef = useRef(null);
  const { darkMode, setDarkMode } = useDarkMode();

  const { coins } = useCoins();

  const isRootPath = location.pathname === "/";
  const isJournalingAlt = location.pathname === "/journaling-alt";

  // Load user data once
  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user") || "null");
    setUserData(user);
  }, []);

  const userId = userData?._id;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch mails
  useEffect(() => {
    if (!userId) {
      setMails([]);
      setHasUnreadMails(false);
      return;
    }

    const fetchMails = async () => {
      try {
        const response = await API.get(`/mails/${userId}`);
        const fetchedMails = response.data.mails;
        setMails(fetchedMails);
        setHasUnreadMails(fetchedMails.some((mail) => !mail.read));
      } catch (err) {
        console.error("Error fetching mails:", err);
        setMails([]);
        setHasUnreadMails(false);
      }
    };

    fetchMails();
  }, [userId]);

  if (location.pathname === "/" && link === "/") return null;

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    window.location.href = "/";
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="w-full bg-white/80 dark:bg-[#1A1A1A]/80 backdrop-blur-md border-b border-gray-200/20 dark:border-gray-700/20 py-3 px-4 md:px-6 flex justify-between items-center sticky top-0 z-[999] shadow-sm">
        {/* Logo */}
        <button
          onClick={() => handleNavigation("/")}
          className="flex items-center group cursor-pointer"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-[#5999a8] to-purple-500 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
            <span className="text-white font-bold text-sm">
              <Star size={16} className="text-white" />
            </span>
          </div>
          <div className="text-lg font-bold tracking-tight">
            <span className="text-[#5999a8]">STARLIT</span>
            <span className="text-gray-800 dark:text-gray-200">JOURNALS</span>
          </div>
        </button>

        {/* Desktop Right Controls */}
        <div className="hidden md:flex items-center space-x-3">
          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {/* Shop Button */}
            <button
              onClick={() => handleNavigation("/cozyshop")}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-all duration-200 group"
              aria-label="Shop"
            >
              <ShoppingBag
                size={18}
                className="text-gray-600 dark:text-gray-400 group-hover:text-[#5999a8]"
              />
            </button>

            {/* Mail Button */}
            <button
              onClick={() => setMailModalOpen(!mailModalOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-all duration-200 group relative"
              aria-label="Mail"
            >
              <Mail
                size={18}
                className="text-gray-600 dark:text-gray-400 group-hover:text-[#5999a8]"
              />
              {hasUnreadMails && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-[#1A1A1A] animate-pulse"></span>
              )}
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-all duration-200 group"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun
                  size={18}
                  className="text-gray-600 dark:text-gray-400 group-hover:text-yellow-500"
                />
              ) : (
                <Moon
                  size={18}
                  className="text-gray-600 dark:text-gray-400 group-hover:text-blue-500"
                />
              )}
            </button>
            {/* Coins Display */}
            {
              <div className="flex items-center px-3 py-2 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-lg border border-yellow-400/30">
                <Coins
                  size={16}
                  className="text-yellow-600 dark:text-yellow-400 mr-2"
                />
                <span className="font-semibold text-yellow-700 dark:text-yellow-300">
                  {coins.toLocaleString()}
                </span>
              </div>
            }
          </div>

          {/* New Entry Button */}
          {!isJournalingAlt && (
            <button
              onClick={() => handleNavigation(link)}
              className="flex items-center px-4 py-2 bg-[#5999a8] text-white rounded-lg hover:bg-[#5999a8]/90 transition-all duration-200 font-medium"
            >
              <Plus size={16} className="mr-2" />
              {name}
            </button>
          )}

          {/* User Dropdown */}
          {userData && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-[#5999a8] transition-all duration-200 group"
              >
                <User
                  size={16}
                  className="mr-2 text-gray-600 dark:text-gray-400 group-hover:text-[#5999a8]"
                />
                <span className="text-gray-700 dark:text-gray-300 group-hover:text-[#5999a8]">
                  {userData.nickname || "User"}
                </span>
                <ChevronDown
                  size={16}
                  className="ml-2 text-gray-600 dark:text-gray-400 group-hover:text-[#5999a8]"
                />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#2A2A2A] rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-30">
                  <button
                    onClick={() => {
                      handleNavigation("/profile-settings");
                      setDropdownOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-[#5999a8] transition-all duration-200"
                  >
                    <Settings size={16} className="mr-3" />
                    Profile Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                  >
                    <LogOut size={16} className="mr-3" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors duration-200"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? (
            <X size={24} className="text-gray-700 dark:text-gray-300" />
          ) : (
            <Menu size={24} className="text-gray-700 dark:text-gray-300" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[73px] bg-white/95 dark:bg-[#1A1A1A]/95 backdrop-blur-md z-30">
          <div className="p-4 space-y-4">
            {/* Coins Display Mobile */}
            {
              <div className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-lg border border-yellow-400/30">
                <Coins
                  size={18}
                  className="text-yellow-600 dark:text-yellow-400 mr-2"
                />
                <span className="font-semibold text-yellow-700 dark:text-yellow-300 text-lg">
                  {coins.toLocaleString()} Coins
                </span>
              </div>
            }

            {/* Mobile Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleNavigation("/cozyshop")}
                className="flex items-center justify-center px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-[#5999a8] transition-all duration-200"
              >
                <ShoppingBag size={18} className="mr-2" />
                Shop
              </button>

              <button
                onClick={() => {
                  setMailModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-center px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-[#5999a8] transition-all duration-200 relative"
              >
                <Mail size={18} className="mr-2" />
                Mail
                {hasUnreadMails && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                )}
              </button>
            </div>

            {/* New Entry Button Mobile */}
            {!isJournalingAlt && (
              <button
                onClick={() => handleNavigation(link)}
                className="flex items-center justify-center w-full px-4 py-3 bg-[#5999a8] text-white rounded-lg font-medium"
              >
                <Plus size={18} className="mr-2" />
                {name}
              </button>
            )}

            {/* Dark Mode Toggle Mobile */}
            <button
              onClick={toggleDarkMode}
              className="flex items-center justify-center w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-[#5999a8] transition-all duration-200"
            >
              {darkMode ? (
                <Sun size={18} className="mr-2" />
              ) : (
                <Moon size={18} className="mr-2" />
              )}
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>

            {/* User Actions Mobile */}
            {userData && (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">
                <div className="text-center text-gray-600 dark:text-gray-400 font-medium">
                  Welcome, {userData.nickname || "User"}!
                </div>
                <button
                  onClick={() => handleNavigation("/profile-settings")}
                  className="flex items-center justify-center w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-[#5999a8] transition-all duration-200"
                >
                  <Settings size={18} className="mr-2" />
                  Profile Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center w-full px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200"
                >
                  <LogOut size={18} className="mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mail Modal */}
      {mailModalOpen && (
        <InGameMail
          toggleMailModal={() => setMailModalOpen(false)}
          mails={mails}
          setMails={setMails}
          setHasUnreadMails={setHasUnreadMails}
          userId={userId}
        />
      )}
    </>
  );
};

export default Navbar;
