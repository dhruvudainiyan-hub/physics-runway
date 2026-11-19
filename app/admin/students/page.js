"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search, UserPlus, ChevronDown, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Loading, Empty, ErrorBox, fmtDate } from "@/components/DashUI";

const inputCls = "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100";
const today = () => new Date().toISOString().slice(0, 10);

export default function StudentsPage() {
  const [s, setS] = useState({ loading: true, error: "", students: [], enrollments: [], batches: [] });
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(null);
  const [pick, setPick] = useState({ batch: "", until: "" });
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");

  const load = useCallback(async () => {
    const [p, e, b] = await Promise.all([
      supabase.from("profiles").select("id,full_name,phone,class_level,exam_category,city,created_at").eq("role", "student").order("created_at", { ascending: false }),
      supabase.from("enrollments").select("id,student_id,batch_id,status,expires_on,batch:batches(name)"),
      supabase.from("batches").select("id,name,is_active").order("name"),
    ]);
    if (p.error || e.error || b.error) return setS((x) => ({ ...x, loading: false, error: "Could not load students. Please refresh." }));
    setS({ loading: false, error: "", students: p.data || [], enrollments: e.data || [], batches: b.data || [] });
  }, []);

  useEffect(() => { load(); }, [load]);

  async function run(fn, okText) {
    setBusy(true); setNote("");
    const { error } = await fn();
    setBusy(false);
    if (error) return setNote(error.code === "23505" ? "This student is already in that batch." : "That did not work. Please try again.");
    setNote(okText || "");
    await load();
  }

  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    return s.students.filter((x) => !t || (x.full_name || "").toLowerCase().includes(t) || (x.phone || "").includes(t.replace(/\D/g, "") || "~"));
  }, [q, s.students]);

  if (s.loading) return <Loading />;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">Students</h1>
          <p className="text-sm text-slate-500">{s.students.length} registered</p>
        </div>
        <Link href="/admin/students/new/" className="btn-primary !py-2.5"><UserPlus className="h-5 w-5" /> Create student</Link>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <input className={`${inputCls} !py-3 pl-10`} placeholder="Search by name or mobile number" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      {s.error && <ErrorBox text={s.error} />}
      {!s.error && list.length === 0 && <Empty title="No students found" text={s.students.length ? "Try a different search." : "Create your first student account."} />}

      <div className="space-y-3">
        {list.map((st) => {
          const mine = s.enrollments.filter((e) => e.student_id === st.id);
          const taken = mine.map((e) => e.batch_id);
          const free = s.batches.filter((b) => b.is_active && !taken.includes(b.id));
          const isOpen = open === st.id;
          return (
            <div key={st.id} className="card !p-4">
              <button onClick={() => { setOpen(isOpen ? null : st.id); setPick({ batch: "", until: "" }); setNote(""); }} className="flex w-full items-center justify-between gap-3 text-left">
                <div className="min-w-0">
                  <p className="font-semibold text-navy-900">{st.full_name || "Unnamed"}</p>
                  <p className="text-xs text-slate-500">+{st.phone} · {[st.class_level, st.exam_category].filter(Boolean).join(" · ")}</p>
                  <p className="mt-1 text-xs text-slate-500">{mine.filter((e) => e.status === "active").length} active batch(es)</p>
                </div>
                <ChevronDown className={`h-5 w-5 shrink-0 transition ${isOpen ? "rotate-180" : ""}`} />
              </button>

              {isOpen && (
                <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
                  <p className="text-sm font-bold">Batches</p>
                  {mine.length === 0 && <p className="text-sm text-slate-500">Not enrolled in any batch.</p>}
                  {mine.map((e) => {
                    const expired = e.expires_on && e.expires_on < today();
                    return (
                      <div key={e.id} className="rounded-xl bg-slate-50 p-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="text-sm font-semibold">{e.batch?.name}</p>
                          <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${e.status === "active" && !expired ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                            {e.status === "revoked" ? "Revoked" : expired ? "Expired" : "Active"}
                          </span>
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                          <label className="text-slate-500">Access until</label>
                          <input type="date" defaultValue={e.expires_on || ""} className="rounded-lg border border-slate-300 px-2 py-1"
                            onChange={(ev) => run(() => supabase.from("enrollments").update({ expires_on: ev.target.value || null }).eq("id", e.id))} />
                          <button disabled={busy} onClick={() => run(() => supabase.from("enrollments").update({ status: e.status === "active" ? "revoked" : "active" }).eq("id", e.id))}
                            className="rounded-lg border border-brand-600 px-3 py-1 font-semibold text-brand-600">{e.status === "active" ? "Revoke access" : "Restore access"}</button>
                          <button disabled={busy} onClick={() => window.confirm("Remove this student from the batch?") && run(() => supabase.from("enrollments").delete().eq("id", e.id))}
                            className="rounded-lg border border-red-300 px-3 py-1 font-semibold text-red-600">Remove</button>
                        </div>
                      </div>
                    );
                  })}

                  <div className="rounded-xl border border-dashed border-brand-200 p-3">
                    <p className="mb-2 text-sm font-bold">Enroll in a batch</p>
                    {free.length === 0 ? (
                      <p className="text-sm text-slate-500">No other active batches available. <Link href="/admin/batches/" className="font-semibold text-brand-600">Create one</Link>.</p>
                    ) : (
                      <div className="grid gap-2 sm:grid-cols-[1fr_auto_auto]">
                        <select className={inputCls} value={pick.batch} onChange={(e) => setPick({ ...pick, batch: e.target.value })}>
                          <option value="">Choose batch</option>
                          {free.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                        </select>
                        <input type="date" className={inputCls} value={pick.until} onChange={(e) => setPick({ ...pick, until: e.target.value })} title="Access until (optional)" />
                        <button disabled={busy || !pick.batch} className="btn-primary !py-2.5 text-sm disabled:opacity-50"
                          onClick={() => run(() => supabase.from("enrollments").insert({ student_id: st.id, batch_id: pick.batch, expires_on: pick.until || null }), "Student enrolled.").then(() => setPick({ batch: "", until: "" }))}>
                          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enroll"}
                        </button>
                      </div>
                    )}
                  </div>
                  {note && <p className="rounded-lg bg-slate-100 p-2 text-sm">{note}</p>}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
                              }
