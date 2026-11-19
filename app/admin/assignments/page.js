"use client";
import { useCallback, useEffect, useState } from "react";
import { Trash2, Loader2, Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Loading, Empty, ErrorBox, fmtDate } from "@/components/DashUI";

const inputCls = "w-full min-w-0 rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100";

export default function AssignmentsAdmin() {
  const [s, setS] = useState({ loading: true, error: "", batches: [], items: [] });
  const [f, setF] = useState({ batch_id: "", title: "", description: "", due_date: "" });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);

  const load = useCallback(async () => {
    const [b, a] = await Promise.all([
      supabase.from("batches").select("id,name").order("name"),
      supabase.from("assignments").select("*, batch:batches(name)").order("created_at", { ascending: false }),
    ]);
    if (b.error || a.error) return setS((x) => ({ ...x, loading: false, error: "Could not load assignments. Please refresh." }));
    setS({ loading: false, error: "", batches: b.data || [], items: a.data || [] });
  }, []);
  useEffect(() => { load(); }, [load]);

  async function add(e) {
    e.preventDefault();
    setMsg(null);
    if (!f.batch_id) return setMsg({ ok: false, text: "Choose a batch." });
    if (f.title.trim().length < 3) return setMsg({ ok: false, text: "Enter a title." });
    setBusy(true);
    const { error } = await supabase.from("assignments").insert({
      batch_id: f.batch_id, title: f.title.trim(),
      description: f.description.trim() || null, due_date: f.due_date || null,
    });
    setBusy(false);
    if (error) return setMsg({ ok: false, text: "Could not save the assignment. Please try again." });
    setF({ batch_id: f.batch_id, title: "", description: "", due_date: "" });
    setMsg({ ok: true, text: "Assignment added." });
    load();
  }

  async function remove(a) {
    if (!window.confirm(`Delete "${a.title}"?`)) return;
    const { error } = await supabase.from("assignments").delete().eq("id", a.id);
    if (error) return setMsg({ ok: false, text: "Could not delete it." });
    load();
  }

  if (s.loading) return <Loading />;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold">Assignments</h1>
        <p className="text-sm text-slate-500">Given to one batch at a time</p>
      </div>
      {s.error && <ErrorBox text={s.error} />}

      {s.batches.length === 0 ? (
        <Empty title="Create a batch first" text="Assignments belong to a batch. Open Batches to create one." />
      ) : (
        <form onSubmit={add} className="card mb-6 space-y-4">
          <h2 className="text-lg font-bold">New assignment</h2>
          <div>
            <label className="mb-1 block text-sm font-semibold">Batch *</label>
            <select className={inputCls} value={f.batch_id} onChange={(e) => setF({ ...f, batch_id: e.target.value })}>
              <option value="">Choose a batch</option>
              {s.batches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-semibold">Title *</label>
              <input className={inputCls} value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold">Due date</label>
              <input type="date" className={inputCls} value={f.due_date} onChange={(e) => setF({ ...f, due_date: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold">Details</label>
            <textarea rows={3} className={inputCls} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} />
          </div>
          {msg && <p className={`rounded-lg p-3 text-sm ${msg.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>{msg.text}</p>}
          <button type="submit" disabled={busy} className="btn-primary w-full disabled:opacity-60">
            {busy ? <><Loader2 className="h-5 w-5 animate-spin" /> Saving…</> : <><Plus className="h-5 w-5" /> Add assignment</>}
          </button>
        </form>
      )}

      {!s.error && s.items.length === 0 && s.batches.length > 0 && <Empty title="No assignments yet" />}
      <div className="space-y-3">
        {s.items.map((a) => (
          <div key={a.id} className="card flex items-start justify-between gap-3 !p-4">
            <div className="min-w-0">
              <p className="font-semibold text-navy-900">{a.title}</p>
              <p className="text-xs text-slate-500">{[a.batch?.name, a.due_date ? `Due ${fmtDate(a.due_date)}` : "No due date"].join(" · ")}</p>
              {a.description && <p className="mt-1 text-sm text-slate-600">{a.description}</p>}
            </div>
            <button onClick={() => remove(a)} className="shrink-0 rounded-xl border-2 border-red-200 px-3 py-2 text-red-600 hover:bg-red-50" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
