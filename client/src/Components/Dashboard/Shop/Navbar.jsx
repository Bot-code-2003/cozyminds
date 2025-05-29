"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Moon, Sun, User, LogOut } from "lucide-react";
import { useDarkMode } from "../../../context/ThemeContext";

const Navbar = () => {
  const { darkMode, setDarkMode } = useDarkMode();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null);

  // Load user data once
  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user") || "null");
    setUserData(user);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <nav className="w-full bg-[var(--bg-navbar)] border-b border-[var(--border)] py-3 px-4 md:px-6 sticky top-0 z-20">
      <div className=" mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <div className="text-lg font-bold tracking-wider text-[var(--text-primary)]">
            STARLIT<span className="text-[var(--accent)]">JOURNASL</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          <Link
            to="/"
            className="px-4 py-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            Dashboard
          </Link>
          <Link
            to="/collections"
            className="px-4 py-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            Collections
          </Link>
          <Link
            to="/shop"
            className="px-4 py-2 border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--text-primary)] transition-colors"
          >
            Shop
          </Link>

          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 hover:text-[var(--accent)] transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* User dropdown */}
          {userData && (
            <div className="relative group">
              <button className="flex items-center px-4 py-2 border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--text-primary)] transition-colors">
                <User size={18} className="mr-2" />
                <span>{userData.username || "User"}</span>
              </button>
              <div className="absolute right-0 mt-1 w-44 shadow-md z-30 bg-[var(--bg-secondary)] border border-[var(--border)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-[var(--text-primary)] hover:bg-[var(--accent)] hover:text-[var(--text-primary)] transition-colors flex items-center"
                >
                  <LogOut size={16} className="mr-2" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-[var(--text-primary)]"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-14 left-0 right-0 bg-[var(--bg-navbar)] border-b border-[var(--border)] z-50">
          <div className="flex flex-col p-4 space-y-2">
            <Link
              to="/"
              className="px-4 py-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/collections"
              className="px-4 py-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Collections
            </Link>
            <Link
              to="/shop"
              className="px-4 py-2 border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--text-primary)] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Shop
            </Link>
            <div className="flex items-center justify-between px-4 py-2">
              <span className="text-[var(--text-secondary)]">Dark Mode</span>
              <button
                onClick={toggleDarkMode}
                className="p-2 hover:text-[var(--accent)] transition-colors"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>
            {userData && (
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 text-[var(--text-secondary)] hover:bg-[var(--accent)] hover:text-[var(--text-primary)] transition-colors"
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
