import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";
import { Copy, Mail, Phone, Send, Loader2 } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const SERVICE_OPTIONS = [
  "Digital ADS & Marketing",
  "Influencer Marketing",
  "Data Science & Structure Management",
  "Trading Indicators & Bots",
  "Social Media Farming",
  "SaaS Engineering",
  "Startup Incubation",
  "General Enquiry",
];

const BUDGET_OPTIONS = ["< $1K", "$1K – $5K", "$5K – $20K", "$20K+", "Let's discuss"];

const EMAIL = "sdhim8055@gmail.com";
const PHONE = "+91 6361751228";

const inputCls =
  "w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-[#0B1220] placeholder:text-slate-400 outline-none transition-colors duration-300 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", service: "General Enquiry", budget: "Let's discuss", message: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handler = (e) => setForm((f) => ({ ...f, service: e.detail }));
    window.addEventListener("prefill-service", handler);
    return () => window.removeEventListener("prefill-service", handler);
  }, []);

  const copy = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard`);
    } catch {
      toast.error("Copy failed");
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in name, email and message");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API}/leads`, form);
      toast.success("Transmission received. Expect a response within 24 hours.");
      setForm({ name: "", email: "", service: "General Enquiry", budget: "Let's discuss", message: "" });
    } catch {
      toast.error("Transmission failed. Please email the founder directly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" data-testid="contact-section" className="relative bg-[#F4F7FB] px-5 py-28 sm:px-8 sm:py-40">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_120%,rgba(6,182,212,0.12),transparent_60%)]" />
      <div className="relative mx-auto grid max-w-7xl gap-16 lg:grid-cols-2 lg:gap-24">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="font-mono2 mb-6 text-xs tracking-[0.3em] text-cyan-600 uppercase"
          >
            {"// Direct Line"}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-3xl font-bold leading-tight tracking-tight text-[#0B1220] sm:text-5xl lg:text-6xl"
          >
            Talk to the
            <br />
            <span className="gradient-text">founder. Directly.</span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            data-testid="founder-card"
            className="mt-12 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
          >
            <div className="flex items-center gap-5">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-cyan-600/30 bg-cyan-50">
                <span className="font-display text-2xl font-extrabold text-cyan-600">DR</span>
              </div>
              <div>
                <h3 data-testid="founder-name" className="font-display text-xl font-bold text-[#0B1220]">Dhimant S Reddy</h3>
                <p className="font-mono2 text-[10px] tracking-[0.22em] text-slate-400 uppercase">Founder & Chief Architect</p>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                <a data-testid="founder-email-link" href={`mailto:${EMAIL}`} className="flex min-w-0 items-center gap-3 text-sm text-slate-600 transition-colors hover:text-cyan-700">
                  <Mail className="h-4 w-4 shrink-0 text-cyan-600" />
                  <span className="truncate">{EMAIL}</span>
                </a>
                <button data-testid="copy-email-button" onClick={() => copy(EMAIL, "Email")} className="shrink-0 text-slate-400 transition-colors hover:text-cyan-600" aria-label="Copy email">
                  <Copy className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                <a data-testid="founder-phone-link" href={`tel:${PHONE.replace(/\s/g, "")}`} className="flex items-center gap-3 text-sm text-slate-600 transition-colors hover:text-cyan-700">
                  <Phone className="h-4 w-4 shrink-0 text-cyan-600" />
                  <span>{PHONE}</span>
                </a>
                <button data-testid="copy-phone-button" onClick={() => copy(PHONE, "Phone")} className="shrink-0 text-slate-400 transition-colors hover:text-cyan-600" aria-label="Copy phone">
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse-dot" />
              <span className="font-mono2 text-[10px] tracking-[0.2em] text-slate-400 uppercase">Responds within 24 hours</span>
            </div>
          </motion.div>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          onSubmit={submit}
          data-testid="contact-form"
          className="flex h-fit flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10"
        >
          <span className="font-mono2 text-xs tracking-[0.24em] text-slate-400 uppercase">Initiate Transmission</span>
          <div className="grid gap-5 sm:grid-cols-2">
            <input
              data-testid="contact-form-name-input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Your name"
              className={inputCls}
            />
            <input
              data-testid="contact-form-email-input"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Email address"
              className={inputCls}
            />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <select
              data-testid="contact-form-service-select"
              value={form.service}
              onChange={(e) => setForm({ ...form, service: e.target.value })}
              className={`${inputCls} appearance-none`}
            >
              {SERVICE_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <select
              data-testid="contact-form-budget-select"
              value={form.budget}
              onChange={(e) => setForm({ ...form, budget: e.target.value })}
              className={`${inputCls} appearance-none`}
            >
              {BUDGET_OPTIONS.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
          <textarea
            data-testid="contact-form-message-input"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            placeholder="Describe your mission..."
            rows={5}
            className={`${inputCls} resize-none`}
          />
          <button
            data-testid="contact-form-submit-button"
            type="submit"
            disabled={loading}
            className="group mt-2 flex items-center justify-center gap-2 rounded-full bg-cyan-500 px-8 py-4 font-mono2 text-sm font-bold tracking-[0.14em] text-white uppercase transition-all duration-300 hover:bg-[#0B1220] hover:shadow-[0_0_40px_rgba(6,182,212,0.3)] disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Transmitting
              </>
            ) : (
              <>
                Send Transmission
                <Send className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </>
            )}
          </button>
        </motion.form>
      </div>
    </section>
  );
}
