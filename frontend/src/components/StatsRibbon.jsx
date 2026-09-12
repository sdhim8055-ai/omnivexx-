import { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "framer-motion";

const STATS = [
  { value: 7, suffix: "", label: "Core Disciplines", testid: "stat-disciplines" },
  { value: 250, prefix: "$", suffix: "K+", label: "Ad Spend Managed", testid: "stat-revenue" },
  { value: 87, suffix: "%", label: "Bot Win-Rate", testid: "stat-winrate" },
  { value: 24, suffix: "/7", label: "Global Operations", testid: "stat-ops" },
];

function Counter({ value, prefix = "", suffix = "", decimals = 0, testid }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 2.2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [inView, value]);

  return (
    <span ref={ref} data-testid={testid} className="font-mono2 text-4xl font-black tracking-tighter text-[#0B1220] sm:text-6xl lg:text-7xl">
      {prefix}
      {display.toFixed(decimals)}
      <span className="text-violet-600">{suffix}</span>
    </span>
  );
}

export default function StatsRibbon() {
  return (
    <section data-testid="stats-ribbon" className="relative border-b border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-slate-200 lg:grid-cols-4">
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-3 px-6 py-10 sm:px-10 sm:py-14"
          >
            <Counter value={s.value} prefix={s.prefix} suffix={s.suffix} decimals={s.decimals} testid={s.testid} />
            <span className="font-mono2 text-[10px] tracking-[0.24em] text-slate-500 uppercase sm:text-xs">
              {s.label}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
