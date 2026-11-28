import PageHeader from "@/components/PageHeader";
import ChapterList from "@/components/ChapterList";
import { freeCategories } from "@/lib/freeResources";

export const dynamicParams = false;

export function generateStaticParams() {
  return freeCategories.map((c) => ({ category: c.slug }));
}

export function generateMetadata({ params }) {
  const c = freeCategories.find((x) => x.slug === params.category);
  return { title: `${c?.title} Free Resources | Physics Runway` };
}

export default function FreeCategoryPage({ params }) {
  const c = freeCategories.find((x) => x.slug === params.category);
  return (
    <main>
      <PageHeader
        eyebrow="Free Resources"
        title={`${c.title} chapters`}
        subtitle={c.blurb}
        crumbs={[{ label: "Free Resources", href: "/free-resources/" }, { label: c.title }]}
      />
      <section className="bg-slate-50 py-12">
        <div className="container-page">
          <ChapterList category={c.slug} />
        </div>
      </section>
    </main>
  );
}
