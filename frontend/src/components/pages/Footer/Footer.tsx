import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export interface FooterProps {
  onHoverChange?: (isHovered: boolean) => void;
  bigText?: string;
  headlineLine1?: string;
  headlineLine2?: string;
  bookCallUrl?: string;
  email?: string;
  credits?: {
    founded?: string;
    siteBy?: string;
    visuals?: string;
    lang?: string;
  };
}

// Generous buffer so the circle lens is never clipped by text bounds
const BUFFER = 350;

const Footer: React.FC<FooterProps> = ({
  onHoverChange,
  bigText = "VEDANTBUILDS_",
  headlineLine1 = "Let's start",
  headlineLine2 = "from  nothing",
  bookCallUrl = "https://cal.com",
  email = "contactvedantbuilds@gmail.com",
  credits = {
    founded: "©2026 — Vedant Khambadkar",
    siteBy: "vedantbuilds",
    visuals: "Design & Engineering",
    lang: "EN",
  },
}) => {
  const footerRef = useRef<HTMLElement>(null);
  const bigTextContainerRef = useRef<HTMLDivElement>(null);
  const lensMaskRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      if (!footerRef.current) return;

      // ── 1. BIG TEXT ("VEDANTBUILDS_") LETTER-BY-LETTER ENTRANCE ──
      const baseChars = gsap.utils.toArray<HTMLElement>(".footer-big-char-base");
      const maskChars = gsap.utils.toArray<HTMLElement>(".footer-big-char-mask");
      if (baseChars.length > 0) {
        const bigTextTl = gsap.timeline({
          scrollTrigger: {
            trigger: bigTextContainerRef.current || footerRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });

        bigTextTl.fromTo(
          baseChars,
          {
            yPercent: 120,
            rotateZ: (i) => (i % 2 === 0 ? -5 : 5),
            opacity: 0,
          },
          {
            yPercent: 0,
            rotateZ: 0,
            opacity: 1,
            duration: 1.1,
            stagger: 0.045,
            ease: "power4.out",
          },
          0
        );

        bigTextTl.fromTo(
          maskChars,
          {
            yPercent: 120,
            rotateZ: (i) => (i % 2 === 0 ? -5 : 5),
            opacity: 0,
          },
          {
            yPercent: 0,
            rotateZ: 0,
            opacity: 1,
            duration: 1.1,
            stagger: 0.045,
            ease: "power4.out",
          },
          0
        );
      }

      // ── 1B. INTERACTIVE CIRCLE LENS ON BIG TEXT ("VEDANTBUILDS_") ──
      const container = bigTextContainerRef.current;
      const mask = lensMaskRef.current;
      if (container && mask) {
        const pos = { x: 0, y: 0, r: 0 };

        const updateClip = () => {
          mask.style.clipPath = `circle(${pos.r}px at ${pos.x}px ${pos.y}px)`;
        };

        updateClip();

        const xTo = gsap.quickTo(pos, "x", {
          duration: 0.18,
          ease: "power2.out",
          onUpdate: updateClip,
        });

        const yTo = gsap.quickTo(pos, "y", {
          duration: 0.18,
          ease: "power2.out",
          onUpdate: updateClip,
        });

        const getTargetRadius = () => {
          if (typeof window === "undefined") return 185;
          if (window.innerWidth >= 1536) return 215;
          if (window.innerWidth >= 1280) return 185;
          return 160;
        };

        const expandCircle = (x: number, y: number) => {
          pos.x = x;
          pos.y = y;
          updateClip();

          onHoverChange?.(true);

          gsap.to(pos, {
            r: getTargetRadius(),
            duration: 0.45,
            ease: "power3.out",
            overwrite: "auto",
            onUpdate: updateClip,
          });
        };

        const shrinkCircle = () => {
          onHoverChange?.(false);

          gsap.to(pos, {
            r: 0,
            duration: 0.4,
            ease: "power3.out",
            overwrite: "auto",
            onUpdate: updateClip,
          });
        };

        const onMouseMove = (e: MouseEvent) => {
          const rect = container.getBoundingClientRect();
          const x = e.clientX - rect.left + BUFFER;
          const y = e.clientY - rect.top + BUFFER;
          xTo(x);
          yTo(y);

          if (pos.r < 10) {
            expandCircle(x, y);
          }
        };

        const onMouseEnter = (e: MouseEvent) => {
          const rect = container.getBoundingClientRect();
          const x = e.clientX - rect.left + BUFFER;
          const y = e.clientY - rect.top + BUFFER;
          expandCircle(x, y);
        };

        const onMouseLeave = () => {
          shrinkCircle();
        };

        const onWindowMouseMove = (e: MouseEvent) => {
          const rect = container.getBoundingClientRect();
          const isInside =
            e.clientX >= rect.left &&
            e.clientX <= rect.right &&
            e.clientY >= rect.top &&
            e.clientY <= rect.bottom;

          if (isInside) {
            const x = e.clientX - rect.left + BUFFER;
            const y = e.clientY - rect.top + BUFFER;
            xTo(x);
            yTo(y);
            if (pos.r < 10) {
              expandCircle(x, y);
            }
          } else if (pos.r > 0) {
            shrinkCircle();
          }
        };

        container.addEventListener("mousemove", onMouseMove);
        container.addEventListener("mouseenter", onMouseEnter);
        container.addEventListener("mouseleave", onMouseLeave);
        window.addEventListener("mousemove", onWindowMouseMove);

        return () => {
          container.removeEventListener("mousemove", onMouseMove);
          container.removeEventListener("mouseenter", onMouseEnter);
          container.removeEventListener("mouseleave", onMouseLeave);
          window.removeEventListener("mousemove", onWindowMouseMove);
          onHoverChange?.(false);
        };
      }

      // ── 2. HEADLINE LINE-BY-LINE STAGGERED ENTRANCE ──
      const headlineLines = gsap.utils.toArray<HTMLElement>(
        ".footer-headline-line"
      );
      if (headlineLines.length > 0) {
        gsap.fromTo(
          headlineLines,
          {
            yPercent: 110,
            opacity: 0,
            rotateX: 25,
          },
          {
            yPercent: 0,
            opacity: 1,
            rotateX: 0,
            duration: 0.9,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: headlineRef.current || footerRef.current,
              start: "top 82%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // ── 3. BUTTONS, SOCIALS & METADATA FADE & DRIFT UP ──
      gsap.fromTo(
        ".footer-fade-elem",
        {
          y: 30,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.08,
          ease: "power2.out",
          delay: 0.15,
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 78%",
            toggleActions: "play none none none",
          },
        }
      );
    },
    { scope: footerRef }
  );

  return (
    <footer
      ref={footerRef}
      id="footer"
      className="relative w-full pt-16 sm:pt-20 lg:pt-28 pb-8 sm:pb-10 px-6 sm:px-10 md:px-16 lg:px-20 overflow-hidden select-none"
    >
      <div className="w-full mx-auto flex flex-col justify-between lg:min-h-[88vh]">
        {/* ══════════════════════════════════════════════════════════════
            MIDDLE ROW: HEADLINE + ACTION PILL BUTTONS
           ══════════════════════════════════════════════════════════════ */}
        <div className="w-full flex flex-col items-start lg:my-auto pt-4 pb-2 lg:py-8">
          {/* Left Column: Heading + Call to Actions */}
          <div className="w-full max-w-3xl flex flex-col items-start">
            {/* Animated Big Heading with crisp typography and natural kerning */}
            <h2
              ref={headlineRef}
              className="text-4xl sm:text-6xl md:text-7xl lg:text-[5.4rem] font-sans font-normal leading-[1.08] tracking-[-0.035em] max-w-2xl mb-8 sm:mb-10"
            >
              <div className="overflow-hidden">
                <span className="footer-headline-line block will-change-transform">
                  {headlineLine1}
                </span>
              </div>
              <div className="overflow-hidden">
                <span className="footer-headline-line block will-change-transform">
                  {headlineLine2}
                </span>
              </div>
            </h2>

            {/* Pill Action Buttons (Full width on mobile, inline on tablet/desktop) */}
            <div className="footer-fade-elem flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4 w-full sm:w-auto">
              {/* Button 1: Book a Call */}
              <a
                href={bookCallUrl}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => onHoverChange?.(true)}
                onMouseLeave={() => onHoverChange?.(false)}
                className="group relative inline-flex items-center justify-center gap-2.5 px-7 py-3.5 sm:py-4 rounded-full border border-zinc-700/80 bg-zinc-950/60 hover:bg-white text-zinc-300 hover:text-black hover:border-white text-xs sm:text-[13px] font-semibold tracking-[0.14em] uppercase transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-sm cursor-pointer text-center"
              >
                <span>BOOK A CALL</span>
                <span className="inline-block transform transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5">
                  →
                </span>
              </a>

              {/* Button 2: Drop an Email */}
              <a
                href={`mailto:${email}`}
                onMouseEnter={() => onHoverChange?.(true)}
                onMouseLeave={() => onHoverChange?.(false)}
                className="group relative inline-flex items-center justify-center gap-2.5 px-7 py-3.5 sm:py-4 rounded-full border border-zinc-700/80 bg-zinc-950/60 hover:bg-white text-zinc-300 hover:text-black hover:border-white text-xs sm:text-[13px] font-semibold tracking-[0.14em] uppercase transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-sm cursor-pointer text-center"
              >
                <span>DROP US AN EMAIL</span>
                <span className="inline-block text-zinc-400 group-hover:text-black transition-colors duration-300">
                  @
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            GIANT BOTTOM BIG TEXT ("VEDANTBUILDS_") WITH INTERACTIVE CIRCLE LENS
            - Base Layer: Classic Cream / Gray text (#b7ab98)
            - Mask Layer: Expanding Coral Circle Lens revealing pure White text (#ffffff)
            (Hidden on mobile view, visible only on lg+ desktop view)
           ══════════════════════════════════════════════════════════════ */}
        <div
          ref={bigTextContainerRef}
          className="relative w-full mt-12 sm:mt-16 md:mt-24 mb-6 sm:mb-10 select-none hidden lg:flex cursor-default"
          aria-label={bigText}
        >
          {/* 1. Base Layer: Solid Grayish / Cream text (#b7ab98) */}
          <div className="w-full flex items-baseline justify-between text-[#b7ab98] pointer-events-none select-none">
            {bigText.split("").map((char, index) => (
              <span
                key={index}
                className="overflow-hidden inline-flex shrink-0 leading-none"
              >
                <span className="footer-big-char-base inline-block font-sans font-black tracking-[-0.04em] lg:text-[11.8vw] leading-none will-change-transform uppercase text-[#b7ab98]">
                  {char}
                </span>
              </span>
            ))}
          </div>

          {/* 2. Interactive Coral Circle Lens Layer (Reveals White text on Red) */}
          <div
            ref={lensMaskRef}
            className="absolute bg-[#f25536] text-white pointer-events-none select-none z-20 will-change-[clip-path]"
            style={{
              top: -BUFFER,
              left: -BUFFER,
              right: -BUFFER,
              bottom: -BUFFER,
              clipPath: "circle(0px at 0px 0px)",
            }}
          >
            {/* Padded Container starting at (0,0) so letters align 1:1 with base text */}
            <div
              className="w-full h-full pointer-events-none select-none"
              style={{ padding: BUFFER }}
            >
              <div className="w-full flex items-baseline justify-between text-white select-none">
                {bigText.split("").map((char, index) => (
                  <span
                    key={index}
                    className="overflow-hidden inline-flex shrink-0 leading-none"
                  >
                    <span className="footer-big-char-mask inline-block font-sans font-black tracking-[-0.04em] lg:text-[11.8vw] leading-none will-change-transform uppercase text-white">
                      {char}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            BOTTOM METADATA BAR (Matching Screenshot 4-Part Layout)
           ══════════════════════════════════════════════════════════════ */}
        <div className="footer-fade-elem w-full pt-8 sm:pt-6 mt-14 sm:mt-16 lg:mt-0 border-t border-zinc-900/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] sm:text-xs text-zinc-500 tracking-wide font-normal">
          {/* Left: Copyright & Founded */}
          <div className="text-center md:text-left hover:text-zinc-400 transition-colors duration-200">
            {credits.founded}
          </div>

          {/* Center: Site Creators */}
          <div className="text-center hover:text-zinc-400 transition-colors duration-200">
            {credits.siteBy}
          </div>

          {/* Right: Visuals & Language */}
          <div className="flex items-center gap-6 justify-center md:justify-end">
            <span className="hover:text-zinc-400 transition-colors duration-200">
              {credits.visuals}
            </span>

            {/* EN Badge */}
            <span className="px-1.5 py-0.5 rounded border border-zinc-800 text-[10px] font-semibold text-zinc-400 uppercase tracking-widest hover:border-zinc-600 hover: transition-colors duration-200 cursor-pointer">
              {credits.lang}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
