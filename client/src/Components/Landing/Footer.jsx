import React from "react";
import { Link } from "react-router-dom";
import FooterImg from "../../assets/footer2.webp";

const Footer = ({ darkMode }) => {
  return (
    <>
      {/* Call-to-Action Section */}
      <section className="relative z-10 w-full max-w-6xl py-12 mb-12 mx-auto">
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
                Join thousands who have transformed their mental clarity with
                Cozy Minds.
              </p>
            </div>
            <Link
              to="/login"
              className={`px-6 py-3 md:px-8 md:py-4 text-sm md:text-base ${
                darkMode ? "bg-[#F4A261] text-black" : "bg-white text-black"
              } hover:opacity-90 transition-opacity whitespace-nowrap`}
            >
              Begin your Journey
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-6xl sm:min-h-[500px] px-4 py-12 mx-auto border-t border-[#1A1A1A]/10 dark:border-[#F8F1E9]/10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="text-xl font-bold tracking-wider mb-4">
              COZY
              <span
                className={`${darkMode ? "text-[#F4A261]" : "text-[#E68A41]"}`}
              >
                MINDS
              </span>
            </div>
            <p className="opacity-70 text-sm">
              Bringing mental clarity to your daily life with minimalist,
              effective tools.
            </p>
          </div>

          {[
            {
              title: "Product",
              links: ["Features", "Pricing", "Testimonials", "FAQ"],
            },
            {
              title: "Company",
              links: ["About", "Team", "Careers", "Press"],
            },
            {
              title: "Resources",
              links: ["Blog", "Support", "Contact", "Privacy"],
            },
          ].map((column, index) => (
            <div key={index}>
              <h3 className="font-semibold mb-4 text-base md:text-lg">
                {column.title}
              </h3>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="opacity-70 hover:opacity-100 hover:text-[#F4A261] transition-all text-sm"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-[#1A1A1A]/10 dark:border-[#F8F1E9]/10 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs md:text-sm opacity-60 text-center md:text-left">
            © {new Date().getFullYear()} Cozy Minds • Built for your calm
          </p>
          <div className="flex gap-6">
            {[
              {
                icon: (
                  <path
                    d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ),
              },
              {
                icon: (
                  <path
                    d="M23 3.00005C22.0424 3.67552 20.9821 4.19216 19.86 4.53005C19.2577 3.83756 18.4573 3.34674 17.567 3.12397C16.6767 2.90121 15.7395 2.95724 14.8821 3.2845C14.0247 3.61176 13.2884 4.19445 12.773 4.95376C12.2575 5.71308 11.9877 6.61238 12 7.53005V8.53005C10.2426 8.57561 8.50127 8.18586 6.93101 7.39549C5.36074 6.60513 4.01032 5.43868 3 4.00005C3 4.00005 -1 13 8 17C5.94053 18.398 3.48716 19.099 1 19C10 24 21 19 21 7.50005C20.9991 7.2215 20.9723 6.94364 20.92 6.67005C21.9406 5.66354 22.6608 4.39276 23 3.00005Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ),
              },
              {
                icon: (
                  <>
                    <path
                      d="M16 8C17.5913 8 19.1174 8.63214 20.2426 9.75736C21.3679 10.8826 22 12.4087 22 14V21H18V14C18 13.4696 17.7893 12.9609 17.4142 12.5858C17.0391 12.2107 16.5304 12 16 12C15.4696 12 14.9609 12.2107 14.5858 12.5858C14.2107 12.9609 14 13.4696 14 14V21H10V14C10 12.4087 10.6321 10.8826 11.7574 9.75736C12.8826 8.63214 14.4087 8 16 8Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M6 9H2V21H6V9Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M4 6C5.10457 6 6 5.10457 6 4C6 2.89543 5.10457 2 4 2C2.89543 2 2 2.89543 2 4C2 5.10457 2.89543 6 4 6Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </>
                ),
              },
              {
                icon: (
                  <>
                    <path
                      d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M16 8V8.01"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <rect
                      x="2"
                      y="2"
                      width="20"
                      height="20"
                      rx="5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </>
                ),
              },
            ].map((social, index) => (
              <a
                key={index}
                href="#"
                className="opacity-60 hover:opacity-100 hover:text-[#F4A261] transition-all"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {social.icon}
                </svg>
              </a>
            ))}
          </div>
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
          <div className="absolute inset-0 bg-gradient-to-b from-[#F8F1E9] to-transparent dark:from-[#1A1A1A] dark:to-transparent" />
        </div>
      </div>
    </>
  );
};

export default Footer;
