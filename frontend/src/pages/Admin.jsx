import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Hexagon, LogOut, RefreshCw, Inbox, Eye, MessageSquare } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const TOKEN_KEY = "omnivexx_admin_token";

const inputCls =
  "w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-[#0B1220] placeholder:text-slate-400 outline-none transition-colors duration-300 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30";

export default function Admin() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [leads, setLeads] = useState(null);
  const [stats, setStats] = useState(null);

  const loadData = async (t) => {
    try {
      const [leadsRes, statsRes] = await Promise.all([
        axios.get(`${API}/leads`, { headers: { Authorization: `Bearer ${t}` } }),
        axios.get(`${API}/analytics/summary`, { headers: { Authorization: `Bearer ${t}` } }),
      ]);
      setLeads(leadsRes.data);
      setStats(statsRes.data);
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      setToken(null);
      setLeads(null);
      setStats(null);
    }
  };

  useEffect(() => {
    if (token) loadData(token);
  }, [token]);

  const login = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`${API}/auth/login`, form);
      localStorage.setItem(TOKEN_KEY, res.data.token);
      setToken(res.data.token);
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(typeof detail === "string" ? detail : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setLeads(null);
    setStats(null);
  };

  const STAT_CARDS = stats
    ? [
        { label: "Visits This Week", week: stats.week_pageviews, total: stats.total_pageviews, icon: Eye, testid: "stats-visits" },
        { label: "VEXX Chats This Week", week: stats.week_chats, total: stats.total_chats, icon: MessageSquare, testid: "stats-chats" },
        { label: "New Leads This Week", week: stats.week_leads, total: stats.total_leads, icon: Inbox, testid: "stats-leads" },
      ]
    : [];

  return (
    <div data-testid="admin-page" className="min-h-screen bg-[#F4F7FB]">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <a data-testid="admin-home-link" href="/" className="flex items-center gap-2.5">
            <Hexagon className="h-6 w-6 text-violet-600" strokeWidth={1.5} />
            <span className="font-display text-lg font-extrabold tracking-[0.18em] text-[#0B1220]">OMNIVEXX</span>
            <span className="font-mono2 rounded-full bg-violet-50 px-2.5 py-1 text-[10px] tracking-[0.2em] text-violet-700 uppercase">Lead Inbox</span>
          </a>
          {token && (
            <div className="flex items-center gap-3">
              <button
                data-testid="admin-refresh-button"
                onClick={() => loadData(token)}
                aria-label="Refresh leads"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:border-violet-500 hover:text-violet-600"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
              <button
                data-testid="admin-logout-button"
                onClick={logout}
                className="flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 font-mono2 text-xs tracking-[0.14em] text-slate-600 uppercase transition-colors hover:border-violet-500 hover:text-violet-600"
              >
                <LogOut className="h-3.5 w-3.5" /> Logout
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        {!token ? (
          <motion.form
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            onSubmit={login}
            data-testid="admin-login-form"
            className="mx-auto mt-16 flex max-w-sm flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
          >
            <div className="text-center">
              <h1 className="font-display text-2xl font-bold text-[#0B1220]">Admin Access</h1>
              <p className="font-mono2 mt-2 text-[10px] tracking-[0.2em] text-slate-400 uppercase">Founders only beyond this point</p>
            </div>
            <input
              data-testid="admin-email-input"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Admin email"
              className={inputCls}
            />
            <input
              data-testid="admin-password-input"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Password"
              className={inputCls}
            />
            {error && (
              <p data-testid="admin-login-error" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
                {error}
              </p>
            )}
            <button
              data-testid="admin-login-submit-button"
              type="submit"
              disabled={loading}
              className="rounded-full bg-violet-500 py-3 font-mono2 text-xs font-bold tracking-[0.14em] text-white uppercase transition-colors hover:bg-[#0B1220] disabled:opacity-60"
            >
              {loading ? "Verifying..." : "Enter Inbox"}
            </button>
          </motion.form>
        ) : (
          <div>
            <div className="mb-8 flex items-end justify-between">
              <div>
                <p className="font-mono2 mb-2 text-xs tracking-[0.3em] text-violet-600 uppercase">{"// Incoming Transmissions"}</p>
                <h1 className="font-display text-3xl font-bold text-[#0B1220] sm:text-4xl">Lead Inbox</h1>
              </div>
              <span data-testid="admin-lead-count" className="font-mono2 text-sm text-slate-500">
                {leads ? `${leads.length} leads` : "..."}
              </span>
            </div>

            {stats && (
              <div data-testid="admin-stats-strip" className="mb-10 grid gap-4 sm:grid-cols-3">
                {STAT_CARDS.map((c) => (
                  <motion.div
                    key={c.label}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    data-testid={c.testid}
                    className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-violet-500/25 bg-violet-50">
                      <c.icon className="h-5 w-5 text-violet-600" />
                    </div>
                    <div>
                      <span className="font-mono2 block text-2xl font-black text-[#0B1220]">{c.week}</span>
                      <span className="font-mono2 text-[10px] tracking-[0.14em] text-slate-400 uppercase">
                        {c.label} · {c.total} all time
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {!leads ? (
              <p className="font-mono2 text-sm text-slate-400">Loading transmissions...</p>
            ) : leads.length === 0 ? (
              <div data-testid="admin-empty-state" className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-slate-300 bg-white py-20">
                <Inbox className="h-10 w-10 text-slate-300" />
                <p className="font-mono2 text-sm text-slate-400">No enquiries yet. The silence won't last.</p>
              </div>
            ) : (
              <div data-testid="admin-leads-table" className="space-y-4">
                {leads.map((l) => (
                  <motion.div
                    key={l.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    data-testid={`admin-lead-${l.id}`}
                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <span className="font-display text-lg font-bold text-[#0B1220]">{l.name}</span>
                        <a href={`mailto:${l.email}`} className="ml-3 text-sm text-violet-700 hover:underline">{l.email}</a>
                      </div>
                      <span className="font-mono2 text-[10px] tracking-[0.14em] text-slate-400 uppercase">
                        {new Date(l.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="font-mono2 rounded-full border border-violet-600/25 bg-violet-50 px-3 py-1 text-[10px] tracking-[0.14em] text-violet-700 uppercase">{l.service}</span>
                      {l.budget && (
                        <span className="font-mono2 rounded-full border border-slate-200 px-3 py-1 text-[10px] tracking-[0.14em] text-slate-500 uppercase">{l.budget}</span>
                      )}
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-slate-600">{l.message}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
