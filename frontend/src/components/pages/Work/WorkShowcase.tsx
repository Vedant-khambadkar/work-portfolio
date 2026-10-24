import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export interface ProjectItem {
  id: string;
  number: string;
  name: string;
  subtitle?: string;
  category: string;
  year: string;
  image: string;
  description: string;
  link?: string;
  client?: string;
  scope?: string[];
}

export interface WorkShowcaseProps {
  onHoverChange?: (isHovered: boolean) => void;
  sectionTitle?: string;
  sectionSubtitle?: string;
  editorialText?: string;
  projects?: ProjectItem[];
}

// ── VERIFIED UNSPLASH IMAGES MATCHING THE USER'S DESIGN REFERENCE ──
export const DEFAULT_PROJECTS: ProjectItem[] = [
  {
    id: "project-1",
    number: "01",
    name: "Project Name",
    subtitle: "Vesper Sanctuary",
    category: "Interior Architecture",
    year: "2025",
    client: "Studio Vesper",
    scope: ["Spatial Design", "Material Direction", "Ambient Lighting"],
    // Left bottom: Dark, moodily lit minimalist bedroom & lounge with sculptural chair
    image:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
    description:
      "An introspective residential sanctuary balancing raw charred timber, honed basalt surfaces, and recessed ambient warmth to cultivate stillness.",
    link: "https://unsplash.com/photos/dd6b41faaea6",
  },
  {
    id: "project-2",
    number: "02",
    name: "Project Name",
    subtitle: "Monolith Atelier",
    category: "Spatial Studio",
    year: "2025",
    client: "Atelier Form",
    scope: ["Furniture Architecture", "Curated Objects", "Minimalist Office"],
    // Center: Minimalist black desk, mesh chair, white wall with black wall shelf
    image:
      "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1200&q=80",
    description:
      "A disciplined creative workspace composed around a singular monolithic desk, sculptural wire mesh seating, and floating geometric wall shelving.",
    link: "https://unsplash.com/photos/f3f8164ba6bd",
  },
  {
    id: "project-3",
    number: "03",
    name: "Project Name",
    subtitle: "Skyline Pavilion",
    category: "Executive Environment",
    year: "2024",
    client: "Apex Holdings",
    scope: ["High-Rise Interior", "Acoustic Glazing", "Custom Joinery"],
    // Right top: Modern office desk and leather chair facing floor-to-ceiling city skyscraper window
    image:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80",
    description:
      "A high-altitude executive corner studio offering unobstructed skyline vistas, framed by precision-engineered glass membranes and tailored leatherwork.",
    link: "https://unsplash.com/photos/6870744d04b2",
  },
  {
    id: "project-4",
    number: "04",
    name: "Project Name",
    subtitle: "Kyoto Hearth",
    category: "Materiality & Dining",
    year: "2024",
    client: "Nara Cultural Guild",
    scope: ["Solid Timber Architecture", "Ceramic Styling", "Spatial Flow"],
    // Right bottom: Long solid wooden conference / dining table with contemporary chairs and ceramics
    image:
      "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=80",
    description:
      "A communal gathering table sculpted from reclaimed Japanese cedar, celebrating the tactile wabi-sabi grain alongside handcrafted stoneware.",
    link: "https://unsplash.com/photos/18e1de247200",
  },
];

const DEFAULT_EDITORIAL =
  "Ruptatam que vidum et optatus dantils uollae agna sae net moluptatur sunt, cori comoditas molecus aunt et et lab ium dolluptaque dolorem caernitam aut quo con conecaptae volupta ssitatum sumquodi occore secuunt aut venit molorrum net parum simusam quos dolores torestrus, nus, inus idem re voluptatur sam con nulliquiatem et rerit quae eormper cipsant aut velitiist doluptatese dolupta temolorumne nihil gavolent perit atem iro, tem eicha dollop quam volupti que dolo.";

const WorkShowcase: React.FC<WorkShowcaseProps> = ({
  onHoverChange,
  sectionTitle = "W O R K",
  sectionSubtitle = "S E L E C T E D   P R O J E C T S",
  editorialText = DEFAULT_EDITORIAL,
  projects = DEFAULT_PROJECTS,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // GSAP scroll entrance animation
  useGSAP(
    () => {
      if (!containerRef.current) return;

      // Header and text reveal
      gsap.from(".animate-work-header", {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 78%",
          toggleActions: "play none none none",
        },
      });

      // Cards staggered reveal
      gsap.from(".animate-work-item", {
        y: 50,
        opacity: 0,
        duration: 1.1,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 72%",
          toggleActions: "play none none none",
        },
      });
    },
    { scope: containerRef }
  );

  const p1 = projects[0] || DEFAULT_PROJECTS[0];
  const p2 = projects[1] || DEFAULT_PROJECTS[1];
  const p3 = projects[2] || DEFAULT_PROJECTS[2];
  const p4 = projects[3] || DEFAULT_PROJECTS[3];

  const handleCardMouseEnter = () => {
    onHoverChange?.(true);
  };

  const handleCardMouseLeave = () => {
    onHoverChange?.(false);
  };

  const renderProjectCard = (
    project: ProjectItem,
    imageAspectClass: string = "aspect-[16/10]",
    customWrapperClass: string = ""
  ) => {
    return (
      <div
        key={project.id}
        onMouseEnter={handleCardMouseEnter}
        onMouseLeave={handleCardMouseLeave}
        className={`animate-work-item group cursor-pointer flex flex-col w-full select-none ${customWrapperClass}`}
      >
        {/* Image Container with Smooth Hover Scale */}
        <div
          className={`w-full ${imageAspectClass} overflow-hidden bg-[#161616] relative transition-shadow duration-500`}
        >
          <img
            src={project.image}
            alt={project.name}
            loading="lazy"
            className="w-full h-full object-cover object-center grayscale contrast-105 brightness-95 transition-all duration-700 ease-out group-hover:scale-105 group-hover:grayscale-0 group-hover:brightness-100 will-change-transform"
          />

          {/* Subtle Corner Accents on Hover */}
          <span className="absolute top-3 right-3 text-[10px] tracking-widest font-mono text-white/40 group-hover:text-white/90 transition-colors duration-300">
            {project.number}
          </span>
          <span className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[10px] uppercase tracking-widest px-2 py-0.5 bg-black/70 backdrop-blur-xs text-white">
            View Project ↗
          </span>
        </div>

        {/* Caption Matching Mockup: Exactly "Project Name" with subtle hover feedback */}
        <div className="pt-3 sm:pt-4 flex items-baseline justify-between">
          <h3 className="text-base sm:text-lg font-medium tracking-tight text-white/90 group-hover:text-[#f25536] transition-colors duration-300">
            {project.name}
          </h3>
          <span className="text-xs text-zinc-500 font-mono hidden sm:inline-block">
            {project.category}
          </span>
        </div>
      </div>
    );
  };

  return (
    <section
      ref={containerRef}
      id="work"
      className="relative w-full px-6 sm:px-12 md:px-20 py-20 sm:py-28 lg:py-36 overflow-hidden select-none"
    >
      <div className="w-full max-w-6xl mx-auto flex flex-col">
        {/* ── TOP SECTION HEADER (Consistent with About / Experience / Clients) ── */}
        <div className="animate-work-header w-full flex items-center justify-between pb-10 sm:pb-16 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="text-xs sm:text-sm font-semibold tracking-[0.35em] uppercase ">
              {sectionTitle}
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono tracking-widest ">
            <span className="hidden sm:inline">{sectionSubtitle}</span>
            <span>( 0 4 )</span>
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════════════
            DESKTOP & LARGE SCREENS: EXACT 3-COLUMN ASYMMETRICAL LAYOUT
            ═════════════════════════════════════════════════════════════════ */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-8 xl:gap-12 items-end pt-12 xl:pt-16">
          {/* ── COLUMN 1 (LEFT) ── */}
          <div className="flex flex-col justify-between h-full min-h-[640px] xl:min-h-[720px]">
            {/* Top: Editorial Narrative Block */}
            <div className="animate-work-item max-w-md pr-2">
              <p className="text-xs sm:text-sm xl:text-[14.5px] leading-relaxed xl:leading-[1.8]  text-justify">
                {editorialText}
              </p>
            </div>

            {/* Bottom: Project 1 Card */}
            <div className="mt-12 xl:mt-16">
              {renderProjectCard(p1, "aspect-[16/10]")}
            </div>
          </div>

          {/* ── COLUMN 2 (CENTER) ── */}
          <div className="flex flex-col justify-end h-full min-h-[640px] xl:min-h-[720px]">
            {/* Project 2 Card: Taller aspect ratio, aligned with bottom baseline */}
            <div className="w-full">
              {renderProjectCard(p2, "aspect-[4/5] sm:aspect-[1/1] xl:aspect-[4/5]")}
            </div>
          </div>

          {/* ── COLUMN 3 (RIGHT) ── */}
          <div className="flex flex-col justify-between h-full min-h-[640px] xl:min-h-[720px] gap-10 xl:gap-14">
            {/* Top: Project 3 Card */}
            <div className="w-full">
              {renderProjectCard(p3, "aspect-[16/10]")}
            </div>

            {/* Bottom: Project 4 Card (Baseline aligned with Project 1 & Project 2) */}
            <div className="w-full">
              {renderProjectCard(p4, "aspect-[16/10]")}
            </div>
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════════════
            TABLET VIEW (768px - 1023px): 2-COLUMN BALANCED FLOW
            ═════════════════════════════════════════════════════════════════ */}
        <div className="hidden md:grid lg:hidden grid-cols-2 gap-8 pt-10 items-start">
          {/* Left Column on Tablet */}
          <div className="flex flex-col gap-10">
            <div className="animate-work-item p-4 bg-white/3 rounded-sm border border-white/5">
              <p className="text-xs sm:text-sm leading-relaxed  text-justify">
                {editorialText}
              </p>
            </div>
            {renderProjectCard(p1, "aspect-[16/10]")}
            {renderProjectCard(p2, "aspect-[4/5]")}
          </div>

          {/* Right Column on Tablet */}
          <div className="flex flex-col gap-10">
            {renderProjectCard(p3, "aspect-[16/10]")}
            {renderProjectCard(p4, "aspect-[16/10]")}
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════════════
            MOBILE VIEW (< 768px): SEAMLESS SINGLE COLUMN FLOW
            ═════════════════════════════════════════════════════════════════ */}
        <div className="flex flex-col md:hidden gap-10 pt-8">
          {/* Mobile Editorial Intro */}
          <div className="animate-work-item p-4 bg-white/3 rounded-xs border border-white/5">
            <p className="text-xs leading-relaxed ">
              {editorialText}
            </p>
          </div>

          {/* Staggered Mobile Project Cards */}
          {projects.map((proj) => renderProjectCard(proj, "aspect-[16/10]"))}
        </div>
      </div>
    </section>
  );
};

export default WorkShowcase;
