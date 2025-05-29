"use client";

import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Tag,
  Share2,
  BookOpen,
  Heart,
  Menu,
  X,
  Smile,
  Pen,
  PawPrint,
  Lamp,
} from "lucide-react";
import { Brain, Sunrise, Moon } from "lucide-react";
import AuthModals from "./AuthModals";
import { useEffect, useState } from "react";
import BlogPostData from "./blogPosts.json";
import { useNavigate, useParams } from "react-router-dom";
import { useDarkMode } from "../../context/ThemeContext";

const BlogPage = ({ onBack }) => {
  const { darkMode, setDarkMode } = useDarkMode();
  // Get auth modal controls
  const { modals, openLoginModal, openSignupModal } = AuthModals({ darkMode });
  const [post, setPost] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navigate = useNavigate();
  const { slug } = useParams();

  // Parse content with proper formatting
  // Parse content with proper formatting
  // Parse content with proper formatting
  const parseContent = (content) => {
    if (!content) return [];

    // Split by double or single newlines, preserving content structure
    const sections = content
      .split(/\n{1,2}/) // Split by one or two newlines
      .map((section) => section.trim())
      .filter(Boolean); // Remove empty sections

    let parsedSections = [];
    let currentList = null;

    sections.forEach((section, index) => {
      // Handle headings with **text**
      if (section.startsWith("**") && section.endsWith("**")) {
        if (currentList) {
          // Push any accumulated list before starting a new section
          parsedSections.push(currentList);
          currentList = null;
        }
        parsedSections.push({
          type: "heading",
          content: section.replace(/\*\*/g, ""),
          index,
        });
        return;
      }

      // Handle bullet lists (unordered)
      if (section.startsWith("- ") || section.startsWith("• ")) {
        if (!currentList || currentList.type !== "list") {
          if (currentList) {
            parsedSections.push(currentList);
          }
          currentList = {
            type: "list",
            items: [],
            index,
          };
        }
        currentList.items.push(section.replace(/^[-•]\s*/, ""));
        return;
      }

      // Handle numbered lists (ordered)
      if (section.match(/^\d+\.\s/)) {
        if (!currentList || currentList.type !== "orderedList") {
          if (currentList) {
            parsedSections.push(currentList);
          }
          currentList = {
            type: "orderedList",
            items: [],
            index,
          };
        }
        currentList.items.push(section.replace(/^\d+\.\s*/, ""));
        return;
      }

      // Handle regular paragraphs
      if (currentList) {
        parsedSections.push(currentList);
        currentList = null;
      }
      parsedSections.push({
        type: "paragraph",
        content: section,
        index,
      });
    });

    // Push any remaining list
    if (currentList) {
      parsedSections.push(currentList);
    }

    return parsedSections;
  };

  // Format text with bold and italic
  // Format text with bold, italic, and links
  const formatText = (text) => {
    return text
      .replace(
        /\*\*(.*?)\*\*/g,
        '<strong class="font-bold text-[#5999a8]">$1</strong>'
      )
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(
        /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
        '<a href="$2" class="text-[#5999a8] hover:underline" target="_blank" rel="noopener noreferrer">$1</a>'
      );
  };

  // Get post from slug parameter
  useEffect(() => {
    if (slug) {
      const foundPost = BlogPostData.find((post) => post.slug === slug);
      if (foundPost) {
        setPost(foundPost);
        // Update page title
        document.title = `${foundPost.title} | Starlit Journals Blog`;
      }
    }
  }, [slug]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getIcon = (iconName) => {
    const icons = {
      Brain: <Brain size={24} className="sm:w-8 sm:h-8" />,
      Sunrise: <Sunrise size={24} className="sm:w-8 sm:h-8" />,
      BookOpen: <BookOpen size={24} className="sm:w-8 sm:h-8" />,
      Heart: <Heart size={24} className="sm:w-8 sm:h-8" />,
      Moon: <Moon size={24} className="sm:w-8 sm:h-8" />,
      Smile: <Smile size={24} className="sm:w-8 sm:h-8" />,
      Pen: <Pen size={24} className="sm:w-8 sm:h-8" />,
      PawPrint: <PawPrint size={24} className="sm:w-8 sm:h-8" />,
      Lamp: <Lamp size={24} className="sm:w-8 sm:h-8" />,
    };
    return icons[iconName] || <BookOpen size={24} className="sm:w-8 sm:h-8" />;
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const handleRecommendationClick = (recommendedPost) => {
    navigate(`/blog/${recommendedPost.slug}`);
    window.scrollTo(0, 0);
  };

  if (!post) {
    return (
      <div className="min-h-screen dark:bg-[#1A1A1A] dark:text-[#F8F1E9] bg-[#f3f9fc] text-[#1A1A1A] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5999a8] mx-auto mb-4"></div>
          <p className="text-lg">Loading post...</p>
        </div>
      </div>
    );
  }

  const parsedContent = parseContent(post.content);

  return (
    <div className="min-h-screen dark:bg-[#1A1A1A] dark:text-[#F8F1E9] bg-[#f3f9fc] text-[#1A1A1A] font-sans transition-colors duration-300">
      {/* SEO Meta Tags */}
      <head>
        <title>{post.seo.ogTitle} | Starlit Journals Blog</title>
        <meta name="description" content={post.metaDescription} />
        <meta name="keywords" content={post.seo.keywords} />
        <meta name="author" content={post.author} />
        <link rel="canonical" href={post.seo.canonicalUrl} />
      </head>

      {/* Enhanced Gradient Accents */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-br from-[#8fa9af]/30 via-[#5999a8]/20 to-transparent opacity-80 dark:opacity-30 transition-opacity duration-300"></div>
      <div className="absolute top-1/4 right-0 w-1/3 h-1/3 bg-gradient-to-l from-[#5999a8]/20 to-transparent opacity-60 dark:opacity-20 rounded-full blur-3xl"></div>

      {/* Grid Pattern Background */}
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

      {/* Floating Navigation Bar */}
      <div
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${
          isScrolled
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-3 px-4 py-2 bg-white/90 dark:bg-[#1A1A1A]/90 backdrop-blur-md border-2 border-[#1A1A1A] dark:border-[#F8F1E9] rounded-full shadow-xl">
          <button
            onClick={() => navigate("/starlitblogs")}
            className="flex items-center gap-2 px-3 py-1.5 hover:bg-[#5999a8]/10 dark:hover:bg-[#5999a8]/20 rounded-full transition-all duration-300"
          >
            <ArrowLeft size={14} />
            <span className="text-sm font-medium hidden sm:inline">Back</span>
          </button>
          <div className="w-px h-6 bg-[#1A1A1A]/20 dark:bg-[#F8F1E9]/20"></div>
          <button
            onClick={handleShare}
            className="p-1.5 hover:bg-[#5999a8]/10 dark:hover:bg-[#5999a8]/20 rounded-full transition-all duration-300"
            aria-label="Share article"
          >
            <Share2 size={14} />
          </button>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-1.5 hover:bg-[#5999a8]/10 dark:hover:bg-[#5999a8]/20 rounded-full transition-all duration-300"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sunrise size={14} /> : <Moon size={14} />}
          </button>
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Mobile Navigation */}
        <div className="flex items-center justify-between mb-8 sm:hidden">
          <button
            onClick={() => navigate("/starlitblogs")}
            className="flex items-center gap-2 px-4 py-3 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] rounded-xl hover:bg-[#5999a8]/10 dark:hover:bg-[#5999a8]/20 transition-all duration-300 font-medium"
          >
            <ArrowLeft size={16} />
            <span className="text-sm">Back</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="p-3 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] rounded-xl hover:bg-[#5999a8]/10 dark:hover:bg-[#5999a8]/20 transition-all duration-300"
              aria-label="Share article"
            >
              <Share2 size={16} />
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-3 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] rounded-xl hover:bg-[#5999a8]/10 dark:hover:bg-[#5999a8]/20 transition-all duration-300"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sunrise size={16} /> : <Moon size={16} />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-3 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] rounded-xl hover:bg-[#5999a8]/10 dark:hover:bg-[#5999a8]/20 transition-all duration-300"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden mb-8 p-5 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] rounded-2xl bg-white/80 dark:bg-[#2A2A2A]/80 backdrop-blur-md shadow-xl">
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  openLoginModal();
                  setMobileMenuOpen(false);
                }}
                className="w-full p-4 text-left border border-[#1A1A1A] dark:border-[#F8F1E9] rounded-xl hover:bg-[#5999a8]/10 dark:hover:bg-[#5999a8]/20 transition-all duration-300 font-medium"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  openSignupModal();
                  setMobileMenuOpen(false);
                }}
                className="w-full p-4 bg-[#1A1A1A] dark:bg-[#F8F1E9] text-[#F8F1E9] dark:text-[#1A1A1A] rounded-xl font-medium hover:scale-105 transition-transform duration-300"
              >
                Get Started
              </button>
            </div>
          </div>
        )}

        {/* Desktop Navigation */}
        <div className="hidden sm:flex items-center justify-between mb-10">
          <button
            onClick={() => navigate("/starlitblogs")}
            className="flex items-center gap-3 px-6 py-3 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] rounded-xl hover:bg-[#5999a8]/10 dark:hover:bg-[#5999a8]/20 hover:scale-105 transition-all duration-300 font-medium"
          >
            <ArrowLeft size={18} />
            Back to Blog
          </button>

          <div className="flex items-center gap-4">
            <button
              onClick={handleShare}
              className="p-3 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] rounded-xl hover:bg-[#5999a8]/10 dark:hover:bg-[#5999a8]/20 hover:scale-110 transition-all duration-300"
              aria-label="Share article"
            >
              <Share2 size={18} />
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-3 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] rounded-xl hover:bg-[#5999a8]/10 dark:hover:bg-[#5999a8]/20 hover:scale-110 transition-all duration-300"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sunrise size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>

        {/* Enhanced Hero Image */}
        <div className="relative mb-8 sm:mb-12 rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-[#1A1A1A] dark:border-[#F8F1E9] shadow-2xl">
          <img
            src={post.image || "/placeholder.svg"}
            alt={post.title}
            className="w-full h-56 sm:h-72 md:h-96 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
          <div className="absolute bottom-6 sm:bottom-8 left-6 sm:left-8 flex flex-wrap items-center gap-3 sm:gap-4">
            <span className="px-4 sm:px-5 py-2 sm:py-3 bg-[#5999a8] text-white text-sm sm:text-base font-bold rounded-full shadow-lg">
              {post.category}
            </span>
            {post.featured && (
              <span className="px-4 sm:px-5 py-2 sm:py-3 bg-white/25 text-white text-sm sm:text-base font-bold rounded-full backdrop-blur-sm">
                FEATURED
              </span>
            )}
          </div>
        </div>

        {/* Enhanced Article Header */}
        <header className="mb-10 sm:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-start gap-6 sm:gap-8 mb-6 sm:mb-8">
            <div className="p-4 sm:p-5 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] rounded-2xl sm:rounded-3xl bg-[#5999a8]/15 dark:bg-[#5999a8]/25 w-fit shadow-lg">
              {getIcon(post.icon)}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-4 sm:mb-6 tracking-tight">
                {post.title}
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl opacity-85 leading-relaxed font-medium">
                {post.excerpt}
              </p>
            </div>
          </div>

          {/* Enhanced Article Meta */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-4 sm:gap-8 text-sm sm:text-base opacity-75 mb-6 sm:mb-8 font-medium">
            <div className="flex items-center gap-2 sm:gap-3">
              <User size={16} className="sm:w-5 sm:h-5" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Calendar size={16} className="sm:w-5 sm:h-5" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Clock size={16} className="sm:w-5 sm:h-5" />
              <span>{post.readTime}</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <BookOpen size={16} className="sm:w-5 sm:h-5" />
              <span>{post.wordCount} words</span>
            </div>
          </div>

          {/* Enhanced Tags */}
          <div className="flex flex-wrap gap-3 mb-8 sm:mb-10">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-4 sm:px-5 py-2 sm:py-3 bg-[#5999a8]/15 dark:bg-[#5999a8]/25 text-sm sm:text-base rounded-xl border border-[#5999a8]/30 flex items-center gap-2 font-medium hover:scale-105 transition-transform duration-300"
              >
                <Tag size={12} className="sm:w-4 sm:h-4" />
                {tag}
              </span>
            ))}
          </div>
        </header>

        {/* Enhanced Article Content */}
        <article className="prose prose-sm sm:prose-lg max-w-none mb-12 sm:mb-16">
          <div className="border-2 border-[#1A1A1A] dark:border-[#F8F1E9] rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 bg-white/60 dark:bg-[#2A2A2A]/60 backdrop-blur-md shadow-xl">
            {parsedContent.map((section) => {
              switch (section.type) {
                case "heading":
                  return (
                    <h2
                      key={section.index}
                      className="text-2xl sm:text-3xl md:text-4xl font-black mt-8 sm:mt-12 mb-4 sm:mb-6 first:mt-0 text-[#5999a8]"
                    >
                      {section.content}
                    </h2>
                  );

                case "list":
                  return (
                    <ul
                      key={section.index}
                      className="list-disc list-inside space-y-3 sm:space-y-4 mb-6 sm:mb-8 ml-4 sm:ml-6"
                    >
                      {section.items.map((item, itemIndex) => (
                        <li
                          key={itemIndex}
                          className="leading-relaxed text-base sm:text-lg md:text-xl"
                          dangerouslySetInnerHTML={{ __html: formatText(item) }}
                        />
                      ))}
                    </ul>
                  );

                case "orderedList":
                  return (
                    <ol
                      key={section.index}
                      className="list-decimal list-inside space-y-3 sm:space-y-4 mb-6 sm:mb-8 ml-4 sm:ml-6"
                    >
                      {section.items.map((item, itemIndex) => (
                        <li
                          key={itemIndex}
                          className="leading-relaxed text-base sm:text-lg md:text-xl"
                          dangerouslySetInnerHTML={{ __html: formatText(item) }}
                        />
                      ))}
                    </ol>
                  );

                case "paragraph":
                  return (
                    <p
                      key={section.index}
                      className="text-base sm:text-lg md:text-xl leading-relaxed mb-6 sm:mb-8 opacity-90"
                      dangerouslySetInnerHTML={{
                        __html: formatText(section.content),
                      }}
                    />
                  );

                default:
                  return null;
              }
            })}
          </div>
        </article>

        {/* Enhanced Author Bio */}
        <div className="border-2 border-[#1A1A1A] dark:border-[#F8F1E9] rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 mb-8 sm:mb-12 bg-gradient-to-br from-[#5999a8]/10 via-white/50 to-[#5999a8]/5 dark:from-[#5999a8]/10 dark:via-[#2A2A2A]/50 dark:to-[#5999a8]/5 backdrop-blur-md shadow-xl">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-black mb-4 sm:mb-6">
            About the Author
          </h3>
          <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
            <div className="p-4 sm:p-5 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] rounded-2xl sm:rounded-3xl bg-[#5999a8]/15 dark:bg-[#5999a8]/25 w-fit shadow-lg">
              <User size={24} className="sm:w-8 sm:h-8" />
            </div>
            <div className="flex-1">
              <h4 className="font-black text-lg sm:text-xl md:text-2xl mb-3 sm:mb-4">
                {post.author}
              </h4>
              <p className="opacity-85 leading-relaxed text-base sm:text-lg md:text-xl">
                {post.authorBio}
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Article Footer */}
        <footer className="border-2 border-[#1A1A1A] dark:border-[#F8F1E9] rounded-2xl sm:rounded-3xl p-6 sm:p-8 mb-8 sm:mb-12 bg-white/40 dark:bg-[#2A2A2A]/40 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 text-sm sm:text-base opacity-75 font-medium">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
              <span>Published: {post.date}</span>
              {post.lastUpdated !== post.date && (
                <span>Updated: {post.lastUpdated}</span>
              )}
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
              <span>Reading Level: {post.seo.readingLevel}</span>
              <span>Category: {post.category}</span>
            </div>
          </div>
        </footer>

        {/* Recommendations Section */}
        <div className="mb-8 sm:mb-12">
          <div className="text-center mb-8 sm:mb-10">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black mb-3 sm:mb-4 tracking-tight">
              You Might Also Like
            </h3>
            <p className="text-base sm:text-lg opacity-80 max-w-2xl mx-auto">
              Discover more cozy insights and gentle guidance for your
              journaling journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {(() => {
              // Get related posts based on category and tags
              const relatedPosts = BlogPostData.filter((p) => {
                if (p.id === post.id) return false; // Exclude current post

                // Check if same category or has common tags
                const sameCategory = p.category === post.category;
                const commonTags = p.tags.some((tag) =>
                  post.tags.includes(tag)
                );

                return sameCategory || commonTags;
              }).slice(0, 3); // Show max 3 recommendations

              // If we don't have enough related posts, fill with other posts
              if (relatedPosts.length < 3) {
                const otherPosts = BlogPostData.filter(
                  (p) =>
                    p.id !== post.id &&
                    !relatedPosts.find((rp) => rp.id === p.id)
                ).slice(0, 3 - relatedPosts.length);
                relatedPosts.push(...otherPosts);
              }

              return relatedPosts.map((recommendedPost, index) => (
                <article
                  key={recommendedPost.id}
                  className="border-2 border-[#1A1A1A] dark:border-[#F8F1E9] rounded-2xl overflow-hidden bg-white/60 dark:bg-[#2A2A2A]/60 backdrop-blur-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group cursor-pointer"
                  onClick={() => handleRecommendationClick(recommendedPost)}
                  style={{
                    animationDelay: `${index * 150}ms`,
                  }}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={recommendedPost.image || "/placeholder.svg"}
                      alt={recommendedPost.title}
                      className="w-full h-40 sm:h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
                      <div className="p-2 bg-white/95 dark:bg-[#1A1A1A]/95 rounded-xl border border-[#1A1A1A] dark:border-[#F8F1E9] group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                        {getIcon(recommendedPost.icon)}
                      </div>
                    </div>
                    <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
                      <span className="px-2 sm:px-3 py-1 bg-[#5999a8]/90 text-white text-xs sm:text-sm font-bold rounded-full">
                        {recommendedPost.category}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                  <div className="p-4 sm:p-6">
                    <h4 className="text-lg sm:text-xl font-black mb-3 leading-tight group-hover:text-[#5999a8] transition-colors duration-300 line-clamp-2">
                      {recommendedPost.title}
                    </h4>
                    <p className="text-sm sm:text-base opacity-80 mb-4 leading-relaxed line-clamp-3">
                      {recommendedPost.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs sm:text-sm opacity-70">
                      <div className="flex items-center gap-2">
                        <User size={12} className="sm:w-3.5 sm:h-3.5" />
                        <span className="font-medium">
                          {recommendedPost.author}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={12} className="sm:w-3.5 sm:h-3.5" />
                        <span>{recommendedPost.readTime}</span>
                      </div>
                    </div>

                    {/* Show why this post is recommended */}
                    <div className="mt-3 pt-3 border-t border-[#1A1A1A]/10 dark:border-[#F8F1E9]/10">
                      <div className="flex flex-wrap gap-1">
                        {recommendedPost.category === post.category && (
                          <span className="px-2 py-1 bg-[#5999a8]/10 dark:bg-[#5999a8]/20 text-xs rounded-md">
                            Same category
                          </span>
                        )}
                        {recommendedPost.tags.some((tag) =>
                          post.tags.includes(tag)
                        ) && (
                          <span className="px-2 py-1 bg-[#5999a8]/10 dark:bg-[#5999a8]/20 text-xs rounded-md">
                            Similar topics
                          </span>
                        )}
                        {recommendedPost.featured && (
                          <span className="px-2 py-1 bg-yellow-500/20 text-xs rounded-md">
                            Featured
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              ));
            })()}
          </div>

          {/* View All Posts Button */}
          <div className="text-center mt-8 sm:mt-10">
            <button
              onClick={() => navigate("/starlitblogs")}
              className="inline-flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] hover:bg-[#5999a8]/10 dark:hover:bg-[#5999a8]/20 hover:scale-105 transition-all duration-300 rounded-xl font-bold text-base sm:text-lg group"
            >
              View All Posts
              <ArrowLeft
                size={18}
                className="sm:w-5 sm:h-5 rotate-180 group-hover:translate-x-1 transition-transform duration-300"
              />
            </button>
          </div>
        </div>

        {/* Enhanced CTA Section */}
        <div className="border-2 border-[#1A1A1A] dark:border-[#F8F1E9] rounded-2xl sm:rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-[#5999a8]/15 via-white/60 to-[#5999a8]/10 dark:from-[#5999a8]/15 dark:via-[#2A2A2A]/60 dark:to-[#5999a8]/10 text-center backdrop-blur-md shadow-2xl">
          <div className="mb-6 sm:mb-8">
            <div className="inline-block p-5 sm:p-6 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] rounded-2xl sm:rounded-3xl bg-white/80 dark:bg-[#1A1A1A]/80 shadow-xl">
              <Heart size={32} className="sm:w-12 sm:h-12 text-[#5999a8]" />
            </div>
          </div>
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 sm:mb-6 tracking-tight">
            Inspired to Start Journaling?
          </h3>
          <p className="text-lg sm:text-xl md:text-2xl opacity-90 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-4">
            Join our community of mindful writers and discover the
            transformative power of daily reflection. Your journey to clarity
            starts here.
          </p>
          <div className="flex flex-col gap-4 justify-center max-w-lg mx-auto">
            <button
              onClick={openSignupModal}
              className="inline-flex items-center justify-center gap-4 px-8 sm:px-10 py-4 sm:py-5 bg-[#1A1A1A] dark:bg-[#F8F1E9] text-[#F8F1E9] dark:text-[#1A1A1A] hover:scale-105 hover:shadow-xl transition-all duration-300 rounded-xl font-black text-lg sm:text-xl group w-full"
            >
              Start Your Cozy Journey
              <ArrowLeft
                size={22}
                className="sm:w-6 sm:h-6 rotate-180 group-hover:translate-x-2 transition-transform duration-300"
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

export default BlogPage;
