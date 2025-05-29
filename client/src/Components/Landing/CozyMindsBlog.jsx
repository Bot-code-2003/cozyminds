"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  User,
  ArrowRight,
  BookOpen,
  Heart,
  Brain,
  Sunrise,
  Moon,
  Sun,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Smile,
  Pen,
  PawPrint,
  Lamp,
} from "lucide-react";
import blogPostsData from "./blogPosts.json";
import BlogPage from "./BlogPage";
import AuthModals from "./AuthModals";
import { useDarkMode } from "../../context/ThemeContext";
import { useNavigate } from "react-router-dom";

import Navbar from "./Navbar";

const CozyMindsBlog = () => {
  const [selectedPost, setSelectedPost] = useState(null);
  const [showBlogPage, setShowBlogPage] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  const navigate = useNavigate();

  const { darkMode, setDarkMode } = useDarkMode();
  // Get auth modal controls
  const { modals, openLoginModal, openSignupModal } = AuthModals({ darkMode });

  useEffect(() => {
    scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const getIcon = (iconName) => {
    const icons = {
      Brain: <Brain size={20} className="sm:w-6 sm:h-6" />,
      Sunrise: <Sunrise size={20} className="sm:w-6 sm:h-6" />,
      BookOpen: <BookOpen size={20} className="sm:w-6 sm:h-6" />,
      Heart: <Heart size={20} className="sm:w-6 sm:h-6" />,
      Moon: <Moon size={20} className="sm:w-6 sm:h-6" />,
      Smile: <Smile size={20} className="sm:w-6 sm:h-6" />,
      Pen: <Pen size={20} className="sm:w-6 sm:h-6" />,
      PawPrint: <PawPrint size={20} className="sm:w-6 sm:h-6" />,
      Lamp: <Lamp size={20} className="sm:w-6 sm:h-6" />,
    };
    return icons[iconName] || <BookOpen size={20} className="sm:w-6 sm:h-6" />;
  };

  const openBlogPost = (post) => {
    setSelectedPost(post);
    setShowBlogPage(true);
    window.scrollTo(0, 0);
  };

  const closeBlogPost = () => {
    setShowBlogPage(false);
    setSelectedPost(null);
    window.scrollTo(0, 0);
  };

  // If showing blog page, render BlogPage component
  if (showBlogPage && selectedPost) {
    navigate(`/blog/${selectedPost.slug}`);
  }

  const featuredPosts = blogPostsData.filter((post) => post.featured);
  const regularPosts = blogPostsData.filter((post) => !post.featured);

  // Auto-rotate carousel for featured posts
  useEffect(() => {
    if (featuredPosts.length > 1) {
      const interval = setInterval(() => {
        setCurrentFeaturedIndex((prev) => (prev + 1) % featuredPosts.length);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [featuredPosts.length]);

  const nextFeatured = () => {
    setCurrentFeaturedIndex((prev) => (prev + 1) % featuredPosts.length);
  };

  const prevFeatured = () => {
    setCurrentFeaturedIndex(
      (prev) => (prev - 1 + featuredPosts.length) % featuredPosts.length
    );
  };

  return (
    <div className="min-h-screen dark:bg-[#1A1A1A] dark:text-[#F8F1E9] bg-[#f3f9fc] text-[#1A1A1A] font-sans transition-colors duration-300">
      {/* SEO Meta Tags */}
      <head>
        <title>
          Starlit Journals Blog - Mindful Journaling Insights & Mental Wellness
          Tips
        </title>
        <meta
          name="description"
          content="Discover thoughtful insights, gentle guidance, and inspiring stories to support your journaling journey and mental wellness. Expert tips on mindful writing and self-reflection."
        />
        <meta
          name="keywords"
          content="journaling blog, mental wellness, mindfulness, self-reflection, therapeutic writing, emotional health, mindful living"
        />
        <meta name="author" content="Starlit Journals Team" />
        <meta
          property="og:title"
          content="Starlit Journals Blog - Mindful Journaling Insights"
        />
        <meta
          property="og:description"
          content="Thoughtful insights and gentle guidance for your journaling journey and mental wellness."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://starlitjournals.vercel.app/starlitblogs"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Starlit Journals Blog - Mindful Journaling Insights"
        />
        <meta
          name="twitter:description"
          content="Discover expert tips on journaling, mindfulness, and mental wellness."
        />
      </head>

      <Navbar
        isScrolled={isScrolled}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        openLoginModal={openLoginModal}
        openSignupModal={openSignupModal}
      />

      {/* Enhanced Gradient Accents */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-br from-[#8fa9af]/30 via-[#5999a8]/20 to-transparent opacity-80 dark:opacity-30 transition-opacity duration-300"></div>
      <div className="absolute top-1/4 right-0 w-1/3 h-1/3 bg-gradient-to-l from-[#5999a8]/20 to-transparent opacity-60 dark:opacity-20 rounded-full blur-3xl"></div>

      {/* Grid Pattern Background - Hidden on mobile for better performance */}
      <div className="absolute inset-0 z-0 opacity-5 dark:opacity-10 pointer-events-none hidden sm:block">
        <div className="absolute inset-0 grid grid-cols-12 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="h-full border-r border-black dark:border-white"
            ></div>
          ))}
        </div>
        <div className="absolute inset-0 grid grid-rows-12 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="w-full border-b border-black dark:border-white"
            ></div>
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden mb-6 p-4 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] rounded-xl bg-white/80 dark:bg-[#2A2A2A]/80 backdrop-blur-md shadow-xl">
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  openLoginModal();
                  setMobileMenuOpen(false);
                }}
                className="w-full p-3 text-left border border-[#1A1A1A] dark:border-[#F8F1E9] rounded-lg hover:bg-[#5999a8]/10 dark:hover:bg-[#5999a8]/20 transition-all duration-300 font-medium"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  openSignupModal();
                  setMobileMenuOpen(false);
                }}
                className="w-full p-3 bg-[#1A1A1A] dark:bg-[#F8F1E9] text-[#F8F1E9] dark:text-[#1A1A1A] rounded-lg font-medium hover:scale-105 transition-transform duration-300"
              >
                Get Started
              </button>
            </div>
          </div>
        )}

        {/* Enhanced Header */}
        <div className="text-center mb-12 mt-20 sm:mb-20">
          <div className="inline-block mb-4 sm:mb-6 px-4 py-2 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] text-xs font-bold tracking-widest bg-white/50 dark:bg-[#2A2A2A]/50 backdrop-blur-sm rounded-full">
            MINDFUL READING
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight mb-6 sm:mb-8 leading-none">
            <span className="relative inline-block">
              Starlit Journals{" "}
              <span className="text-[#5999a8] relative">
                Blog
                <svg
                  className="absolute -bottom-2 sm:-bottom-3 left-0 w-full h-2 sm:h-3 text-[#5999a8]"
                  viewBox="0 0 100 10"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0,5 Q25,0 50,5 T100,5"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                  />
                </svg>
              </span>
            </span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl opacity-90 font-medium max-w-3xl mx-auto px-4 leading-relaxed">
            Thoughtful insights, gentle guidance, and inspiring stories to
            support your journaling journey and mental wellness.
          </p>
        </div>

        {/* Enhanced Featured Posts Carousel */}
        {featuredPosts.length > 0 && (
          <div className="mb-12 sm:mb-20">
            <div className="relative">
              <div className="overflow-hidden rounded-2xl sm:rounded-3xl border-2 border-[#1A1A1A] dark:border-[#F8F1E9] bg-white/60 dark:bg-[#2A2A2A]/60 backdrop-blur-md shadow-2xl">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{
                    transform: `translateX(-${currentFeaturedIndex * 100}%)`,
                  }}
                >
                  {featuredPosts.map((post, index) => (
                    <div key={post.id} className="w-full flex-shrink-0">
                      <div
                        className="grid grid-cols-1 md:grid-cols-2 gap-0 cursor-pointer group"
                        onClick={() => openBlogPost(post)}
                      >
                        <div className="relative overflow-hidden order-1 md:order-1">
                          <img
                            src={post.image || "/placeholder.svg"}
                            alt={post.title}
                            className="w-full h-56 sm:h-72 max-h-[512px] md:h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute top-4 sm:top-6 left-4 sm:left-6">
                            <span className="px-3 sm:px-4 py-2 bg-[#5999a8] text-white text-sm font-bold rounded-full shadow-lg">
                              FEATURED
                            </span>
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </div>
                        <div className="p-6 sm:p-8 md:p-10 order-2 md:order-2">
                          <div className="flex items-center gap-4 sm:gap-5 mb-4 sm:mb-6">
                            <div className="p-3 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] rounded-2xl bg-[#5999a8]/15 dark:bg-[#5999a8]/25 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                              {getIcon(post.icon)}
                            </div>
                            <span className="text-sm sm:text-base font-bold opacity-80 tracking-wide">
                              {post.category}
                            </span>
                          </div>
                          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-4 sm:mb-6 leading-tight group-hover:text-[#5999a8] transition-colors duration-300">
                            {post.title}
                          </h2>
                          <p className="text-base sm:text-lg md:text-xl opacity-85 mb-6 sm:mb-8 leading-relaxed">
                            {post.excerpt}
                          </p>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
                            <div className="flex flex-wrap items-center gap-4 sm:gap-5 text-sm sm:text-base opacity-75">
                              <div className="flex items-center gap-2">
                                <User size={16} className="sm:w-5 sm:h-5" />
                                <span className="font-medium">
                                  {post.author}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar size={16} className="sm:w-5 sm:h-5" />
                                <span>{post.date}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock size={16} className="sm:w-5 sm:h-5" />
                                <span>{post.readTime}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 px-5 sm:px-6 py-3 sm:py-4 bg-[#1A1A1A] dark:bg-[#F8F1E9] text-[#F8F1E9] dark:text-[#1A1A1A] rounded-xl group-hover:scale-105 group-hover:shadow-xl transition-all duration-300 font-bold text-base sm:text-lg w-fit">
                              Read More
                              <ArrowRight
                                size={18}
                                className="sm:w-5 sm:h-5 group-hover:translate-x-2 transition-transform duration-300"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Carousel Controls */}
              {featuredPosts.length > 1 && (
                <>
                  <button
                    onClick={prevFeatured}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 dark:bg-[#1A1A1A]/90 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] rounded-full hover:scale-110 transition-all duration-300 shadow-lg"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={nextFeatured}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 dark:bg-[#1A1A1A]/90 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] rounded-full hover:scale-110 transition-all duration-300 shadow-lg"
                  >
                    <ChevronRight size={20} />
                  </button>

                  {/* Carousel Indicators */}
                  <div className="flex justify-center gap-2 mt-6">
                    {featuredPosts.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentFeaturedIndex(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === currentFeaturedIndex
                            ? "bg-[#5999a8] scale-125"
                            : "bg-[#1A1A1A]/30 dark:bg-[#F8F1E9]/30 hover:bg-[#5999a8]/50"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Enhanced Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 mb-12 sm:mb-20">
          {regularPosts.map((post, index) => (
            <article
              key={post.id}
              className="border-2 border-[#1A1A1A] dark:border-[#F8F1E9] rounded-2xl sm:rounded-3xl overflow-hidden bg-white/60 dark:bg-[#2A2A2A]/60 backdrop-blur-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group cursor-pointer"
              onClick={() => openBlogPost(post)}
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <div className="relative overflow-hidden">
                <img
                  src={post.image || "/placeholder.svg"}
                  alt={post.title}
                  className="w-full h-48 sm:h-56 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 sm:top-5 left-4 sm:left-5">
                  <div className="p-2 sm:p-3 bg-white/95 dark:bg-[#1A1A1A]/95 rounded-2xl border border-[#1A1A1A] dark:border-[#F8F1E9] group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                    {getIcon(post.icon)}
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              <div className="p-5 sm:p-7">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs sm:text-sm font-bold px-3 py-1.5 bg-[#5999a8]/15 dark:bg-[#5999a8]/25 rounded-full border border-[#5999a8]/30">
                    {post.category}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black mb-4 leading-tight group-hover:text-[#5999a8] transition-colors duration-300">
                  {post.title}
                </h3>
                <p className="text-sm sm:text-base opacity-85 mb-5 leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 text-xs sm:text-sm opacity-75">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <User size={14} className="sm:w-4 sm:h-4" />
                      <span className="font-medium">{post.author}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock size={14} className="sm:w-4 sm:h-4" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                  <span className="text-right sm:text-left font-medium">
                    {post.date}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Enhanced Signup CTA */}
        <div className="border-2 border-[#1A1A1A] dark:border-[#F8F1E9] rounded-2xl sm:rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-[#5999a8]/10 via-white/50 to-[#5999a8]/5 dark:from-[#5999a8]/10 dark:via-[#2A2A2A]/50 dark:to-[#5999a8]/5 text-center backdrop-blur-md shadow-2xl">
          <div className="mb-6 sm:mb-8">
            <div className="inline-block p-4 sm:p-6 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] rounded-2xl sm:rounded-3xl bg-white/80 dark:bg-[#1A1A1A]/80 shadow-lg">
              <Heart size={32} className="sm:w-12 sm:h-12 text-[#5999a8]" />
            </div>
          </div>
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 sm:mb-6 tracking-tight">
            Ready to Start Your Journey?
          </h3>
          <p className="text-lg sm:text-xl opacity-90 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-4">
            Join thousands of mindful writers who've discovered the
            transformative power of daily journaling. Your cozy space awaits.
          </p>
          <div className="flex flex-col gap-4 justify-center max-w-lg mx-auto">
            <button
              onClick={openSignupModal}
              className="inline-flex items-center justify-center gap-4 px-8 sm:px-10 py-4 sm:py-5 bg-[#1A1A1A] dark:bg-[#F8F1E9] text-[#F8F1E9] dark:text-[#1A1A1A] hover:scale-105 hover:shadow-xl transition-all duration-300 rounded-xl font-black text-lg sm:text-xl group w-full"
            >
              Begin Your Cozy Journey
              <ArrowRight
                size={22}
                className="sm:w-6 sm:h-6 group-hover:translate-x-2 transition-transform duration-300"
              />
            </button>
            <button
              onClick={openLoginModal}
              className="inline-flex items-center justify-center gap-4 px-8 sm:px-10 py-4 sm:py-5 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] hover:bg-[#5999a8]/15 dark:hover:bg-[#5999a8]/25 hover:scale-105 transition-all duration-300 rounded-xl font-black text-lg sm:text-xl w-full"
            >
              Already a Member? Sign In
            </button>
          </div>
        </div>
      </div>

      {/* Auth Modals */}
      {modals}
    </div>
  );
};

export default CozyMindsBlog;
