import { useEffect } from "react";
import Lenis from "lenis";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import "@/App.css";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import StatsRibbon from "@/components/StatsRibbon";
import Manifesto from "@/components/Manifesto";
import Services from "@/components/Services";
import CaseStudies from "@/components/CaseStudies";
import Marquee from "@/components/Marquee";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Cursor from "@/components/Cursor";
import ChatWidget from "@/components/ChatWidget";
import Admin from "@/pages/Admin";
import ServiceDetail from "@/pages/ServiceDetail";
import { trackEvent } from "@/lib/track";

export const scrollToSection = (id) => {
  const lenis = window.__lenis;
  if (lenis) {
    lenis.scrollTo(id, { offset: -72, duration: 1.6 });
  } else {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  }
};

function Home() {
  useEffect(() => {
    trackEvent("pageview", "ovx_pv");
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
      window.__lenis = null;
    };
  }, []);

  useEffect(() => {
    if (window.location.hash) {
      const t = setTimeout(() => scrollToSection(window.location.hash), 600);
      return () => clearTimeout(t);
    }
  }, []);

  return (
    <div data-testid="app-root" className="relative bg-[#06060A] min-h-screen overflow-x-clip selection:bg-violet-500/30">
      <Cursor />
      <Navbar />
      <main>
        <Hero />
        <StatsRibbon />
        <Manifesto />
        <Services />
        <CaseStudies />
        <Marquee />
        <Contact />
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services/:slug" element={<ServiceDetail />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
      <Toaster theme="dark" position="bottom-right" toastOptions={{ style: { background: "#0D0E15", border: "1px solid rgba(255,255,255,0.1)", color: "#F8FAFC" } }} />
    </BrowserRouter>
  );
}

export default App;
