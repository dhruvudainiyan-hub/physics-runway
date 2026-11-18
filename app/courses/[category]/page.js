import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import CourseCard from "@/components/CourseCard";
import SubjectIcon from "@/components/SubjectIcon";
import { categories, courses } from "@/lib/siteData";

export const dynamicParams = false;

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export function generateMetadata({ params }) {
  const cat = categories.find((c) => c.slug === params.category);
  return { title: `${cat?.title} Courses | Physics Runway` };
}

export default function CategoryPage({ params }) {
  const cat = categories.find((c) => c.slug === params.category);
  const list = courses.filter((c) => c.category === cat.slug);

  return (
    <main>
      <PageHeader
        eyebrow={cat.duration}
        title={`${cat.title} Courses`}
        subtitle={cat.tagline}
        crumbs={[{ label: cat.title }]}
      />
      <section className="bg-white py-12">
        <div className="container-page">
          <div className="mb-8 flex flex-wrap gap-2">
            {list.map((c) => (
              <Link key={c.id} href={`/courses/${c.category}/${c.subject}/`}
                className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-600 hover:bg-brand-100">
                <SubjectIcon subject={c.subject} className="h-4 w-4" /> {c.subjectName}
              </Link>
            ))}
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {list.map((c) => <CourseCard key={c.id} course={c} />)}
          </div>
          <p className="mt-8 text-center text-xs text-slate-400">Demo website: fees and details are sample data.</p>
        </div>
      </section>
    </main>
  );
}
