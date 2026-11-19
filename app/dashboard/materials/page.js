"use client";
import { useState } from "react";
import { Download, FileText, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useBatchData } from "@/lib/useStudentData";
import { Loading, Empty, ErrorBox, PageTitle, fmtDate } from "@/components/DashUI";

export default function Materials() {
  const { loading, error, rows, enrollments } = useBatchData("materials");
  const [busyId, setBusyId] = useState(null);
  const [msg, setMsg] = useState("");

  async function download(m) {
    setMsg("");
    setBusyId(m.id);
    // A short-lived link (60 seconds). The database re-checks enrollment first.
    const { data, error: err } = await supabase.storage.from("materials").createSignedUrl(m.file_path, 60, { download: true });
    setBusyId(null);
    if (err || !data?.signedUrl) return setMsg("You do not have access to this file, or it could not be found.");
    window.location.href = data.signedUrl;
  }

  if (loading) return <Loading />;

  return (
    <div>
      <PageTitle title="Study Materials" subtitle="Only materials from your enrolled batches appear here" />
      {error && <ErrorBox text={error} />}
      {msg && <div className="mb-4"><ErrorBox text={msg} /></div>}
      {!error && rows.length === 0 && (
        <Empty title="No study materials yet" text={enrollments.length === 0 ? "You are not enrolled in a batch yet." : "Your teachers have not uploaded anything yet."} />
      )}
      <div className="space-y-6">
        {enrollments.map((e) => {
          const list = rows.filter((m) => m.batch_id === e.batch.id);
          if (list.length === 0) return null;
          return (
            <div key={e.id}>
              <h2 className="mb-3 text-lg font-bold">{e.batch.name}</h2>
              <div className="space-y-3">
                {list.map((m) => (
                  <div key={m.id} className="card flex flex-wrap items-center justify-between gap-3 !p-4">
                    <div className="flex min-w-0 items-start gap-3">
                      <span className="rounded-xl bg-brand-50 p-2 text-brand-600"><FileText className="h-5 w-5" /></span>
                      <div className="min-w-0">
                        <p className="font-semibold text-navy-900">{m.title}</p>
                        <p className="text-xs text-slate-500">{[m.subject, fmtDate(m.created_at)].filter(Boolean).join(" · ")}</p>
                        {m.description && <p className="mt-1 text-sm text-slate-600">{m.description}</p>}
                      </div>
                    </div>
                    {m.file_path ? (
                      <button onClick={() => download(m)} disabled={busyId === m.id} className="btn-primary !px-4 !py-2 text-sm disabled:opacity-60">
                        {busyId === m.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />} Download
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400">No file attached</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
        }
