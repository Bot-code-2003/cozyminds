import {
  Coffee,
  Zap,
  Brain,
  BarChart2,
  TrendingUp,
  Search,
  Star,
  Sparkles,
  BookOpenCheck,
  Leaf,
  Smile,
  Sliders,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const Features = () => {
  const features = [
    {
      icon: <Coffee size={32} />,
      label: "COZY BOOST",
      title: "Cozy Spark",
      description:
        "A cozy popup once a day with quotes, reflections, and gentle actions to ease your mind and brighten your moment.",
      list: [
        {
          icon: <Sparkles size={18} />,
          text: "Uplifting thought for the day",
        },
        {
          icon: <Zap size={18} />,
          text: "One tiny step to center yourself",
        },
        {
          icon: <Brain size={18} />,
          text: "Something cozy to hold close",
        },
      ],
      color: "F4A261",
      bgLight: "FFD7BA",
      bgDark: "3A2E2A",
      position: "top-left",
    },
    {
      icon: <BarChart2 size={32} />,
      label: "ANALYTICS",
      title: "Mood Grid",
      description:
        "Track your pulse, see what shapes your calm, and take control of your mental landscape.",
      list: [
        {
          icon: <TrendingUp size={18} />,
          text: "Map your emotional flow",
        },
        {
          icon: <Search size={18} />,
          text: "Pinpoint your triggers",
        },
        {
          icon: <Star size={18} />,
          text: "Own your mental space",
        },
      ],
      color: "61A5C2",
      bgLight: "A9D6E5",
      bgDark: "2A3A36",
      position: "top-right",
    },
    {
      icon: <Sparkles size={32} />,
      label: "STORYLINE",
      title: "Cozy Story Journey",
      description:
        "Follow a month-long evolving visual story that blossoms as you return day by day.",
      list: [
        {
          icon: <Leaf size={18} />,
          text: "Track your daily growth",
        },
        {
          icon: <BookOpenCheck size={18} />,
          text: "Each day unlocks a chapter",
        },
        {
          icon: <Smile size={18} />,
          text: "Your calm world blossoms",
        },
      ],
      color: "A3C9A8",
      bgLight: "D7EDD7",
      bgDark: "263326",
      position: "bottom-left",
    },
    {
      icon: <Brain size={32} />,
      label: "INSIGHTS",
      title: "Smart Recommendations",
      description: "Unlock extra clever tips to level up your experience!",
      list: [
        {
          icon: <Sliders size={18} />,
          text: "Personalized suggestions",
        },
        {
          icon: <TrendingUp size={18} />,
          text: "Optimize your journey",
        },
        {
          icon: <Star size={18} />,
          text: "Stay ahead with insights",
        },
      ],
      color: "D4C4A1",
      bgLight: "F1E8D9",
      bgDark: "3F3A2E",
      position: "bottom-right",
    },
  ];

  return (
    <section className="relative z-10 w-full max-w-6xl mt-20 px-6">
      <div className="text-center mb-16">
        <div className="inline-block mb-4 px-3 py-1 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] text-xs font-medium tracking-wider">
          FEATURES
        </div>
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Standout Features
        </h2>
        <p className="text-lg opacity-70 max-w-xl mx-auto">
          Designed to bring clarity and peace to your daily routine
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="group relative border-2 border-[#1A1A1A] dark:border-[#F8F1E9] transition-all duration-300 hover:-translate-y-1"
          >
            {/* Accent corner */}
            <div
              className={`absolute ${
                feature.position === "top-left"
                  ? "-top-3 -left-3"
                  : feature.position === "top-right"
                  ? "-top-3 -right-3"
                  : feature.position === "bottom-left"
                  ? "-bottom-3 -left-3"
                  : "-bottom-3 -right-3"
              } 
                            w-6 h-6 bg-[#${feature.color}] z-10`}
            ></div>

            <div
              className={`p-8 h-full flex flex-col`}
              style={{
                backgroundColor: `var(--dark-mode, false) ? #${feature.bgDark} : #${feature.bgLight}`,
              }}
            >
              <div className="flex justify-between items-start mb-6">
                <div
                  className={`p-3 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] text-[#${feature.color}]`}
                >
                  {feature.icon}
                </div>
                <div className="px-3 py-1 text-xs font-bold bg-[#1A1A1A] dark:bg-[#F8F1E9] text-white dark:text-[#1A1A1A]">
                  {feature.label}
                </div>
              </div>

              <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
              <p className="opacity-80 mb-6">{feature.description}</p>

              <ul className="space-y-4 mb-2">
                {feature.list.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className={`mt-1 text-[#${feature.color}]`}>
                      {item.icon}
                    </div>
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>

              {/* <Link
                to={`/features/${feature.title
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
                className="mt-auto inline-flex items-center text-sm font-medium text-[#1A1A1A] dark:text-[#F8F1E9] hover:text-[#${feature.color}] dark:hover:text-[#${feature.color}] group-hover:underline transition-colors"
              >
                Learn more
                <ArrowRight
                  size={14}
                  className="ml-1 group-hover:translate-x-1 transition-transform"
                />
              </Link> */}
            </div>
          </div>
        ))}
      </div>

      {/* Feature highlight box */}
      <div className="mt-16 border-2 border-[#F4A261] p-8 relative">
        <div className="absolute -top-3 -right-3 px-3 py-1 bg-[#F4A261] text-[#1A1A1A] text-xs font-bold">
          NEW
        </div>

        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-2/3">
            <h3 className="text-2xl font-bold mb-4">
              Coming Soon: AI-Powered Journaling Assistant
            </h3>
            <p className="opacity-80 mb-4">
              Our new AI assistant will help guide your journaling practice with
              personalized prompts and insights based on your mood patterns and
              goals.
            </p>
            {/* <Link
              to="/waitlist"
              className="inline-flex items-center gap-2 px-6 py-2 bg-[#1A1A1A] dark:bg-[#F8F1E9] text-white dark:text-[#1A1A1A] hover:bg-[#F4A261] dark:hover:bg-[#F4A261] transition-colors"
            >
              Join the waitlist
              <ArrowRight size={16} />
            </Link> */}
          </div>

          <div className="md:w-1/3 aspect-square bg-[#F4A261]/10 dark:bg-[#F4A261]/5 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] flex items-center justify-center">
            <Sparkles size={64} className="text-[#F4A261]" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
