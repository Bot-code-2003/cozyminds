import React from "react";
import { useDarkMode } from "../../context/ThemeContext";
import { Smile, PenSquare, Sprout } from "lucide-react";

const HowItWorks = () => {
  const { darkMode } = useDarkMode();

  const steps = [
    {
      step: "01",
      title: "Create Your Cozy Identity",
      description:
        "Sign up with a name you create — no real email needed. Just your cozy self.",
      icon: <Smile size={32} />,
      color: "F4A261",
      bgLight: "FFD7BA",
      bgDark: "3A2E2A",
      position: "top-left",
    },
    {
      step: "02",
      title: "Start Journaling Freely",
      description:
        "Capture your moods and moments, reflect on your day, and begin your mindful journey.",
      icon: <PenSquare size={32} />,
      color: "61A5C2",
      bgLight: "A9D6E5",
      bgDark: "2A3A36",
      position: "top-right",
    },
    {
      step: "03",
      title: "Watch Your Story & Garden Grow",
      description:
        "Every time you visit, your garden evolves and your personal cozy story unfolds.",
      icon: <Sprout size={32} />,
      color: "A3C9A8",
      bgLight: "D7EDD7",
      bgDark: "263326",
      position: "bottom-left",
    },
  ];

  return (
    <section className="relative z-10 w-full max-w-6xl mt-12 px-6 py-12">
      <div className="text-center mb-16">
        <div className="inline-block mb-4 px-3 py-1 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] text-xs font-medium tracking-wider">
          THE PROCESS
        </div>
        <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
        <p className="text-lg opacity-70 max-w-xl mx-auto">
          Three cozy steps to start your anonymous clarity journey
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step, index) => (
          <div
            key={index}
            className="group relative border-2 border-[#1A1A1A] dark:border-[#F8F1E9] transition-all duration-300 hover:-translate-y-1"
          >
            {/* Accent corner */}
            <div
              className={`absolute ${
                step.position === "top-left"
                  ? "-top-3 -left-3"
                  : step.position === "top-right"
                  ? "-top-3 -right-3"
                  : "-bottom-3 -left-3"
              } w-6 h-6 bg-[#${step.color}] z-10`}
            ></div>

            <div
              className="p-8 h-full flex flex-col"
              style={{
                backgroundColor: darkMode
                  ? `#${step.bgDark}`
                  : `#${step.bgLight}`,
              }}
            >
              <div className="flex justify-between items-start mb-6">
                <div
                  className={`p-3 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] text-[#${step.color}]`}
                >
                  {step.icon}
                </div>
                <div className="px-3 py-1 text-xs font-bold bg-[#1A1A1A] dark:bg-[#F8F1E9] text-white dark:text-[#1A1A1A]">
                  STEP {step.step}
                </div>
              </div>

              <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
              <p className="opacity-80">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
