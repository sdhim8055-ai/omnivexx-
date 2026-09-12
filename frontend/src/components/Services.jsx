import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ArrowUpRight } from "lucide-react";
import { scrollToSection } from "@/App";
import { SERVICE_SLUGS } from "@/data/services";

const SERVICES = [
  { id: "01", title: "Digital ADS & Marketing", tag: "PERFORMANCE", metric: "3.1x Avg ROAS", desc: "High-velocity targeted campaigns, multi-channel performance scaling, and conversion funnels engineered for maximum return on ad spend.", stack: ["Meta Ads", "Google Ads", "Funnel CRO", "Attribution"] },
  { id: "02", title: "Influencer Marketing", tag: "REACH", metric: "5M+ Impressions", desc: "Data-backed creator matchmaking, viral outreach algorithms, and campaign orchestration across tier-1 global influencers.", stack: ["Creator CRM", "Viral Loops", "UGC Engines", "Analytics"] },
  { id: "03", title: "Data Science & Structure Management", tag: "INFRASTRUCTURE", metric: "99.9% Reliability", desc: "Enterprise data pipelines, warehousing architecture, predictive analytics, and automated telemetry systems.", stack: ["Pipelines", "Warehousing", "ML Models", "Dashboards"] },
  { id: "04", title: "Trading Indicators & Bots", tag: "QUANT & ALGO", metric: "<12ms Execution", desc: "Algorithmic execution strategies, custom PineScript/Python indicators, high-frequency bot engines, and risk management automation.", stack: ["PineScript", "Python", "Backtesting", "Risk Engine"] },
  { id: "05", title: "Social Media Farming", tag: "DOMINANCE", metric: "10x Engagement", desc: "Autonomous audience cultivation, multi-platform account authority building, and algorithmic engagement amplification.", stack: ["Automation", "Multi-Platform", "Growth Loops", "Authority"] },
  { id: "06", title: "SaaS Engineering", tag: "FULL-STACK", metric: "Sub-100ms APIs", desc: "Full-stack cloud applications, scalable microservices, seamless UX/UI design, and high-concurrency architecture.", stack: ["React", "FastAPI", "Cloud Native", "Microservices"] },
  { id: "07", title: "Startup Incubation", tag: "VENTURE BUILD", metric: "3+ Ventures", desc: "End-to-end venture acceleration, MVP sprint building, technical co-founding support, and pitch deck refinement.", stack: ["MVP Sprints", "Tech Co-Found", "GTM Strategy", "Pitch"] },
];

export default function Services() {
  const [open, setOpen] = useState("01");

  const bookService = (title) => {
    window.dispatchEvent(new CustomEvent("prefill-service", { detail: title }));
    scrollToSection("#contact");
  };

  return (
    <section id="services" data-testid="services-section" className="relative bg-white px-5 py-28 sm:px-8 sm:py-36">
      <div className="mx-auto max-w-7xl">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="font-mono2 mb-6 text-xs tracking-[0.3em] text-violet-600 uppercase"
        >
          {"// Capabilities Index"}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="font-display mb-16 max-w-3xl text-3xl font-bold leading-tight tracking-tight text-[#0B1220] sm:text-5xl lg:text-6xl"
        >
          Seven disciplines.
          <span className="text-slate-400"> One operating system for growth.</span>
        </motion.h2>

        <div className="border-t border-slate-200">
          {SERVICES.map((s, i) => {
            const isOpen = open === s.id;
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.7, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                data-testid={`service-card-${s.id}`}
                className={`group border-b border-slate-200 transition-colors duration-500 ${isOpen ? "bg-slate-50" : "hover:bg-slate-50/70"}`}
              >
                <button
                  data-testid={`service-toggle-${s.id}`}
                  onClick={() => setOpen(isOpen ? null : s.id)}
                  className="flex w-full items-center gap-5 px-2 py-7 text-left sm:gap-10 sm:px-6 sm:py-9"
                >
                  <span className={`font-mono2 text-sm transition-colors duration-300 ${isOpen ? "text-violet-600" : "text-slate-400 group-hover:text-violet-600"}`}>
                    {s.id}
                  </span>
                  <span className={`font-display flex-1 text-lg font-bold tracking-tight transition-all duration-500 sm:text-3xl lg:text-4xl ${isOpen ? "gradient-text" : "text-[#0B1220] group-hover:translate-x-2"}`}>
                    {s.title}
                  </span>
                  <span className="font-mono2 hidden rounded-full border border-slate-200 px-3 py-1 text-[10px] tracking-[0.2em] text-slate-500 uppercase md:block">
                    {s.tag}
                  </span>
                  <Plus className={`h-5 w-5 shrink-0 text-violet-600 transition-transform duration-500 ${isOpen ? "rotate-45" : ""}`} />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="grid gap-8 px-2 pb-10 sm:grid-cols-[1.4fr_1fr] sm:px-6 sm:pl-[7.5rem]">
                        <div>
                          <p className="max-w-xl text-sm leading-relaxed text-slate-500 sm:text-base">{s.desc}</p>
                          <div className="mt-6 flex flex-wrap gap-2">
                            {s.stack.map((t) => (
                              <span key={t} className="font-mono2 rounded-full border border-violet-600/25 bg-violet-50 px-3 py-1 text-[10px] tracking-[0.16em] text-violet-700 uppercase">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-col items-start justify-between gap-6 sm:items-end">
                          <div className="sm:text-right">
                            <span className="font-mono2 block text-3xl font-black text-[#0B1220] sm:text-4xl">{s.metric}</span>
                            <span className="font-mono2 mt-1 block text-[10px] tracking-[0.2em] text-slate-400 uppercase">Key Metric</span>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 sm:justify-end">
                            <a
                              data-testid={`service-details-${s.id}`}
                              href={`/services/${SERVICE_SLUGS[s.title]}`}
                              className="font-mono2 text-xs font-bold tracking-[0.14em] text-slate-500 uppercase underline decoration-violet-400/60 underline-offset-4 transition-colors duration-300 hover:text-violet-600"
                            >
                              Full Breakdown
                            </a>
                            <button
                              data-testid={`service-book-${s.id}`}
                              onClick={() => bookService(s.title)}
                              className="group/btn flex items-center gap-2 rounded-full border border-violet-600/40 px-5 py-2.5 font-mono2 text-xs font-bold tracking-[0.14em] text-violet-700 uppercase transition-all duration-300 hover:bg-violet-500 hover:text-white"
                            >
                              Deploy This
                              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
