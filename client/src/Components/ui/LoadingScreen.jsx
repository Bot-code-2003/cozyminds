import { useDarkMode } from "../../context/ThemeContext";
import { useEffect, useState, useRef } from "react";

const LoadingScreen = ({ isLoading, progress = 0 }) => {
  const { darkMode } = useDarkMode();
  const [fadeIn, setFadeIn] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [weather, setWeather] = useState("clear"); // clear, rain, snow
  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    if (isLoading) {
      setFadeIn(true);

      // Randomly select a weather type
      const weathers = ["snow"];
      setWeather(weathers[Math.floor(Math.random() * weathers.length)]);

      // Rotate through cozy messages
      intervalRef.current = setInterval(() => {
        setCurrentMessage((prev) => (prev + 1) % cozyMessages.length);
      }, 4000);

      // Initialize ambient sound if browser supports it
      if (typeof window !== "undefined" && window.AudioContext) {
        try {
          if (!audioRef.current) {
            audioRef.current = new Audio("/sounds/ambient-cozy.mp3");
            audioRef.current.volume = 0.2;
            audioRef.current.loop = true;
          }
          audioRef.current
            .play()
            .catch((e) => console.log("Audio autoplay prevented"));
        } catch (e) {
          console.log("Audio playback not supported");
        }
      }
    } else {
      setTimeout(() => setFadeIn(false), 700);
      clearInterval(intervalRef.current);

      // Fade out audio if exists
      if (audioRef.current) {
        const fadeAudio = setInterval(() => {
          if (audioRef.current && audioRef.current.volume > 0.1) {
            audioRef.current.volume -= 0.1;
          } else {
            if (audioRef.current) audioRef.current.pause();
            clearInterval(fadeAudio);
          }
        }, 100);
      }
    }

    return () => {
      clearInterval(intervalRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [isLoading]);

  const cozyMessages = [
    "Take a deep breath. Good things are coming. ✯",
    "Let your thoughts drift like leaves on a warm breeze 🍂",
    "Even the tiniest spark lights the coziest fire ✨",
    "You're doing great. This moment is yours ☕",
    "Magic takes time — so does your brilliance 🌙",
    "Cuddled in code and comfort. Just a sec 🧶",
    "Sometimes the journey needs a peaceful pause 🌿",
    "Brewing something wonderful for you 🍵",
    "The best ideas come in moments of quiet ✨",
    "Coziness isn't a destination, it's this moment 🏡",
    "Creating a little pocket of peace, just for you 🌤️",
  ];

  if (!fadeIn) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-opacity duration-700 ${
        isLoading
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      } ${darkMode ? "bg-[#1F2521]" : "bg-[#FFF8F0]"}`}
      aria-live="polite"
      role="alert"
    >
      <div
        className={`absolute inset-0 animate-gradient ${
          darkMode
            ? "bg-gradient-to-t from-[#2A2E2B] via-[#1F2521] to-[#2E3631]"
            : "bg-gradient-to-t from-[#FFE8D6] via-[#FFF8F0] to-[#F8E2CC]"
        }`}
      ></div>

      {/* Weather Effects */}
      {weather === "rain" && (
        <div className="absolute inset-0 pointer-events-none z-10 opacity-40">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={`rain-${i}`}
              className={`absolute w-px h-6 rounded-full ${
                darkMode ? "bg-[#B4D6E9]" : "bg-[#7CA3BD]"
              } animate-rainfall`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `-20px`,
                animationDuration: `${0.8 + Math.random() * 0.6}s`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            ></div>
          ))}
        </div>
      )}

      {weather === "snow" && (
        <div className="absolute inset-0 pointer-events-none z-10 opacity-70">
          {Array.from({ length: 25 }).map((_, i) => (
            <div
              key={`snow-${i}`}
              className={`absolute rounded-full ${
                darkMode ? "bg-[#F8F1E9]" : "bg-blue-400"
              } animate-snowfall`}
              style={{
                width: `${1 + Math.random() * 3}px`,
                height: `${1 + Math.random() * 3}px`,
                left: `${Math.random() * 100}%`,
                top: `-10px`,
                animationDuration: `${3 + Math.random() * 5}s`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            ></div>
          ))}
        </div>
      )}

      <div className="relative w-64 h-64 sm:w-80 sm:h-80 mb-8 scale-95 sm:scale-100 z-10">
        {/* Gentle Hill */}
        <div
          className={`absolute bottom-0 w-full h-20 rounded-t-full ${
            darkMode ? "bg-[#2E3631]" : "bg-[#EAD9C2]"
          }`}
        ></div>

        {/* Background Elements - Trees or Mountains */}
        <div className="absolute bottom-16 left-2">
          <div
            className={`w-8 h-12 rounded-t-full ${
              darkMode ? "bg-[#3A4A40]" : "bg-[#C2A78A]"
            }`}
          ></div>
        </div>

        <div className="absolute bottom-14 right-4">
          <div
            className={`w-10 h-16 rounded-t-full ${
              darkMode ? "bg-[#3A4A40]" : "bg-[#C2A78A]"
            }`}
          ></div>
        </div>

        {/* Campfire with improved flames */}
        <div className="absolute bottom-8 left-12 flex items-end">
          <div className="relative w-8 h-8">
            <div
              className={`absolute w-8 h-1 rounded-full transform rotate-45 ${
                darkMode ? "bg-[#5A4032]" : "bg-[#8A5A3C]"
              }`}
              style={{ top: "50%" }}
            ></div>
            <div
              className={`absolute w-8 h-1 rounded-full transform -rotate-45 ${
                darkMode ? "bg-[#5A4032]" : "bg-[#8A5A3C]"
              }`}
              style={{ top: "50%" }}
            ></div>

            {/* Embers */}
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={`ember-${i}`}
                className={`absolute w-1 h-1 rounded-full ${
                  darkMode ? "bg-[#FFBB91]" : "bg-[#FF8C42]"
                } animate-ember`}
                style={{
                  bottom: "10px",
                  left: `${8 + i * 2}px`,
                  animationDelay: `${i * 0.2}s`,
                }}
              ></div>
            ))}

            <div
              className={`absolute bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-6 rounded-t-full ${
                darkMode ? "bg-[#F4A261]" : "bg-[#E68A41]"
              } animate-flicker`}
            ></div>
            <div
              className={`absolute bottom-3 left-1/2 transform -translate-x-1/2 w-2 h-4 rounded-t-full ${
                darkMode ? "bg-[#FFD7BA]" : "bg-[#FFBB91]"
              } animate-flicker-fast`}
              style={{ animationDelay: "0.3s" }}
            ></div>
          </div>
        </div>

        {/* Fox with subtle animations */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-24 h-24 animate-breathe">
            {/* Fox blanket */}
            <div
              className={`absolute bottom-0 w-28 h-16 rounded-lg transform -translate-x-2 ${
                darkMode ? "bg-[#3E4A45]" : "bg-[#D9C2A7]"
              }`}
              style={{ zIndex: 1 }}
            >
              <div
                className={`absolute w-full h-1 top-2 ${
                  darkMode ? "bg-[#2E3631]" : "bg-[#C2A78A]"
                }`}
              ></div>
              <div
                className={`absolute w-full h-1 top-6 ${
                  darkMode ? "bg-[#2E3631]" : "bg-[#C2A78A]"
                }`}
              ></div>
              <div
                className={`absolute w-14 h-4 bottom-0 left-1/2 transform -translate-x-1/2 rounded-t-lg ${
                  darkMode ? "bg-[#344038]" : "bg-[#C9B296]"
                }`}
              ></div>
            </div>

            {/* Fox body */}
            <div
              className={`relative w-24 h-24 rounded-full ${
                darkMode ? "bg-[#F4A261]" : "bg-[#E68A41]"
              }`}
              style={{ zIndex: 2 }}
            >
              <div
                className={`absolute -top-2 left-6 w-8 h-8 rounded-t-full transform -rotate-12 ${
                  darkMode ? "bg-[#F4A261]" : "bg-[#E68A41]"
                } animate-ear-wiggle`}
              ></div>
              <div
                className={`absolute -top-2 right-6 w-8 h-8 rounded-t-full transform rotate-12 ${
                  darkMode ? "bg-[#F4A261]" : "bg-[#E68A41]"
                } animate-ear-wiggle-delay`}
              ></div>

              {/* Fox face */}
              <div
                className={`absolute top-6 left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full ${
                  darkMode ? "bg-[#FFD7BA]" : "bg-[#FFF5E8]"
                }`}
              >
                {/* Fox eyes that blink occasionally */}
                <div className="absolute top-5 left-4 w-3 h-3">
                  <div
                    className={`absolute inset-0 rounded-full ${
                      darkMode ? "bg-[#2A2A2A]" : "bg-[#5A4032]"
                    } animate-blink`}
                  ></div>
                </div>
                <div className="absolute top-5 right-4 w-3 h-3">
                  <div
                    className={`absolute inset-0 rounded-full ${
                      darkMode ? "bg-[#2A2A2A]" : "bg-[#5A4032]"
                    } animate-blink`}
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                </div>

                {/* Fox nose */}
                <div
                  className={`absolute bottom-3 left-1/2 transform -translate-x-1/2 w-4 h-3 rounded-full ${
                    darkMode ? "bg-[#2A2A2A]" : "bg-[#5A4032]"
                  }`}
                ></div>

                {/* Fox whiskers */}
                <div
                  className={`absolute bottom-4 left-3 w-3 h-px transform -rotate-12 ${
                    darkMode ? "bg-[#707070]" : "bg-[#8A6C55]"
                  }`}
                ></div>
                <div
                  className={`absolute bottom-4 right-3 w-3 h-px transform rotate-12 ${
                    darkMode ? "bg-[#707070]" : "bg-[#8A6C55]"
                  }`}
                ></div>
              </div>

              {/* Fox tail */}
              <div
                className={`absolute -right-4 bottom-4 w-6 h-12 rounded-full transform rotate-45 ${
                  darkMode ? "bg-[#F4A261]" : "bg-[#E68A41]"
                } animate-tail-wag origin-bottom`}
              >
                <div
                  className={`absolute top-0 right-0 w-3 h-3 rounded-full ${
                    darkMode ? "bg-[#FFD7BA]" : "bg-[#FFF5E8]"
                  }`}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Mug with steam */}
        <div className="absolute bottom-10 right-12">
          <div
            className={`relative w-6 h-5 rounded-b-lg ${
              darkMode ? "bg-[#8A6C55]" : "bg-[#B4855E]"
            }`}
          >
            <div
              className={`absolute -right-2 top-1 w-2 h-3 rounded-r-full border-r border-t border-b ${
                darkMode ? "border-[#8A6C55]" : "border-[#B4855E]"
              }`}
            ></div>
            <div
              className={`absolute top-0 left-0 right-0 h-1 rounded-full ${
                darkMode ? "bg-[#D4A072]" : "bg-[#D9B18C]"
              }`}
            ></div>

            {/* Steam */}
            <div className="absolute -top-4 left-1 w-1 h-3 bg-white opacity-60 animate-steam"></div>
            <div className="absolute -top-4 right-1 w-1 h-3 bg-white opacity-60 animate-steam-delayed"></div>
          </div>
        </div>

        {/* Floating zzzs with improved animation */}
        {[0, 0.5, 1].map((d, i) => (
          <div
            key={i}
            className={`absolute w-5 h-5 text-base font-bold ${
              darkMode ? "text-[#F4A261]" : "text-[#E68A41]"
            } animate-float-slow`}
            style={{
              left: `${60 + i * 7}%`,
              top: `${10 + i * 10}%`,
              animationDelay: `${d}s`,
              transform: `rotate(${i * 5}deg)`,
            }}
          >
            z
          </div>
        ))}

        {/* Sparkles with varied sizes and delays */}
        {[0, 0.6, 1.2, 0.3, 0.9].map((d, i) => (
          <div
            key={i}
            className={`absolute rounded-full ${
              darkMode ? "bg-[#F8F1E9]" : "bg-[#FFBB91]"
            } animate-sparkle`}
            style={{
              left: `${15 + i * 17}%`,
              top: `${30 - (i % 0.3) * 15}%`,
              width: `${1 + (i % 3)}px`,
              height: `${1 + (i % 3)}px`,
              animationDelay: `${d}s`,
            }}
          ></div>
        ))}

        {/* Stars (always visible but more prominent in dark mode) */}
        <div
          className={`absolute w-1.5 h-1.5 ${
            darkMode ? "bg-[#F8F1E9]" : "bg-[#FFD7BA]"
          } rounded-full animate-twinkle opacity-${darkMode ? "90" : "40"}`}
          style={{ left: "10%", top: "10%" }}
        ></div>
        <div
          className={`absolute w-1 h-1 ${
            darkMode ? "bg-[#F8F1E9]" : "bg-[#FFD7BA]"
          } rounded-full animate-twinkle opacity-${darkMode ? "90" : "40"}`}
          style={{ left: "90%", top: "15%", animationDelay: "0.4s" }}
        ></div>
        <div
          className={`absolute w-2 h-2 ${
            darkMode ? "bg-[#F8F1E9]" : "bg-[#FFD7BA]"
          } rounded-full animate-twinkle opacity-${darkMode ? "90" : "40"}`}
          style={{ left: "25%", top: "35%", animationDelay: "0.8s" }}
        ></div>
        <div
          className={`absolute w-1 h-1 ${
            darkMode ? "bg-[#F8F1E9]" : "bg-[#FFD7BA]"
          } rounded-full animate-twinkle opacity-${darkMode ? "90" : "40"}`}
          style={{ left: "75%", top: "25%", animationDelay: "1.2s" }}
        ></div>
      </div>

      {/* Progress bar with smoother animation */}
      {progress > 0 && (
        <div className="w-3/4 sm:w-2/3 h-2 bg-opacity-20 rounded-full overflow-hidden mb-4 z-10 relative">
          <div
            className={`h-full transition-all duration-700 ${
              darkMode ? "bg-[#F4A261]" : "bg-[#E68A41]"
            }`}
            style={{ width: `${progress}%` }}
          >
            <div
              className={`absolute right-0 top-0 h-full w-4 ${
                darkMode ? "bg-[#FFD7BA]" : "bg-[#FFBB91]"
              } opacity-70 animate-progress-shine`}
            ></div>
          </div>
        </div>
      )}

      {/* Text content with animated transitions */}
      <div className="text-center px-6 z-10 animate-fade-in">
        <h3 className="text-3xl font-semibold mb-3 tracking-wider relative">
          COZY{" "}
          <span
            className={`${
              darkMode ? "text-[#F4A261]" : "text-[#E68A41]"
            } inline-block animate-gentle-bounce`}
          >
            MINDS
          </span>
        </h3>
        <p
          className={`mt-2 text-sm max-w-md ${
            darkMode ? "text-[#B4B4B4]" : "text-[#7A5A44]"
          } font-medium italic animate-message-fade`}
        >
          {cozyMessages[currentMessage]}
        </p>
      </div>

      {/* Mute button for audio */}
      {audioRef.current && (
        <button
          className={`absolute bottom-4 right-4 p-2 rounded-full z-20 opacity-60 hover:opacity-100 transition-opacity ${
            darkMode
              ? "bg-[#2A2E2B] text-[#B4B4B4]"
              : "bg-[#F8E2CC] text-[#7A5A44]"
          }`}
          onClick={() => {
            if (audioRef.current.paused) {
              audioRef.current.play();
            } else {
              audioRef.current.pause();
            }
          }}
          aria-label="Toggle audio"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11 5L6 9H2V15H6L11 19V5Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M15.54 8.46C16.4774 9.39764 17.004 10.6692 17.004 11.995C17.004 13.3208 16.4774 14.5924 15.54 15.53"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}

      <style jsx>{`
        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2.5s infinite ease-in-out;
        }

        @keyframes breathe {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.03);
          }
        }
        .animate-breathe {
          animation: breathe 5s infinite ease-in-out;
        }

        @keyframes float-slow {
          0% {
            opacity: 0;
            transform: translateY(0) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: translateY(-15px) rotate(5deg);
          }
          100% {
            opacity: 0;
            transform: translateY(-30px) rotate(10deg);
          }
        }
        .animate-float-slow {
          animation: float-slow 2.5s infinite ease-in-out;
        }

        @keyframes flicker {
          0%,
          100% {
            transform: scale(1) translateY(0);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.1) translateY(-1px);
            opacity: 1;
          }
        }
        .animate-flicker {
          animation: flicker 1.2s infinite ease-in-out;
        }

        @keyframes flicker-fast {
          0%,
          100% {
            transform: translateX(-50%) scale(1) translateY(0);
            opacity: 0.9;
          }
          50% {
            transform: translateX(-50%) scale(1.2) translateY(-2px);
            opacity: 1;
          }
        }
        .animate-flicker-fast {
          animation: flicker-fast 0.8s infinite ease-in-out;
        }

        @keyframes ember {
          0% {
            opacity: 0.7;
            transform: translateY(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-20px) scale(0.5);
          }
        }
        .animate-ember {
          animation: ember 2s infinite ease-out;
        }

        @keyframes sparkle {
          0% {
            opacity: 0;
            transform: scale(0);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(0) translateY(-15px);
          }
        }
        .animate-sparkle {
          animation: sparkle 2s infinite ease-in-out;
        }

        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.3;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-twinkle {
          animation: twinkle 2s infinite ease-in-out;
        }

        @keyframes gradientFade {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient {
          background-size: 400% 400%;
          animation: gradientFade 15s ease infinite;
        }

        @keyframes blink {
          0%,
          95%,
          100% {
            transform: scaleY(1);
          }
          97%,
          98% {
            transform: scaleY(0.1);
          }
        }
        .animate-blink {
          animation: blink 6s infinite ease-in-out;
        }

        @keyframes ear-wiggle {
          0%,
          80%,
          100% {
            transform: rotate(-12deg);
          }
          85%,
          95% {
            transform: rotate(-18deg);
          }
        }
        .animate-ear-wiggle {
          animation: ear-wiggle 8s infinite ease-in-out;
        }

        @keyframes ear-wiggle-delay {
          0%,
          85%,
          100% {
            transform: rotate(12deg);
          }
          90%,
          95% {
            transform: rotate(18deg);
          }
        }
        .animate-ear-wiggle-delay {
          animation: ear-wiggle-delay 8s infinite ease-in-out;
          animation-delay: 0.2s;
        }

        @keyframes tail-wag {
          0%,
          70%,
          100% {
            transform: rotate(45deg);
          }
          80%,
          90% {
            transform: rotate(55deg) translateX(-2px);
          }
        }
        .animate-tail-wag {
          animation: tail-wag 5s infinite ease-in-out;
        }

        @keyframes gentle-bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-2px);
          }
        }
        .animate-gentle-bounce {
          animation: gentle-bounce 2s infinite ease-in-out;
        }

        @keyframes message-fade {
          0%,
          20% {
            opacity: 0;
            transform: translateY(5px);
          }
          30%,
          90% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(-5px);
          }
        }
        .animate-message-fade {
          animation: message-fade 4s infinite ease-in-out;
        }

        @keyframes fade-in {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        @keyframes progress-shine {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(300%);
          }
        }
        .animate-progress-shine {
          animation: progress-shine 2s infinite ease-in-out;
        }

        @keyframes rainfall {
          0% {
            transform: translateY(-20px);
            opacity: 0;
          }
          50% {
            opacity: 0.7;
          }
          100% {
            transform: translateY(400px);
            opacity: 0;
          }
        }
        .animate-rainfall {
          animation: rainfall 1.5s infinite linear;
        }

        @keyframes snowfall {
          0% {
            transform: translateY(-10px) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(400px) translateX(20px);
            opacity: 0;
          }
        }
        .animate-snowfall {
          animation: snowfall 8s infinite linear;
        }

        @keyframes steam {
          0% {
            opacity: 0;
            transform: translateY(0) scale(1);
          }
          50% {
            opacity: 0.7;
          }
          100% {
            opacity: 0;
            transform: translateY(-8px) scale(1.5);
          }
        }
        .animate-steam {
          animation: steam 2s infinite ease-out;
        }

        .animate-steam-delayed {
          animation: steam 2s infinite ease-out;
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
