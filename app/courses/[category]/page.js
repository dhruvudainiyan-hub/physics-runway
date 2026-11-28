import PageHeader from "@/components/PageHeader";
import CategoryCourses from "@/components/CategoryCourses";
import { categories } from "@/lib/siteData";

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
  return (
    <main>
      <PageHeader eyebrow={cat.duration} title={`${cat.title} Courses`} subtitle={cat.tagline} crumbs={[{ label: cat.title }]} />
      <section className="bg-white py-12">
        <CategoryCourses category={cat.slug} />
      </section>
    </main>
  );
}
