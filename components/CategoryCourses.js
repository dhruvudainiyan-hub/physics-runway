"use client";
import Link from "next/link";
import CourseCard from "@/components/CourseCard";
import SubjectIcon from "@/components/SubjectIcon";
import { useContent } from "@/lib/content";

export default function CategoryCourses({ category }) {
  const { courses } = useContent();
  const list = courses.filter((c) => c.category === category);
  return (
    <div className="container-page">
      <div className="mb-8 flex flex-wrap gap-2">
        {list.map((c) => (
          <Link key={c.id} href={`/courses/${c.category}/${c.subject}/`}
            className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-600 hover:bg-brand-100">
            <SubjectIcon subject={c.subject} className="h-4 w-4" /> {c.subjectName}
          </Link>
        ))}
      </div>
      <div className="flex flex-wrap justify-center gap-6">
        {list.map((c) => (
          <div key={c.id} className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"><CourseCard course={c} /></div>
        ))}
      </div>
    </div>
  );
}
