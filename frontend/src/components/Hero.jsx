import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { scrollToSection } from "@/App";

const LINES = [
  { text: "WE ENGINEER", accent: false },
  { text: "DIGITAL", accent: true },
  { text: "DOMINANCE.", accent: false },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.35 } },
};

const lineReveal = {
  hidden: { y: "115%" },
  show: { y: "0%", transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] } },
};

export default function Hero() {
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const sy = useSpring(my, { stiffness: 60, damping: 20 });
  const glowX = useTransform(sx, [0, 1], ["-12%", "12%"]);
  const glowY = useTransform(sy, [0, 1], ["-8%", "8%"]);
  const gridX = useTransform(sx, [0, 1], [18, -18]);
  const gridY = useTransform(sy, [0, 1], [12, -12]);

  const onMouseMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };

  return (
    <section
      id="hero"
      data-testid="hero-section"
      onMouseMove={onMouseMove}
      className="noise relative flex min-h-screen flex-col justify-center overflow-hidden pt-24"
    >
      <motion.div style={{ x: gridX, y: gridY }} className="bg-grid absolute -inset-10 opacity-80" />
      <motion.div
        style={{ x: glowX, y: glowY }}
        className="absolute inset-0"
      >
        <div className="absolute left-1/2 top-[-20%] h-[70vh] w-[90vw] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.22),rgba(168,85,247,0.08),transparent_70%)] blur-2xl" />
      </motion.div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-8">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          data-testid="hero-eyebrow"
          className="font-mono2 mb-8 text-xs tracking-[0.3em] text-cyan-400 uppercase sm:text-sm"
        >
          {"// Omnivexx — Tech Service Agency"}
        </motion.p>

        <motion.h1
          variants={container}
          initial="hidden"
          animate="show"
          data-testid="hero-title"
          className="font-display text-5xl font-extrabold leading-[0.92] tracking-tighter sm:text-7xl lg:text-[7.5rem]"
        >
          {LINES.map((l, i) => (
            <span key={i} className="block overflow-hidden pb-1">
              <motion.span
                variants={lineReveal}
                className={`block ${l.accent ? "gradient-text" : "text-white"}`}
              >
                {l.text}
              </motion.span>
            </span>
          ))}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.05 }}
          data-testid="hero-subtitle"
          className="mt-8 max-w-xl text-sm leading-relaxed text-slate-400 sm:text-lg"
        >
          Seven disciplines. One machine. From algorithmic trading bots to
          full-scale SaaS and startup incubation — we build the systems that
          make brands unavoidable.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.2 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <button
            data-testid="hero-explore-button"
            onClick={() => scrollToSection("#services")}
            className="group flex items-center gap-2 rounded-full bg-cyan-400 px-7 py-3.5 font-mono2 text-sm font-bold tracking-[0.12em] text-[#06060A] uppercase transition-all duration-300 hover:bg-white hover:shadow-[0_0_40px_rgba(6,182,212,0.4)]"
          >
            Explore Ecosystem
            <ArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-1" />
          </button>
          <button
            data-testid="hero-contact-button"
            onClick={() => scrollToSection("#contact")}
            className="group flex items-center gap-2 rounded-full border border-white/20 px-7 py-3.5 font-mono2 text-sm font-bold tracking-[0.12em] text-white uppercase transition-colors duration-300 hover:border-cyan-400 hover:text-cyan-400"
          >
            Contact Founder
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="font-mono2 text-[10px] tracking-[0.3em] text-slate-500 uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="h-10 w-px bg-gradient-to-b from-cyan-400 to-transparent"
          />
        </div>
      </motion.div>
    </section>
  );
}
