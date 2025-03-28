"use client";

import {
  BookOpenCheck,
  Leaf,
  Smile,
  Stars,
  Wand,
  SunMedium,
  ArrowRight,
  PawPrint,
  CloudRainWind,
} from "lucide-react";
import { Link } from "react-router-dom";

const CozyStoryTeaser = ({ darkMode }) => {
  return (
    <div className="w-full mx-auto mt-12 relative">
      {/* Background pattern */}
      <div className="absolute inset-0 grid grid-cols-8 z-0 opacity-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-full border-r border-[#1A1A1A] dark:border-[#F8F1E9]"
          ></div>
        ))}
      </div>

      {/* Main content container */}
      <div
        className={`relative z-10 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] transition-all duration-300 ${
          darkMode ? "bg-[#2A2A2A] text-[#F8F1E9]" : "bg-white text-[#1A1A1A]"
        }`}
      >
        {/* Top accent bar */}
        <div className="h-2 w-full bg-[#F4A261]"></div>

        {/* Content */}
        <div className="p-8 md:p-12">
          {/* Floating decorative icons */}
          <Stars
            className="absolute top-8 left-8 text-[#F4A261] opacity-40"
            size={18}
          />
          <Wand
            className="absolute top-8 right-8 text-[#A3C9A8] opacity-30"
            size={18}
          />
          <SunMedium
            className="absolute bottom-8 left-8 text-[#F98989] opacity-30"
            size={18}
          />

          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-block mb-6 px-3 py-1 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] text-xs font-medium tracking-wider">
              YOUR JOURNEY
            </div>
            <h3 className="text-3xl md:text-4xl font-bold mb-4 relative inline-block">
              <span className="relative z-10">Taste the Cozy Story</span>
              <span className="absolute -bottom-2 left-0 w-full h-2 bg-[#F4A261]/30"></span>
            </h3>
            <p className="opacity-80 max-w-md mx-auto text-base md:text-lg">
              Get a little glimpse of your evolving cozy journey — one visit,
              one moment at a time.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {[
              {
                icon: <Leaf />,
                emoji: "🌱",
                day: "Day 1",
                title: "The Seed in Your Hand",
                quote:
                  "You find a small seed in an old coat pocket, rough and unassuming. You decide to plant it in a pot by your window, wondering what it might become.",
                color: "A3C9A8",
                bgLight: "FFF5E1",
                bgDark: "2A3A2A",
              },
              {
                icon: <CloudRainWind />,
                emoji: "🌧️",
                day: "Day 10",
                title: "The Big Rain",
                quote:
                  "A heavier rain falls, bending the sprouts. You prop them with a twig, whispering encouragement—they’ll rise again, and so will you.",
                color: "66B2B2",
                bgLight: "E0F7FA",
                bgDark: "263A3A",
              },
              {
                icon: <PawPrint />,
                emoji: "🦊",
                day: "Day 20",
                title: "The Fox’s Nap",
                quote:
                  "A fox curls up beneath the tree, napping in its shade. You watch from a rocking chair, lantern lit—your peace is a gift to others now.",
                color: "F98989",
                bgLight: "FEE4E1",
                bgDark: "3A2A2A",
              },
            ].map((item, index) => (
              <div
                key={index}
                className={`relative border-2 border-[#1A1A1A] dark:border-[#F8F1E9] overflow-hidden group transition-all duration-300 hover:-translate-y-1`}
              >
                {/* Top colored bar */}
                <div className={`h-1 w-full bg-[#${item.color}]`}></div>

                {/* Day indicator */}
                <div className="absolute top-4 right-4 text-xs font-bold px-2 py-1 border border-[#1A1A1A]/20 dark:border-[#F8F1E9]/20">
                  {item.day}
                </div>

                <div
                  className={`p-6 pt-8 ${
                    darkMode ? `bg-[#${item.bgDark}]` : `bg-[#${item.bgLight}]`
                  }`}
                >
                  <div className="mb-4 text-4xl">{item.emoji}</div>
                  <p className="font-bold text-lg mb-2">{item.title}</p>
                  <p className="text-sm opacity-70 italic">"{item.quote}"</p>

                  {/* Icon in bottom right */}
                  <div
                    className={`absolute bottom-3 right-3 text-[#${item.color}] opacity-30 group-hover:opacity-60 transition-opacity`}
                  >
                    {item.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/login"
              className={`inline-flex items-center gap-2 px-8 py-3 text-sm font-semibold tracking-wide border-2 ${
                darkMode
                  ? "bg-[#F4A261] text-[#1A1A1A] border-[#F4A261] hover:bg-transparent hover:text-[#F8F1E9]"
                  : "bg-[#1A1A1A] text-white border-[#1A1A1A] hover:bg-transparent hover:text-[#1A1A1A]"
              } transition-all duration-300 group`}
            >
              Begin Your Cozy Journey
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative corner elements */}
      <div className="absolute -bottom-3 -right-3 w-24 h-24 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] bg-[#F4A261]/20 dark:bg-[#F4A261]/10 z-0"></div>
      <div className="absolute -top-3 -left-3 w-16 h-16 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] bg-[#F4A261]/10 dark:bg-[#F4A261]/5 z-0"></div>
    </div>
  );
};

export default CozyStoryTeaser;
