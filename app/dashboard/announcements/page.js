"use client";
import { useBatchData } from "@/lib/useStudentData";
import { Loading, Empty, ErrorBox, PageTitle, fmtDate } from "@/components/DashUI";

export default function Announcements() {
  const { loading, error, rows, enrollments } = useBatchData("announcements", { global: true });
  if (loading) return <Loading />;
  const batchName = (id) => (id ? enrollments.find((e) => e.batch.id === id)?.batch.name : "Everyone");

  return (
    <div>
      <PageTitle title="Announcements" subtitle="News from the institute and your batches" />
      {error && <ErrorBox text={error} />}
      {!error && rows.length === 0 && <Empty title="No announcements" text="Check back later." />}
      <div className="space-y-3">
        {rows.map((a) => (
          <div key={a.id} className="card !p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-semibold text-navy-900">{a.title}</p>
              <span className="text-xs text-slate-400">{fmtDate(a.created_at)}</span>
            </div>
            <span className="mt-1 inline-block rounded-full bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-600">{batchName(a.batch_id)}</span>
            {a.body && <p className="mt-2 text-sm text-slate-600">{a.body}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
