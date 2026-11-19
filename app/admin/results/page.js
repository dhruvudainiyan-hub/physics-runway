"use client";
import { useCallback, useEffect, useState } from "react";
import { Trash2, Loader2, Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Loading, Empty, ErrorBox, fmtDate } from "@/components/DashUI";

const inputCls = "w-full min-w-0 rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100";
const today = () => new Date().toISOString().slice(0, 10);

export default function ResultsAdmin() {
  const [s, setS] = useState({ loading: true, error: "", students: [], batches: [], items: [] });
  const [f, setF] = useState({ student_id: "", batch_id: "", test_name: "", score: "", max_score: "", test_date: today() });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);

  const load = useCallback(async () => {
    const [p, b, r] = await Promise.all([
      supabase.from("profiles").select("id,full_name,phone").eq("role", "student").order("full_name"),
      supabase.from("batches").select("id,name").order("name"),
      supabase.from("test_results").select("*, student:profiles(full_name), batch:batches(name)").order("test_date", { ascending: false }).limit(100),
    ]);
    if (p.error || b.error || r.error) return setS((x) => ({ ...x, loading: false, error: "Could not load results. Please refresh." }));
    setS({ loading: false, error: "", students: p.data || [], batches: b.data || [], items: r.data || [] });
  }, []);
  useEffect(() => { load(); }, [load]);

  async function add(e) {
    e.preventDefault();
    setMsg(null);
    const score = Number(f.score), max = Number(f.max_score);
    if (!f.student_id) return setMsg({ ok: false, text: "Choose a student." });
    if (f.test_name.trim().length < 2) return setMsg({ ok: false, text: "Enter the test name." });
    if (f.score === "" || Number.isNaN(score) || score < 0) return setMsg({ ok: false, text: "Enter a valid score." });
    if (!(max > 0)) return setMsg({ ok: false, text: "Enter the maximum marks." });
    if (score > max) return setMsg({ ok: false, text: "The score cannot be higher than the maximum marks." });

    setBusy(true);
    const { error } = await supabase.from("test_results").insert({
      student_id: f.student_id, batch_id: f.batch_id || null, test_name: f.test_name.trim(),
      score, max_score: max, test_date: f.test_date || today(),
    });
    setBusy(false);
    if (error) return setMsg({ ok: false, text: "Could not save the result. Please try again." });
    setF({ ...f, test_name: f.test_name, score: "" });
    setMsg({ ok: true, text: "Result saved. Change the student and enter the next score." });
    load();
  }

  async function remove(r) {
    if (!window.confirm("Delete this result?")) return;
    const { error } = await supabase.from("test_results").delete().eq("id", r.id);
    if (error) return setMsg({ ok: false, text: "Could not delete it." });
    load();
  }

  if (s.loading) return <Loading />;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold">Test Results</h1>
        <p className="text-sm text-slate-500">Each student sees only their own scores</p>
      </div>
      {s.error && <ErrorBox text={s.error} />}

      {s.students.length === 0 ? (
        <Empty title="No students yet" text="Create a student account first." />
      ) : (
        <form onSubmit={add} className="card mb-6 space-y-4">
          <h2 className="text-lg font-bold">Add a result</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-semibold">Student *</label>
              <select className={inputCls} value={f.student_id} onChange={(e) => setF({ ...f, student_id: e.target.value })}>
                <option value="">Choose a student</option>
                {s.students.map((st) => <option key={st.id} value={st.id}>{st.full_name || "Unnamed"} (+{st.phone})</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold">Batch (optional)</label>
              <select className={inputCls} value={f.batch_id} onChange={(e) => setF({ ...f, batch_id: e.target.value })}>
                <option value="">None</option>
                {s.batches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold">Test name *</label>
            <input className={inputCls} value={f.test_name} onChange={(e) => setF({ ...f, test_name: e.target.value })} placeholder="Unit Test 1" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-semibold">Score *</label>
              <input className={inputCls} inputMode="decimal" value={f.score} onChange={(e) => setF({ ...f, score: e.target.value })} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold">Out of *</label>
              <input className={inputCls} inputMode="decimal" value={f.max_score} onChange={(e) => setF({ ...f, max_score: e.target.value })} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold">Date</label>
              <input type="date" className={inputCls} value={f.test_date} onChange={(e) => setF({ ...f, test_date: e.target.value })} />
            </div>
          </div>
          {msg && <p className={`rounded-lg p-3 text-sm ${msg.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>{msg.text}</p>}
          <button type="submit" disabled={busy} className="btn-primary w-full disabled:opacity-60">
            {busy ? <><Loader2 className="h-5 w-5 animate-spin" /> Saving…</> : <><Plus className="h-5 w-5" /> Save result</>}
          </button>
        </form>
      )}

      {!s.error && s.items.length === 0 && s.students.length > 0 && <Empty title="No results yet" />}
      <div className="space-y-3">
        {s.items.map((r) => (
          <div key={r.id} className="card flex items-start justify-between gap-3 !p-4">
            <div className="min-w-0">
              <p className="font-semibold text-navy-900">{r.student?.full_name || "Student"} · {r.test_name}</p>
              <p className="text-xs text-slate-500">{[r.batch?.name, fmtDate(r.test_date)].filter(Boolean).join(" · ")}</p>
              <p className="mt-1 text-sm font-bold">{r.score} / {r.max_score} <span className="text-brand-600">({Math.round((r.score / r.max_score) * 100)}%)</span></p>
            </div>
            <button onClick={() => remove(r)} className="shrink-0 rounded-xl border-2 border-red-200 px-3 py-2 text-red-600 hover:bg-red-50" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
