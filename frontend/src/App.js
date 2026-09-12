import { useEffect } from "react";
import Lenis from "lenis";
import { Toaster } from "sonner";
import "@/App.css";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import StatsRibbon from "@/components/StatsRibbon";
import Manifesto from "@/components/Manifesto";
import Services from "@/components/Services";
import Marquee from "@/components/Marquee";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Cursor from "@/components/Cursor";

export const scrollToSection = (id) => {
  const lenis = window.__lenis;
  if (lenis) {
    lenis.scrollTo(id, { offset: -72, duration: 1.6 });
  } else {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  }
};

function App() {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.35, smoothWheel: true });
    window.__lenis = lenis;
    let raf;
    const loop = (time) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return (
    <div data-testid="app-root" className="relative bg-[#06060A] text-slate-100 min-h-screen overflow-x-clip selection:bg-cyan-500/30 selection:text-white">
      <Cursor />
      <Navbar />
      <main>
        <Hero />
        <StatsRibbon />
        <Manifesto />
        <Services />
        <Marquee />
        <Contact />
      </main>
      <Footer />
      <Toaster theme="dark" position="bottom-right" toastOptions={{ style: { background: "#0D0E15", border: "1px solid rgba(255,255,255,0.1)", color: "#F8FAFC" } }} />
    </div>
  );
}

export default App;
