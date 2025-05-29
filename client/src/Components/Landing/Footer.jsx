import React from "react";
import { Link } from "react-router-dom";
import FooterImg from "../../assets/footer2.webp";
import { Linkedin, Github } from "lucide-react";

const Footer = ({ darkMode, setShowLoginModal }) => {
  return (
    <>
      {/* Call-to-Action Section */}
      <section className="relative z-10 w-full max-w-7xl py-12 mb-12 mx-auto px-1 sm:px-6">
        <div
          className={`w-full p-6 md:p-12 ${
            darkMode ? "bg-[#2A2A2A]" : "bg-[#1A1A1A] text-white"
          } shadow-sharp`}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Ready to Start Your Journey?
              </h2>
              <p
                className={`opacity-80 text-sm md:text-base max-w-md ${
                  darkMode ? "" : "text-white/80"
                }`}
              >
                Join others in finding mental clarity with Starlit Journals,
                crafted for well-being.
              </p>
            </div>
            <button
              onClick={() => setShowLoginModal(true)}
              className={`px-6 py-3 md:px-8 md:py-4 text-sm md:text-base ${
                darkMode ? "bg-[#5999a8] text-white" : "bg-white text-black"
              } hover:opacity-90 transition-opacity whitespace-nowrap`}
            >
              Begin Your Journey
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-6xl px-4 py-12 mx-auto border-t border-[#1A1A1A]/10 dark:border-[#F8F1E9]/10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <div className="text-xl font-bold tracking-wider mb-4">
              <span
                className={`${darkMode ? "text-[#5999a8]" : "text-[#E68A41]"}`}
              >
                STARLIT
              </span>{" "}
              JOURNALS
            </div>
            <p className="opacity-70 text-sm max-w-xs">
              A solo developer's passion project to bring mental clarity and
              well-being to all.
            </p>

            <div className="flex gap-4 mt-4 opacity-70 text-sm max-w-xs  ">
              <Link className="hover:underline" to="/privacy-policy">
                Privacy Policy
              </Link>
              <Link className="hover:underline" to="/terms-of-service">
                Terms of Service
              </Link>

              <Link className="hover:underline" to="/cozyminds-blog">
                Our Blogs
              </Link>
            </div>
          </div>

          <div className="flex gap-6">
            {[
              {
                icon: (
                  <Linkedin
                    // size={32}
                    className="hover:opacity-80 transition-opacity"
                  />
                ),
                link: "https://www.linkedin.com/in/dharmadeep-madisetty-oct2003",
              },
              {
                icon: (
                  <Github
                    // size={32}
                    className="hover:opacity-80 transition-opacity"
                  />
                ),
                link: "https://github.com/Bot-code-2003/",
              },
            ].map((social, index) => (
              <a
                key={index}
                href={social.link}
                className="opacity-60 hover:opacity-100 hover:text-[#5999a8] transition-all"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        <div className="border-t border-[#1A1A1A]/10 dark:border-[#F8F1E9]/10 mt-12 pt-6 text-center">
          <p className="text-xs md:text-sm opacity-60">
            © {new Date().getFullYear()} Starlit Journals • Built with care for
            your calm
          </p>
        </div>
      </footer>

      {/* Footer Image Decoration */}
      <div className="absolute bottom-0 left-0 w-full pointer-events-none">
        <div className="relative w-full h-32 md:h-80">
          <img
            src={FooterImg}
            alt="Footer Decoration"
            className="w-full h-full object-cover opacity-60 dark:opacity-60 transition-opacity duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#f3f9fc] to-transparent dark:from-[#1A1A1A] dark:to-transparent" />
        </div>
      </div>
    </>
  );
};

export default Footer;
