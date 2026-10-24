import { useEffect, useState } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// import Loader from "./components/loader/Loader";
import Hero from "./components/pages/Home/Hero";
import About from "./components/pages/About/About";
import Experience from "./components/pages/Experience/Experience";
import WhatICanDo from "./components/pages/WhatICanDo/WhatICanDo";
import WorkShowcase from "./components/pages/Work/WorkShowcase";
import ClientReviews from "./components/pages/ClientReviews/ClientReviews";
import CursorFollower from "./components/cursor/CursorFollower";
import Client from "./components/pages/ClientReviews/Client";
import Header from "./components/header/Header";
import SocialSidebar from "./components/social/SocialSidebar";
import Loader from "./components/loader/Loader";
gsap.registerPlugin(ScrollTrigger);

function App() {
  const [cursorHidden, setCursorHidden] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Prevent scrolling while loader is running
  useEffect(() => {
    if (!isLoaded) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isLoaded]);

  useEffect(() => {
    // Initialize Lenis smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    // Synchronize Lenis scroll positions with GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // Drive Lenis RAF loop via GSAP's high-precision ticker
    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
    };
  }, []);

  return (
    <main className="w-full min-h-screen overflow-x-hidden relative selection:bg-[#f25536] selection:text-white">
      <Loader onComplete={() => setIsLoaded(true)} />
      {/* ── ONE UNIFIED CURSOR FOLLOWER FOR ENTIRE SITE ── */}
      <CursorFollower hidden={cursorHidden || !isLoaded} />

      {/* ── PERSISTENT SITE HEADER ── */}
      <Header isLoaded={isLoaded} onHoverChange={setCursorHidden} />

      {/* ── PERSISTENT SOCIAL LINKS LAYER (VISIBLE EVERYWHERE) ── */}
      <SocialSidebar isLoaded={isLoaded} onHoverChange={setCursorHidden} />

      {/* Hero Section */}
      <Hero isLoaded={isLoaded} onHoverChange={setCursorHidden} />

      {/* About Section */}
      <About onHoverChange={setCursorHidden} />

      {/* Experience Section */}
      <Experience onHoverChange={setCursorHidden} />

      {/* What I Can Do Section */}
      <WhatICanDo onHoverChange={setCursorHidden} />

      {/* Work / Projects Showcase Section */}
      <WorkShowcase onHoverChange={setCursorHidden} />

      {/* Client Section */}
      <Client onHoverChange={setCursorHidden} />

      {/* Client Reviews Section */}
      <ClientReviews onHoverChange={setCursorHidden} />
    </main>
  );
}

export default App;
