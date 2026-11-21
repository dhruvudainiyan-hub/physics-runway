import PageHeader from "@/components/PageHeader";
import ImageBox from "@/components/ImageBox";
import Reveal from "@/components/Reveal";
import { faculty } from "@/lib/homeData";

export const metadata = { title: "Our Faculty | Physics Runway" };

export default function FacultyPage() {
  return (
    <main>
      <PageHeader eyebrow="Meet the mentors" title="Our Faculty" crumbs={[{ label: "Our Faculty" }]} />
      <section className="bg-slate-50 py-12">
        <div className="container-page grid grid-cols-1 gap-6 md:grid-cols-2">
          {faculty.map((f, i) => (
            <Reveal key={f.subject} delay={i * 80}>
              <div className="card flex h-full flex-col gap-5 sm:flex-row">
                <div className="w-full shrink-0 sm:w-44">
                  <ImageBox src={f.image} alt={`${f.subject} faculty`} label={`${f.subject} faculty photo`} ratio="aspect-[4/5]" />
                </div>
                <div className="min-w-0">
                  <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600">{f.subject}</span>
                  <h2 className="mt-2 text-xl font-bold">{f.name}</h2>
                  <p className="mt-1 text-sm text-slate-500">{f.qualification}</p>
                  <p className="text-sm text-slate-500">{f.experience}</p>
                  <p className="mt-3 text-sm text-slate-600">{f.bio}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
    }
