import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface SocialItem {
  name: string;
  url: string;
  icon: React.ReactNode;
}

const SOCIAL_ITEMS: SocialItem[] = [
  {
    name: "Dribbble",
    url: "https://dribbble.com",
    icon: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm6.605 4.61a8.502 8.502 0 0 1 1.93 5.312c-.27-.052-2.433-.46-4.693-.207a23.36 23.36 0 0 0-1.824-3.81 18.258 18.258 0 0 1 4.587-1.295zM12 3.69c2.08 0 3.978.75 5.46 2.002a16.666 16.666 0 0 0-4.322 1.218 25.132 25.132 0 0 0-3.328-3.08A8.437 8.437 0 0 1 12 3.69zm-3.072.585a23.957 23.957 0 0 1 3.12 2.87c-3.95 1.15-7.55 1.19-8.106 1.19a8.47 8.47 0 0 1 4.986-4.06zm-5.23 5.578c.62 0 4.5-.04 8.65-1.29a24.773 24.773 0 0 1 1.706 3.538c-4.99 1.55-9.35 4.68-9.843 5.048a8.51 8.51 0 0 1-.513-7.296zm4.986 9.87c.43-.33 4.29-3.23 9.07-4.71a25.86 25.86 0 0 1 1.49 4.35 8.497 8.497 0 0 1-10.56.36zm11.758-1.503a27.606 27.606 0 0 0-1.428-4.14c2.07-.26 3.99.11 4.31.18a8.528 8.528 0 0 1-2.882 3.96z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    url: "https://instagram.com",
    icon: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    name: "Media",
    url: "https://youtube.com",
    icon: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M8 5v14l11-7z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    url: "https://linkedin.com",
    icon: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
      </svg>
    ),
  },
];

interface SocialSidebarProps {
  isLoaded?: boolean;
  onHoverChange?: (isHovered: boolean) => void;
}

const BUFFER = 100;

const SocialSidebar: React.FC<SocialSidebarProps> = ({
  isLoaded = false,
  onHoverChange,
}) => {
  const sidebarRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);

  // Entrance animation
  useGSAP(
    () => {
      if (!isLoaded) {
        gsap.set(".animate-social", { x: -25, opacity: 0 });
        return;
      }

      gsap.fromTo(
        ".animate-social",
        { x: -25, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power2.out",
          stagger: 0.1,
          delay: 0.3,
        }
      );
    },
    { dependencies: [isLoaded], scope: sidebarRef }
  );

  // Dynamic Red Circle Lens on Social Sidebar (reveals Black icons on Red)
  useGSAP(
    () => {
      const container = containerRef.current;
      const mask = maskRef.current;
      if (!container || !mask) return;

      const pos = { x: 0, y: 0, r: 0 };
      const updateClip = () => {
        mask.style.clipPath = `circle(${pos.r}px at ${pos.x}px ${pos.y}px)`;
      };

      updateClip();

      const xTo = gsap.quickTo(pos, "x", {
        duration: 0.15,
        ease: "power2.out",
        onUpdate: updateClip,
      });

      const yTo = gsap.quickTo(pos, "y", {
        duration: 0.15,
        ease: "power2.out",
        onUpdate: updateClip,
      });

      const expandCircle = (x: number, y: number) => {
        pos.x = x;
        pos.y = y;
        updateClip();
        onHoverChange?.(true);

        gsap.to(pos, {
          r: 38,
          duration: 0.35,
          ease: "power3.out",
          overwrite: "auto",
          onUpdate: updateClip,
        });
      };

      const shrinkCircle = () => {
        onHoverChange?.(false);

        gsap.to(pos, {
          r: 0,
          duration: 0.3,
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
        if (pos.r < 5) expandCircle(x, y);
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

      container.addEventListener("mousemove", onMouseMove);
      container.addEventListener("mouseenter", onMouseEnter);
      container.addEventListener("mouseleave", onMouseLeave);

      return () => {
        container.removeEventListener("mousemove", onMouseMove);
        container.removeEventListener("mouseenter", onMouseEnter);
        container.removeEventListener("mouseleave", onMouseLeave);
      };
    },
    { scope: sidebarRef }
  );

  return (
    <aside
      ref={sidebarRef}
      aria-label="Social links"
      className="hidden lg:flex fixed left-8 lg:left-12 top-1/2 -translate-y-1/2 z-40 pointer-events-auto select-none"
    >
      <div
        ref={containerRef}
        className="relative cursor-pointer"
      >
        {/* 1. Base Layer: Solid Grayish Icons (#b7ab98) */}
        <div className="flex flex-col items-center gap-7 text-[#b7ab98]">
          {SOCIAL_ITEMS.map((item) => (
            <a
              key={item.name}
              href={item.url}
              target="_blank"
              rel="noreferrer"
              aria-label={item.name}
              className="animate-social w-6 h-6 flex items-center justify-center cursor-pointer will-change-transform"
            >
              {item.icon}
            </a>
          ))}
        </div>

        {/* 2. Masked Layer: Red Circle Lens revealing Black Icons (#0c0c0c) */}
        <div
          ref={maskRef}
          className="absolute bg-[#f25536] pointer-events-none select-none z-20 will-change-[clip-path]"
          style={{
            top: -BUFFER,
            left: -BUFFER,
            right: -BUFFER,
            bottom: -BUFFER,
            clipPath: "circle(0px at 0px 0px)",
          }}
        >
          <div
            className="w-full h-full pointer-events-none select-none"
            style={{ padding: BUFFER }}
          >
            <div
              aria-hidden="true"
              className="flex flex-col items-center gap-7 text-[#0c0c0c]"
            >
              {SOCIAL_ITEMS.map((item) => (
                <div
                  key={item.name}
                  className="w-6 h-6 flex items-center justify-center"
                >
                  {item.icon}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SocialSidebar;
