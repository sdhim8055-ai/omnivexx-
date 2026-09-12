import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";
import { MessageSquare, X, Send, Bot, CalendarCheck, Loader2 } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const QUICK_CHIPS = ["What services do you offer?", "How does pricing work?", "Who is the founder?"];

const getSessionId = () => {
  let id = localStorage.getItem("omnivexx_chat_session");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("omnivexx_chat_session", id);
  }
  return id;
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("chat");
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hey, I'm VEXX — Omnivexx's concierge. Ask me anything about our services, or tap Book a Call to talk to the founder." },
  ]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [bookForm, setBookForm] = useState({ name: "", email: "", time: "" });
  const [booking, setBooking] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open, mode]);

  const send = async (text) => {
    const msg = (text ?? input).trim();
    if (!msg || streaming) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text: msg }, { role: "assistant", text: "" }]);
    setStreaming(true);
    try {
      const res = await fetch(`${API}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: getSessionId(), message: msg }),
      });
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let acc = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop();
        for (const ev of events) {
          const line = ev.trim();
          if (!line.startsWith("data: ")) continue;
          const payload = line.slice(6);
          if (payload === "[DONE]") continue;
          try {
            acc += JSON.parse(payload).delta;
            const snapshot = acc;
            setMessages((m) => {
              const copy = [...m];
              copy[copy.length - 1] = { role: "assistant", text: snapshot };
              return copy;
            });
          } catch { /* partial chunk */ }
        }
      }
    } catch {
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = { role: "assistant", text: "Signal dropped — email sdhim8055@gmail.com and the founder will reply directly." };
        return copy;
      });
    } finally {
      setStreaming(false);
    }
  };

  const submitBooking = async (e) => {
    e.preventDefault();
    if (!bookForm.name || !bookForm.email || !bookForm.time) {
      toast.error("Fill in name, email and preferred time");
      return;
    }
    setBooking(true);
    try {
      await axios.post(`${API}/leads`, {
        name: bookForm.name,
        email: bookForm.email,
        service: "AI Concierge — Call Booking",
        budget: "",
        message: `Preferred time: ${bookForm.time}`,
      });
      toast.success("Call request saved. The founder will confirm shortly.");
      setMessages((m) => [...m, { role: "assistant", text: `Locked in, ${bookForm.name}. Your call request (${bookForm.time}) just landed in the founder's inbox — expect a confirmation at ${bookForm.email}.` }]);
      setBookForm({ name: "", email: "", time: "" });
      setMode("chat");
    } catch {
      toast.error("Booking failed — please use the contact form");
    } finally {
      setBooking(false);
    }
  };

  const bookInputCls = "w-full rounded-lg border border-white/10 bg-[#06060A] px-3 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none transition-colors focus:border-violet-400/60";

  return (
    <>
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.6, type: "spring", stiffness: 260, damping: 18 }}
        data-testid="chat-widget-toggle"
        onClick={() => setOpen(!open)}
        aria-label="Open AI concierge chat"
        className="fixed bottom-6 right-6 z-[90] flex h-14 w-14 items-center justify-center rounded-full bg-violet-400 text-[#06060A] shadow-[0_0_30px_rgba(168,85,247,0.45)] transition-transform duration-300 hover:scale-110"
      >
        {open ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 32, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            data-testid="chat-widget-panel"
            className="fixed bottom-24 right-6 z-[90] flex h-[520px] w-[calc(100vw-3rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0D0E15]/95 shadow-[0_24px_80px_rgba(0,0,0,0.6)] backdrop-blur-xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-violet-400/30 bg-violet-400/10">
                  <Bot className="h-5 w-5 text-violet-400" />
                </div>
                <div>
                  <span className="font-display block text-sm font-bold text-white">VEXX</span>
                  <span className="font-mono2 text-[9px] tracking-[0.2em] text-slate-500 uppercase">Omnivexx Concierge</span>
                </div>
              </div>
              <button
                data-testid="chat-book-call-button"
                onClick={() => setMode(mode === "book" ? "chat" : "book")}
                className="flex items-center gap-1.5 rounded-full border border-violet-400/40 px-3 py-1.5 font-mono2 text-[10px] font-bold tracking-[0.14em] text-violet-400 uppercase transition-colors hover:bg-violet-400 hover:text-[#06060A]"
              >
                <CalendarCheck className="h-3.5 w-3.5" />
                Book a Call
              </button>
            </div>

            {mode === "book" ? (
              <form onSubmit={submitBooking} data-testid="chat-booking-form" className="flex flex-1 flex-col gap-4 p-5">
                <p className="text-sm leading-relaxed text-slate-400">
                  Drop your details and a preferred time — the request lands directly in the founder's inbox.
                </p>
                <input data-testid="chat-booking-name-input" value={bookForm.name} onChange={(e) => setBookForm({ ...bookForm, name: e.target.value })} placeholder="Your name" className={bookInputCls} />
                <input data-testid="chat-booking-email-input" type="email" value={bookForm.email} onChange={(e) => setBookForm({ ...bookForm, email: e.target.value })} placeholder="Email address" className={bookInputCls} />
                <input data-testid="chat-booking-time-input" value={bookForm.time} onChange={(e) => setBookForm({ ...bookForm, time: e.target.value })} placeholder="Preferred time (e.g. Tue 4 PM IST)" className={bookInputCls} />
                <button
                  data-testid="chat-booking-submit-button"
                  type="submit"
                  disabled={booking}
                  className="mt-auto flex items-center justify-center gap-2 rounded-full bg-violet-400 py-3 font-mono2 text-xs font-bold tracking-[0.14em] text-[#06060A] uppercase transition-colors hover:bg-white disabled:opacity-60"
                >
                  {booking ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm Booking"}
                </button>
              </form>
            ) : (
              <>
                <div ref={scrollRef} data-testid="chat-messages" className="chat-scroll flex-1 space-y-4 overflow-y-auto p-5">
                  {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                          m.role === "user"
                            ? "rounded-br-sm bg-violet-400 text-[#06060A]"
                            : "rounded-bl-sm border border-white/10 bg-white/5 text-slate-200"
                        }`}
                      >
                        {m.text || <Loader2 className="h-4 w-4 animate-spin text-violet-400" />}
                      </div>
                    </div>
                  ))}
                  {messages.length === 1 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {QUICK_CHIPS.map((c) => (
                        <button
                          key={c}
                          data-testid={`chat-chip-${c.split(" ")[0].toLowerCase()}`}
                          onClick={() => send(c)}
                          className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-slate-300 transition-colors hover:border-violet-400/50 hover:text-violet-300"
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 border-t border-white/10 p-3">
                  <input
                    data-testid="chat-input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && send()}
                    placeholder="Ask VEXX anything..."
                    className="flex-1 rounded-full border border-white/10 bg-[#06060A] px-4 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none transition-colors focus:border-violet-400/60"
                  />
                  <button
                    data-testid="chat-send-button"
                    onClick={() => send()}
                    disabled={streaming || !input.trim()}
                    aria-label="Send message"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-400 text-[#06060A] transition-colors hover:bg-white disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
