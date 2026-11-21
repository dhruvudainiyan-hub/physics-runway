import { Trophy } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import { results } from "@/lib/homeData";

export default function ResultsSection() {
  return (
    <section className="bg-white py-16">
      <div className="container-page">
        <SectionHeading center eyebrow="Achievements" title="Our Results" />
        <div className="grid gap-6 md:grid-cols-3">
          {results.map((r, i) => (
            <Reveal key={r.exam} delay={i * 80}>
              <div className="card h-full">
                <div className="flex items-center gap-2">
                  <span className="rounded-xl bg-accent-400/30 p-2 text-accent-500"><Trophy className="h-5 w-5" /></span>
                  <h3 className="text-xl font-bold">{r.exam} Results</h3>
                </div>
                <ul className="mt-4 space-y-3">
                  {r.items.map((it) => (
                    <li key={it.name} className="flex justify-between gap-3 rounded-xl bg-slate-50 px-4 py-3 text-sm">
                      <span className="font-semibold text-navy-900">{it.name}</span>
                      <span className="text-right text-slate-500">{it.score}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
                    }
