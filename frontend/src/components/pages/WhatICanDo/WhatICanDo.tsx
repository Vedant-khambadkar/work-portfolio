import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface WhatICanDoProps {
  onHoverChange?: (isHovered: boolean) => void;
}

interface ServiceItem {
  id: string;
  number: string;
  subtitle?: string;
  // Without AI
  baseTitle: string;
  baseDescription: string;
  baseDetails?: string[];
  // With AI (Revealed inside circular lens)
  aiTitle: string;
  aiDescription: string;
  aiDetails?: string[];
}

const SERVICES: ServiceItem[] = [
  {
    id: "01",
    number: "01",
    subtitle: "Complete solution from 0 to 100%",
    baseTitle: "Website Development",
    baseDescription:
      "Building modern, responsive, and user-friendly websites tailored to unique ideas and business needs.",
    baseDetails: [
      "Craft clean, accessible, and high-performance digital architectures.",
      "Develop custom responsive layouts optimized for all screen sizes and devices.",
      "Integrate smooth navigation, modern state management, and reliable APIs.",
    ],
    aiTitle: "AI-Powered Website Development",
    aiDescription:
      "Building smarter web experiences by integrating AI capabilities that improve functionality and user interaction.",
    aiDetails: [
      "Embed intelligent conversational agents and dynamic context-aware interfaces.",
      "Automate personalized content delivery based on live user intent and interactions.",
      "Integrate modern LLM APIs and real-time generative capabilities seamlessly.",
    ],
  },
  {
    id: "02",
    number: "02",
    baseTitle: "Animated Website Development",
    baseDescription:
      "Creating engaging web experiences with smooth transitions, scroll animations, and interactive motion effects.",
    baseDetails: [
      "Implement buttery-smooth GSAP and ScrollTrigger motion choreographies.",
      "Design subtle micro-interactions that elevate brand perception and delight visitors.",
      "Ensure 60fps GPU-accelerated performance without layout jank or battery drain.",
    ],
    aiTitle: "AI-Assisted Development",
    aiDescription:
      "Using AI tools to accelerate coding, simplify debugging, and streamline the development workflow.",
    aiDetails: [
      "Harness AI-driven pair programming for rapid iteration and prototyping.",
      "Automate test coverage generation, edge-case analysis, and code optimization.",
      "Dramatically shorten delivery timelines while raising engineering quality.",
    ],
  },
  {
    id: "03",
    number: "03",
    baseTitle: "3D Website Development",
    baseDescription:
      "Crafting immersive 3D web experiences with interactive models, real-time rendering, and custom shader effects.",
    baseDetails: [
      "Build interactive WebGL and Three.js scenes with realistic materials and lighting.",
      "Write custom GLSL fragment and vertex shaders for unique aesthetic effects.",
      "Optimize mesh geometry and textures for fast mobile and web loading times.",
    ],
    aiTitle: "AI-Generated Visual Assets",
    aiDescription:
      "Creating unique visuals, textures, and creative assets with AI to bring digital concepts to life.",
    aiDetails: [
      "Synthesize custom PBR textures, procedural depth maps, and ambient environments.",
      "Generate bespoke visual concepts, icons, and hero graphics at production speed.",
      "Blend generative 2D/3D assets seamlessly into real-time interactive canvases.",
    ],
  },
  {
    id: "04",
    number: "04",
    baseTitle: "Creative Development",
    baseDescription:
      "Transforming creative concepts into interactive digital experiences through experimental design and custom coding.",
    baseDetails: [
      "Bridge the gap between visionary design and rock-solid technical execution.",
      "Craft unconventional layouts, magnetic cursor mechanics, and tactile feedback.",
      "Produce award-worthy digital experiences that stand out from the ordinary.",
    ],
    aiTitle: "AI-Powered Web Applications",
    aiDescription:
      "Developing intelligent web applications with AI-driven features, automated workflows, and personalized user experiences.",
    aiDetails: [
      "Architect full-stack intelligent workflows with real-time streaming interfaces.",
      "Build custom agentic automations that handle complex multi-step user tasks.",
      "Create adaptive digital platforms that learn and improve from user engagement.",
    ],
  },
];

const BUFFER = 120;

const WhatICanDo = ({ onHoverChange }: WhatICanDoProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);

  // Accordion state: default open item 0 (like in the design mockup)
  const [activeItem, setActiveItem] = useState<number | null>(0);

  const toggleItem = (idx: number) => {
    setActiveItem((prev) => (prev === idx ? null : idx));
  };

  useGSAP(
    () => {
      const container = textContainerRef.current;
      const mask = maskRef.current;
      if (!container || !mask) return;

      const pos = { x: 0, y: 0, r: 0 };

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

      const onMouseMove = (e: MouseEvent) => {
        const curRect = container.getBoundingClientRect();
        const x = e.clientX - curRect.left + BUFFER;
        const y = e.clientY - curRect.top + BUFFER;
        xTo(x);
        yTo(y);
      };

      const onMouseEnter = (e: MouseEvent) => {
        const curRect = container.getBoundingClientRect();
        pos.x = e.clientX - curRect.left + BUFFER;
        pos.y = e.clientY - curRect.top + BUFFER;
        updateClip();

        onHoverChange?.(true);

        // Sleek, compact circular lens (75px radius / 150px diameter on desktop, 55px on mobile)
        gsap.to(pos, {
          r: window.innerWidth < 640 ? 55 : 75,
          duration: 0.4,
          ease: "power3.out",
          overwrite: "auto",
          onUpdate: updateClip,
        });
      };

      const onMouseLeave = () => {
        onHoverChange?.(false);

        // Contract circle back to 0 on exit
        gsap.to(pos, {
          r: 0,
          duration: 0.35,
          ease: "power3.out",
          overwrite: "auto",
          onUpdate: updateClip,
        });
      };

      // Support mobile touch drag
      const onTouchStart = (e: TouchEvent) => {
        if (!e.touches[0]) return;
        const curRect = container.getBoundingClientRect();
        const touch = e.touches[0];
        pos.x = touch.clientX - curRect.left + BUFFER;
        pos.y = touch.clientY - curRect.top + BUFFER;
        updateClip();

        gsap.to(pos, {
          r: 55,
          duration: 0.35,
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
          duration: 0.35,
          ease: "power3.out",
          overwrite: "auto",
          onUpdate: updateClip,
        });
      };

      container.addEventListener("mousemove", onMouseMove);
      container.addEventListener("mouseenter", onMouseEnter);
      container.addEventListener("mouseleave", onMouseLeave);
      container.addEventListener("touchstart", onTouchStart, { passive: true });
      container.addEventListener("touchmove", onTouchMove, { passive: true });
      container.addEventListener("touchend", onTouchEnd);

      // ── ENTRANCE TEXT REVEAL ANIMATION (y: 100% -> 0) ──
      gsap.from(".animate-text", {
        y: "100%",
        duration: 1,
        ease: "power1.inOut",
        stagger: 0.05,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      });

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

  // Helper to render an individual row's layout identically in both layers
  const renderRowContent = (
    item: ServiceItem,
    isAI: boolean,
    isOpen: boolean
  ) => {
    const title = isAI ? item.aiTitle : item.baseTitle;
    const description = isAI ? item.aiDescription : item.baseDescription;
    const details = isAI ? item.aiDetails : item.baseDetails;
    const buttonText = isAI ? "LEAVE A REQUEST" : "LEAVE A REQUEST";
    const subtitle = item.subtitle
      ? isAI
        ? "AI-Augmented & Scalable"
        : item.subtitle
      : undefined;

    return (
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4 sm:gap-6 w-full">
        {/* Col 1: Number + Subtitle */}
        <div className="w-14 sm:w-20 md:w-24 shrink-0">
          <span className="block overflow-hidden">
            <span
              className={`animate-text block will-change-transform text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight ${isAI ? "text-[#0c0c0c]" : ""
                }`}
            >
              {item.number}
            </span>
          </span>
          {subtitle && (
            <div className="overflow-hidden">
              <p
                className={`animate-text will-change-transform text-xs leading-relaxed mt-2 hidden sm:block ${isAI ? "text-[#0c0c0c]/70" : "text-zinc-500"
                  }`}
              >
                {subtitle}
              </p>
            </div>
          )}
        </div>

        {/* Col 2: Title + Action Button */}
        <div className="w-full sm:w-[42%] md:w-[44%] shrink-0 pr-4 lg:pr-8">
          <span className="block overflow-hidden">
            <h3
              className={`animate-text block will-change-transform text-2xl sm:text-3xl md:text-4xl lg:text-[2.5rem] font-black uppercase tracking-tight leading-[1.08] ${isAI ? "text-[#0c0c0c]" : ""
                }`}
            >
              {title}
            </h3>
          </span>

          {/* Action Button when Open */}
          {isOpen && (
            <div className="mt-8 relative inline-block">
              <div className="relative p-0.5">
                <span
                  className={`absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 ${isAI ? "border-black" : "border-white"
                    }`}
                />
                <span
                  className={`absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 ${isAI ? "border-black" : "border-white"
                    }`}
                />
                <span
                  className={`absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 ${isAI ? "border-black" : "border-white"
                    }`}
                />
                <span
                  className={`absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 ${isAI ? "border-black" : "border-white"
                    }`}
                />

                <div
                  className={`font-black text-[11px] sm:text-xs tracking-wider uppercase px-5 py-2.5 shadow-md ${isAI
                    ? "bg-[#0c0c0c] "
                    : "bg-white text-[#0e0e0e]"
                    }`}
                >
                  {buttonText}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Col 3: Description Paragraph(s) */}
        <div className="flex-1 min-w-0 pr-4 mt-2 sm:mt-0">
          <div className="overflow-hidden">
            <p
              className={`animate-text will-change-transform text-sm sm:text-base leading-relaxed ${isAI ? "text-[#0c0c0c] font-semibold" : "text-zinc-300"
                }`}
            >
              {description}
            </p>
          </div>

          {isOpen && details && (
            <div
              className={`mt-6 space-y-3 pt-4 border-t ${isAI ? "border-black/20" : "border-zinc-800/80"
                }`}
            >
              {details.map((detail, dIdx) => (
                <p
                  key={dIdx}
                  className={`text-xs sm:text-sm leading-relaxed ${isAI ? "text-[#0c0c0c]/85" : "text-zinc-400"
                    }`}
                >
                  {detail}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Col 4: Arrow Indicator */}
        <div className="w-8 sm:w-10 shrink-0 flex justify-end pt-1">
          <span
            className={`inline-flex items-center justify-center text-xl sm:text-2xl font-bold transition-all duration-300 ${isAI
              ? isOpen
                ? "text-[#0c0c0c] rotate-0 scale-125"
                : "text-[#0c0c0c]/50 rotate-90"
              : isOpen
                ? " rotate-0 scale-125"
                : "text-zinc-500 rotate-90"
              }`}
          >
            ↗
          </span>
        </div>
      </div>
    );
  };

  return (
    <section
      ref={containerRef}
      id="services"
      className="relative w-full min-h-screen  px-6 sm:px-12 md:px-20 py-20 sm:py-28 select-none"
    >
      {/* ── SECTION HEADER (Matches Reference Mockup) ── */}
      <div className="w-full max-w-6xl mx-auto mb-12 sm:mb-16">
        <div className="flex flex-col items-end">
          <h2 className="text-6xl md:text-7xl lg:text-9xl font-black uppercase tracking-tight text-right leading-none">
            <span className="block overflow-hidden">
              <span className="animate-text block will-change-transform">WHAT</span>
            </span>
            <span className="block overflow-hidden">
              <span className="animate-text block will-change-transform">I DO</span>
            </span>
          </h2>
        </div>
      </div>

      {/* ── INTERACTIVE DUAL-LAYER SERVICES CONTAINER (BOTH ARE ONE WITH LENS) ── */}
      <div className="w-full max-w-6xl mx-auto relative">
        <div ref={textContainerRef} className="relative w-full cursor-default">
          {/* ══════════════════════════════════════════════════════════════
              LAYER 1: BASE SERVICES (Without AI - Traditional Craftsmanship)
             ══════════════════════════════════════════════════════════════ */}
          <div className="w-full border-t border-zinc-800">
            {SERVICES.map((item, idx) => {
              const isOpen = activeItem === idx;
              return (
                <div
                  key={item.id}
                  onClick={() => toggleItem(idx)}
                  className="group border-b border-zinc-800 py-8 sm:py-12 transition-colors duration-300 hover:bg-zinc-900/30 cursor-pointer"
                >
                  {/* CSS GRID ROW SIZER: guarantees Layer 1 and Layer 2 have the exact same row height */}
                  <div className="grid grid-cols-1 grid-rows-1 w-full">
                    {/* Visible Base Content */}
                    <div className="col-start-1 row-start-1 w-full">
                      {renderRowContent(item, false, isOpen)}
                    </div>
                    {/* Invisible Ghost of AI Content so Layer 1 stretches to match Layer 2 */}
                    <div
                      aria-hidden="true"
                      className="col-start-1 row-start-1 w-full invisible pointer-events-none select-none"
                    >
                      {renderRowContent(item, true, isOpen)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ══════════════════════════════════════════════════════════════
              LAYER 2: MASKED SERVICES (With AI - Revealed inside Coral Lens)
             ══════════════════════════════════════════════════════════════ */}
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
            <div
              className="absolute border-t border-black/25 pointer-events-none select-none"
              style={{
                top: BUFFER,
                left: BUFFER,
                right: BUFFER,
              }}
            >
              {SERVICES.map((item, idx) => {
                const isOpen = activeItem === idx;
                return (
                  <div
                    key={item.id}
                    className="border-b border-black/25 py-8 sm:py-12 pointer-events-none select-none"
                  >
                    {/* CSS GRID ROW SIZER: guarantees Layer 2 has the exact same row height as Layer 1 */}
                    <div className="grid grid-cols-1 grid-rows-1 w-full">
                      {/* Visible AI Content */}
                      <div className="col-start-1 row-start-1 w-full">
                        {renderRowContent(item, true, isOpen)}
                      </div>
                      {/* Invisible Ghost of Base Content so Layer 2 stretches to match Layer 1 */}
                      <div
                        aria-hidden="true"
                        className="col-start-1 row-start-1 w-full invisible pointer-events-none select-none"
                      >
                        {renderRowContent(item, false, isOpen)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatICanDo;
