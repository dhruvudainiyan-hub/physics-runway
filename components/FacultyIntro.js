import SectionHeading from "@/components/SectionHeading";
import ImageBox from "@/components/ImageBox";
import Reveal from "@/components/Reveal";
import { faculty } from "@/lib/homeData";

export default function FacultyIntro() {
  return (
    <section className="bg-white py-16">
      <div className="container-page">
        <SectionHeading center eyebrow="Meet the mentors" title="Our Faculty" subtitle="Demo profiles. Real teacher details and photos will be added later." />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {faculty.map((f, i) => (
            <Reveal key={f.subject} delay={i * 80}>
              <div className="card h-full !p-4">
                <ImageBox src={f.image} alt={`${f.subject} faculty`} label={`${f.subject} faculty photo`} ratio="aspect-[4/5]" />
                <span className="mt-4 inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600">{f.subject}</span>
                <h3 className="mt-2 text-lg font-bold">{f.name}</h3>
                <p className="text-sm text-slate-500">{f.qualification}</p>
                <p className="text-sm text-slate-500">{f.experience}</p>
                <p className="mt-2 text-sm">{f.bio}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
