import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Hexagon, Menu, X } from "lucide-react";
import { scrollToSection } from "@/App";

const LINKS = [
  { label: "Services", href: "#services", testid: "navbar-services-link" },
  { label: "Work", href: "#work", testid: "navbar-work-link" },
  { label: "Manifesto", href: "#manifesto", testid: "navbar-about-link" },
  { label: "Contact", href: "#contact", testid: "navbar-contact-link" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const go = (href) => {
    setMenuOpen(false);
    setTimeout(() => scrollToSection(href), 80);
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#06060A]/80 backdrop-blur-md"
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <button
            data-testid="navbar-logo-link"
            onClick={() => go("#hero")}
            className="flex items-center gap-2.5"
          >
            <Hexagon className="h-6 w-6 text-violet-400" strokeWidth={1.5} />
            <span className="font-display text-lg font-extrabold tracking-[0.18em] text-white">
              OMNIVEXX
            </span>
          </button>

          <div className="hidden items-center gap-8 md:flex">
            {LINKS.map((l) => (
              <button
                key={l.label}
                data-testid={l.testid}
                onClick={() => go(l.href)}
                className="font-mono2 text-xs tracking-[0.22em] text-slate-400 uppercase transition-colors duration-300 hover:text-violet-300"
              >
                {l.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div
              data-testid="navbar-status-indicator"
              className="hidden items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 lg:flex"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-dot" />
              <span className="font-mono2 text-[10px] tracking-[0.18em] text-slate-400 uppercase">
                Open for Q3/Q4 Projects
              </span>
            </div>
            <button
              data-testid="navbar-cta-button"
              onClick={() => go("#contact")}
              className="group hidden items-center gap-1.5 rounded-full bg-violet-500 px-4 py-2 font-mono2 text-xs font-bold tracking-[0.14em] text-white uppercase transition-colors duration-300 hover:bg-white hover:text-[#0A0614] sm:flex"
            >
              Initiate Project
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
            <button
              data-testid="mobile-menu-toggle"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:border-violet-400 hover:text-violet-300 md:hidden"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            data-testid="mobile-menu"
            className="noise fixed inset-0 z-40 flex flex-col justify-center bg-[#0A0614]/97 px-8 backdrop-blur-xl md:hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-10%,rgba(168,85,247,0.25),transparent_60%)]" />
            <nav className="relative flex flex-col gap-2">
              {LINKS.map((l, i) => (
                <motion.button
                  key={l.label}
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.5, delay: 0.08 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  data-testid={`mobile-menu-${l.label.toLowerCase()}-link`}
                  onClick={() => go(l.href)}
                  className="group flex items-baseline gap-4 py-3 text-left"
                >
                  <span className="font-mono2 text-xs text-violet-400">0{i + 1}</span>
                  <span className="font-display text-4xl font-extrabold tracking-tight text-white transition-colors group-hover:text-violet-300">
                    {l.label}
                  </span>
                </motion.button>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="relative mt-12 flex flex-col gap-5"
            >
              <button
                data-testid="mobile-menu-cta-button"
                onClick={() => go("#contact")}
                className="flex w-fit items-center gap-2 rounded-full bg-violet-500 px-7 py-3.5 font-mono2 text-sm font-bold tracking-[0.12em] text-white uppercase"
              >
                Initiate Project
                <ArrowUpRight className="h-4 w-4" />
              </button>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-dot" />
                <span className="font-mono2 text-[10px] tracking-[0.2em] text-slate-500 uppercase">Open for Q3/Q4 Projects</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
