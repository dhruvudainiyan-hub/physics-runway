"use client";
import ImageBox from "@/components/ImageBox";
import Reveal from "@/components/Reveal";
import { useContent, safeImage } from "@/lib/content";

export default function FacultyList() {
  const { faculty } = useContent();
  return (
    <div className="container-page flex flex-wrap justify-center gap-6">
      {faculty.map((f, i) => (
        <Reveal key={i} delay={i * 80} className="w-full md:w-[calc(50%-12px)]">
          <div className="card flex h-full flex-col gap-5 sm:flex-row">
            <div className="w-full shrink-0 sm:w-44">
              <ImageBox src={safeImage(f.image)} alt={`${f.subject} faculty`} label={`${f.subject} faculty photo`} ratio="aspect-[4/5]" />
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
  );
}
