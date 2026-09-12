import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 250, damping: 25, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 250, damping: 25, mass: 0.6 });

  useEffect(() => {
    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);

  return (
    <div className="custom-cursor pointer-events-none fixed inset-0 z-[100]" aria-hidden>
      <motion.div
        style={{ x: ringX, y: ringY }}
        className="absolute -ml-5 -mt-5 h-10 w-10 rounded-full border border-cyan-400/50 mix-blend-difference"
      />
      <motion.div
        style={{ x, y }}
        className="absolute -ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-cyan-400"
      />
    </div>
  );
}
