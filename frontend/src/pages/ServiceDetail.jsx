import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Hexagon, Minus, Plus } from "lucide-react";
import { SERVICES_DATA } from "@/data/services";

const fadeUp = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
};

export default function ServiceDetail() {
  const { slug } = useParams();
  const service = SERVICES_DATA.find((s) => s.slug === slug);
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    if (!service) return;
    document.title = service.seoTitle;
    const setMeta = (key, content, prop = false) => {
      const attr = prop ? "property" : "name";
      let tag = document.querySelector(`meta[${attr}="${key}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attr, key);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };
    setMeta("description", service.seoDescription);
    setMeta("og:title", service.seoTitle, true);
    setMeta("og:description", service.seoDescription, true);
    return () => {
      document.title = "Omnivexx — Tech Service Agency";
    };
  }, [service]);

  if (!service) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#0A0614] text-white">
        <p className="font-mono2 text-sm tracking-[0.2em] text-slate-400 uppercase">Service not found</p>
        <a data-testid="service-not-found-home-link" href="/" className="rounded-full bg-violet-500 px-6 py-3 font-mono2 text-xs font-bold tracking-[0.14em] uppercase">
          Back to Home
        </a>
      </div>
    );
  }

  return (
    <div data-testid="service-detail-page" className="min-h-screen bg-[#F4F7FB]">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#06060A]/80 backdrop-blur-md">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <a data-testid="service-detail-logo-link" href="/" className="flex items-center gap-2.5">
            <Hexagon className="h-6 w-6 text-violet-400" strokeWidth={1.5} />
            <span className="font-display text-lg font-extrabold tracking-[0.18em] text-white">OMNIVEXX</span>
          </a>
          <a
            data-testid="service-detail-back-link"
            href="/#services"
            className="flex items-center gap-2 font-mono2 text-xs tracking-[0.2em] text-slate-400 uppercase transition-colors hover:text-violet-300"
          >
            <ArrowLeft className="h-4 w-4" /> All Services
          </a>
        </nav>
      </header>

      <section className="noise relative overflow-hidden bg-[#0A0614] px-5 pb-20 pt-36 sm:px-8 sm:pt-44">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-20%,rgba(168,85,247,0.3),transparent_65%)]" />
        <div className="relative mx-auto max-w-7xl">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="font-mono2 mb-6 text-xs tracking-[0.3em] text-violet-300 uppercase"
          >
            {`// Service ${service.id} — ${service.tag}`}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            data-testid="service-detail-title"
            className="font-display max-w-4xl text-4xl font-extrabold leading-[0.95] tracking-tighter text-white sm:text-6xl lg:text-7xl"
          >
            <span className="gradient-text-lavender">{service.title}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-6 max-w-2xl text-base leading-relaxed text-violet-200/70 sm:text-lg"
          >
            {service.tagline} {service.about}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <span data-testid="service-detail-metric" className="font-mono2 rounded-full border border-violet-400/30 bg-violet-400/10 px-4 py-2 text-xs font-bold tracking-[0.16em] text-violet-300 uppercase">
              {service.metric}
            </span>
            <a
              data-testid="service-detail-cta-button"
              href="/#contact"
              className="group flex items-center gap-2 rounded-full bg-violet-500 px-7 py-3.5 font-mono2 text-sm font-bold tracking-[0.12em] text-white uppercase transition-all duration-300 hover:bg-white hover:text-[#0A0614] hover:shadow-[0_0_50px_rgba(168,85,247,0.5)]"
            >
              Start This Service
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </motion.div>
        </div>
      </section>

      <section data-testid="service-process-section" className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
        <motion.p {...fadeUp} className="font-mono2 mb-4 text-xs tracking-[0.3em] text-violet-600 uppercase">
          {"// The Process"}
        </motion.p>
        <motion.h2 {...fadeUp} className="font-display mb-14 text-3xl font-bold tracking-tight text-[#0B1220] sm:text-5xl">
          How we run it.
        </motion.h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {service.process.map((p, i) => (
            <motion.div
              key={p.step}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              data-testid={`process-step-${p.step}`}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-500 hover:border-violet-400/50 hover:shadow-[0_16px_50px_rgba(168,85,247,0.15)]"
            >
              <span className="font-mono2 text-3xl font-black text-violet-500">{p.step}</span>
              <h3 className="font-display mt-4 text-lg font-bold text-[#0B1220]">{p.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-500">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section data-testid="service-pricing-section" className="border-y border-slate-200 bg-white px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.p {...fadeUp} className="font-mono2 mb-4 text-xs tracking-[0.3em] text-violet-600 uppercase">
            {"// Investment Guide"}
          </motion.p>
          <motion.h2 {...fadeUp} className="font-display mb-4 text-3xl font-bold tracking-tight text-[#0B1220] sm:text-5xl">
            Pricing hints.
          </motion.h2>
          <motion.p {...fadeUp} className="mb-14 max-w-xl text-sm text-slate-500 sm:text-base">
            Every engagement is scoped to your goals — these ranges show where projects typically land.
          </motion.p>
          <div className="grid gap-6 md:grid-cols-3">
            {service.pricing.map((tier, i) => (
              <motion.div
                key={tier.label}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                data-testid={`pricing-tier-${i}`}
                className={`rounded-2xl border p-8 transition-all duration-500 ${
                  i === 1
                    ? "border-violet-500/50 bg-gradient-to-b from-violet-50 to-white shadow-[0_16px_50px_rgba(168,85,247,0.18)]"
                    : "border-slate-200 bg-[#F4F7FB] hover:border-violet-400/40"
                }`}
              >
                {i === 1 && (
                  <span className="font-mono2 mb-4 inline-block rounded-full bg-violet-500 px-3 py-1 text-[10px] font-bold tracking-[0.16em] text-white uppercase">
                    Most Popular
                  </span>
                )}
                <h3 className="font-display text-xl font-bold text-[#0B1220]">{tier.label}</h3>
                <p className="font-mono2 mt-3 text-3xl font-black text-violet-600">{tier.range}</p>
                <p className="mt-4 text-sm leading-relaxed text-slate-500">{tier.note}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section data-testid="service-faq-section" className="mx-auto max-w-4xl px-5 py-24 sm:px-8">
        <motion.p {...fadeUp} className="font-mono2 mb-4 text-xs tracking-[0.3em] text-violet-600 uppercase">
          {"// Straight Answers"}
        </motion.p>
        <motion.h2 {...fadeUp} className="font-display mb-14 text-3xl font-bold tracking-tight text-[#0B1220] sm:text-5xl">
          Frequently asked.
        </motion.h2>
        <div className="border-t border-slate-200">
          {service.faqs.map((f, i) => {
            const isOpen = openFaq === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                data-testid={`faq-item-${i}`}
                className="border-b border-slate-200"
              >
                <button
                  data-testid={`faq-toggle-${i}`}
                  onClick={() => setOpenFaq(isOpen ? -1 : i)}
                  className="flex w-full items-center justify-between gap-6 py-6 text-left"
                >
                  <span className={`font-display text-base font-bold transition-colors sm:text-lg ${isOpen ? "text-violet-600" : "text-[#0B1220]"}`}>
                    {f.q}
                  </span>
                  {isOpen ? <Minus className="h-5 w-5 shrink-0 text-violet-500" /> : <Plus className="h-5 w-5 shrink-0 text-violet-500" />}
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pb-6 pr-10 text-sm leading-relaxed text-slate-500 sm:text-base">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        <motion.div {...fadeUp} className="mt-16 flex flex-col items-center gap-5 rounded-2xl bg-[#0A0614] p-10 text-center">
          <h3 className="font-display text-2xl font-bold text-white sm:text-3xl">
            Ready to deploy <span className="gradient-text-lavender">{service.title}</span>?
          </h3>
          <p className="max-w-md text-sm text-slate-400">
            One conversation is all it takes to scope your project. The founder replies within 24 hours.
          </p>
          <a
            data-testid="service-detail-bottom-cta"
            href="/#contact"
            className="group flex items-center gap-2 rounded-full bg-violet-500 px-8 py-4 font-mono2 text-sm font-bold tracking-[0.12em] text-white uppercase transition-all duration-300 hover:bg-white hover:text-[#0A0614] hover:shadow-[0_0_50px_rgba(168,85,247,0.5)]"
          >
            Initiate Project
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </motion.div>
      </section>
    </div>
  );
}
