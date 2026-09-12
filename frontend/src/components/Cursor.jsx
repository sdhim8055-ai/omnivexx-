import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

let trailId = 0;

export default function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 250, damping: 25, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 250, damping: 25, mass: 0.6 });
  const [trail, setTrail] = useState([]);

  useEffect(() => {
    let last = 0;
    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const now = performance.now();
      if (now - last > 45) {
        last = now;
        const id = ++trailId;
        setTrail((t) => [...t.slice(-14), { id, px: e.clientX, py: e.clientY }]);
      }
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);

  const removePoint = (id) => setTrail((t) => t.filter((p) => p.id !== id));

  return (
    <div className="custom-cursor pointer-events-none fixed inset-0 z-[100]" aria-hidden>
      <AnimatePresence>
        {trail.map((p) => (
          <motion.span
            key={p.id}
            initial={{ opacity: 0.55, scale: 1 }}
            animate={{ opacity: 0, scale: 0.15 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            onAnimationComplete={() => removePoint(p.id)}
            className="absolute h-3 w-3 rounded-full bg-violet-400 blur-[3px]"
            style={{ left: p.px - 6, top: p.py - 6 }}
          />
        ))}
      </AnimatePresence>
      <motion.div
        style={{ x: ringX, y: ringY }}
        className="absolute -ml-5 -mt-5 h-10 w-10 rounded-full border border-violet-400/50 mix-blend-difference"
      />
      <motion.div
        style={{ x, y }}
        className="absolute -ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-violet-400"
      />
    </div>
  );
}
