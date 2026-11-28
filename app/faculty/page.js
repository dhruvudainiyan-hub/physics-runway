import PageHeader from "@/components/PageHeader";
import FacultyList from "@/components/FacultyList";

export const metadata = { title: "Our Faculty | Physics Runway" };

export default function FacultyPage() {
  return (
    <main>
      <PageHeader eyebrow="Meet the mentors" title="Our Faculty" crumbs={[{ label: "Our Faculty" }]} />
      <section className="bg-slate-50 py-12">
        <FacultyList />
      </section>
    </main>
  );
}
