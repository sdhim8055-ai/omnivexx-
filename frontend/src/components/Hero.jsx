import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useScroll } from "framer-motion";
import { ArrowDown, ArrowUpRight, Sparkles } from "lucide-react";
import { scrollToSection } from "@/App";

const ROTATING = [
  "Digital ADS & Marketing",
  "Influencer Marketing",
  "Data Science",
  "Trading Bots & Indicators",
  "Social Media Farming",
  "SaaS Engineering",
  "Startup Incubation",
];

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

const ORBS = [
  { size: 420, color: "rgba(168,85,247,0.35)", top: "-10%", left: "-8%", dur: 14 },
  { size: 320, color: "rgba(196,181,253,0.28)", top: "40%", left: "70%", dur: 18 },
  { size: 260, color: "rgba(232,121,249,0.22)", top: "65%", left: "12%", dur: 16 },
];

export default function Hero() {
  const sectionRef = useRef(null);
  const [rotIdx, setRotIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setRotIdx((i) => (i + 1) % ROTATING.length), 2800);
    return () => clearInterval(t);
  }, []);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const sy = useSpring(my, { stiffness: 60, damping: 20 });
  const glowX = useTransform(sx, [0, 1], ["-14%", "14%"]);
  const glowY = useTransform(sy, [0, 1], ["-10%", "10%"]);
  const ringX = useTransform(sx, [0, 1], [30, -30]);
  const ringY = useTransform(sy, [0, 1], [20, -20]);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -140]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.25]);
  const gridYScroll = useTransform(scrollYProgress, [0, 1], [0, 120]);

  const onMouseMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };

  return (
    <section
      id="hero"
      ref={sectionRef}
      data-testid="hero-section"
      onMouseMove={onMouseMove}
      className="noise relative flex min-h-screen flex-col justify-center overflow-hidden bg-[#0A0614] pt-24"
    >
      {/* parallax grid */}
      <motion.div style={{ y: gridYScroll, scale: bgScale }} className="absolute -inset-10">
        <div className="bg-grid absolute inset-0 opacity-70" />
      </motion.div>

      {/* mouse-parallax aurora glow */}
      <motion.div style={{ x: glowX, y: glowY }} className="absolute inset-0">
        <div className="absolute left-1/2 top-[-25%] h-[80vh] w-[95vw] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.35),rgba(196,181,253,0.12),transparent_70%)] blur-3xl" />
      </motion.div>

      {/* floating lavender orbs */}
      {ORBS.map((o, i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -36, 0], x: [0, 22, 0] }}
          transition={{ duration: o.dur, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute rounded-full blur-3xl"
          style={{ width: o.size, height: o.size, background: o.color, top: o.top, left: o.left }}
        />
      ))}

      {/* rotating orbital ring reacting to cursor */}
      <motion.div
        style={{ x: ringX, y: ringY }}
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
          className="h-[130vmin] w-[130vmin] rounded-full border border-dashed border-violet-400/15"
        />
      </motion.div>
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[90vmin] w-[90vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border border-fuchsia-400/10"
      />

      {/* shooting shimmer beam */}
      <motion.div
        animate={{ x: ["-20vw", "120vw"] }}
        transition={{ duration: 9, repeat: Infinity, repeatDelay: 5, ease: "easeInOut" }}
        className="pointer-events-none absolute top-[22%] h-px w-[30vw] bg-gradient-to-r from-transparent via-violet-300/60 to-transparent"
      />

      <motion.div style={{ y: contentY, opacity: contentOpacity }} className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="mb-8 flex items-center gap-3"
        >
          <Sparkles className="h-4 w-4 text-violet-300" />
          <p
            data-testid="hero-eyebrow"
            className="font-mono2 text-xs tracking-[0.3em] text-violet-300 uppercase sm:text-sm"
          >
            {"// Omnivexx — Tech Service Agency"}
          </p>
        </motion.div>

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
                className={`block ${l.accent ? "gradient-text-lavender drop-shadow-[0_0_30px_rgba(168,85,247,0.35)]" : "text-white"}`}
              >
                {l.text}
              </motion.span>
            </span>
          ))}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.15 }}
          className="mt-7 flex items-center gap-3"
        >
          <span className="font-mono2 text-xs tracking-[0.28em] text-violet-300/60 uppercase sm:text-sm">
            {"// Deploying"}
          </span>
          <span className="inline-flex h-7 items-center overflow-hidden sm:h-8">
            <AnimatePresence mode="wait">
              <motion.span
                key={ROTATING[rotIdx]}
                initial={{ y: 26, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -26, opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                data-testid="hero-rotating-headline"
                className="gradient-text-lavender font-display text-lg font-bold tracking-tight sm:text-2xl"
              >
                {ROTATING[rotIdx]}
              </motion.span>
            </AnimatePresence>
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.05 }}
          data-testid="hero-subtitle"
          className="mt-8 max-w-xl text-sm leading-relaxed text-violet-200/70 sm:text-lg"
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
            className="group flex items-center gap-2 rounded-full bg-violet-500 px-7 py-3.5 font-mono2 text-sm font-bold tracking-[0.12em] text-white uppercase transition-all duration-300 hover:bg-violet-400 hover:shadow-[0_0_50px_rgba(168,85,247,0.5)]"
          >
            Explore Ecosystem
            <ArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-1" />
          </button>
          <button
            data-testid="hero-contact-button"
            onClick={() => scrollToSection("#contact")}
            className="group flex items-center gap-2 rounded-full border border-violet-300/30 px-7 py-3.5 font-mono2 text-sm font-bold tracking-[0.12em] text-violet-200 uppercase transition-colors duration-300 hover:border-violet-300 hover:text-white"
          >
            Contact Founder
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="font-mono2 text-[10px] tracking-[0.3em] text-violet-300/60 uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="h-10 w-px bg-gradient-to-b from-violet-400 to-transparent"
          />
        </div>
      </motion.div>
    </section>
  );
}
