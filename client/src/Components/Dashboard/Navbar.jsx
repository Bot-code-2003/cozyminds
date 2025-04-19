"use client";

import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Sun,
  Moon,
  Plus,
  ChevronDown,
  ArrowLeft,
  Mail,
  ShoppingBag,
} from "lucide-react";
import { useDarkMode } from "../../context/ThemeContext";
import { useCoins } from "../../context/CoinContext";
import InGameMail from "./Mail/InGameMail";
import axios from "axios";

// Configure Axios with base URL
const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });

const Navbar = ({ name = "New Entry", link = "/journaling-alt" }) => {
  const { darkMode, setDarkMode } = useDarkMode();
  const { coins, isInitialized } = useCoins();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mailModalOpen, setMailModalOpen] = useState(false);
  const [mails, setMails] = useState([]);
  const [hasUnreadMails, setHasUnreadMails] = useState(false);
  const [userData, setUserData] = useState(null);
  const dropdownRef = useRef(null);

  const isRootPath = location.pathname === "/";
  const isJournalingAlt = location.pathname === "/journaling-alt";

  // Fetch user data from session storage once on mount
  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user") || "null");
    setUserData(user);
  }, []); // Empty dependency array means this only runs once on mount

  const userId = userData?._id;

  // Handle clicks outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch mails to initialize state
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
    document.documentElement.classList.toggle("dark");
  };

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    window.location.href = "/";
  };

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleMailModal = () => setMailModalOpen(!mailModalOpen);

  return (
    <>
      <nav
        className={`w-full bg-[var(--bg-navbar)] border-b border-[var(--border)] py-3 px-4 md:px-6 flex justify-between items-center sticky top-0 z-20`}
      >
        <Link to={"/"} className="flex items-center">
          <div className="text-lg font-bold tracking-wider text-[var(--text-primary)]">
            COZY
            <span className="text-[var(--accent)]">MINDS</span>
          </div>
        </Link>

        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Coins display */}
          {isInitialized && (
            <div className="flex items-center px-3 py-1 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-full">
              <span className="text-yellow-300 mr-1">🪙</span>
              <span className="text-[var(--text-primary)]">{coins}</span>
            </div>
          )}

          <Link
            to="/cozyshop"
            className="p-2 hover:text-[var(--accent)] transition-colors"
            aria-label="Shop"
          >
            <ShoppingBag size={18} />
          </Link>

          <button
            onClick={toggleMailModal}
            className="p-2 hover:text-[var(--accent)] transition-colors relative"
            aria-label="Mail"
          >
            <Mail size={18} />
            {hasUnreadMails && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--highlight)] rounded-full"></span>
            )}
          </button>

          <button
            onClick={toggleDarkMode}
            className="p-2 hover:text-[var(--accent)] transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Button Logic */}
          <div className="hidden md:flex items-center space-x-2">
            {/* Show New Entry unless on /journaling-alt */}
            {!isJournalingAlt && (
              <Link
                to={link}
                className="flex items-center px-4 py-2 border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--text-primary)] transition-colors duration-200"
              >
                <Plus size={18} className="mr-2" />
                {name || "New Entry"}
              </Link>
            )}

            {/* Show Dashboard for non-root paths */}
            {!isRootPath && (
              <Link
                to="/"
                className="flex items-center px-4 py-2 border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--text-primary)] transition-colors duration-200"
              >
                <ArrowLeft size={18} className="mr-2" />
                Dashboard
              </Link>
            )}
          </div>

          {userData && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className="hidden md:flex items-center px-4 py-2 border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--text-primary)] transition-colors duration-200"
              >
                <span className="hidden md:inline">
                  {userData.nickname || "User"}
                </span>
                <ChevronDown size={16} className="ml-2" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-1 w-44 shadow-md z-30 bg-[var(--bg-secondary)] border-[var(--border)]">
                  <Link
                    to="/profile-settings"
                    className="block px-4 py-2 text-[var(--text-primary)] hover:bg-[var(--accent)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    Profile Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-[var(--text-primary)] hover:bg-[var(--accent)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {mailModalOpen && (
        <InGameMail
          toggleMailModal={toggleMailModal}
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
