import { motion } from "framer-motion";
import { Hexagon } from "lucide-react";
import { scrollToSection } from "@/App";

export default function Footer() {
  return (
    <footer data-testid="footer" className="relative overflow-hidden border-t border-white/10 bg-[#06060A] text-slate-100">
      <div className="mx-auto max-w-7xl px-5 pt-16 sm:px-8">
        <div className="flex flex-col items-start justify-between gap-10 pb-16 md:flex-row md:items-center">
          <div className="flex items-center gap-2.5">
            <Hexagon className="h-6 w-6 text-violet-400" strokeWidth={1.5} />
            <div>
              <span className="font-display block text-lg font-extrabold tracking-[0.18em] text-white">OMNIVEXX</span>
              <span className="font-mono2 text-[10px] tracking-[0.2em] text-slate-500 uppercase">Architecting next-gen digital dominance</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            {[
              { label: "Services", href: "#services", testid: "footer-services-link" },
              { label: "Manifesto", href: "#manifesto", testid: "footer-manifesto-link" },
              { label: "Contact", href: "#contact", testid: "footer-contact-link" },
            ].map((l) => (
              <button
                key={l.label}
                data-testid={l.testid}
                onClick={() => scrollToSection(l.href)}
                className="font-mono2 text-xs tracking-[0.2em] text-slate-400 uppercase transition-colors hover:text-violet-400"
              >
                {l.label}
              </button>
            ))}
            <a
              data-testid="footer-admin-link"
              href="/admin"
              className="font-mono2 text-xs tracking-[0.2em] text-slate-600 uppercase transition-colors hover:text-violet-400"
            >
              Admin
            </a>
            <div data-testid="footer-status" className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-dot" />
              <span className="font-mono2 text-[10px] tracking-[0.18em] text-slate-400 uppercase">All systems operational</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 border-t border-white/10 py-6 sm:flex-row sm:items-center">
          <span data-testid="footer-copyright" className="font-mono2 text-[10px] tracking-[0.18em] text-slate-600 uppercase">
            © 2026 Omnivexx. All rights reserved.
          </span>
          <a data-testid="footer-email-link" href="mailto:sdhim8055@gmail.com" className="font-mono2 text-[10px] tracking-[0.18em] text-slate-600 uppercase transition-colors hover:text-violet-400">
            sdhim8055@gmail.com
          </a>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-none select-none pb-8 text-center"
        aria-hidden
      >
        <span className="text-outline-cyan font-display inline-block text-[16vw] font-extrabold leading-[1.05] tracking-tight opacity-40">
          OMNIVEXX
        </span>
      </motion.div>
    </footer>
  );
}
