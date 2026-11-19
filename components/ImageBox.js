"use client";
import { useEffect, useRef, useState } from "react";
import { ImageIcon } from "lucide-react";

/* ratio examples: "aspect-video", "aspect-square", "aspect-[4/5]"
   fit: "cover" (fills the box, may crop) or "contain" (never crops; use for QR code) */
export default function ImageBox({ src, alt, label, ratio = "aspect-video", fit = "cover", className = "" }) {
  const [failed, setFailed] = useState(false);
  const ref = useRef(null);
  const filename = src.split("/").pop();

  useEffect(() => {
    const el = ref.current;
    if (el && el.complete && el.naturalWidth === 0) setFailed(true);
  }, []);

  return (
    <div className={`relative w-full overflow-hidden rounded-2xl bg-gradient-to-br from-brand-100 to-brand-50 ${ratio} ${className}`}>
      {!failed ? (
        <img
          ref={ref}
          src={src}
          alt={alt}
          onError={() => setFailed(true)}
          className={`absolute inset-0 h-full w-full ${fit === "contain" ? "object-contain" : "object-cover"}`}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 p-3 text-center text-brand-600">
          <ImageIcon className="h-8 w-8 opacity-70" />
          <p className="text-sm font-semibold">{label || alt}</p>
          <p className="text-xs opacity-70">Add file: {filename}</p>
        </div>
      )}
    </div>
  );
}
