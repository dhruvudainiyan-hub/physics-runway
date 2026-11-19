"use client";
import { useBatchData } from "@/lib/useStudentData";
import { Loading, Empty, ErrorBox, PageTitle, fmtDate } from "@/components/DashUI";

function status(due) {
  if (!due) return { text: "No due date", cls: "bg-slate-100 text-slate-600" };
  const days = Math.ceil((new Date(due + "T23:59:59") - new Date()) / 86400000);
  if (days < 0) return { text: "Past due", cls: "bg-red-50 text-red-700" };
  if (days <= 2) return { text: `Due in ${days + 1} day${days ? "s" : ""}`, cls: "bg-accent-400/30 text-navy-900" };
  return { text: `Due ${fmtDate(due)}`, cls: "bg-brand-50 text-brand-600" };
}

export default function Assignments() {
  const { loading, error, rows, enrollments } = useBatchData("assignments", { orderBy: "due_date", ascending: true });
  if (loading) return <Loading />;
  const batchName = (id) => enrollments.find((e) => e.batch.id === id)?.batch.name;

  return (
    <div>
      <PageTitle title="Assignments" subtitle="Work given by your teachers" />
      {error && <ErrorBox text={error} />}
      {!error && rows.length === 0 && <Empty title="No assignments" text="Nothing has been assigned yet." />}
      <div className="space-y-3">
        {rows.map((a) => {
          const s = status(a.due_date);
          return (
            <div key={a.id} className="card !p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <p className="font-semibold text-navy-900">{a.title}</p>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${s.cls}`}>{s.text}</span>
              </div>
              <p className="text-xs text-slate-500">{batchName(a.batch_id)}</p>
              {a.description && <p className="mt-2 text-sm text-slate-600">{a.description}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
    }
