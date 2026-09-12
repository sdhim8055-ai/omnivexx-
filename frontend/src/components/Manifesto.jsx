import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const CHAPTERS = [
  {
    id: "01",
    title: "Relentless Precision",
    body: "Every campaign, pipeline, and line of code is engineered to a measurable outcome. We don't guess — we instrument, test, and compound what works.",
  },
  {
    id: "02",
    title: "Code Meets Capital",
    body: "From trading bots executing in under 12ms to ad funnels printing ROAS, we treat software as a financial instrument — built to generate, not decorate.",
  },
  {
    id: "03",
    title: "Autonomous Dominance",
    body: "Social farming networks, data infrastructure, SaaS engines — systems that run while you sleep and scale while you grow.",
  },
];

export default function Manifesto() {
  const imgRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: imgRef, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section id="manifesto" data-testid="manifesto-section" className="relative mx-auto max-w-7xl px-5 py-28 sm:px-8 sm:py-40">
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="font-mono2 mb-6 text-xs tracking-[0.3em] text-cyan-400 uppercase"
      >
        {"// The Manifesto"}
      </motion.p>

      <div className="grid gap-16 lg:grid-cols-[1.2fr_1fr] lg:gap-24">
        <div>
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="font-display mb-16 text-3xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            Built like an engine.
            <br />
            <span className="text-slate-500">Run like a machine.</span>
          </motion.h2>

          <div className="space-y-0">
            {CHAPTERS.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, x: -32 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.8, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                data-testid={`manifesto-chapter-${c.id}`}
                className="group border-t border-white/10 py-10 transition-colors duration-500 hover:border-cyan-400/40"
              >
                <div className="flex items-baseline gap-6">
                  <span className="font-mono2 text-sm text-cyan-400">CH.{c.id}</span>
                  <div>
                    <h3 className="font-display text-xl font-bold text-white transition-colors duration-300 group-hover:text-cyan-300 sm:text-3xl">
                      {c.title}
                    </h3>
                    <p className="mt-4 max-w-lg text-sm leading-relaxed text-slate-400 sm:text-base">
                      {c.body}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-10">
          <motion.div
            ref={imgRef}
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/10"
          >
            <motion.img
              style={{ y: imgY }}
              src="https://images.unsplash.com/photo-1546146477-15a587cd3fcb?crop=entropy&cs=srgb&fm=jpg&q=85&w=900"
              alt="Cyber tunnel infrastructure"
              className="absolute inset-0 h-[120%] w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#06060A] via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5">
              <span className="font-mono2 text-[10px] tracking-[0.24em] text-cyan-400 uppercase">
                Fig. 01 — The Machine Room
              </span>
            </div>
          </motion.div>

          <motion.blockquote
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            data-testid="founder-quote"
            className="rounded-2xl border border-white/10 bg-[#0D0E15]/75 p-8 backdrop-blur-xl"
          >
            <p className="font-display text-lg font-semibold leading-snug text-white sm:text-2xl">
              "Most agencies sell hours. We ship autonomous systems that
              compound attention into revenue."
            </p>
            <footer className="mt-6 flex items-center gap-3">
              <div className="h-px w-8 bg-cyan-400" />
              <span className="font-mono2 text-xs tracking-[0.18em] text-slate-400 uppercase">
                Dhimant S Reddy — Founder
              </span>
            </footer>
          </motion.blockquote>
        </div>
      </div>
    </section>
  );
}
