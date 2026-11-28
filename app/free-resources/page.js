import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { freeCategories } from "@/lib/freeResources";

export const metadata = { title: "Free Resources | Physics Runway" };

export default function FreeResourcesPage() {
  return (
    <main>
      <PageHeader eyebrow="Learn for free" title="Free Resources" subtitle="Chapter-wise videos, notes, PPTs and practice questions with answers." crumbs={[{ label: "Free Resources" }]} />
      <section className="bg-slate-50 py-12">
        <div className="container-page grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {freeCategories.map((c) => (
            <Link key={c.slug} href={`/free-resources/${c.slug}/`} className="card flex h-full flex-col">
              <span className="inline-flex w-fit rounded-xl bg-gradient-to-br from-brand-600 to-brand-500 p-3 text-white"><BookOpen className="h-6 w-6" /></span>
              <h2 className="mt-4 text-xl font-bold">{c.title}</h2>
              <p className="mt-1 text-sm text-slate-500">{c.blurb}</p>
              <p className="mt-2 text-xs text-slate-400">{c.chapters.length} chapters</p>
              <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-brand-600">Open <ArrowRight className="h-4 w-4" /></span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
