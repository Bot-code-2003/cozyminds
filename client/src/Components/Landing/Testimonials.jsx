import { Star, Quote, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Testimonials = ({ darkMode }) => {
  const testimonials = [
    {
      quote:
        "It’s lovely. The messages feel warm and personal. I use it every evening with my tea.",
      author: "Mom",
      role: "Lifelong Encourager",
      rating: 5,
      avatar: "M",
      highlight: true,
    },
    {
      quote:
        "Proud of what you've built. It’s clean, simple, and feels like a quiet corner on the internet.",
      author: "Dad",
      role: "Supportive Dad",
      rating: 5,
      avatar: "D",
      highlight: false,
    },
    {
      quote:
        "I’ve actually started journaling because of this — and I never journal. The daily rewards are fun too.",
      author: "Brother",
      role: "Reluctant Tester Turned Fan",
      rating: 5,
      avatar: "B",
      highlight: false,
    },
  ];

  return (
    <section className="z-10 w-full max-w-7xl py-24 px-1 sm:px-6 relative">
      {/* Background decorative elements */}
      <div className="absolute -top-12 -right-12 w-24 h-24 border-2 border-[#1A1A1A]/20 dark:border-[#F8F1E9]/20 z-0"></div>
      <div className="absolute bottom-12 left-0 w-12 h-12 border-2 border-[#1A1A1A]/20 dark:border-[#F8F1E9]/20 z-0"></div>

      <div className="text-center mb-16 relative">
        <div className="inline-block rounded-2xl mb-4 px-3 py-1 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] text-xs font-medium tracking-wider">
          TESTIMONIALS
        </div>
        <h2 className="text-3xl md:text-5xl font-bold mb-4">
          What Our Users Say
        </h2>
        <p className="text-lg opacity-70 max-w-xl mx-auto">
          Join thousands who have transformed their mental clarity with our
          minimalist approach.
        </p>

        {/* Large quote icon */}
        <Quote
          size={120}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#5999a8]/5 dark:text-[#5999a8]/10 -z-10"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className={`relative border-2 ${
              testimonial.highlight
                ? "border-[#5999a8]"
                : "border-[#1A1A1A] dark:border-[#F8F1E9]"
            } ${
              darkMode ? "bg-[#2A2A2A]" : "bg-white"
            } transition-all rounded-2xl duration-300 hover:-translate-y-1 group`}
          >
            {testimonial.highlight && (
              <div className="absolute -top-3 rounded-2xl -right-3 px-3 py-1 bg-[#5999a8] text-[white] text-xs font-bold">
                FEATURED
              </div>
            )}

            <div className="p-8">
              {/* Quote icon */}
              <Quote
                size={24}
                className={`mb-4 ${
                  testimonial.highlight
                    ? "text-[#5999a8]"
                    : "text-[#1A1A1A]/20 dark:text-[#F8F1E9]/20"
                }`}
              />

              {/* Rating */}
              <div className="flex mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className="text-[#5999a8] fill-current"
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-lg mb-8 min-h-[100px]">
                "{testimonial.quote}"
              </p>

              {/* Author info */}
              <div className="flex items-center mt-auto">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    testimonial.highlight
                      ? "bg-[#5999a8] text-[white]"
                      : darkMode
                      ? "bg-[#F8F1E9] text-[#1A1A1A]"
                      : "bg-[#1A1A1A] text-white"
                  }`}
                >
                  {testimonial.avatar}
                </div>
                <div className="ml-4">
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm opacity-70">{testimonial.role}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Call to action */}
      {/* <div className="text-center mt-16">
        <Link
          to="/testimonials"
          className="inline-flex items-center gap-2 text-[#5999a8] hover:underline group"
        >
          Read more testimonials
          <ArrowRight
            size={16}
            className="group-hover:translate-x-1 transition-transform"
          />
        </Link>
      </div> */}
    </section>
  );
};

export default Testimonials;
