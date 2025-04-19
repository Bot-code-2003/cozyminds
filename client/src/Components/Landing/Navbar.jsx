import React, { useState } from "react";
import { Sun, Moon, LayoutDashboard, User, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = ({ isScrolled, darkMode, setDarkMode, user }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navigationItems = [
    // {
    //   name: "Home",
    //   path: "/",
    // },
    // {
    //   name: "Pricing",
    //   path: "/pricing",
    // },
    // {
    //   name: "About",
    //   path: "/about",
    // },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? darkMode
              ? "bg-[#1A1A1A]/90 backdrop-blur-sm"
              : "bg-[#F8F1E9]/90 backdrop-blur-sm"
            : ""
        } py-4`}
      >
        <div className="container mx-auto flex justify-between items-center px-6">
          {/* Logo */}
          <div className="text-xl font-bold tracking-wider">
            COZY
            <span
              className={`${darkMode ? "text-[#F4A261]" : "text-[#E68A41]"}`}
            >
              MINDS
            </span>
          </div>

          {/* Hamburger Menu Button (visible on mobile) */}
          <button
            className="md:hidden  p-2 hover:text-[#F4A261] transition-colors"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navigationItems.map((item) => (
              <Link
                to={item.path}
                key={item.name}
                className="font-medium hover:text-[#F4A261] transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 hover:text-[#F4A261] transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {user !== null ? (
              <>
                {/* <Link
                  to={"/dashboard"}
                  className={`px-4 py-2 flex items-center gap-3 ${
                    darkMode
                      ? "bg-[#F4A261] text-[#1A1A1A]"
                      : "bg-[#1A1A1A] text-white"
                  } hover:opacity-90 transition-opacity`}
                >
                  Dashboard <LayoutDashboard size={18} />
                </Link> */}

                {user && (
                  <Link
                    to="/profile-settings"
                    className={`px-4 py-2 flex items-center gap-3 ${
                      darkMode
                        ? "bg-[#F4A261] text-[#1A1A1A]"
                        : "bg-[#1A1A1A] text-white"
                    } hover:opacity-90 transition-opacity`}
                  >
                    <span>{user.nickname || "User"}</span>
                    <User size={18} />
                  </Link>
                )}
              </>
            ) : (
              <Link
                to={"/login"}
                className={`px-4 py-2 ${
                  darkMode
                    ? "bg-[#F4A261] text-[#1A1A1A]"
                    : "bg-[#1A1A1A] text-white"
                } hover:opacity-90 transition-opacity`}
              >
                Login
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden px-6 py-4 bg-opacity-90 backdrop-blur-sm">
            <div className="flex flex-col space-y-4">
              {navigationItems.map((item) => (
                <Link
                  to={item.path}
                  key={item}
                  className="font-medium hover:text-[#F4A261] transition-colors text-left"
                  onClick={toggleMobileMenu}
                >
                  {item.name}
                </Link>
              ))}

              {/* Mobile User Actions */}
              <div className="flex items-center space-x-4 pt-2">
                <button
                  onClick={toggleDarkMode}
                  className="p-2 hover:text-[#F4A261] transition-colors"
                  aria-label="Toggle dark mode"
                >
                  {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                {user !== null ? (
                  <>
                    <Link
                      to={"/dashboard"}
                      className={`px-4 py-2 flex items-center gap-3 ${
                        darkMode
                          ? "bg-[#F4A261] text-[#1A1A1A]"
                          : "bg-[#1A1A1A] text-white"
                      } hover:opacity-90 transition-opacity`}
                      onClick={toggleMobileMenu}
                    >
                      Dashboard <LayoutDashboard size={18} />
                    </Link>

                    {user && (
                      <Link
                        to="/profile-settings"
                        className={`px-4 py-2 flex items-center gap-3 ${
                          darkMode
                            ? "bg-[#F4A261] text-[#1A1A1A]"
                            : "bg-[#1A1A1A] text-white"
                        } hover:opacity-90 transition-opacity`}
                        onClick={toggleMobileMenu}
                      >
                        <span>{user.nickname || "User"}</span>
                        <User size={18} />
                      </Link>
                    )}
                  </>
                ) : (
                  <Link
                    to={"/login"}
                    className={`px-4 py-2 ${
                      darkMode
                        ? "bg-[#F4A261] text-[#1A1A1A]"
                        : "bg-[#1A1A1A] text-white"
                    } hover:opacity-90 transition-opacity`}
                    onClick={toggleMobileMenu}
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
