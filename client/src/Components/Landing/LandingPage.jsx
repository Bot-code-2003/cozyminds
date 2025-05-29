"use client";

import { useState, useEffect } from "react";
import { ArrowRight, BookImage, Notebook, Clock, Users } from "lucide-react";
import Navbar from "./Navbar";
import { useDarkMode } from "../../context/ThemeContext";
import Footer from "./Footer";
import Testimonials from "./Testimonials";
import Features from "./Features";
import HowItWorks from "./HowItWorks";
import AuthModals from "./AuthModals";
import axios from "axios";
import Home from "../../assets/home3.png";

const LandingPage = () => {
  const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  });

  const [isScrolled, setIsScrolled] = useState(false);
  const [userCount, setUserCount] = useState(null); // Initialize as null to indicate loading
  const [journalCount, setJournalCount] = useState(null); // State for journal entries count
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("Peace");
  const { darkMode, setDarkMode } = useDarkMode();
  const [user, setUser] = useState(null);

  // Get auth modal controls
  const { modals, openLoginModal, openSignupModal } = AuthModals({ darkMode });

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`Subscribed: ${email} to ${category}`);

    // Show success message
    const button = e.target.querySelector("button");
    const originalText = button.innerHTML;
    button.innerHTML = "Success!";

    setTimeout(() => {
      button.innerHTML = originalText;
      setEmail("");
    }, 2000);
  };

  // Handle scroll effect and fetch user and journal counts
  useEffect(() => {
    // Fetch user count
    const fetchUserCount = async () => {
      try {
        const response = await API.get("/users");
        console.log("Number of users:", response.data.users);
        setUserCount(response.data.users);
      } catch (err) {
        console.error("Error fetching user count:", err);
        setUserCount(0); // Fallback to 0 on error
      }
    };

    // Fetch journal count
    const fetchJournalCount = async () => {
      console.log("⏳ Fetching journal count...");
      try {
        const response = await API.get("/journals/journalscount");
        console.log("✅ Journal count:", response.data.count);
        setJournalCount(response.data.count);
      } catch (err) {
        console.error(
          "❌ Error fetching journal count:",
          err.response?.data || err.message
        );
        setJournalCount(0);
      }
    };

    fetchUserCount();
    fetchJournalCount();

    const storedUser = JSON.parse(sessionStorage.getItem("user"));
    console.log("Stored User:", storedUser);

    if (storedUser) {
      setUser(storedUser);
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    // Listen for login events
    const handleUserLogin = (event) => {
      setUser(event.detail.user);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("user-logged-in", handleUserLogin);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("user-logged-in", handleUserLogin);
    };
  }, []);

  return (
    <div
      className={`min-h-screen dark:dark p-6 sm:p-0 dark:bg-[#1A1A1A] dark:text-[#F8F1E9] bg-[#f3f9fc] text-[#1A1A1A] font-sans flex flex-col items-center relative overflow-hidden transition-colors duration-300`}
    >
      {/* SEO Metadata */}
      <title>Starlit Journals - A place to dream and write.</title>
      <meta
        name="description"
        content="Starlit Journals offers a serene space for guided journaling and mindfulness practices to foster mental clarity and personal growth."
      />
      <meta
        name="keywords"
        content="mental wellness, guided journaling, mindfulness, mental health, self-care, meditation, personal growth"
      />
      <meta name="author" content="Starlit Journals Team" />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      {/* Gradient Accents */}
      <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-[#8fa9af] to-transparent opacity-70 dark:opacity-20 transition-opacity duration-300"></div>

      {/* Grid Pattern Background */}
      <div className="absolute inset-0 z-0 opacity-5 dark:opacity-10 pointer-events-none">
        <div className="absolute inset-0 grid grid-cols-12 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="h-full border-r border-black dark:border-white"
            ></div>
          ))}
        </div>
        <div className="absolute inset-0 grid grid-rows-12 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="w-full border-b border-black dark:border-white"
            ></div>
          ))}
        </div>
      </div>

      {/* Navbar */}
      <Navbar
        user={user}
        isScrolled={isScrolled}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        openLoginModal={openLoginModal}
        openSignupModal={openSignupModal}
      />

      {/* Header */}
      <header className="z-10 w-full max-w-6xl mt-32 mb-16 px-2 sm:px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <div className="inline-block mb-4 px-3 py-1 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] text-xs font-medium tracking-wider">
              MENTAL CLARITY
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
              <span className="relative">
                Starlit<span className="text-[#5999a8]">Journals</span>
                <svg
                  className="absolute -bottom-2 left-0 w-full h-2 text-[#5999a8] dark:text-[#5999a8]"
                  viewBox="0 0 100 10"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0,5 Q25,0 50,5 T100,5"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </span>
            </h1>
            <p className="mt-4 text-lg md:text-xl opacity-80 font-medium sm:max-w-xl">
              Illuminate your thoughts with Starlit Journals. A serene space for
              guided journaling and mindfulness to foster mental clarity.
            </p>
            <div className="mt-10">
              <button
                className={`px-6 py-3 ${
                  darkMode
                    ? "bg-[#5999a8] text-white"
                    : "bg-[#1A1A1A] text-white"
                } hover:opacity-90 transition-opacity w-full sm:w-fit rounded-md flex items-center gap-2 group border-2 border-transparent`}
                onClick={openLoginModal}
                aria-label="Begin your journaling journey"
              >
                <span className="flex items-center gap-2">
                  Begin your Journey
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </span>
              </button>
            </div>
          </div>

          <div className="order-1 md:order-2 relative">
            <div className="aspect-square w-full max-w-md mx-auto relative">
              <div className="absolute inset-0 rounded-2xl bg-[#5999a8]/20 dark:bg-[#5999a8]/10 -rotate-3 transform"></div>
              <div className="absolute inset-0 border-2 rounded-2xl border-[#1A1A1A] dark:border-[#F8F1E9] rotate-3 transform"></div>
              <div className="absolute inset-0 rounded-2xl bg-[#5999a8]/20 dark:bg-[#5999a8]/10 rotate-6 transform"></div>
              <div className="relative z-10 rounded-2xl w-full h-full border-2 border-[#1A1A1A] dark:border-[#F8F1E9] bg-white dark:bg-[#2A2A2A] flex items-center justify-center">
                <img
                  src={Home || "/placeholder.svg"}
                  className="w-full h-full object-cover rounded-2xl"
                  alt="Starlit Journals app interface showing guided journaling"
                  loading="lazy"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-20 h-20 rounded-2xl border-2 border-[#1A1A1A] dark:border-[#F8F1E9] bg-[#F8F1E9] dark:bg-[#1A1A1A] z-20 flex items-center justify-center">
                <span className="text-2xl font-bold">❤️</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="z-10 flex flex-col items-center gap-24 max-w-7xl">
        {/* Stats Section */}
        <section
          className="w-full px-1 sm:px-6"
          aria-labelledby="stats-heading"
        >
          <h2 id="stats-heading" className="sr-only">
            User Statistics
          </h2>
          <div className="border-2 rounded-2xl border-[#1A1A1A] dark:border-[#F8F1E9]">
            <div className="grid grid-cols-1 md:grid-cols-3">
              {[
                {
                  number:
                    userCount === null ? (
                      <div
                        className={`inline-block h-8 w-8 border-4 border-t-[#5999a8] border-[#1A1A1A] dark:border-t-[#5999a8] dark:border-[#F8F1E9] rounded-full animate-spin`}
                      ></div>
                    ) : (
                      userCount
                    ),
                  label: "Active Users",
                  icon: <Users size={28} />,
                  description:
                    "Join our growing community of mindful journalers",
                },
                {
                  number:
                    journalCount === null ? (
                      <div
                        className={`inline-block h-8 w-8 border-4 border-t-[#5999a8] border-[#1A1A1A] dark:border-t-[#5999a8] dark:border-[#F8F1E9] rounded-full animate-spin`}
                      ></div>
                    ) : (
                      journalCount
                    ),
                  label: "Entries Written",
                  icon: <Notebook size={28} />,
                  description: "Total journal entries created by our community",
                },
                {
                  number: "5 mins",
                  label: "To a More Serene Mind",
                  icon: <Clock size={28} />,
                  description:
                    "That's all it takes to start your daily practice",
                },
              ].map((stat, index) => (
                <div
                  key={index}
                  className={`flex flex-col p-8 ${
                    index !== 2
                      ? "border-b md:border-b-0 md:border-r"
                      : "border-b md:border-b-0"
                  } border-[#1A1A1A] dark:border-[#F8F1E9] ${
                    index === 1 ? "bg-[#5999a8]/10 dark:bg-[#5999a8]/5" : ""
                  }`}
                >
                  <div className="mb-4 rounded-2xl p-3 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] inline-block">
                    {stat.icon}
                  </div>
                  <div className="text-4xl font-bold mb-2">{stat.number}</div>
                  <p className="text-lg font-medium mb-2">{stat.label}</p>
                  <p className="text-sm opacity-70">{stat.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <Features />

        {/* How It Works Section */}
        <HowItWorks setShowLoginModal={openLoginModal} />
      </main>

      {/* Testimonials */}
      <Testimonials darkMode={darkMode} />

      {/* Footer + CTA Section */}
      <Footer darkMode={darkMode} setShowLoginModal={openLoginModal} />

      {/* Auth Modals */}
      {modals}
    </div>
  );
};

export default LandingPage;
