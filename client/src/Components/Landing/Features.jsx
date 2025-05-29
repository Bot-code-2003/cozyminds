import { Sparkles, Smile } from "lucide-react";
import { Link } from "react-router-dom";

import Home from "../../assets/home3.png";
import Reward from "../../assets/reward.png";
import MailIG from "../../assets/mail.png";
import Shop from "../../assets/shop.png";
import Mood from "../../assets/mood.png";
import AI from "../../assets/AI.png";

import { useDarkMode } from "../../context/ThemeContext";

import { Gift, BarChart3, Mail, ShoppingBag, ChevronRight } from "lucide-react";
const Features = () => {
  const { darkMode, setDarkMode } = useDarkMode();
  return (
    <div className="relative z-10 px-1 sm:px-6 ">
      {/* Features Section */}
      <section className="relative z-10 w-full py-12 sm:py-24 ">
        <div className="text-center mb-20">
          <div className="inline-block mb-6 px-4 py-1.5 bg-[#f0e6d9] dark:bg-[#2a2520] rounded-full text-xs font-medium tracking-wider text-[#5999a8] dark:text-[#7ab8c7] shadow-sm">
            STANDOUT FEATURES
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 font-serif">
            Cozy Features
          </h2>
          <p className="text-lg opacity-70 max-w-xl mx-auto">
            Designed to bring clarity and peace to your daily routine
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {[
            {
              icon: <Gift size={32} />,
              image: Reward,
              label: "REWARDS",
              title: "Daily Journaling Rewards",
              description:
                "Earn coins every day you write. Hit streaks for surprise bonuses and limited collectibles!",
              color: "6BC9B5", // Ocean jade
              bgLight: "DAD8DC", // Deeper aqua tide
              bgDark: "123C3A", // Deep kelp night
            },
            {
              icon: <BarChart3 size={32} />,
              image: Mood,
              label: "INSIGHTS",
              title: "Mood Insights",
              description:
                "Visualize how your moods shift over time with beautiful charts. Reflect deeper with every entry you make.",
              color: "6BC9B5",
              bgLight: "DAD8DC",
              bgDark: "123C3A",
            },
            {
              icon: <Mail size={32} />,
              image: MailIG,
              label: "MAIL",
              title: "In-Site Mail",
              description:
                "Receive heartwarming greetings, seasonal tales, and delightful surprise gifts from the charming characters of Starlit Journals, right in your in-site mailbox.",
              color: "6BC9B5",
              bgLight: "DAD8DC",
              bgDark: "123C3A",
            },
            {
              icon: <ShoppingBag size={32} />,
              image: Shop,
              label: "SHOP",
              title: "Inventory & Shop",
              description:
                "Buy sticker packs, journal themes, and magical mail styles. Activate, customize, and make it yours.",
              color: "6BC9B5",
              bgLight: "DAD8DC",
              bgDark: "123C3A",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border-2"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#5999A8]/10 to-transparent rounded-bl-full"></div>

              <div className="p-8 flex flex-col md:flex-row gap-6">
                <div className="md:w-1/2 flex flex-col justify-between">
                  <div>
                    <div className="mb-6 px-3 py-1.5 inline-block rounded-full text-xs font-bold bg-[#1A1A1A]/10 dark:bg-[#F8F1E9]/10">
                      {feature.label}
                    </div>
                    <h3 className="text-2xl font-bold mb-4 font-serif">
                      {feature.title}
                    </h3>
                    <p className="opacity-80 mb-6">{feature.description}</p>
                  </div>

                  {/* <Link
                    to={`/features/${feature.title
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                    className="inline-flex items-center text-sm font-medium text-[#5999a8] dark:text-[#7ab8c7] hover:underline group"
                  >
                    <span>Learn more</span>
                    <ChevronRight
                      size={16}
                      className="ml-1 group-hover:translate-x-1 transition-transform"
                    />
                  </Link> */}
                </div>

                <div className="md:w-1/2 aspect-square rounded-xl overflow-hidden shadow-md transition-all duration-300 group-hover:shadow-lg">
                  <img
                    src={feature.image || "/placeholder.svg"}
                    alt={`Illustration for ${feature.title}`}
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="w-full py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#5999a8]/10 to-[#7ab8c7]/10 dark:from-[#5999a8]/5 dark:to-[#7ab8c7]/5"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block mb-6 px-4 py-1.5 bg-[#f0e6d9] dark:bg-[#2a2520] rounded-full text-xs font-medium tracking-wider text-[#5999a8] dark:text-[#7ab8c7] shadow-sm">
                COMING SOON
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 font-serif">
                AI-Powered Cozy Assistant
              </h2>
              <p className="text-lg opacity-80 mb-8 leading-relaxed">
                A gentle companion to guide your journaling with thoughtful
                prompts, mood insights, and cozy tips—crafted for calm and
                clarity.
              </p>

              {/* <form className="flex flex-col sm:flex-row gap-3 max-w-md">
                <input
                  type="email"
                  placeholder="Enter your email for early access"
                  className="flex-1 px-4 py-3 rounded-lg border-2 border-[#5999a8]/20 dark:border-[#7ab8c7]/20 bg-white/80 dark:bg-[#2a2520]/80 backdrop-blur-sm focus:outline-none focus:border-[#5999a8] dark:focus:border-[#7ab8c7] transition-all duration-300"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-[#5999a8] to-[#7ab8c7] text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 whitespace-nowrap"
                >
                  Notify Me
                </button>
              </form> */}
            </div>

            <div className="relative">
              <div className="aspect-square max-w-md mx-auto relative">
                {/* Decorative elements */}
                <div className="absolute -top-6 -left-6 w-full h-full bg-[#f0e6d9] dark:bg-[#2a2520] rounded-2xl -rotate-3 transform"></div>
                <div className="absolute -top-3 -left-3 w-full h-full border-2 border-[#5999a8] dark:border-[#7ab8c7] rounded-2xl rotate-1 transform"></div>

                {/* Main image */}
                <div className="relative z-10 w-full h-full rounded-2xl overflow-hidden shadow-xl">
                  <img
                    src={AI || "/placeholder.svg"}
                    alt="AI assistant concept - a friendly, cozy AI character helping with journaling"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Floating elements */}
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#f0e6d9] dark:bg-[#2a2520] rounded-full shadow-lg z-20 flex items-center justify-center">
                  <div className="text-center">
                    <Sparkles
                      size={20}
                      className="mx-auto mb-1 text-[#5999a8] dark:text-[#7ab8c7]"
                    />
                    <span className="text-xs font-medium">AI Magic</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Features;
