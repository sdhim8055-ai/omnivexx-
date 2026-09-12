import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { scrollToSection } from "@/App";

const CASES = [
  {
    id: "01",
    client: "NexaPay",
    title: "Fintech MVP to Seed Round",
    services: ["Startup Incubation", "SaaS Engineering"],
    desc: "Took a napkin-sketch payments idea to a production MVP in 6 weeks — auth, ledger engine, KYC flow — then refined the pitch that closed the round.",
    metrics: ["6 wks to MVP", "$500K seed closed"],
    img: "https://images.unsplash.com/photo-1644088379091-d574269d422f?crop=entropy&cs=srgb&fm=jpg&q=85&w=900",
  },
  {
    id: "02",
    client: "Velvet Root",
    title: "D2C ROAS Turnaround",
    services: ["Digital ADS", "Influencer Marketing"],
    desc: "Rebuilt the funnel from creative to checkout and layered a 40-creator UGC engine on top. Ad account went from bleeding to compounding in one quarter.",
    metrics: ["0.9 → 3.1 ROAS", "90 days"],
    img: "https://images.unsplash.com/photo-1689443111130-6e9c7dfd8f9e?crop=entropy&cs=srgb&fm=jpg&q=85&w=900",
  },
  {
    id: "03",
    client: "DeltaDesk",
    title: "Algo Trading Desk Automation",
    services: ["Trading Bots", "Data Science"],
    desc: "Designed custom indicators, a backtesting harness, and a live execution bot with automated risk limits running around the clock.",
    metrics: ["<12ms execution", "87% win-rate"],
    img: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?crop=entropy&cs=srgb&fm=jpg&q=85&w=900",
  },
];

export default function CaseStudies() {
  return (
    <section id="work" data-testid="case-studies-section" className="relative bg-[#F4F7FB] px-5 py-28 sm:px-8 sm:py-36">
      <div className="mx-auto max-w-7xl">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="font-mono2 mb-6 text-xs tracking-[0.3em] text-cyan-600 uppercase"
        >
          {"// Field Notes"}
        </motion.p>
        <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="font-display max-w-2xl text-3xl font-bold leading-tight tracking-tight text-[#0B1220] sm:text-5xl lg:text-6xl"
          >
            Proof, not promises.
          </motion.h2>
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            data-testid="case-studies-sample-note"
            className="font-mono2 text-[10px] tracking-[0.2em] text-slate-400 uppercase"
          >
            Sample engagements — live results on request
          </motion.span>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {CASES.map((c, i) => (
            <motion.article
              key={c.id}
              initial={{ opacity: 0, y: 48 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.9, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              data-testid={`case-study-${c.id}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow duration-500 hover:shadow-[0_20px_60px_rgba(6,182,212,0.15)]"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={c.img}
                  alt={c.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/60 to-transparent" />
                <span className="font-mono2 absolute left-4 top-4 rounded-full bg-[#06060A]/70 px-3 py-1 text-[10px] tracking-[0.2em] text-cyan-300 uppercase backdrop-blur-sm">
                  Case {c.id}
                </span>
                <span className="font-display absolute bottom-4 left-4 text-xl font-bold text-white">
                  {c.client}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-display text-lg font-bold text-[#0B1220] sm:text-xl">{c.title}</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {c.services.map((s) => (
                    <span key={s} className="font-mono2 rounded-full border border-cyan-600/25 bg-cyan-50 px-2.5 py-0.5 text-[10px] tracking-[0.14em] text-cyan-700 uppercase">
                      {s}
                    </span>
                  ))}
                </div>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-500">{c.desc}</p>
                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                  <div className="flex gap-4">
                    {c.metrics.map((m) => (
                      <span key={m} className="font-mono2 text-xs font-bold text-[#0B1220]">{m}</span>
                    ))}
                  </div>
                  <button
                    data-testid={`case-study-cta-${c.id}`}
                    onClick={() => scrollToSection("#contact")}
                    aria-label={`Discuss a project like ${c.title}`}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-cyan-600/40 text-cyan-700 transition-all duration-300 hover:bg-cyan-500 hover:text-white"
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
