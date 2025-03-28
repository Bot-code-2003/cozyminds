"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Smile, Clock, Users } from "lucide-react";

import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import { useDarkMode } from "../../context/ThemeContext";
import Footer from "./Footer";
import Testimonials from "./Testimonials";
import Features from "./Features";
import HowItWorks from "./HowItWorks";

import axios from "axios";
import CozyStoryTeaser from "./CozyStoryTeaser";

// import Home from "../../assets/home1.png";
// import Home from "../../assets/home2.jpg";
import Home from "../../assets/home3.png";

const LandingPage = () => {
  const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });
  const [isScrolled, setIsScrolled] = useState(false);
  const [userCount, setUserCount] = useState(0);
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("Peace");
  const { darkMode, setDarkMode } = useDarkMode();
  const [user, setUser] = useState(null);

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

  // Handle scroll effect
  useEffect(() => {
    const numOfUsers = async () => {
      try {
        const response = await API.get("/users");
        console.log("Number of users:", response.data.users);
        setUserCount(response.data.users);
      } catch (err) {
        console.error("Error fetching user count:", err);
      }
    };
    numOfUsers();

    const storedUser = JSON.parse(sessionStorage.getItem("user"));
    console.log("Stored User:", storedUser);

    if (storedUser) {
      setUser(storedUser);
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`min-h-screen dark:dark p-6 sm:p-0 dark:bg-[#1A1A1A] dark:text-[#F8F1E9] bg-[#F8F1E9] text-[#1A1A1A] font-sans flex flex-col items-center relative overflow-hidden transition-colors duration-300`}
    >
      {/* Gradient Accents */}
      <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-[#FFD7BA] to-transparent opacity-70 dark:opacity-20 transition-opacity duration-300"></div>

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

      {/* SVG Decorative Elements */}
      <div className="absolute top-20 left-10 opacity-10 dark:opacity-5">
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="20"
            y="20"
            width="80"
            height="80"
            stroke={darkMode ? "#F8F1E9" : "#1A1A1A"}
            strokeWidth="2"
          />
          <rect
            x="40"
            y="40"
            width="40"
            height="40"
            stroke={darkMode ? "#F8F1E9" : "#1A1A1A"}
            strokeWidth="2"
          />
        </svg>
      </div>

      <div className="absolute bottom-20 right-10 opacity-10 dark:opacity-5">
        <svg
          width="150"
          height="150"
          viewBox="0 0 150 150"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="75"
            cy="75"
            r="50"
            stroke={darkMode ? "#F8F1E9" : "#1A1A1A"}
            strokeWidth="2"
          />
          <circle
            cx="75"
            cy="75"
            r="25"
            stroke={darkMode ? "#F8F1E9" : "#1A1A1A"}
            strokeWidth="2"
          />
        </svg>
      </div>

      <div className="absolute top-1/3 right-1/4 opacity-10 dark:opacity-5">
        <svg
          width="100"
          height="100"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10 50H90M50 10V90"
            stroke={darkMode ? "#F8F1E9" : "#1A1A1A"}
            strokeWidth="2"
          />
        </svg>
      </div>

      {/* Navigation */}
      <Navbar
        user={user}
        isScrolled={isScrolled}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* Header - Improved */}
      <header className="z-10 w-full max-w-6xl mt-24 mb-16 px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <div className="inline-block mb-4 px-3 py-1 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] text-xs font-medium tracking-wider">
              MENTAL CLARITY
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
              <span className="relative">
                Cozy <span className="text-[#F4A261]">Minds</span>
                <svg
                  className="absolute -bottom-2 left-0 w-full h-2 text-[#F4A261] dark:text-[#F4A261]"
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
            <p className="mt-4 text-lg md:text-xl opacity-80 font-medium max-w-xl">
              Clarity starts here — sharp and simple. A minimalist approach to
              mental wellness through guided journaling and mindfulness.
            </p>
            <div className="mt-10 ">
              <button
                className={`px-6 py-3 ${
                  darkMode
                    ? "bg-[#F4A261] text-[#1A1A1A]"
                    : "bg-[#1A1A1A] text-white"
                } hover:opacity-90 transition-opacity flex items-center gap-2 group border-2 border-transparent`}
              >
                <Link to="/login" className="flex items-center gap-2">
                  Begin your Journey
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>
              </button>
              {/* <button
                className={`px-6 py-3 border-2 ${
                  darkMode
                    ? "border-[#F8F1E9] hover:bg-[#F8F1E9]/10"
                    : "border-[#1A1A1A] hover:bg-[#1A1A1A]/5"
                } transition-colors`}
              >
                <Link to="/about">Learn More</Link>
              </button> */}
            </div>
          </div>

          <div className="order-1 md:order-2 relative">
            <div className="aspect-square w-full max-w-md mx-auto relative">
              {/* Decorative layers */}
              <div className="absolute inset-0 bg-[#F4A261]/20 dark:bg-[#F4A261]/10 -rotate-3 transform"></div>
              <div className="absolute inset-0 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] rotate-3 transform"></div>
              <div className="absolute inset-0 bg-[#E9C46A]/20 dark:bg-[#E9C46A]/10 rotate-6 transform"></div>

              {/* Main image placeholder - replace with your actual image */}
              <div className="relative z-10 w-full h-full border-2 border-[#1A1A1A] dark:border-[#F8F1E9] bg-white dark:bg-[#2A2A2A] flex items-center justify-center">
                {/* <div className="text-center p-6">
                  <div className="text-6xl mb-4">🧠</div>
                  <div className="text-sm opacity-70">
                    Peaceful mind illustration
                  </div>
                </div> */}
                <img src={Home} className="w-full h-full object-cover" alt="" />
              </div>

              {/* Decorative element */}
              <div className="absolute -bottom-6 -right-6 w-24 h-24 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] bg-[#F8F1E9] dark:bg-[#1A1A1A] z-20 flex items-center justify-center">
                <span className="text-sm font-bold">Find Peace</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="z-10 flex flex-col items-center gap-24 w-full max-w-6xl">
        {/* Stats Section - Improved */}
        <div className="w-full px-6">
          <div className="border-2 border-[#1A1A1A] dark:border-[#F8F1E9]">
            <div className="grid grid-cols-1 md:grid-cols-3">
              {[
                {
                  number: userCount || 1250,
                  label: "Active Users",
                  icon: <Users size={28} />,
                  description:
                    "Join our growing community of mindful individuals",
                },
                {
                  number: "89%",
                  label: "Feel Calmer After Journaling",
                  icon: <Smile size={28} />,
                  description: "Based on our user satisfaction surveys",
                },
                {
                  number: "5 mins",
                  label: "To a More Peaceful Mind",
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
                    index === 1 ? "bg-[#F4A261]/10 dark:bg-[#F4A261]/5" : ""
                  }`}
                >
                  <div className="mb-4 p-3 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] inline-block">
                    {stat.icon}
                  </div>
                  <div className="text-4xl font-bold mb-2">{stat.number}</div>
                  <div className="text-lg font-medium mb-2">{stat.label}</div>
                  <div className="text-sm opacity-70">{stat.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <Features />

        {/* How It Works Section */}
        <HowItWorks />

        {/* CozyStory Teaser Block */}
        <CozyStoryTeaser darkMode={darkMode} />
      </main>

      {/* Testimonials */}
      <Testimonials darkMode={darkMode} />

      {/* Footer + CTA Section */}
      <Footer darkMode={darkMode} />

      {/* Custom CSS */}
      <style jsx>{`
        .shadow-sharp {
          box-shadow: 6px 6px 0px rgba(0, 0, 0, 0.1);
        }

        .dark .shadow-sharp {
          box-shadow: 6px 6px 0px rgba(255, 255, 255, 0.05);
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
