"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Rocket } from "lucide-react";

export default function Logo({ light = false }) {
  const [failed, setFailed] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (el && el.complete && el.naturalWidth === 0) setFailed(true);
  }, []);

  return (
    <Link href="/" className="flex items-center gap-2">
      {!failed ? (
        <img ref={ref} src="/assets/images/logo.png" alt="Physics Runway logo" onError={() => setFailed(true)} className="h-10 w-auto" />
      ) : (
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-brand-500 text-white shadow-md">
          <Rocket className="h-5 w-5" />
        </span>
      )}
      {failed && (
        <span className={`font-heading text-xl font-extrabold leading-none ${light ? "text-white" : "text-navy-900"}`}>
          Physics<span className="text-accent-500"> Runway</span>
        </span>
      )}
    </Link>
  );
}
