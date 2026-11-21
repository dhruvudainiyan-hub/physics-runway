import { Trophy, Quote, AlertTriangle } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import ImageBox from "@/components/ImageBox";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import { results, testimonials } from "@/lib/homeData";

export const metadata = { title: "Results | Physics Runway" };

export default function ResultsPage() {
  return (
    <main>
      <PageHeader eyebrow="Achievements" title="Our Results" subtitle="Student achievements and success stories." crumbs={[{ label: "Results" }]} />

      <section className="bg-slate-50 py-12">
        <div className="container-page">
               <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {results.map((r, i) => (
              <Reveal key={r.exam} delay={i * 80}>
                <div className="card h-full">
                  <div className="flex items-center gap-2">
                    <span className="rounded-xl bg-accent-400/30 p-2 text-accent-500"><Trophy className="h-5 w-5" /></span>
                    <h2 className="text-xl font-bold">{r.exam} Results</h2>
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

      <section className="bg-white py-12">
        <div className="container-page">
          <SectionHeading center eyebrow="Success stories" title="What our students say" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="card h-full">
                  <Quote className="h-8 w-8 text-accent-500" />
                  <p className="mt-3 text-slate-600">{t.quote}</p>
                  <div className="mt-5 flex items-center gap-3">
                    <div className="w-14 shrink-0"><ImageBox src={t.image} alt={t.name} label="" ratio="aspect-square" className="!rounded-full" /></div>
                    <div>
                      <p className="font-bold text-navy-900">{t.name}</p>
                      <p className="text-sm text-slate-500">{t.detail}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
  }
