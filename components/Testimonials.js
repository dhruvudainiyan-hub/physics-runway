import { Quote } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import ImageBox from "@/components/ImageBox";
import Reveal from "@/components/Reveal";
import { testimonials } from "@/lib/homeData";

export default function Testimonials() {
  return (
    <section className="bg-slate-50 py-16">
      <div className="container-page">
        <SectionHeading center eyebrow="Student voices" title="What Students Say" subtitle="Fictional demo testimonials. Replace with real ones." />
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={i} delay={i * 80}>
              <div className="card h-full">
                <Quote className="h-8 w-8 text-accent-500" />
                <p className="mt-3 text-slate-600">{t.quote}</p>
                <div className="mt-5 flex items-center gap-3">
                  <div className="w-14 shrink-0">
                    <ImageBox src={t.image} alt={t.name} label="" ratio="aspect-square" className="!rounded-full" />
                  </div>
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
  );
  }
