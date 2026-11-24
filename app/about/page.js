import Link from "next/link";
import { Eye, Target, CheckCircle2 } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import ImageBox from "@/components/ImageBox";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import { about } from "@/lib/pageData";

export const metadata = { title: "About Us | Physics Runway" };

export default function AboutPage() {
  return (
    <main>
      <PageHeader eyebrow="Who we are" title="About Physics Runway" subtitle="Coaching for Class 10, Class 11 and Class 12." crumbs={[{ label: "About Us" }]} />

      <section className="bg-white py-12">
        <div className="container-page grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Introduction" title="Built for ambitious students" />
            <p className="-mt-4 text-lg text-slate-600">{about.intro}</p>
          </div>
          <ImageBox src="/assets/images/institute-image.png" alt="Physics Runway institute" label="Institute photo" ratio="aspect-[4/3]" className="shadow-xl" />
        </div>
      </section>

      <section className="bg-slate-50 py-12">
        <div className="container-page grid grid-cols-1 gap-6 md:grid-cols-2">
          <Reveal>
            <div className="card h-full">
              <span className="inline-flex rounded-xl bg-brand-50 p-3 text-brand-600"><Eye className="h-6 w-6" /></span>
              <h2 className="mt-3 text-xl font-bold">Our Vision</h2>
              <p className="mt-2 text-slate-600">{about.vision}</p>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div className="card h-full">
              <span className="inline-flex rounded-xl bg-brand-50 p-3 text-brand-600"><Target className="h-6 w-6" /></span>
              <h2 className="mt-3 text-xl font-bold">Our Mission</h2>
              <p className="mt-2 text-slate-600">{about.mission}</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="container-page">
          <SectionHeading center eyebrow="Teaching approach" title="How we teach" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {about.approach.map((a, i) => (
              <Reveal key={a.title} delay={i * 80}>
                <div className="card h-full">
                  <h3 className="text-lg font-bold">{a.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{a.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-navy-900 py-12">
        <div className="container-page">
          <SectionHeading center light eyebrow="Why choose us" title="Why students choose Physics Runway" />
          <ul className="mx-auto grid max-w-3xl gap-3">
            {about.why.map((w) => (
              <li key={w} className="flex items-start gap-3 rounded-xl bg-white/5 p-4 text-slate-200">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent-400" /> {w}
              </li>
            ))}
          </ul>
          <div className="mt-8 text-center">
            <Link href="/admission/" className="btn-accent">Apply for Admission</Link>
          </div>
        </div>
      </section>
    </main>
  );
  }
