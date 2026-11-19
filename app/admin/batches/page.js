"use client";
import { useCallback, useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Loader2, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { courses } from "@/lib/siteData";
import { Loading, Empty, ErrorBox } from "@/components/DashUI";

const inputCls = "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100";
const blank = { id: null, name: "", course_id: "", teacher: "", timing: "", is_active: true };

export default function BatchesPage() {
  const [s, setS] = useState({ loading: true, error: "", batches: [], counts: {} });
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    const [b, e] = await Promise.all([
      supabase.from("batches").select("*").order("created_at", { ascending: false }),
      supabase.from("enrollments").select("batch_id").eq("status", "active"),
    ]);
    if (b.error || e.error) return setS({ loading: false, error: "Could not load batches. Please refresh.", batches: [], counts: {} });
    const counts = {};
    (e.data || []).forEach((r) => { counts[r.batch_id] = (counts[r.batch_id] || 0) + 1; });
    setS({ loading: false, error: "", batches: b.data || [], counts });
  }, []);

  useEffect(() => { load(); }, [load]);

  async function save(e) {
    e.preventDefault();
    setMsg("");
    const course = courses.find((c) => c.id === form.course_id);
    if (form.name.trim().length < 3) return setMsg("Enter a batch name (for example: Class 11 Physics – Batch A).");
    if (!course) return setMsg("Choose a course.");
    setSaving(true);
    const row = {
      name: form.name.trim(), course_id: course.id, course_title: course.title, subject: course.subjectName,
      teacher: form.teacher.trim() || null, timing: form.timing.trim() || null, is_active: form.is_active,
    };
    const { error } = form.id
      ? await supabase.from("batches").update(row).eq("id", form.id)
      : await supabase.from("batches").insert(row);
    setSaving(false);
    if (error) return setMsg("Could not save the batch. Please try again.");
    setForm(null);
    load();
  }

  async function remove(b) {
    if (!window.confirm(`Delete "${b.name}"?\n\nThis also deletes its enrollments, materials, assignments and announcements. This cannot be undone.`)) return;
    const { error } = await supabase.from("batches").delete().eq("id", b.id);
    if (error) return setS((p) => ({ ...p, error: "Could not delete the batch." }));
    load();
  }

  if (s.loading) return <Loading />;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">Batches</h1>
          <p className="text-sm text-slate-500">Each batch has its own students and materials</p>
        </div>
        <button onClick={() => { setMsg(""); setForm(blank); }} className="btn-primary !py-2.5"><Plus className="h-5 w-5" /> New batch</button>
      </div>

      {s.error && <div className="mb-4"><ErrorBox text={s.error} /></div>}

      {form && (
        <form onSubmit={save} className="card mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">{form.id ? "Edit batch" : "New batch"}</h2>
            <button type="button" onClick={() => setForm(null)} aria-label="Close"><X className="h-5 w-5" /></button>
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold">Batch name *</label>
            <input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Class 11 Physics – Batch A" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold">Course *</label>
            <select className={inputCls} value={form.course_id} onChange={(e) => setForm({ ...form, course_id: e.target.value })}>
              <option value="">Select a course</option>
              {courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-semibold">Teacher</label>
              <input className={inputCls} value={form.teacher} onChange={(e) => setForm({ ...form, teacher: e.target.value })} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold">Timing</label>
              <input className={inputCls} value={form.timing} onChange={(e) => setForm({ ...form, timing: e.target.value })} placeholder="Mon, Wed, Fri · 5 to 7 PM" />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm font-semibold">
            <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} /> Batch is active
          </label>
          {msg && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{msg}</p>}
          <button type="submit" disabled={saving} className="btn-primary w-full disabled:opacity-60">
            {saving ? <><Loader2 className="h-5 w-5 animate-spin" /> Saving…</> : "Save batch"}
          </button>
        </form>
      )}

      {!s.error && s.batches.length === 0 && <Empty title="No batches yet" text="Tap New batch to create your first one." />}

      <div className="space-y-3">
        {s.batches.map((b) => (
          <div key={b.id} className="card flex flex-wrap items-center justify-between gap-3 !p-4">
            <div className="min-w-0">
              <p className="font-semibold text-navy-900">{b.name}</p>
              <p className="text-xs text-slate-500">{[b.course_title, b.teacher, b.timing].filter(Boolean).join(" · ")}</p>
              <p className="mt-1 text-xs">
                <span className={`rounded-full px-2 py-0.5 font-semibold ${b.is_active ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-500"}`}>{b.is_active ? "Active" : "Inactive"}</span>
                <span className="ml-2 text-slate-500">{s.counts[b.id] || 0} student(s)</span>
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setMsg(""); setForm({ id: b.id, name: b.name, course_id: b.course_id, teacher: b.teacher || "", timing: b.timing || "", is_active: b.is_active }); }}
                className="btn-outline !px-3 !py-2 text-sm" aria-label="Edit"><Pencil className="h-4 w-4" /></button>
              <button onClick={() => remove(b)} className="rounded-xl border-2 border-red-200 px-3 py-2 text-red-600 hover:bg-red-50" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
        }
