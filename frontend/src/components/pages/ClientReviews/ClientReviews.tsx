import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Clent_Bharatdigiguru from "../../../assets/Client/client_bharatdigiguru.webp"
gsap.registerPlugin(ScrollTrigger);

interface ClientReviewsProps {
  onHoverChange?: (isHovered: boolean) => void;
}

interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  image: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: "Bharat DigiGuru",
    name: "Shubham Singh",
    role: "Founder of Bharat DigiGuru",
    quote:
      "“From planning to final delivery, everything was handled with clarity and precision. Their attention to detail and design quality really stood out.”",
    image: Clent_Bharatdigiguru,
  }
];

const ClientReviews = ({ onHoverChange }: ClientReviewsProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const parallaxGroupRef = useRef<HTMLDivElement>(null);
  const photoParallaxRef = useRef<HTMLImageElement>(null);
  const badgeParallaxRef = useRef<HTMLDivElement>(null);
  const quoteCardRef = useRef<HTMLDivElement>(null);
  const quoteTextRef = useRef<HTMLParagraphElement>(null);
  const authorInfoRef = useRef<HTMLDivElement>(null);

  const activeClient = TESTIMONIALS[activeIndex];
  // The other 3 clients displayed in the thumbnail row matching Image 1
  const otherClients = TESTIMONIALS.map((item, idx) => ({ ...item, originalIndex: idx })).filter(
    (_, idx) => idx !== activeIndex
  );

  // ── SCROLL PARALLAX EFFECT ──
  useGSAP(
    () => {
      const section = containerRef.current;
      if (!section) return;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (prefersReducedMotion) return;

      // Photo parallax: moves smoothly inside its cropped overflow-hidden container
      if (photoParallaxRef.current) {
        gsap.fromTo(
          photoParallaxRef.current,
          { yPercent: -5, scale: 1.06 },
          {
            yPercent: 5,
            scale: 1.01,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.2,
            },
          }
        );
      }

      // Floating white tag badge parallax: glides at a different rate for multi-plane depth
      if (badgeParallaxRef.current) {
        gsap.fromTo(
          badgeParallaxRef.current,
          { y: 10 },
          {
            y: -10,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.9,
            },
          }
        );
      }

      // Quote text subtle parallax float
      if (quoteTextRef.current) {
        gsap.fromTo(
          quoteTextRef.current,
          { yPercent: 4 },
          {
            yPercent: -4,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.0,
            },
          }
        );
      }
    },
    { scope: containerRef }
  );

  // ── MOUSE-MOVE PARALLAX & TILT (Desktop only) ──
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.innerWidth < 1024) return;
    const group = parallaxGroupRef.current;
    if (!group) return;

    const rect = group.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    // Photo subtle drift
    gsap.to(photoParallaxRef.current, {
      x: x * 14,
      duration: 0.4,
      ease: "power2.out",
      overwrite: "auto",
    });

    // White badge floating parallax
    gsap.to(badgeParallaxRef.current, {
      x: x * 22,
      y: y * 16,
      duration: 0.35,
      ease: "power2.out",
      overwrite: "auto",
    });

    // Quote card subtle 3D tilt
    gsap.to(quoteCardRef.current, {
      rotateY: x * 2.5,
      rotateX: -y * 2.5,
      duration: 0.45,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  const handleMouseLeave = () => {
    gsap.to([photoParallaxRef.current, badgeParallaxRef.current], {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: "power2.out",
      overwrite: "auto",
    });
    gsap.to(quoteCardRef.current, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.5,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  // ── SMOOTH TRANSITION ON REVIEW SWITCH ──
  const changeReview = (newIndex: number) => {
    if (newIndex === activeIndex) return;

    const targets = [
      quoteTextRef.current,
      authorInfoRef.current,
      badgeParallaxRef.current,
      photoParallaxRef.current,
    ];

    gsap.to(targets, {
      opacity: 0,
      y: 8,
      duration: 0.2,
      ease: "power2.in",
      onComplete: () => {
        setActiveIndex(newIndex);
        gsap.fromTo(
          targets,
          { opacity: 0, y: -8 },
          {
            opacity: 1,
            y: 0,
            duration: 0.35,
            stagger: 0.04,
            ease: "power2.out",
          }
        );
      },
    });
  };

  const handlePrev = () => {
    const nextIdx =
      (activeIndex - 1 + TESTIMONIALS.length) % TESTIMONIALS.length;
    changeReview(nextIdx);
  };

  const handleNext = () => {
    const nextIdx = (activeIndex + 1) % TESTIMONIALS.length;
    changeReview(nextIdx);
  };

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex]);

  useGSAP(
    () => {
      gsap.from(".animate-text", {
        y: "100%",
        duration: 1,
        ease: "power1.inOut",
        stagger: 0.1,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      id="reviews"
      className="relative w-full min-h-fit lg:min-h-screen flex flex-col justify-center px-6 sm:px-12 md:px-20 py-16 sm:py-20 lg:py-24 select-none"
    >
      <div className="w-full max-w-6xl mx-auto flex flex-col justify-center">
        {/* ══════════════════════════════════════════════════════════════
            1. TOP HEADER ROW (Matching Image 1: Clean, no lines, no tags)
           ══════════════════════════════════════════════════════════════ */}
        <div className="w-full flex flex-col md:flex-row md:items-start justify-between gap-4 sm:gap-6 mb-10 sm:mb-12 lg:mb-14">
          <h2 className="animate-text block text-xs sm:text-sm font-semibold tracking-[0.35em] uppercase text-zinc-400 will-change-transform">
            what our client says
          </h2>

          <div className="max-w-sm overflow-hidden">
            <p className="animate-text text-xs sm:text-sm leading-relaxed will-change-transform">
              From concept to completion, we offer end-to-end solutions tailored
              to your vision, budget, and lifestyle.
            </p>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            2. MAIN CARDS ROW (Matching Image 1: Left Portrait + Right Quote)
           ══════════════════════════════════════════════════════════════ */}
        <div className="w-full">
          <div
            ref={parallaxGroupRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={() => onHoverChange?.(true)}
            className="animate-text w-full grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch relative will-change-transform"
            style={{ perspective: 1000 }}
          >
            {/* ── LEFT: CLIENT PHOTO CARD ── */}
            <div className="lg:col-span-5 relative flex flex-col">
              <div className="w-full h-80 sm:h-96 lg:h-full min-h-[300px] lg:min-h-[380px] rounded-2xl overflow-hidden relative bg-[#181818] shadow-lg">
                <img
                  ref={photoParallaxRef}
                  src={activeClient.image}
                  alt={activeClient.name}
                  className="w-full h-full object-cover object-center grayscale contrast-110 brightness-95 will-change-transform transition-transform duration-700 ease-out"
                  loading="lazy"
                />
              </div>
            </div>

            {/* ── RIGHT: TESTIMONIAL QUOTE CARD ── */}
            <div
              ref={quoteCardRef}
              className="lg:col-span-7 rounded-2xl p-6 sm:p-10 lg:p-12 flex flex-col justify-between relative min-h-[300px] lg:min-h-[380px] will-change-transform"
            >
              {/* Quote Text with Parallax Float */}
              <div className="pt-2 sm:pt-4">
                <p
                  ref={quoteTextRef}
                  className="text-lg sm:text-2xl md:text-[1.65rem] lg:text-[1.8rem] font-normal leading-[1.38] tracking-tight will-change-transform"
                >
                  {activeClient.quote}
                </p>
              </div>

              {/* Bottom Row: Author Name/Role on Left, Arrows on Right */}
              <div className="flex items-end justify-between pt-8 sm:pt-10 gap-4">
                <div ref={authorInfoRef} className="flex flex-col">
                  <h4 className="text-base sm:text-lg font-bold tracking-tight">
                    {activeClient.name}
                  </h4>
                  <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
                    {activeClient.role}
                  </p>
                </div>

                {/* Arrow Navigation Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrev}
                    disabled={TESTIMONIALS.length <= 1}
                    aria-label="Previous client review"
                    className="w-10 h-10 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors active:scale-95 cursor-pointer"
                  >
                    <svg
                      className="w-4 h-4 fill-none stroke-current stroke-2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                      />
                    </svg>
                  </button>

                  <button
                    onClick={handleNext}
                    disabled={TESTIMONIALS.length <= 1}
                    aria-label="Next client review"
                    className="w-10 h-10 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors active:scale-95 cursor-pointer"
                  >
                    <svg
                      className="w-4 h-4 fill-none stroke-current stroke-2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            3. THUMBNAILS ROW (Only rendered if multiple clients exist)
           ══════════════════════════════════════════════════════════════ */}
        {otherClients.length > 0 && (
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 mt-8 sm:mt-10">
            <div className="hidden lg:block lg:col-span-5" />
            <div className="lg:col-span-7 flex items-center gap-4">
              {otherClients.map((client) => (
                <button
                  key={client.id}
                  onClick={() => changeReview(client.originalIndex)}
                  aria-label={`View review by ${client.name}`}
                  className="w-16 h-16 sm:w-18 sm:h-18 rounded-xl overflow-hidden bg-zinc-800 border border-zinc-700/50 opacity-45 hover:opacity-100 hover:scale-105 transition-all duration-300 cursor-pointer shadow-lg"
                >
                  <img
                    src={client.image}
                    alt={client.name}
                    className="w-full h-full object-cover object-center grayscale hover:grayscale-0 transition-all duration-300"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ClientReviews;
