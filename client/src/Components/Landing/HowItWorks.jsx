"use client";

import { MailCheck, Lock, Sparkles, Heart, ArrowRight } from "lucide-react";
import { useDarkMode } from "../../context/ThemeContext";

const HowItWorks = ({ setShowLoginModal }) => {
  const { darkMode } = useDarkMode();

  const sections = [
    {
      icon: <MailCheck size={32} />,
      // emoji: "🧚‍♂️",
      title: "Identity, Your Way",
      description: (
        <>
          No personal email needed. Sign in with a whimsical alias like{" "}
          <code className="px-2 py-1 bg-[#5999a8]/20 dark:bg-[#5999a8]/30 rounded-md font-mono text-sm text-[#5999a8] font-semibold">
            batman@dc.com
          </code>{" "}
          or{" "}
          <code className="px-2 py-1 bg-[#5999a8]/20 dark:bg-[#5999a8]/30 rounded-md font-mono text-sm text-[#5999a8] font-semibold">
            sunshine@cozyspace.co
          </code>
          . Stay anonymous, stay comfy — this space is yours.
        </>
      ),
      accent: "bg-purple-100 dark:bg-purple-900/20",
      iconBg: "bg-purple-500",
      borderColor: "border-purple-200 dark:border-purple-700",
    },
    {
      icon: <Lock size={32} />,
      // emoji: "🔒",
      title: "Private & Insightful",
      description: (
        <>
          Your words are yours alone. We gently analyze your journal to give
          personal insights — but never share a single word. Your thoughts
          remain in your cozy corner of the universe.
        </>
      ),
      accent: "bg-emerald-100 dark:bg-emerald-900/20",
      iconBg: "bg-emerald-500",
      borderColor: "border-emerald-200 dark:border-emerald-700",
    },
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 relative">
      {/* Decorative Background Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-[#5999a8]/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-emerald-500/10 rounded-full blur-lg"></div>

      {/* Header */}
      <div className="text-center mb-16 relative z-10">
        <div className="inline-block mb-6 px-4 py-2 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] rounded-full text-xs font-medium tracking-wider bg-[#5999a8]/10 dark:bg-[#5999a8]/20">
          ✨ THE MAGIC BEHIND
        </div>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight leading-tight">
          <span className="relative">
            Starlit <span className="text-[#5999a8]">Journals</span>
            <svg
              className="absolute -bottom-2 left-0 w-full h-2 text-[#5999a8]"
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
        </h2>
        <p className="text-lg sm:text-xl opacity-80 max-w-2xl mx-auto font-medium leading-relaxed">
          Discover the gentle magic that makes your journaling experience truly
          special
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid gap-8 lg:grid-cols-2 relative z-10">
        {sections.map((section, index) => (
          <div
            key={index}
            className={`group relative overflow-hidden rounded-2xl border-2 ${section.borderColor} transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl bg-white/50 dark:bg-[#2A2A2A]/50 backdrop-blur-sm ${section.accent}`}
          >
            {/* Decorative corner accent */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#5999a8]/20 to-transparent rounded-bl-3xl"></div>

            {/* Floating emoji */}
            <div
              className="absolute -top-2 -right-2 text-3xl animate-bounce"
              style={{ animationDelay: `${index * 0.5}s` }}
            >
              {section.emoji}
            </div>

            <div className="p-8 sm:p-10 relative z-10">
              {/* Icon and Title */}
              <div className="flex items-start gap-6 mb-6">
                <div
                  className={`flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center ${section.iconBg} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  {section.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl sm:text-3xl font-bold mb-2 text-[#1A1A1A] dark:text-[#F8F1E9] leading-tight group-hover:text-[#5999a8] transition-colors duration-300">
                    {section.title}
                  </h3>
                </div>
              </div>

              {/* Description */}
              <p className="text-base sm:text-lg leading-relaxed text-[#1A1A1A] dark:text-[#F8F1E9] opacity-90 mb-8">
                {section.description}
              </p>

              {/* Decorative sparkles */}
              <div className="flex justify-end">
                <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                  <Sparkles size={16} className="text-[#5999a8]" />
                  <Sparkles size={12} className="text-purple-500" />
                  <Sparkles size={14} className="text-emerald-500" />
                </div>
              </div>
            </div>

            {/* Hover effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#5999a8]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="text-center mt-16 relative z-10">
        <div className="inline-block p-8 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] rounded-2xl bg-gradient-to-r from-[#5999a8]/10 via-purple-500/10 to-emerald-500/10 dark:from-[#5999a8]/5 dark:via-purple-500/5 dark:to-emerald-500/5 backdrop-blur-sm">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart size={24} className="text-[#5999a8]" />
            <h3 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] dark:text-[#F8F1E9]">
              Ready to Begin Your Journey?
            </h3>
            <Heart size={24} className="text-purple-500" />
          </div>
          <p className="text-lg opacity-80 mb-6 max-w-xl mx-auto leading-relaxed">
            Join thousands of dreamers who've found their cozy corner in the
            digital universe
          </p>
          <button
            onClick={() => setShowLoginModal(true)}
            className="group inline-flex items-center gap-3 px-8 py-4 bg-[#1A1A1A] dark:bg-[#F8F1E9] text-[#F8F1E9] dark:text-[#1A1A1A] rounded-lg hover:opacity-90 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl"
          >
            <Sparkles
              size={20}
              className="group-hover:rotate-12 transition-transform duration-300"
            />
            Start Your Starlit Journey
            <ArrowRight
              size={20}
              className="group-hover:translate-x-1 transition-transform duration-300"
            />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
