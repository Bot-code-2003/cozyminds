import { Calendar, BarChart2, Plus, User, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import StreakCard from "../StreakCard";
import Journaling from "./assets/journaling3.png";
import Library from "./assets/Library5.png";
// import journalEntries from "./journalEntries";
import Settings from "./assets/settings5.png";

const MainSection = ({
  darkMode,
  journalEntries,
  userData,
  wordCountStats,
  formatDate,
}) => {
  const quickActions = [
    {
      to: "/journaling-alt",
      icon: <Plus size={24} />,
      title: "New Entry",
      description: "Start writing",
      backgroundImage: Journaling,
    },
    {
      to: "/profile-settings",
      icon: <User size={24} />,
      title: "Profile",
      description: "Your settings",
      backgroundImage: Settings,
    },
    {
      to: "/collections",
      icon: <BookOpen size={24} />,
      title: "Library",
      description: "Browse entries",
      backgroundImage: Library,
    },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-0 py-8">
      {/* Welcome Section */}
      <div className="mb-10 text-center">
        <h1 className={`text-4xl `}>
          Welcome,{" "}
          <span className="text-[var(--accent)]">
            {userData?.nickname || "Traveler"}
          </span>
        </h1>
        <p
          className={`mt-2 text-sm font-sans uppercase tracking-wide text-[var(--text-secondary)]`}
        >
          Your personal journal
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {quickActions.map((action, index) => (
          <Link
            key={index}
            to={action.to}
            className="block relative h-56 w-full overflow-hidden transform transition-transform hover:scale-102"
            style={{
              backgroundImage: `url("${action.backgroundImage}")`,
              backgroundSize: "contain",
              backgroundPosition: "center",
            }}
          >
            {/* Overlay to ensure text readability */}
            <div
              className="absolute inset-0"
              style={{
                background: darkMode
                  ? "linear-gradient(to top, rgba(30, 30, 50, 0.65), rgba(30, 30, 50, 0.2))"
                  : "linear-gradient(to top, rgba(30, 30, 50, 0.35), rgba(220, 210, 255, 0.2))",
              }}
            />

            {/* Content overlay */}
            <div className="absolute inset-0 p-5 flex flex-col justify-end text-white">
              <div
                className={`p-2 mb-3 flex items-center justify-center w-10 h-10 bg-[var(--accent)]`}
              >
                {action.icon}
              </div>

              <h3 className={`text-xl font-bold mb-1 `}>{action.title}</h3>

              <p className={`text-xs font-sans tracking-wide `}>
                {action.description}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <StreakCard
        journalEntries={journalEntries}
        wordCountStats={wordCountStats}
      />
    </main>
  );
};

export default MainSection;
