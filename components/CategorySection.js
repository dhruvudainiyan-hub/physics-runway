import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import CourseCard from "@/components/CourseCard";
import Reveal from "@/components/Reveal";

export default function CategorySection({ category, courses, tinted = false }) {
  return (
    <section id={category.slug} className={`scroll-mt-20 py-16 ${tinted ? "bg-slate-50" : "bg-white"}`}>
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow={category.duration} title={`${category.title} Courses`} subtitle={category.tagline} />
          <Link href={`/courses/${category.slug}/`} className="mb-10 inline-flex items-center gap-1 font-semibold text-brand-600">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          {courses.map((c, i) => (
            <Reveal key={c.id} delay={i * 80} className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"><CourseCard course={c} /></Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
