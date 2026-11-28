import PageHeader from "@/components/PageHeader";
import ChapterResources from "@/components/ChapterResources";
import { freeCategories } from "@/lib/freeResources";

export const dynamicParams = false;

export function generateStaticParams() {
  return freeCategories.flatMap((c) => c.chapters.map((ch) => ({ category: c.slug, chapter: ch.slug })));
}

export function generateMetadata({ params }) {
  const c = freeCategories.find((x) => x.slug === params.category);
  const ch = c?.chapters.find((x) => x.slug === params.chapter);
  return { title: `${ch?.title} | ${c?.title} | Physics Runway` };
}

export default function ChapterPage({ params }) {
  const c = freeCategories.find((x) => x.slug === params.category);
  const ch = c.chapters.find((x) => x.slug === params.chapter);
  return (
    <main>
      <PageHeader
        eyebrow={`${c.title} · ${ch.part}`}
        title={`Chapter ${ch.number}: ${ch.title}`}
        crumbs={[
          { label: "Free Resources", href: "/free-resources/" },
          { label: c.title, href: `/free-resources/${c.slug}/` },
          { label: `Chapter ${ch.number}` },
        ]}
      />
      <section className="bg-slate-50 py-12">
        <div className="container-page max-w-3xl">
          <ChapterResources category={c.slug} chapter={ch.slug} />
        </div>
      </section>
    </main>
  );
}
