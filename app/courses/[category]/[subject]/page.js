import Link from "next/link";
import { Clock, CalendarDays, Users, Video, CheckCircle2, BadgeIndianRupee } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import ImageBox from "@/components/ImageBox";
import CourseCard from "@/components/CourseCard";
import { courses } from "@/lib/siteData";
import { faculty } from "@/lib/homeData";
import { syllabus, batchInfo } from "@/lib/syllabus";

export const dynamicParams = false;

export function generateStaticParams() {
  return courses.map((c) => ({ category: c.category, subject: c.subject }));
}

export function generateMetadata({ params }) {
  const c = courses.find((x) => x.id === `${params.category}-${params.subject}`);
  return { title: `${c?.title} | Physics Runway` };
}

export default function CourseDetails({ params }) {
  const course = courses.find((x) => x.id === `${params.category}-${params.subject}`);
  const teacher = faculty.find((f) => (f.teaches || [f.subject]).includes(course.subjectName));
  const topics = syllabus[course.id] || syllabus[course.subject] || [];
  const related = courses.filter((c) => c.category === course.category && c.id !== course.id);

  const facts = [
    { Icon: Clock, label: "Duration", value: course.duration },
    { Icon: Users, label: "Batch", value: batchInfo.name },
    { Icon: CalendarDays, label: "Timing", value: batchInfo.timing },
    { Icon: Video, label: "Mode", value: batchInfo.mode },
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
          {/* Price card (shown first on phones) */}
          <aside className="order-first lg:order-last">
            <div className="card sticky top-24">
              <p className="text-sm text-slate-500">Monthly fee</p>
              <p className="flex items-center gap-1 font-heading text-4xl font-extrabold text-navy-900">
                <BadgeIndianRupee className="h-8 w-8 text-brand-600" />
                {course.fee.toLocaleString("en-IN")}
              </p>
              <ul className="mt-5 space-y-3">
                {facts.map(({ Icon, label, value }) => (
                  <li key={label} className="flex items-start gap-3 text-sm">
                    <Icon className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
                    <span><span className="block text-slate-500">{label}</span><span className="font-semibold text-navy-900">{value}</span></span>
                  </li>
                ))}
              </ul>
              {/* Enrollment page is built in Stages 5 to 7 */}
              <Link href={`/admission/?course=${course.id}`} className="btn-accent mt-6 w-full">Apply for Admission</Link>
              <p className="mt-2 text-center text-xs text-slate-400">Fees are paid in person at the institute.</p>
            </div>
          </aside>

          {/* Main content */}
          <div className="space-y-8 lg:col-span-2">
            <ImageBox src={course.image} alt={`${course.title} thumbnail`} label={`${course.title} thumbnail`} ratio="aspect-video" className="shadow-lg" />

            <div className="card">
              <h2 className="text-2xl font-bold">About this course</h2>
              <p className="mt-3">{course.description} </p>
            </div>

            <div className="card">
              <h2 className="text-2xl font-bold">Syllabus</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {topics.map((t, i) => (
                  <li key={t} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
                    <span className="font-semibold text-navy-900">Chapter {i + 1}:</span> {t}
                  </li>
                ))}
              </ul>
            </div>

            <div className="card">
              <h2 className="text-2xl font-bold">Batch information</h2>
              <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <p><span className="block text-slate-500">Batch</span><span className="font-semibold text-navy-900">{batchInfo.name}</span></p>
                <p><span className="block text-slate-500">Seats</span><span className="font-semibold text-navy-900">{batchInfo.seats}</span></p>
                <p><span className="block text-slate-500">Timing</span><span className="font-semibold text-navy-900">{batchInfo.timing}</span></p>
                <p><span className="block text-slate-500">Start</span><span className="font-semibold text-navy-900">{batchInfo.start}</span></p>
              </div>
            </div>

            {teacher && (
              <div className="card">
                <h2 className="text-2xl font-bold">Your faculty</h2>
                <div className="mt-4 flex items-start gap-4">
                  <div className="w-24 shrink-0">
                    <ImageBox src={teacher.image} alt={`${teacher.subject} faculty`} label="Photo" ratio="aspect-[4/5]" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-navy-900">{teacher.name}</p>
                    <p className="text-sm text-slate-500">{teacher.qualification} · {teacher.experience}</p>
                    <p className="mt-2 text-sm">{teacher.bio}</p>
                  </div>
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
