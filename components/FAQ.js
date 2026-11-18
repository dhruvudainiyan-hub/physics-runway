"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { faqs } from "@/lib/homeData";

export default function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <section className="bg-slate-50 py-16">
      <div className="container-page max-w-3xl">
        <SectionHeading center eyebrow="Got questions?" title="Frequently Asked Questions" />
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <div key={f.q} className="rounded-2xl border border-slate-200 bg-white">
              <button onClick={() => setOpen(open === i ? -1 : i)} className="flex w-full items-center justify-between gap-4 p-5 text-left font-semibold text-navy-900">
                {f.q}
                <ChevronDown className={`h-5 w-5 shrink-0 transition ${open === i ? "rotate-180" : ""}`} />
              </button>
              {open === i && <p className="px-5 pb-5 text-slate-600">{f.a}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
