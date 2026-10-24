import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import logoImg from "../../assets/Logo-transparent.png";

interface HeaderProps {
  isLoaded?: boolean;
  onHoverChange?: (isHovered: boolean) => void;
  onContactClick?: () => void;
}

const NAV_ITEMS = [
  { label: "ABOUT", href: "#about" },
  { label: "WORK", href: "#work" },
  { label: "CONTACT", href: "#contact" },
];

const Header: React.FC<HeaderProps> = ({
  isLoaded = true,
  onHoverChange,
  onContactClick,
}) => {
  const headerRef = useRef<HTMLElement>(null);
  const navContainerRef = useRef<HTMLDivElement>(null);
  const navMaskRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);

  const BUFFER = 100;

  // Track scroll position to subtly adjust header background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // GSAP entrance animation coordinated with isLoaded
  useGSAP(
    () => {
      if (!isLoaded) {
        gsap.set(".animate-header-item", { y: -25, opacity: 0 });
        return;
      }

      gsap.fromTo(
        ".animate-header-item",
        { y: -25, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.08,
          delay: 0.2,
        }
      );
    },
    { dependencies: [isLoaded], scope: headerRef }
  );

  // Dynamic Red Circle Lens on Navbar (reveals Black text on Red)
  useGSAP(
    () => {
      const container = navContainerRef.current;
      const mask = navMaskRef.current;
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
          r: 52,
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
    { scope: headerRef }
  );

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();

    if (href === "#contact") {
      if (onContactClick) {
        onContactClick();
      } else {
        const contactEl = document.getElementById("contact");
        if (contactEl) {
          contactEl.scrollIntoView({ behavior: "smooth" });
        } else {
          setContactModalOpen(true);
        }
      }
      return;
    }

    const targetEl = document.querySelector(href);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-400 select-none ${isScrolled
            ? "py-4 sm:py-5 bg-[#0e0e0e]/80 backdrop-blur-md"
            : "py-6 sm:py-8 bg-transparent"
          }`}
      >
        <div className="w-full max-w-8xl mx-auto px-6 sm:px-12 md:px-20 flex items-center justify-between">
          {/* ── LEFT: CIRCULAR ICON / CREATURE EMBLEM (Matches Reference Image) ── */}
          <a
            href="/"
            onClick={handleLogoClick}
            aria-label="Scroll to top"
            onMouseEnter={() => onHoverChange?.(true)}
            onMouseLeave={() => onHoverChange?.(false)}
            className="animate-header-item group relative inline-block cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f25536]"
          >
            <div className="w-18 h-18 sm:w-16 sm:h-16 rounded-full overflow-hidden  flex items-center justify-center p-2.5 shadow-md transition-all duration-300 group-hover:scale-110 group-hover:border-zinc-700 will-change-transform">
              <img
                src={logoImg}
                alt="VB Logo"
                className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105 select-none pointer-events-none"
              />
            </div>
          </a>

          {/* ── RIGHT: VERTICALLY STACKED NAVIGATION (2-Layer Red Circle Lens) ── */}
          <div
            ref={navContainerRef}
            className="relative cursor-pointer"
          >
            {/* 1. Base Layer: Solid Grayish text (#b7ab98) */}
            <nav
              aria-label="Main Navigation"
              className="flex flex-col items-end gap-0.5 sm:gap-1 text-right select-none"
            >
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleLinkClick(e, item.href)}
                  className="animate-header-item block py-0.5 text-xs sm:text-[13px] font-bold tracking-[0.14em] uppercase text-[#b7ab98] transition-transform duration-200 hover:-translate-x-1 will-change-transform"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* 2. Masked Layer: Red Circle Lens revealing Black text (#0c0c0c) */}
            <div
              ref={navMaskRef}
              className="absolute bg-[#f25536] pointer-events-none select-none z-20 will-change-[clip-path]"
              style={{
                top: -BUFFER,
                left: -BUFFER,
                right: -BUFFER,
                bottom: -BUFFER,
                clipPath: "circle(0px at 0px 0px)",
              }}
            >
              <div style={{ padding: BUFFER }}>
                <div
                  aria-hidden="true"
                  className="flex flex-col items-end gap-0.5 sm:gap-1 text-right select-none"
                >
                  {NAV_ITEMS.map((item) => (
                    <div
                      key={item.label}
                      className="py-0.5 text-xs sm:text-[13px] font-bold tracking-[0.14em] uppercase text-[#0c0c0c] transition-transform duration-200"
                    >
                      {item.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── MINIMAL CONTACT POPUP / DRAWER (Triggered by CONTACT link) ── */}
      {contactModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setContactModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            onMouseEnter={() => onHoverChange?.(true)}
            onMouseLeave={() => onHoverChange?.(false)}
            className="w-full max-w-lg bg-[#121212] border border-white/10 p-6 sm:p-8 rounded-sm shadow-2xl relative"
          >
            <div className="flex items-center justify-between pb-6 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#f25536] animate-pulse" />
                <h3 className="text-xs font-mono tracking-widest uppercase text-zinc-400">
                  GET IN TOUCH
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setContactModalOpen(false)}
                aria-label="Close contact dialog"
                className="text-xs font-mono text-zinc-500 hover:text-white transition-colors cursor-pointer px-2 py-1"
              >
                [ CLOSE ✕ ]
              </button>
            </div>

            <div className="py-6 space-y-4">
              <p className="text-sm leading-relaxed text-zinc-300">
                Interested in working together or exploring a new project? Reach
                out directly or drop a message below.
              </p>

              <div className="p-4 bg-white/3 border border-white/5 rounded-xs space-y-2 font-mono text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500">EMAIL</span>
                  <a
                    href="mailto:contact@vedant.dev"
                    className="text-white hover:text-[#f25536] transition-colors"
                  >
                    contact@vedant.dev
                  </a>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500">LOCATION</span>
                  <span className="text-zinc-300">Available Worldwide</span>
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
              <a
                href="mailto:contact@vedant.dev"
                className="px-6 py-2.5 bg-[#f25536] text-white font-semibold text-xs tracking-wider uppercase hover:bg-[#ff694b] transition-colors shadow-lg"
              >
                Send Email ↗
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
