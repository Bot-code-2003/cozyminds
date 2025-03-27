import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { useDarkMode } from "../../context/ThemeContext";
import {
  Mail,
  Coffee,
  Zap,
  Brain,
  BarChart2,
  TrendingUp,
  Search,
  Star,
  MessageSquare,
  Sliders,
} from "lucide-react";

const Features = () => {
  const { darkMode, setDarkMode } = useDarkMode();
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);

  const features = [
    {
      icon: <Mail size={28} className="opacity-80" />,
      label: "DAILY INSIGHT",
      h1: "Daily Spark",
      p: "One bold email daily your pick: Peace, Productivity, Mindfulness, or Stress Relief.",
      list: [
        {
          icon: <Coffee size={18} className="mt-0.5 opacity-70" />,
          text: "Quote to ignite your day",
        },
        {
          icon: <Zap size={18} className="mt-0.5 opacity-70" />,
          text: "Step to shift your vibe",
        },
        {
          icon: <Brain size={18} className="mt-0.5 opacity-70" />,
          text: "Thought to hold close",
        },
      ],
      bgLight: "#FFD7BA", // Peach for light mode
      bgDark: "#3A2E2A", // Cozy brown for dark mode
      labelBgLight: "#1A1A1A",
      labelTextLight: "white",
      labelBgDark: "#F4A261",
      labelTextDark: "#1A1A1A",
    },
    {
      icon: <BarChart2 size={28} className="opacity-80" />,
      label: "ANALYTICS",
      h1: "Mood Grid",
      p: "Track your pulse see what shapes your calm and take control of your mental landscape.",
      list: [
        {
          icon: <TrendingUp size={18} className="mt-0.5 opacity-70" />,
          text: "Map your emotional flow",
        },
        {
          icon: <Search size={18} className="mt-0.5 opacity-70" />,
          text: "Pinpoint your triggers",
        },
        {
          icon: <Star size={18} className="mt-0.5 opacity-70" />,
          text: "Own your mental space",
        },
      ],
      bgLight: "#A9D6E5", // Pastel blue for light mode
      bgDark: "#2A3A36", // Deep teal for dark mode
      labelBgLight: "#1A1A1A",
      labelTextLight: "white",
      labelBgDark: "#61A5C2",
      labelTextDark: "#1A1A1A",
    },
    {
      icon: <MessageSquare size={28} className="opacity-80" />,
      label: "COMPANION",
      h1: "AI Chat Friends",
      p: "Chat with AI buddies who feel like your best pals!",
      list: [
        {
          icon: <MessageSquare size={18} className="mt-0.5 opacity-70" />,
          text: "Always there to listen",
        },
        {
          icon: <Brain size={18} className="mt-0.5 opacity-70" />,
          text: "Tailored conversations",
        },
        {
          icon: <Star size={18} className="mt-0.5 opacity-70" />,
          text: "Boost your mood",
        },
      ],
      bgLight: "#E8D9F1", // Pastel lavender for light mode
      bgDark: "#3A2E3F", // Soft purple for dark mode
      labelBgLight: "#1A1A1A",
      labelTextLight: "white",
      labelBgDark: "#A78BFA",
      labelTextDark: "#1A1A1A",
    },
    {
      icon: <Brain size={28} className="opacity-80" />,
      label: "INSIGHTS",
      h1: "Smart Recommendations",
      p: "Unlock extra clever tips to level up your experience!",
      list: [
        {
          icon: <Sliders size={18} className="mt-0.5 opacity-70" />,
          text: "Personalized suggestions",
        },
        {
          icon: <TrendingUp size={18} className="mt-0.5 opacity-70" />,
          text: "Optimize your journey",
        },
        {
          icon: <Star size={18} className="mt-0.5 opacity-70" />,
          text: "Stay ahead with insights",
        },
      ],
      bgLight: "#F1E8D9", // Pastel beige for light mode
      bgDark: "#3F3A2E", // Warm taupe for dark mode
      labelBgLight: "#1A1A1A",
      labelTextLight: "white",
      labelBgDark: "#D4C4A1",
      labelTextDark: "#1A1A1A",
    },
  ];

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
    <div>
      {/* Background Gradient */}

      {/* Navigation */}
      <Navbar
        user={user}
        isScrolled={isScrolled}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* Features Section */}
      <section className="relative z-10 w-full max-w-6xl mt-20">
        <h1 className="text-5xl sm:text-6xl font-extrabold text-center mb-12 bg-gradient-to-r from-[#FFD7BA] to-[#1A1A1A] dark:to-[#F8F1E9] bg-clip-text text-transparent">
          Standout Features
        </h1>

        {/* 2-in-a-row Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-8 flex flex-col justify-between shadow-sharp hover:translate-y-[-4px] transition-all duration-300"
              style={{
                backgroundColor: darkMode ? feature.bgDark : feature.bgLight,
              }}
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  {feature.icon}
                  <div
                    className={`px-2 py-1 text-xs font-medium`}
                    style={{
                      backgroundColor: darkMode
                        ? feature.labelBgDark
                        : feature.labelBgLight,
                      color: darkMode
                        ? feature.labelTextDark
                        : feature.labelTextLight,
                    }}
                  >
                    {feature.label}
                  </div>
                </div>
                <h2 className="text-3xl font-semibold">{feature.h1}</h2>
                <p className="mt-4 text-base opacity-80 font-medium">
                  {feature.p}
                </p>
              </div>
              <ul className="mt-8 space-y-4 font-medium">
                {feature.list.map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-3">
                    {item.icon}
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Features;
