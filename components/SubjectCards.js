import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import SubjectIcon from "@/components/SubjectIcon";
import Reveal from "@/components/Reveal";
import { subjects, courses } from "@/lib/siteData";

export default function SubjectCards() {
  return (
    <section className="bg-white py-16">
      <div className="container-page">
        <SectionHeading center eyebrow="Subject-wise" title="Pick your subject" subtitle="Find your subject across every class and exam." />
        <div className="flex flex-wrap justify-center gap-6">
          {Object.entries(subjects).map(([key, s], i) => (
            <Reveal key={key} delay={i * 80} className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
              <div className="card h-full">
                <span className="inline-flex rounded-xl bg-gradient-to-br from-brand-600 to-brand-500 p-3 text-white">
                  <SubjectIcon subject={key} />
                </span>
                <h3 className="mt-4 text-xl font-bold">{s.name}</h3>
                <p className="mt-1 text-sm text-slate-500">{s.blurb}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {courses.filter((c) => c.subject === key).map((c) => (
                    <Link key={c.id} href={`/courses/${c.category}/${c.subject}/`}
                      className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600 hover:bg-brand-100">
                      {c.categoryTitle}
                    </Link>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
