import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export interface TextPart {
  text: string;
  className?: string;
}

export interface EditorialSectionProps {
  id: string;
  title: string | React.ReactNode;
  layer1Parts: TextPart[];
  layer2Parts: TextPart[];
  baseText?: React.ReactNode;
  revealedText?: React.ReactNode;
  onHoverChange?: (isHovered: boolean) => void;
  referenceSizerText?: string;
}

const BUFFER = 350;

const renderLetterByLetter = (parts: TextPart[], charClass: string) => {
  return parts.map((part, pIdx) => {
    const words = part.text.trim().split(/\s+/);
    return (
      <span key={pIdx} className={part.className}>
        {words.map((word, wIdx) => (
          <span key={wIdx}>
            <span className="inline-block">
              {word.split("").map((char, cIdx) => (
                <span
                  key={cIdx}
                  className={`${charClass} inline-block will-change-[opacity]`}
                  style={{ opacity: 0.5 }}
                >
                  {char}
                </span>
              ))}
            </span>
            {" "}
          </span>
        ))}
      </span>
    );
  });
};

const EditorialSection: React.FC<EditorialSectionProps> = ({
  id,
  title,
  layer1Parts,
  layer2Parts,
  baseText,
  revealedText,
  onHoverChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const container = textContainerRef.current;
      const mask = maskRef.current;
      if (!container || !mask) return;

      const pos = {
        x: 0,
        y: 0,
        r: 0,
      };

      const updateClip = () => {
        mask.style.clipPath = `circle(${pos.r}px at ${pos.x}px ${pos.y}px)`;
      };

      updateClip();

      const xTo = gsap.quickTo(pos, "x", {
        duration: 0.22,
        ease: "power2.out",
        onUpdate: updateClip,
      });

      const yTo = gsap.quickTo(pos, "y", {
        duration: 0.22,
        ease: "power2.out",
        onUpdate: updateClip,
      });

      const expandCircle = (x: number, y: number) => {
        pos.x = x;
        pos.y = y;
        updateClip();

        onHoverChange?.(true);

        gsap.to(pos, {
          r: window.innerWidth < 640 ? 120 : 165,
          duration: 0.5,
          ease: "power3.out",
          overwrite: "auto",
          onUpdate: updateClip,
        });
      };

      const shrinkCircle = () => {
        onHoverChange?.(false);

        gsap.to(pos, {
          r: 0,
          duration: 0.45,
          ease: "power3.out",
          overwrite: "auto",
          onUpdate: updateClip,
        });
      };

      const onMouseMove = (e: MouseEvent) => {
        const curRect = container.getBoundingClientRect();
        const x = e.clientX - curRect.left + BUFFER;
        const y = e.clientY - curRect.top + BUFFER;
        xTo(x);
        yTo(y);

        if (pos.r < 10) {
          expandCircle(x, y);
        }
      };

      const onMouseEnter = (e: MouseEvent) => {
        const curRect = container.getBoundingClientRect();
        const x = e.clientX - curRect.left + BUFFER;
        const y = e.clientY - curRect.top + BUFFER;
        expandCircle(x, y);
      };

      const onMouseLeave = () => {
        shrinkCircle();
      };

      const onTouchStart = (e: TouchEvent) => {
        if (!e.touches[0]) return;
        const curRect = container.getBoundingClientRect();
        const touch = e.touches[0];
        pos.x = touch.clientX - curRect.left + BUFFER;
        pos.y = touch.clientY - curRect.top + BUFFER;
        updateClip();

        gsap.to(pos, {
          r: 115,
          duration: 0.4,
          ease: "power3.out",
          overwrite: "auto",
          onUpdate: updateClip,
        });
      };

      const onTouchMove = (e: TouchEvent) => {
        if (!e.touches[0]) return;
        const curRect = container.getBoundingClientRect();
        const touch = e.touches[0];
        const x = touch.clientX - curRect.left + BUFFER;
        const y = touch.clientY - curRect.top + BUFFER;
        xTo(x);
        yTo(y);
      };

      const onTouchEnd = () => {
        gsap.to(pos, {
          r: 0,
          duration: 0.4,
          ease: "power3.out",
          overwrite: "auto",
          onUpdate: updateClip,
        });
      };

      // ── SCROLL-DRIVEN LETTER-BY-LETTER OPACITY (0.5 -> 1.0) ──
      const baseChars = container.querySelectorAll(".editorial-char-base");
      const maskChars = container.querySelectorAll(".editorial-char-mask");

      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top 85%",
          end: "center 50%",
          scrub: 0.6,
        },
      });

      if (baseChars && baseChars.length > 0) {
        scrollTl.fromTo(
          baseChars,
          { opacity: 0.5 },
          {
            opacity: 1,
            duration: 0.2,
            stagger: 0.02,
            ease: "none",
          },
          0
        );
      }

      if (maskChars && maskChars.length > 0) {
        scrollTl.fromTo(
          maskChars,
          { opacity: 0.5 },
          {
            opacity: 1,
            duration: 0.2,
            stagger: 0.02,
            ease: "none",
          },
          0
        );
      }


      container.addEventListener("mousemove", onMouseMove);
      container.addEventListener("mouseenter", onMouseEnter);
      container.addEventListener("mouseleave", onMouseLeave);
      container.addEventListener("touchstart", onTouchStart, { passive: true });
      container.addEventListener("touchmove", onTouchMove, { passive: true });
      container.addEventListener("touchend", onTouchEnd);

      return () => {
        container.removeEventListener("mousemove", onMouseMove);
        container.removeEventListener("mouseenter", onMouseEnter);
        container.removeEventListener("mouseleave", onMouseLeave);
        container.removeEventListener("touchstart", onTouchStart);
        container.removeEventListener("touchmove", onTouchMove);
        container.removeEventListener("touchend", onTouchEnd);
      };
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      id={id}
      className="relative w-full min-h-fit lg:h-screen flex flex-col justify-between px-6 sm:px-12 md:px-20 py-8 sm:py-16 overflow-hidden select-none"
    >
      {/* ── TOP SECTION HEADER ── */}
      <div className="w-full max-w-6xl mx-auto pt-2 sm:pt-14 flex items-center justify-between">
        <span className="block overflow-hidden">
          <span className="animate-text block text-xs sm:text-sm font-semibold tracking-[0.35em] uppercase text-zinc-400 will-change-transform">
            {title}
          </span>
        </span>
      </div>

      {/* ── CENTER EDITORIAL STATEMENT WITH LENS (BOTH ARE ONE WITH MOUSE HOVER) ── */}
      <div className="w-full max-w-6xl mx-auto my-auto py-6 sm:py-16 relative">
        <div ref={textContainerRef} className="relative w-full cursor-default">
          {/* Sizer grid: dynamically sizes to max(Layer 1, Layer 2) with zero dead space */}
          <div className="grid grid-cols-1 grid-rows-1 w-full items-start overflow-hidden">
            {/* LAYER 1: BASE EDITORIAL TEXT (Cream & Coral) */}
            <h2 className="animate-text col-start-1 row-start-1 text-3xl sm:text-5xl md:text-6xl lg:text-[4.3vw] font-bold leading-[1.15] sm:leading-[1.15] tracking-tight will-change-transform">
              {baseText || renderLetterByLetter(layer1Parts, "editorial-char-base")}
            </h2>

            {/* GHOST LAYER: Hidden copy of Layer 2 to ensure container dynamically expands if Layer 2 wraps more lines */}
            <h2
              aria-hidden="true"
              className="animate-text col-start-1 row-start-1 invisible pointer-events-none select-none text-3xl sm:text-5xl md:text-6xl lg:text-[4.3vw] font-bold leading-[1.15] sm:leading-[1.15] tracking-tight will-change-transform"
            >
              {revealedText || renderLetterByLetter(layer2Parts, "editorial-char-ghost")}
            </h2>
          </div>

          {/* LAYER 2: INTERACTIVE CORAL LENS OF TRUTH */}
          <div
            ref={maskRef}
            className="absolute bg-[#ea583a] text-black pointer-events-none select-none z-20 will-change-[clip-path]"
            style={{
              top: -BUFFER,
              left: -BUFFER,
              right: -BUFFER,
              bottom: -BUFFER,
              clipPath: "circle(0px at 0px 0px)",
            }}
          >
            {/* Exactly padded container starting at (0,0) without flex centering so masked text superimposes 1:1 on base text */}
            <div
              className="w-full h-full pointer-events-none select-none"
              style={{ padding: BUFFER }}
            >
              <div className="overflow-hidden">
                <h2 className="animate-text text-3xl sm:text-5xl md:text-6xl lg:text-[4.3vw] font-bold leading-[1.15] sm:leading-[1.15] tracking-tight will-change-transform">
                  {revealedText || renderLetterByLetter(layer2Parts, "editorial-char-mask")}
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditorialSection;
