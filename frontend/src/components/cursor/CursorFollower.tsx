import { useEffect, useRef } from "react";
import gsap from "gsap";

interface CursorFollowerProps {
  hidden?: boolean;
}

const CursorFollower = ({ hidden = false }: CursorFollowerProps) => {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cursorRef.current;
    if (!el) return;

    gsap.set(el, {
      xPercent: -50,
      yPercent: -50,
    });

    const xTo = gsap.quickTo(el, "x", {
      duration: 0.18,
      ease: "power2.out",
    });

    const yTo = gsap.quickTo(el, "y", {
      duration: 0.18,
      ease: "power2.out",
    });

    const onMouseMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    window.addEventListener("mousemove", onMouseMove);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  useEffect(() => {
    if (!cursorRef.current) return;
    gsap.to(cursorRef.current, {
      autoAlpha: hidden ? 0 : 1,
      scale: hidden ? 0.3 : 1,
      duration: 0.25,
      ease: "power2.out",
    });
  }, [hidden]);

  return (
    <div
      ref={cursorRef}
      className="w-7 h-7 rounded-full fixed top-0 left-0 bg-[#f25536] pointer-events-none z-50 will-change-transform shadow-[0_0_15px_rgba(242,85,54,0.3)] hidden sm:block"
    />
  );
};

export default CursorFollower;
