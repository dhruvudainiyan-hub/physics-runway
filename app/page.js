"use client";
import Hero from "@/components/Hero";
import SectionHeading from "@/components/SectionHeading";
import CourseCard from "@/components/CourseCard";
import WhyChoose from "@/components/WhyChoose";
import FacultyIntro from "@/components/FacultyIntro";
import FAQ from "@/components/FAQ";
import ContactSection from "@/components/ContactSection";
import Reveal from "@/components/Reveal";
import CountUp from "@/components/CountUp";
import { useContent } from "@/lib/content";

export default function Home() {
  const { courses, stats } = useContent();
  return (
    <main>
      <Hero />

      <section className="border-b border-slate-200 bg-white py-8">
        <div className="container-page">
          <div className="grid grid-cols-2 gap-6 text-center lg:grid-cols-4">
            {stats.map((s, i) => (
              <div key={i}>
                <CountUp value={s.value} className="font-heading text-3xl font-extrabold text-brand-600" />
                <p className="text-sm text-slate-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="courses" className="scroll-mt-20 bg-slate-50 py-16">
        <div className="container-page">
          <SectionHeading center eyebrow="What we teach" title="Our Courses" subtitle="Choose your class and start learning." />
          <div className="flex flex-wrap justify-center gap-6">
            {courses.map((c, i) => (
              <Reveal key={c.id} delay={i * 80} className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
                <CourseCard course={c} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <WhyChoose />
      <FacultyIntro />
      <FAQ />
      <ContactSection />
    </main>
  );
}
