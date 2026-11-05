import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroText from "./HeroText";
import experiencePortrait from "../../../assets/experience_portrait.jpg";

gsap.registerPlugin(ScrollTrigger);

interface HeroProps {
  baseText?: React.ReactNode;
  revealedText?: React.ReactNode;
  onHoverChange?: (isHovered: boolean) => void;
  isLoaded?: boolean;
}

const Hero: React.FC<HeroProps> = ({
  baseText,
  revealedText,
  onHoverChange,
  isLoaded = false,
}) => {
  const heroRef = useRef<HTMLElement>(null);
  const portraitWrapperRef = useRef<HTMLDivElement>(null);
  const portraitImgRef = useRef<HTMLImageElement>(null);

  useGSAP(
    () => {
      const hero = heroRef.current;
      const wrapper = portraitWrapperRef.current;
      const img = portraitImgRef.current;
      if (!hero || !wrapper || !img) return;

      // ── 1. SCROLL-ONLY PARALLAX (NO MOUSE MOVE) ──
      gsap.to(wrapper, {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      // ── 2. CINEMATIC ENTRANCE ON LOAD ──
      if (!isLoaded) {
        gsap.set(img, { opacity: 0, scale: 1.06 });
        return;
      }

      gsap.fromTo(
        img,
        {
          opacity: 0,
          scale: 1.06,
        },
        {
          opacity: 1,
          scale: 1,
          duration: 1.4,
          ease: "power3.out",
        }
      );
    },
    { dependencies: [isLoaded], scope: heroRef }
  );

  return (
    <section
      ref={heroRef}
      id="home"
      className="w-full min-h-screen flex flex-col items-center justify-between relative overflow-hidden select-none"
    >
      {/* ── FULL-SCREEN PARALLAX PORTRAIT BACKGROUND ── */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden z-0"
        aria-hidden="true"
      >
        <div
          ref={portraitWrapperRef}
          className="absolute -top-[12%] left-0 w-full h-[124%] pointer-events-none select-none will-change-transform"
        >
          <img
            ref={portraitImgRef}
            src={experiencePortrait}
            alt="Vedant Khambadkar"
            className="w-full h-full object-cover object-[72%_center] md:object-[68%_center] opacity-60 sm:opacity-75 lg:opacity-90 contrast-[1.05] brightness-95 will-change-transform"
          />

          {/* Left gradient for contrast with hero text */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0c0c0c] via-[#0c0c0c]/50 to-transparent pointer-events-none" />
          {/* Subtle bottom gradient to blend smoothly into the About section */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-transparent to-[#0c0c0c]/30 pointer-events-none" />
        </div>
      </div>

      <div className="header w-full h-12 sm:h-16 relative z-10"></div>

      <div className="main w-full flex-1 flex items-center justify-center relative z-10 px-4 md:px-0">
        {/* Dual-expression hero text: lens expands from cursor to reveal alternative message */}
        <HeroText
          baseText={baseText}
          revealedText={revealedText}
          onHoverChange={onHoverChange}
          isLoaded={isLoaded}
        />
      </div>
    </section>
  );
};

export default Hero;
