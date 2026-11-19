"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronDown, Phone, MessageCircle, Trash2, UserPlus, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { courses } from "@/lib/siteData";
import { Loading, Empty, ErrorBox, fmtDate } from "@/components/DashUI";

const STATUSES = [
  { key: "new", label: "New", cls: "bg-blue-50 text-blue-700" },
  { key: "contacted", label: "Contacted", cls: "bg-amber-50 text-amber-700" },
  { key: "admitted", label: "Admitted", cls: "bg-green-50 text-green-700" },
  { key: "rejected", label: "Rejected", cls: "bg-red-50 text-red-700" },
];
const badge = (k) => STATUSES.find((s) => s.key === k) || STATUSES[0];

export default function AdmissionsAdmin() {
  const [s, setS] = useState({ loading: true, error: "", rows: [] });
  const [tab, setTab] = useState("all");
  const [open, setOpen] = useState(null);
  const [notes, setNotes] = useState({});
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");

  const load = useCallback(async () => {
    const { data, error } = await supabase.from("admission_applications").select("*").order("created_at", { ascending: false });
    if (error) return setS({ loading: false, error: "Could not load applications. Please refresh.", rows: [] });
    setS({ loading: false, error: "", rows: data || [] });
  }, []);
  useEffect(() => { load(); }, [load]);

  async function patch(id, values, okText) {
    setBusy(true); setNote("");
    const { error } = await supabase.from("admission_applications").update(values).eq("id", id);
    setBusy(false);
    if (error) return setNote("That did not work. Please try again.");
    setNote(okText || "Saved.");
    load();
  }

  async function remove(r) {
    if (!window.confirm(`Delete the application from ${r.full_name}? This cannot be undone.`)) return;
    const { error } = await supabase.from("admission_applications").delete().eq("id", r.id);
    if (error) return setNote("Could not delete it.");
    setOpen(null);
    load();
  }

  const counts = useMemo(() => {
    const c = { all: s.rows.length };
    STATUSES.forEach((x) => { c[x.key] = s.rows.filter((r) => r.status === x.key).length; });
    return c;
  }, [s.rows]);
  const list = tab === "all" ? s.rows : s.rows.filter((r) => r.status === tab);

  if (s.loading) return <Loading />;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold">Admissions</h1>
        <p className="text-sm text-slate-500">Applications from the public admission form</p>
      </div>
      {s.error && <ErrorBox text={s.error} />}

      <div className="-mx-4 mb-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {[{ key: "all", label: "All" }, ...STATUSES].map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${tab === t.key ? "bg-navy-900 text-white" : "bg-white text-slate-600"}`}>
            {t.label} ({counts[t.key] ?? 0})
          </button>
        ))}
      </div>

      {!s.error && list.length === 0 && <Empty title="No applications" text={s.rows.length ? "Nothing in this tab." : "New applications will appear here."} />}

      <div className="space-y-3">
        {list.map((r) => {
          const isOpen = open === r.id;
          const course = courses.find((c) => c.id === r.course_id);
          return (
            <div key={r.id} className="card !p-4">
              <button onClick={() => { setOpen(isOpen ? null : r.id); setNote(""); setNotes((n) => ({ ...n, [r.id]: n[r.id] ?? r.admin_notes ?? "" })); }}
                className="flex w-full items-center justify-between gap-3 text-left">
                <div className="min-w-0">
                  <p className="font-semibold text-navy-900">{r.full_name}</p>
                  <p className="text-xs text-slate-500">{[r.current_class, r.exam_category, fmtDate(r.created_at)].join(" · ")}</p>
                  <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${badge(r.status).cls}`}>{badge(r.status).label}</span>
                </div>
                <ChevronDown className={`h-5 w-5 shrink-0 transition ${isOpen ? "rotate-180" : ""}`} />
              </button>

              {isOpen && (
                <div className="mt-4 space-y-4 border-t border-slate-100 pt-4 text-sm">
                  <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {[
                      ["Student mobile", `+91 ${r.phone}`],
                      ["Email", r.email || "Not provided"],
                      ["Course", course?.title || "Not specified"],
                      ["Preferred subjects", r.preferred_subjects || "Not specified"],
                      ["Parent / guardian", r.parent_name],
                      ["Parent mobile", `+91 ${r.parent_phone}`],
                    ].map(([k, v]) => (
                      <div key={k}><dt className="text-xs text-slate-500">{k}</dt><dd className="break-words font-semibold text-navy-900">{v}</dd></div>
                    ))}
                  </dl>
                  {r.previous_academics && (
                    <div><p className="text-xs text-slate-500">Previous academics</p><p className="whitespace-pre-wrap">{r.previous_academics}</p></div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    <a href={`tel:+91${r.phone}`} className="btn-outline !px-3 !py-2 text-xs"><Phone className="h-4 w-4" /> Call student</a>
                    <a href={`tel:+91${r.parent_phone}`} className="btn-outline !px-3 !py-2 text-xs"><Phone className="h-4 w-4" /> Call parent</a>
                    <a href={`https://wa.me/91${r.phone}`} target="_blank" rel="noreferrer" className="btn-outline !px-3 !py-2 text-xs"><MessageCircle className="h-4 w-4" /> WhatsApp</a>
                  </div>

                  <div>
                    <p className="mb-2 text-xs font-bold uppercase text-slate-500">Status</p>
                    <div className="flex flex-wrap gap-2">
                      {STATUSES.map((st) => (
                        <button key={st.key} disabled={busy || r.status === st.key} onClick={() => patch(r.id, { status: st.key }, "Status updated.")}
                          className={`rounded-full px-4 py-1.5 text-xs font-semibold ${r.status === st.key ? "bg-navy-900 text-white" : "border border-slate-300 text-slate-600"}`}>
                          {st.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold uppercase text-slate-500">Your notes (private)</label>
                    <textarea rows={3} maxLength={2000} className="w-full min-w-0 rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-brand-600"
                      value={notes[r.id] ?? ""} onChange={(e) => setNotes({ ...notes, [r.id]: e.target.value })} />
                    <button disabled={busy} onClick={() => patch(r.id, { admin_notes: (notes[r.id] || "").trim() || null }, "Notes saved.")} className="btn-primary mt-2 !py-2 text-sm">
                      {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save notes"}
                    </button>
                  </div>

                  {r.status === "admitted" && (
                    <Link href="/admin/students/new/" className="btn-accent !py-2 text-sm"><UserPlus className="h-4 w-4" /> Create student account</Link>
                  )}
                  {note && <p className="rounded-lg bg-slate-100 p-2">{note}</p>}
                  <button onClick={() => remove(r)} className="flex items-center gap-1 text-xs font-semibold text-red-600"><Trash2 className="h-4 w-4" /> Delete application</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
    }
