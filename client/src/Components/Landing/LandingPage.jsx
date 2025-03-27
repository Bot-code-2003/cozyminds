"use client";

import { useState, useEffect } from "react";
import {
  ArrowRight,
  ChevronDown,
  BarChart2,
  Mail,
  Coffee,
  Zap,
  Brain,
  TrendingUp,
  Search,
  Star,
  Users,
} from "lucide-react";
import FooterImg from "../../assets/footer1.jpg";

import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import { useDarkMode } from "../../context/ThemeContext";
import Footer from "./Footer";
import Testimonials from "./Testimonials";
import Features from "./Features";
import HowItWorks from "./HowItWorks";

const LandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
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
      className={`min-h-screen dark:dark p-6 sm:p-0 dark:bg-[#1A1A1A] dark:text-[#F8F1E9] bg-[#F8F1E9] text-[#1A1A1A] font-sans flex flex-col items-center pt  -12 relative overflow-hidden transition-colors duration-300`}
    >
      {/* Gradient Accents */}
      <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-[#FFD7BA] to-transparent opacity-70 dark:opacity-20 transition-opacity duration-300"></div>
      {/* <div className="absolute bottom-0 right-0 w-full h-1/4 bg-gradient-to-t from-[#A9D6E5] to-transparent opacity-70 dark:opacity-20 transition-opacity duration-300"></div> */}
      {/* Footer Image */}

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
      {/* Header */}
      <header className="z-10 text-center mt-24 mb-16">
        <div className="inline-block mb-4 px-3 py-1 border border-[#1A1A1A] dark:border-[#F8F1E9] text-xs font-medium tracking-wider">
          MENTAL CLARITY
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-[0.1em] mb-6">
          Cozy Minds
        </h1>
        <p className="mt-4 text-lg md:text-xl opacity-70 font-medium max-w-xl mx-auto">
          Clarity starts here sharp and simple. A minimalist approach to mental
          wellness.
        </p>
        <div className="mt-10 flex justify-center">
          <button
            className={`px-6 py-3 ${
              darkMode
                ? "bg-[#F4A261] text-[#1A1A1A]"
                : "bg-[#1A1A1A] text-white"
            } hover:opacity-90 transition-opacity flex items-center space-x-2 group`}
          >
            <Link to="/login">Begin your Journey</Link>
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="z-10 flex flex-col items-center gap-24 w-full max-w-6xl">
        {/* Stats Section */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 border-y border-[#1A1A1A]/10 dark:border-[#F8F1E9]/10 py-12">
          {[
            { number: "10K+", label: "Active Users", icon: <Users /> },
            {
              number: "98%",
              label: "Satisfaction Rate",
              icon: <Star size={24} />,
            },
            {
              number: "24/7",
              label: "Mental Support",
              icon: <Brain size={24} />,
            },
          ].map((stat, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="mb-3 opacity-80">{stat.icon}</div>
              <div className="text-3xl font-bold">{stat.number}</div>
              <div className="text-sm opacity-70 font-medium mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Features Section */}
        <Features />

        {/* How It Works Section */}
        <HowItWorks />
        {/* Signup Block */}
        <div
          className={`w-full max-w-2xl ${
            darkMode ? "bg-[#2A2A2A]" : "bg-white"
          } p-8 shadow-sharp border-t-4 border-[#F4A261]`}
        >
          <h3 className="text-2xl font-semibold text-center mb-6">
            Join the Calm
          </h3>
          <p className="text-center opacity-70 mb-8 max-w-md mx-auto">
            Sign up for our daily insights and start your journey to mental
            clarity today.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={`w-full px-4 py-3 appearance-none ${
                  darkMode
                    ? "bg-[#1A1A1A] border-[#333333]"
                    : "bg-[#F8F1E9] border-[#D9D9D9]"
                } border text-current focus:outline-none focus:border-[#F4A261] transition-all duration-300`}
              >
                <option value="Peace">Peace</option>
                <option value="Productivity">Productivity</option>
                <option value="Mindfulness">Mindfulness</option>
                <option value="Overcoming Stress">Overcoming Stress</option>
              </select>
              <ChevronDown
                size={16}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none opacity-70"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className={`flex-1 px-4 py-3 ${
                  darkMode
                    ? "bg-[#1A1A1A] border-[#333333]"
                    : "bg-[#F8F1E9] border-[#D9D9D9]"
                } border text-current focus:outline-none focus:border-[#F4A261] transition-all duration-300`}
                required
              />
              <button
                type="submit"
                className={`px-6 py-3 ${
                  darkMode
                    ? "bg-[#F4A261] text-[#1A1A1A]"
                    : "bg-[#F4A261] text-white"
                } hover:opacity-90 transition-all duration-300`}
              >
                Sign Up
              </button>
            </div>
            <p className="text-xs opacity-60 text-center mt-2">
              We respect your privacy. Unsubscribe anytime.
            </p>
          </form>
        </div>
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
