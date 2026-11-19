"use client";
import Link from "next/link";
import { Clock, User } from "lucide-react";
import { useMyBatches } from "@/lib/useStudentData";
import { Loading, Empty, ErrorBox, PageTitle, fmtDate } from "@/components/DashUI";

export default function MyCourses() {
  const { loading, error, enrollments } = useMyBatches();
  if (loading) return <Loading />;
  return (
    <div>
      <PageTitle title="My Courses & Batches" subtitle="Batches you are enrolled in" />
      {error && <ErrorBox text={error} />}
      {!error && enrollments.length === 0 && (
        <Empty title="No batches yet" text="The institute will add you to a batch after admission and fee payment." />
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        {enrollments.map((e) => (
          <div key={e.id} className="card">
            <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600">{e.batch.subject || "Course"}</span>
            <h2 className="mt-3 text-lg font-bold">{e.batch.name}</h2>
            <p className="text-sm text-slate-500">{e.batch.course_title}</p>
            <ul className="mt-3 space-y-1 text-sm text-slate-600">
              {e.batch.teacher && <li className="flex items-center gap-2"><User className="h-4 w-4" />{e.batch.teacher}</li>}
              {e.batch.timing && <li className="flex items-center gap-2"><Clock className="h-4 w-4" />{e.batch.timing}</li>}
            </ul>
            <p className="mt-3 text-xs text-slate-400">
              Enrolled since {fmtDate(e.starts_on)}{e.expires_on ? ` · Access until ${fmtDate(e.expires_on)}` : ""}
            </p>
            <Link href={`/courses/${e.batch.course_id.replace(/^(class-1[12]|jee|neet)-/, "$1/")}/`} className="mt-3 inline-block text-sm font-semibold text-brand-600">
              View course details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
  }
