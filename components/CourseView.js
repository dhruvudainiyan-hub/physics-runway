"use client";
import Link from "next/link";
import { Clock, Video, CheckCircle2, BadgeIndianRupee } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import ImageBox from "@/components/ImageBox";
import CourseCard from "@/components/CourseCard";
import { syllabus } from "@/lib/syllabus";
import { useContent, safeImage } from "@/lib/content";

export default function CourseView({ courseId }) {
  const { courses, faculty } = useContent();
  const course = courses.find((x) => x.id === courseId);
  if (!course) return null;

  const teachers = faculty.filter((f) => (f.teaches || [f.subject]).includes(course.subjectName));
  const topics = syllabus[course.id] || syllabus[course.subject] || [];
  const related = courses.filter((c) => c.category === course.category && c.id !== course.id);

  const facts = [
    { Icon: Clock, label: "Duration", value: course.duration },
    { Icon: Video, label: "Mode", value: "Offline classroom teaching" },
  ];

  return (
    <main>
      <PageHeader
        eyebrow={course.categoryTitle}
        title={course.title}
        subtitle={course.description}
        crumbs={[{ label: course.categoryTitle, href: `/courses/${course.category}/` }, { label: course.subjectName }]}
      />

      <section className="bg-slate-50 py-12">
        <div className="container-page grid gap-8 lg:grid-cols-3">
          <aside className="order-first lg:order-last">
            <div className="card sticky top-24">
              <p className="text-sm text-slate-500">Monthly fee</p>
              <p className="flex items-center gap-1 font-heading text-4xl font-extrabold text-navy-900">
                <BadgeIndianRupee className="h-8 w-8 text-brand-600" />
                {course.fee.toLocaleString("en-IN")}
                <span className="ml-1 text-base font-medium text-slate-500">/ month</span>
              </p>
              <ul className="mt-5 space-y-3">
                {facts.map(({ Icon, label, value }) => (
                  <li key={label} className="flex items-start gap-3 text-sm">
                    <Icon className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
                    <span><span className="block text-slate-500">{label}</span><span className="font-semibold text-navy-900">{value}</span></span>
                  </li>
                ))}
              </ul>
              <Link href={`/admission/?course=${course.id}`} className="btn-accent mt-6 w-full">Apply for Admission</Link>
              <p className="mt-2 text-center text-xs text-slate-400">Fees are paid in person at the institute.</p>
            </div>
          </aside>

          <div className="space-y-8 lg:col-span-2">
            <ImageBox src={course.image} alt={`${course.title} thumbnail`} label={`${course.title} thumbnail`} ratio="aspect-video" className="shadow-lg" />

            <div className="card">
              <h2 className="text-2xl font-bold">About this course</h2>
              <p className="mt-3">{course.description}</p>
            </div>

            <div className="card">
              <h2 className="text-2xl font-bold">Syllabus</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {topics.map((t, i) => (
                  <li key={t} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
                    <span><span className="font-semibold text-navy-900">Chapter {i + 1}:</span> {t}</span>
                  </li>
                ))}
              </ul>
            </div>

            {teachers.length > 0 && (
              <div className="card">
                <h2 className="text-2xl font-bold">Your faculty</h2>
                <div className="mt-4 space-y-6">
                  {teachers.map((t, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="w-24 shrink-0">
                        <ImageBox src={safeImage(t.image)} alt={`${t.subject} faculty`} label="Photo" ratio="aspect-[4/5]" />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-navy-900">{t.name}</p>
                        <p className="text-sm text-slate-500">{t.qualification} · {t.experience}</p>
                        <p className="mt-2 text-sm">{t.bio}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="bg-white py-12">
          <div className="container-page">
            <h2 className="mb-6 text-2xl font-bold">More {course.categoryTitle} courses</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((c) => <CourseCard key={c.id} course={c} />)}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
