import gsap from "gsap";
import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import logoImg from "../../assets/Logo-transparent.png";

interface LoaderProps {
  onComplete?: () => void;
}

const Loader = ({ onComplete }: LoaderProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const startScreenRef = useRef<HTMLDivElement>(null);
  const [readyToStart, setReadyToStart] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  // Initial timeline: progress sequence -> transition to START screen
  useGSAP(
    () => {
      const tl = gsap.timeline({
        defaults: { force3D: true },
      });

      tl.set(".loader-ray", {
        scaleY: 0,
        transformOrigin: "top center",
      })
        .from(".loader-logo", {
          y: -25,
          autoAlpha: 0,
          duration: 0.5,
          ease: "power2.out",
        })
        .to(".loader-ray", {
          scaleY: 1,
          transformOrigin: "top center",
          duration: 0.9,
          ease: "power2.inOut",
        })
        .to(".upper-layer", {
          autoAlpha: 1,
          duration: 0.1,
          ease: "power1.out",
        })
        .to(
          ".left-curtain",
          {
            scaleX: 0,
            duration: 0.8,
            ease: "power3.inOut",
          },
          "animate"
        )
        .to(
          ".right-curtain",
          {
            scaleX: 0,
            duration: 0.8,
            ease: "power3.inOut",
          },
          "animate"
        )
        .to(".loader-track", {
          scaleX: 1,
          transformOrigin: "center center",
          duration: 0.6,
          ease: "power2.out",
        })
        .to(".loader-bar", {
          scaleX: 1,
          transformOrigin: "center center",
          delay: 0.2,
          duration: 0.8,
          ease: "power2.inOut",
        })
        // Dot drops down onto line (Matches Image 1)
        .to(
          ".loader-logo",
          {
            y: 19,
            duration: 0.4,
            ease: "power2.in",
          },
          ">"
        )
        // ── TRANSITION TO START SCREEN (Matches Image 2) ──
        .to(
          ".loader-track",
          {
            scaleX: 0,
            opacity: 0,
            duration: 0.4,
            ease: "power2.inOut",
          },
          ">"
        )
        .to(
          ".loader-logo",
          {
            opacity: 0,
            scale: 0.8,
            duration: 0.35,
            ease: "power2.inOut",
          },
          "<"
        )
        // Reveal Start Screen with emblem and START pill button
        .set(startScreenRef.current, {
          opacity: 1,
          pointerEvents: "auto",
        })
        .fromTo(
          ".start-emblem",
          { scale: 0.75, opacity: 0, y: 15 },
          {
            scale: 1,
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.1"
        )
        .fromTo(
          ".start-btn",
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power3.out",
            onComplete: () => {
              setReadyToStart(true);
            },
          },
          "-=0.4"
        );
    },
    { scope: containerRef }
  );

  // Handle clicking START to reveal the website
  const handleStartClick = () => {
    if (isExiting) return;
    setIsExiting(true);

    const exitTl = gsap.timeline();

    exitTl
      .to(".start-btn", {
        opacity: 0,
        y: 10,
        scale: 0.95,
        duration: 0.25,
        ease: "power2.in",
      })
      .to(
        ".start-emblem",
        {
          scale: 25,
          opacity: 0,
          duration: 0.8,
          ease: "power3.inOut",
        },
        "-=0.1"
      )
      .to(
        containerRef.current,
        {
          autoAlpha: 0,
          duration: 0.45,
          ease: "power2.out",
          onStart: () => {
            onComplete?.();
          },
        },
        "-=0.35"
      );
  };

  // Keyboard accessibility: press Enter or Space to Start
  useEffect(() => {
    if (!readyToStart) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleStartClick();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [readyToStart, isExiting]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[#0e0e0e] select-none will-change-[opacity,visibility] h-[100dvh] w-screen"
    >
      {/* ── 1. INITIAL LOADER SEQUENCE (Logo, Ray, Curtains, Track) ── */}
      {/* Center logo (Vedant's VB Logo) */}
      <div className="loader-logo z-20 will-change-transform flex items-center justify-center pointer-events-none">
        <img
          src={logoImg}
          alt="VB Logo"
          className="w-12 sm:w-16 h-auto object-contain filter drop-shadow-md select-none"
        />
      </div>

      {/* Split curtain layer */}
      <div className="upper-layer opacity-0 pointer-events-none fixed inset-0 flex items-center justify-between bg-black z-10 h-[100dvh]">
        <div className="left-curtain h-full w-[50.5%] bg-[#0e0e0e] origin-left will-change-transform" />
        <div className="right-curtain h-full w-[50.5%] bg-[#0e0e0e] origin-right will-change-transform" />
      </div>

      {/* Vertical ray (draws down from top to bottom) */}
      <div className="loader-ray w-[1px] h-full absolute top-0 left-1/2 -translate-x-1/2 bg-black origin-top scale-y-0 will-change-transform z-10 pointer-events-none" />

      {/* Progress bar track (Matches Image 1) */}
      <div className="loader-track absolute left-1/2 top-1/2 translate-y-8 sm:translate-y-10 -translate-x-1/2 w-[65%] sm:w-[45%] md:w-[30%] max-w-xs h-[1px] rounded-full bg-gray-800 origin-center scale-x-0 overflow-hidden z-10 will-change-transform flex items-center justify-center">
        <div className="loader-bar w-full h-full bg-white origin-center scale-x-0 will-change-transform" />
      </div>

      {/* ── 2. START SCREEN LAYER (Matches Image 2) ── */}
      <div
        ref={startScreenRef}
        className="start-screen absolute inset-0 flex flex-col items-center justify-center z-30 pointer-events-none opacity-0 select-none"
      >
        {/* Emblem with Vedant's Logo */}
        <div className="start-emblem w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center p-3.5 sm:p-4 overflow-hidden will-change-transform">
          <img
            src={logoImg}
            alt="VB Logo"
            className="w-full h-full object-contain filter drop-shadow-md select-none pointer-events-none"
          />
        </div>

        {/* START Pill Button (Matches Image 2) */}
        <div className="mt-2  pointer-events-auto">
          <button
            type="button"
            onClick={handleStartClick}
            disabled={!readyToStart || isExiting}
            aria-label="Start and enter website"
            className="start-btn group px-12 sm:px-16 py-3 sm:py-3.5 rounded-full border border-[#b7ab98]/60 hover:border-[#b7ab98] bg-transparent hover:bg-[#b7ab98] text-[#b7ab98] hover:text-[#0e0e0e] text-xs sm:text-sm font-bold tracking-[0.25em] uppercase transition-all duration-300 ease-out cursor-pointer shadow-lg hover:shadow-[0_0_25px_rgba(183,171,152,0.3)] hover:scale-105 active:scale-95 will-change-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f25536]"
          >
            START
          </button>
        </div>
      </div>
    </div>
  );
};

export default Loader;
