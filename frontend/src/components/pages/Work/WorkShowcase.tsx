import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Import Animated Videos from assets
import bikeVideo from "../../../assets/Animated Videos/bike.mp4";
import bristonVideo from "../../../assets/Animated Videos/Briston Collection.mp4";
import cosmosVideo from "../../../assets/Animated Videos/Cosmos.mp4";
import dropStudioVideo from "../../../assets/Animated Videos/Drop Studio.mp4";
import founderVideo from "../../../assets/Animated Videos/Founder.mp4";
import jellyVideo from "../../../assets/Animated Videos/Jelly.mp4";
import laptopVideo from "../../../assets/Animated Videos/Laptop.mp4";
import projectShowcaseVideo from "../../../assets/Animated Videos/project Showcase.mp4";

gsap.registerPlugin(ScrollTrigger);

export interface ProjectItem {
  id: string;
  number: string;
  name: string;
  subtitle?: string;
  category: string;
  year: string;
  video?: string;
  image?: string;
  description?: string;
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

// ── 8 ANIMATED VIDEO PROJECTS FROM ASSETS ──
export const DEFAULT_PROJECTS: ProjectItem[] = [
  {
    id: "project-1",
    number: "01",
    name: "Drop Studio",
    subtitle: "Spatial & Fluid Motion",
    category: "Brand Motion / 3D",
    year: "2025",
    video: dropStudioVideo,
    description:
      "A kinetic visual identity exploring fluid simulation, lighting geometry, and tactile interactive micro-interactions.",
  },
  {
    id: "project-2",
    number: "02",
    name: "Briston Collection",
    subtitle: "Horology & Product Cinema",
    category: "3D Product Experience",
    year: "2025",
    video: bristonVideo,
    description:
      "A cinematic exploration of precision horology, mechanical aesthetics, and high-fidelity raytraced materiality.",
  },
  {
    id: "project-3",
    number: "03",
    name: "Cosmos",
    subtitle: "Generative Starfield Simulation",
    category: "Creative Engineering",
    year: "2025",
    video: cosmosVideo,
    description:
      "High-speed algorithmic particle rendering and dynamic gravitational simulation crafted for interactive web experiences.",
  },
  {
    id: "project-4",
    number: "04",
    name: "Founder Edition",
    subtitle: "Executive Digital Identity",
    category: "Editorial Direction",
    year: "2024",
    video: founderVideo,
    description:
      "A high-impact digital presence framing venture builders, technical founders, and next-generation product architectures.",
  },
  {
    id: "project-5",
    number: "05",
    name: "Urban Kinetic",
    subtitle: "Engineering in Motion",
    category: "Industrial Motion",
    year: "2024",
    video: bikeVideo,
    description:
      "A technical motion study tracking mechanical engineering, precision gearboxes, and aerodynamic frame structures.",
  },
  {
    id: "project-6",
    number: "06",
    name: "Jelly Studio",
    subtitle: "Soft-Body Physics Playground",
    category: "Creative Interaction",
    year: "2024",
    video: jellyVideo,
    description:
      "Real-time interactive soft-body physics, squishy deformation shaders, and playful generative spatial interactions.",
  },
  {
    id: "project-7",
    number: "07",
    name: "Silicon Canvas",
    subtitle: "Modern Computing Interface",
    category: "Digital Workspace",
    year: "2024",
    video: laptopVideo,
    description:
      "Next-generation digital workspace hardware aesthetics, minimal bezel framing, and focused developer experience.",
  },
  {
    id: "project-8",
    number: "08",
    name: "Motion Archive",
    subtitle: "Curated Experimental R&D",
    category: "Design Systems",
    year: "2024",
    video: projectShowcaseVideo,
    description:
      "A curated reel of experimental motion studies, shader experiments, and interactive layout prototypes.",
  },
];

const DEFAULT_EDITORIAL =
  "Combining engineering precision with cinematic motion. Every project is crafted from the ground up to captivate, communicate with clarity, and deliver digital experiences that leave a lasting impression.";

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
        stagger: 0.1,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 72%",
          toggleActions: "play none none none",
        },
      });
    },
    { scope: containerRef }
  );

  const handleCardMouseEnter = () => {
    onHoverChange?.(true);
  };

  const handleCardMouseLeave = () => {
    onHoverChange?.(false);
  };

  const renderProjectCard = (
    project: ProjectItem,
    aspectClass: string = "aspect-[16/10]",
    customWrapperClass: string = ""
  ) => {
    return (
      <div
        key={project.id}
        onMouseEnter={handleCardMouseEnter}
        onMouseLeave={handleCardMouseLeave}
        className={`animate-work-item group cursor-pointer flex flex-col w-full select-none ${customWrapperClass}`}
      >
        {/* Video / Media Container */}
        <div
          className={`w-full ${aspectClass} overflow-hidden bg-[#161616] rounded-lg relative transition-all duration-500 shadow-sm group-hover:shadow-[0_12px_36px_rgba(0,0,0,0.6)]`}
        >
          {project.video ? (
            <video
              src={project.video}
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 will-change-transform"
            />
          ) : (
            <img
              src={project.image}
              alt={project.name}
              loading="lazy"
              className="w-full h-full object-cover object-center grayscale contrast-105 brightness-95 transition-all duration-700 ease-out group-hover:scale-105 group-hover:grayscale-0 group-hover:brightness-100 will-change-transform"
            />
          )}

          {/* Top-right subtle counter */}
          <span className="absolute top-3.5 right-3.5 text-[11px] tracking-widest font-mono /50 group-hover: transition-colors duration-300 bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded">
            {project.number}
          </span>
        </div>

        {/* Caption Matching Mockup: Project Name + Subtitle + Category */}
        <div className="pt-3 sm:pt-4 flex items-baseline justify-between">
          <div className="flex flex-col">
            <h3 className="text-base sm:text-lg font-medium tracking-tight /95 group-hover:text-[#f25536] transition-colors duration-300">
              {project.name}
            </h3>
            {project.subtitle && (
              <span className="text-xs text-zinc-400 mt-0.5 font-normal">
                {project.subtitle}
              </span>
            )}
          </div>
          <span className="text-xs text-zinc-500 font-mono hidden sm:inline-block">
            {project.category}
          </span>
        </div>
      </div>
    );
  };

  // Divide projects into rows
  const p1 = projects[0] || DEFAULT_PROJECTS[0];
  const p2 = projects[1] || DEFAULT_PROJECTS[1];
  const p3 = projects[2] || DEFAULT_PROJECTS[2];
  const p4 = projects[3] || DEFAULT_PROJECTS[3];

  const p5 = projects[4] || DEFAULT_PROJECTS[4];
  const p6 = projects[5] || DEFAULT_PROJECTS[5];
  const p7 = projects[6] || DEFAULT_PROJECTS[6];
  const p8 = projects[7] || DEFAULT_PROJECTS[7];

  return (
    <section
      ref={containerRef}
      id="work"
      className="relative w-full px-6 sm:px-12 md:px-20 py-20 sm:py-28 lg:py-36 overflow-hidden select-none"
    >
      <div className="w-full max-w-6xl mx-auto flex flex-col">
        {/* ── TOP SECTION HEADER ── */}
        <div className="animate-work-header w-full flex items-center justify-between pb-10 sm:pb-16 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="text-xs sm:text-sm font-semibold tracking-[0.35em] uppercase text-zinc-400">
              {sectionTitle}
            </span>
          </div>
          {sectionSubtitle && (
            <span className="text-xs font-mono tracking-widest text-zinc-500 uppercase hidden sm:inline-block">
              {sectionSubtitle}
            </span>
          )}
        </div>

        {/* ═════════════════════════════════════════════════════════════════
            DESKTOP & LARGE SCREENS: EDITORIAL ASYMMETRICAL 3-COLUMN ROWS
            ═════════════════════════════════════════════════════════════════ */}
        <div className="hidden lg:flex lg:flex-col gap-16 xl:gap-24 pt-12 xl:pt-16">
          {/* ── TIER 1: PROJECTS 1 - 4 WITH EDITORIAL BLOCK ── */}
          <div className="grid grid-cols-3 gap-8 xl:gap-12 items-end">
            {/* Column 1 (Left): Editorial Narrative + Project 1 */}
            <div className="flex flex-col justify-between h-full min-h-[640px] xl:min-h-[720px]">
              <div className="animate-work-item max-w-md pr-2">
                <p className="text-xs sm:text-sm xl:text-[14.5px] leading-relaxed xl:leading-[1.8] text-zinc-400 text-justify">
                  {editorialText}
                </p>
              </div>
              <div className="mt-12 xl:mt-16">
                {renderProjectCard(p1, "aspect-[16/10]")}
              </div>
            </div>

            {/* Column 2 (Center): Project 2 (Tall Aspect) */}
            <div className="flex flex-col justify-end h-full min-h-[640px] xl:min-h-[720px]">
              <div className="w-full">
                {renderProjectCard(p2, "aspect-[4/5] xl:aspect-[4/5]")}
              </div>
            </div>

            {/* Column 3 (Right): Project 3 & Project 4 Stacked */}
            <div className="flex flex-col justify-between h-full min-h-[640px] xl:min-h-[720px] gap-10 xl:gap-14">
              <div className="w-full">{renderProjectCard(p3, "aspect-[16/10]")}</div>
              <div className="w-full">{renderProjectCard(p4, "aspect-[16/10]")}</div>
            </div>
          </div>

          {/* ── TIER 2: PROJECTS 5 - 8 ── */}
          <div className="grid grid-cols-3 gap-8 xl:gap-12 items-end">
            {/* Column 1 (Left): Project 5 & Project 6 Stacked */}
            <div className="flex flex-col justify-between h-full min-h-[640px] xl:min-h-[720px] gap-10 xl:gap-14">
              <div className="w-full">{renderProjectCard(p5, "aspect-[16/10]")}</div>
              <div className="w-full">{renderProjectCard(p6, "aspect-[16/10]")}</div>
            </div>

            {/* Column 2 (Center): Project 7 (Tall Aspect) */}
            <div className="flex flex-col justify-end h-full min-h-[640px] xl:min-h-[720px]">
              <div className="w-full">
                {renderProjectCard(p7, "aspect-[4/5] xl:aspect-[4/5]")}
              </div>
            </div>

            {/* Column 3 (Right): Project 8 */}
            <div className="flex flex-col justify-end h-full min-h-[640px] xl:min-h-[720px]">
              <div className="w-full">{renderProjectCard(p8, "aspect-[16/10]")}</div>
            </div>
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════════════
            TABLET VIEW (768px - 1023px): 2-COLUMN BALANCED FLOW
            ═════════════════════════════════════════════════════════════════ */}
        <div className="hidden md:grid lg:hidden grid-cols-2 gap-8 pt-10 items-start">
          <div className="flex flex-col gap-10">
            <div className="animate-work-item p-4 bg-white/3 rounded-lg border border-white/5">
              <p className="text-xs sm:text-sm leading-relaxed text-zinc-400 text-justify">
                {editorialText}
              </p>
            </div>
            {renderProjectCard(p1, "aspect-[16/10]")}
            {renderProjectCard(p3, "aspect-[16/10]")}
            {renderProjectCard(p5, "aspect-[16/10]")}
            {renderProjectCard(p7, "aspect-[16/10]")}
          </div>

          <div className="flex flex-col gap-10">
            {renderProjectCard(p2, "aspect-[4/5]")}
            {renderProjectCard(p4, "aspect-[16/10]")}
            {renderProjectCard(p6, "aspect-[16/10]")}
            {renderProjectCard(p8, "aspect-[16/10]")}
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════════════
            MOBILE VIEW (< 768px): SEAMLESS SINGLE COLUMN FLOW
            ═════════════════════════════════════════════════════════════════ */}
        <div className="flex flex-col md:hidden gap-10 pt-8">
          {/* Mobile Editorial Intro */}
          <div className="animate-work-item p-4 bg-white/3 rounded-lg border border-white/5">
            <p className="text-xs leading-relaxed text-zinc-400">
              {editorialText}
            </p>
          </div>

          {/* All 8 Video Projects */}
          {projects.map((proj) => renderProjectCard(proj, "aspect-[16/10]"))}
        </div>
      </div>
    </section>
  );
};

export default WorkShowcase;
