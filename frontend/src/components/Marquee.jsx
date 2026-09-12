const WORDS = [
  "ALGORITHMIC TRADING",
  "SAAS INCUBATION",
  "DATA SCIENCE",
  "DIGITAL ADS",
  "INFLUENCER DOMINANCE",
  "SOCIAL FARMING",
  "STARTUP INCUBATION",
];

export default function Marquee() {
  const row = [...WORDS, ...WORDS];
  return (
    <section data-testid="editorial-marquee" className="relative overflow-hidden border-y border-white/10 py-10 sm:py-14">
      <div className="animate-marquee-slow flex w-max items-center gap-10 whitespace-nowrap">
        {row.map((w, i) => (
          <span key={i} className="flex items-center gap-10">
            <span
              className={`font-display text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl ${
                i % 2 === 0 ? "text-outline" : "text-white"
              }`}
            >
              {w}
            </span>
            <span className="h-2.5 w-2.5 rotate-45 bg-cyan-400" />
          </span>
        ))}
      </div>
    </section>
  );
}
