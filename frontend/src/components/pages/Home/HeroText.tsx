import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface HeroTextProps {
  baseText?: React.ReactNode;
  revealedText?: React.ReactNode;
  className?: string;
  onHoverChange?: (isHovered: boolean) => void;
  isLoaded?: boolean;
}

// Generous buffer so the circle is never clipped into a flat sheet by text bounds
const BUFFER = 350;

// Track global mouse position so we know where the cursor is even before first container move
let globalMouseX: number | null = null;
let globalMouseY: number | null = null;

if (typeof window !== "undefined") {
  window.addEventListener(
    "mousemove",
    (e) => {
      globalMouseX = e.clientX;
      globalMouseY = e.clientY;
    },
    { passive: true }
  );
}

const HeroText = ({
  baseText,
  revealedText,
  className = "",
  onHoverChange,
  isLoaded = false,
}: HeroTextProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const container = containerRef.current;
      const mask = maskRef.current;
      if (!container || !mask) return;

      // Track cursor coordinates (including buffer) and circle radius
      const pos = { x: 0, y: 0, r: 0 };

      const updateClip = () => {
        mask.style.clipPath = `circle(${pos.r}px at ${pos.x}px ${pos.y}px)`;
      };

      updateClip();

      const xTo = gsap.quickTo(pos, "x", {
        duration: 0.2,
        ease: "power2.out",
        onUpdate: updateClip,
      });

      const yTo = gsap.quickTo(pos, "y", {
        duration: 0.2,
        ease: "power2.out",
        onUpdate: updateClip,
      });

      const getTargetRadius = () =>
        window.innerWidth < 640
          ? 125
          : window.innerWidth < 1024
            ? 160
            : 185;

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

      // ── ON INITIAL HOME PAGE LOAD: EXPAND RED CIRCLE FROM START ──
      if (isLoaded) {
        const rect = container.getBoundingClientRect();
        const hasMoved = globalMouseX !== null && globalMouseY !== null;
        const isInside = hasMoved
          ? globalMouseX! >= rect.left &&
          globalMouseX! <= rect.right &&
          globalMouseY! >= rect.top &&
          globalMouseY! <= rect.bottom
          : true;

        if (isInside) {
          const initX = hasMoved
            ? globalMouseX! - rect.left + BUFFER
            : rect.width / 2 + BUFFER;
          const initY = hasMoved
            ? globalMouseY! - rect.top + BUFFER
            : rect.height / 2 + BUFFER;

          pos.x = initX;
          pos.y = initY;
          updateClip();
          onHoverChange?.(true);

          gsap.fromTo(
            pos,
            { r: 0 },
            {
              r: getTargetRadius(),
              duration: 0.85,
              delay: 0.2,
              ease: "power3.out",
              overwrite: "auto",
              onUpdate: updateClip,
            }
          );
        }
      }

      const onMouseMove = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left + BUFFER;
        const y = e.clientY - rect.top + BUFFER;
        xTo(x);
        yTo(y);

        // If circle is not expanded yet (r is 0), expand it immediately
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

      // Global window mousemove ensures tracking even if cursor was resting during page transition
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

      // Support mobile touch drag
      const onTouchStart = (e: TouchEvent) => {
        if (!e.touches[0]) return;
        const rect = container.getBoundingClientRect();
        const touch = e.touches[0];
        const x = touch.clientX - rect.left + BUFFER;
        const y = touch.clientY - rect.top + BUFFER;
        expandCircle(x, y);
      };

      const onTouchMove = (e: TouchEvent) => {
        if (!e.touches[0]) return;
        const rect = container.getBoundingClientRect();
        const touch = e.touches[0];
        const x = touch.clientX - rect.left + BUFFER;
        const y = touch.clientY - rect.top + BUFFER;
        xTo(x);
        yTo(y);
        if (pos.r < 10) {
          expandCircle(x, y);
        }
      };

      const onTouchEnd = () => {
        shrinkCircle();
      };

      container.addEventListener("mousemove", onMouseMove);
      container.addEventListener("mouseenter", onMouseEnter);
      container.addEventListener("mouseleave", onMouseLeave);
      window.addEventListener("mousemove", onWindowMouseMove);
      container.addEventListener("touchstart", onTouchStart, { passive: true });
      container.addEventListener("touchmove", onTouchMove, { passive: true });
      container.addEventListener("touchend", onTouchEnd);

      return () => {
        container.removeEventListener("mousemove", onMouseMove);
        container.removeEventListener("mouseenter", onMouseEnter);
        container.removeEventListener("mouseleave", onMouseLeave);
        window.removeEventListener("mousemove", onWindowMouseMove);
        container.removeEventListener("touchstart", onTouchStart);
        container.removeEventListener("touchmove", onTouchMove);
        container.removeEventListener("touchend", onTouchEnd);
      };
    },
    { dependencies: [isLoaded], scope: containerRef }
  );

  useGSAP(
    () => {
      if (!isLoaded) {
        gsap.set(".animate-text", { y: "100%" });
        return;
      }

      gsap.fromTo(
        ".animate-text",
        { y: "100%" },
        {
          y: "0%",
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.1,
          delay: 0.1,
        }
      );
    },
    { dependencies: [isLoaded], scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className={`hero-content relative w-full max-w-6xl xl:max-w-2xl px-4 cursor-default ${className}`}
    >
      {/* Sizer grid: ensures both base and revealed text occupy the exact same bounding box */}
      <div className="grid grid-cols-1 grid-rows-1 w-full text-center">
        {/* 1. Base Layer: Solid public text */}
        <div className="col-start-1 row-start-1 text-7xl lg:text-[7vw] font-black w-full h-fit text-center leading-[0.92] sm:leading-[0.88] tracking-tight sm:tracking-tighter select-none">
          <h2 className="animate-text block text-xs sm:text-sm font-semibold tracking-[0.35em] uppercase text-zinc-400 will-change-transform mb-10">
            Vedant Khambadkar
          </h2>
          {baseText || (
            <>
              <span className="block overflow-hidden">
                <span className="animate-text hero-line block will-change-transform">I BUILD THINGS</span>
              </span>
              <span className="block overflow-hidden">
                <span className="animate-text hero-line block will-change-transform">FOR THE DIGITAL</span>
              </span>
              <span className="block overflow-hidden">
                <span className="animate-text hero-line block will-change-transform">WORLD.</span>
              </span>
            </>
          )}
        </div>

        {/* GHOST LAYER: hidden copy of Layer 2 to ensure identical height */}
        <div
          aria-hidden="true"
          className="col-start-1 row-start-1 invisible pointer-events-none select-none text-7xl lg:text-[7vw] font-black w-full h-fit text-center leading-[0.92] sm:leading-[0.88] tracking-tight sm:tracking-tighter"
        >
          {revealedText || (
            <>
              <span className="block overflow-hidden">
                <span className="block">I BUILD DIGITAL</span>
              </span>
              <span className="block overflow-hidden">
                <span className="block">EXPERIENCES BEYOND</span>
              </span>
              <span className="block overflow-hidden">
                <span className="block">THE ORDINARY.</span>
              </span>
            </>
          )}
        </div>
      </div>

      {/* 2. Masked Layer: Coral lens reveals the second way to express yourself in rich black text */}
      <div
        ref={maskRef}
        className="absolute bg-[#ea583a] pointer-events-none select-none z-20 will-change-[clip-path]"
        style={{
          top: -BUFFER,
          left: -BUFFER,
          right: -BUFFER,
          bottom: -BUFFER,
          clipPath: "circle(0px at 0px 0px)",
        }}
      >
        {/* Inner container padded by BUFFER so text aligns 1:1 with base text */}
        <div
          className="w-full h-full pointer-events-none select-none"
          style={{ padding: BUFFER }}
        >
          <div className="text-[#0c0c0c] text-7xl lg:text-[7vw] font-black w-full h-fit text-center leading-[0.92] sm:leading-[0.88] tracking-tight sm:tracking-tighter select-none">
            {revealedText || (
              <>
                <span className="block overflow-hidden">
                  <span className="animate-text hero-line block will-change-transform">I BUILD DIGITAL</span>
                </span>
                <span className="block overflow-hidden">
                  <span className="animate-text hero-line block will-change-transform">EXPERIENCES BEYOND</span>
                </span>
                <span className="block overflow-hidden">
                  <span className="animate-text hero-line block will-change-transform">THE ORDINARY.</span>
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroText;
