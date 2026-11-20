"use client";
import { useEffect, useRef, useState } from "react";

// Counts from 0 up to a value like "10,000+", "50+", "95%" or "4".
export default function CountUp({ value, duration = 1800, className = "" }) {
  const m = String(value).match(/^([^\d]*)([\d,]+)(.*)$/);
  const prefix = m ? m[1] : "";
  const target = m ? parseInt(m[2].replace(/,/g, ""), 10) : 0;
  const suffix = m ? m[3] : "";

  const [n, setN] = useState(target);
  const ref = useRef(null);

  useEffect(() => {
    if (!m) return;
    const el = ref.current;
    if (!el) return;

    // Skip the animation for people who prefer reduced motion
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    setN(0);
    let frame;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3); // fast start, gentle finish
        setN(Math.round(target * eased));
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(el);

    return () => { io.disconnect(); cancelAnimationFrame(frame); };
  }, [target, duration]);

  if (!m) return <p className={className}>{value}</p>;
  return <p ref={ref} className={className}>{prefix}{n.toLocaleString("en-IN")}{suffix}</p>;
    }
