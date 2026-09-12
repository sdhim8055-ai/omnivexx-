import { motion } from "framer-motion";
import { ArrowUpRight, Hexagon } from "lucide-react";
import { scrollToSection } from "@/App";

const LINKS = [
  { label: "Services", href: "#services", testid: "navbar-services-link" },
  { label: "Manifesto", href: "#manifesto", testid: "navbar-about-link" },
  { label: "Contact", href: "#contact", testid: "navbar-contact-link" },
];

export default function Navbar() {
  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#06060A]/80 backdrop-blur-md"
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <button
          data-testid="navbar-logo-link"
          onClick={() => scrollToSection("#hero")}
          className="flex items-center gap-2.5"
        >
          <Hexagon className="h-6 w-6 text-cyan-400" strokeWidth={1.5} />
          <span className="font-display text-lg font-extrabold tracking-[0.18em] text-white">
            OMNIVEXX
          </span>
        </button>

        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <button
              key={l.label}
              data-testid={l.testid}
              onClick={() => scrollToSection(l.href)}
              className="font-mono2 text-xs tracking-[0.22em] text-slate-400 uppercase transition-colors duration-300 hover:text-cyan-400"
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
            onClick={() => scrollToSection("#contact")}
            className="group flex items-center gap-1.5 rounded-full bg-cyan-400 px-4 py-2 font-mono2 text-xs font-bold tracking-[0.14em] text-[#06060A] uppercase transition-colors duration-300 hover:bg-white"
          >
            Initiate Project
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </nav>
    </motion.header>
  );
}
