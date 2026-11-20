import Hero from "@/components/Hero";
import SectionHeading from "@/components/SectionHeading";
import CourseCard from "@/components/CourseCard";
import CategorySection from "@/components/CategorySection";
import SubjectCards from "@/components/SubjectCards";
import WhyChoose from "@/components/WhyChoose";
import FacultyIntro from "@/components/FacultyIntro";
import Testimonials from "@/components/Testimonials";
import ResultsSection from "@/components/ResultsSection";
import FAQ from "@/components/FAQ";
import ContactSection from "@/components/ContactSection";
import Reveal from "@/components/Reveal";
import CountUp from "@/components/CountUp";
import { categories, courses, popularIds, stats } from "@/lib/siteData";

export default function Home() {
  const popular = popularIds.map((id) => courses.find((c) => c.id === id)).filter(Boolean);

  return (
    <main>
      <Hero />

      <section className="border-b border-slate-200 bg-white py-8">
        <div className="container-page">
          <div className="grid grid-cols-2 gap-6 text-center lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label}>
                <CountUp value={s.value} className="font-heading text-3xl font-extrabold text-brand-600" />
                <p className="text-sm text-slate-500">{s.label}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-center text-xs text-slate-400">Demo website: all figures and fees are sample data.</p>
        </div>
      </section>

      <section id="courses" className="scroll-mt-20 bg-slate-50 py-16">
        <div className="container-page">
          <SectionHeading center eyebrow="Most loved" title="Popular Courses" subtitle="Top picks chosen by students like you." />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {popular.map((c, i) => (
              <Reveal key={c.id} delay={i * 80}><CourseCard course={c} /></Reveal>
            ))}
          </div>
        </div>
      </section>

      {categories.map((cat, i) => (
        <CategorySection
          key={cat.slug}
          category={cat}
          courses={courses.filter((c) => c.category === cat.slug)}
          tinted={i % 2 === 1}
        />
      ))}

      <SubjectCards />
      <WhyChoose />
      <FacultyIntro />
      <Testimonials />
      <ResultsSection />
      <FAQ />
      <ContactSection />
    </main>
  );
}
