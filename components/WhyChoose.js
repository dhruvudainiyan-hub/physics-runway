import { Users, Video, BookOpen, BarChart3, ShieldCheck, Smartphone } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import { whyChoose } from "@/lib/homeData";

const icons = { users: Users, video: Video, book: BookOpen, chart: BarChart3, shield: ShieldCheck, phone: Smartphone };

export default function WhyChoose() {
  return (
    <section className="bg-navy-900 py-16">
      <div className="container-page">
        <SectionHeading center light eyebrow="Our edge" title="Why Choose Physics Runway?" subtitle="Everything you need, in one place." />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {whyChoose.map((w, i) => {
            const Icon = icons[w.icon];
            return (
              <Reveal key={w.title} delay={i * 80}>
                <div className="h-full rounded-2xl border border-white/10 bg-white/5 p-6">
                  <span className="inline-flex rounded-xl bg-accent-500 p-3 text-navy-900"><Icon className="h-6 w-6" /></span>
                  <h3 className="mt-4 text-lg font-bold !text-white">{w.title}</h3>
                  <p className="mt-1 text-sm text-slate-300">{w.text}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
