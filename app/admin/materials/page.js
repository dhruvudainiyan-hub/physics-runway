"use client";
import { useCallback, useEffect, useState } from "react";
import { Upload, Trash2, Download, FileText, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Loading, Empty, ErrorBox, fmtDate } from "@/components/DashUI";

const inputCls = "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100";
const MAX_MB = 20;
const TYPES = [
  "application/pdf", "image/png", "image/jpeg",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
];

export default function MaterialsAdmin() {
  const [s, setS] = useState({ loading: true, error: "", batches: [], items: [] });
  const [f, setF] = useState({ batch_id: "", title: "", subject: "", description: "" });
  const [file, setFile] = useState(null);
  const [fileKey, setFileKey] = useState(0);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);

  const load = useCallback(async () => {
    const [b, m] = await Promise.all([
      supabase.from("batches").select("id,name,subject").order("name"),
      supabase.from("materials").select("*, batch:batches(name)").order("created_at", { ascending: false }),
    ]);
    if (b.error || m.error) return setS((x) => ({ ...x, loading: false, error: "Could not load materials. Please refresh." }));
    setS({ loading: false, error: "", batches: b.data || [], items: m.data || [] });
  }, []);

  useEffect(() => { load(); }, [load]);

  function pickBatch(id) {
    const b = s.batches.find((x) => x.id === id);
    setF({ ...f, batch_id: id, subject: f.subject || b?.subject || "" });
  }

  async function upload(e) {
    e.preventDefault();
    setMsg(null);
    if (!f.batch_id) return setMsg({ ok: false, text: "Choose a batch." });
    if (f.title.trim().length < 3) return setMsg({ ok: false, text: "Enter a title." });
    if (!file) return setMsg({ ok: false, text: "Choose a file." });
    if (!TYPES.includes(file.type)) return setMsg({ ok: false, text: "Only PDF, Word, PowerPoint, PNG or JPG files are allowed." });
    if (file.size > MAX_MB * 1024 * 1024) return setMsg({ ok: false, text: `File is too large. The limit is ${MAX_MB} MB.` });

    setBusy(true);
    const safe = file.name.replace(/[^A-Za-z0-9._-]/g, "_");
    const path = `${f.batch_id}/${crypto.randomUUID()}-${safe}`;

    const up = await supabase.storage.from("materials").upload(path, file, { contentType: file.type });
    if (up.error) { setBusy(false); return setMsg({ ok: false, text: "Upload failed. Please try again." }); }

    const { error } = await supabase.from("materials").insert({
      batch_id: f.batch_id, title: f.title.trim(), subject: f.subject.trim() || null,
      description: f.description.trim() || null, file_path: path,
    });
    if (error) {
      await supabase.storage.from("materials").remove([path]);
      setBusy(false);
      return setMsg({ ok: false, text: "Could not save the material. Please try again." });
    }
    setBusy(false);
    setF({ batch_id: f.batch_id, title: "", subject: f.subject, description: "" });
    setFile(null); setFileKey((k) => k + 1);
    setMsg({ ok: true, text: "Uploaded. Only students in that batch can see it." });
    load();
  }

  async function open(m) {
    const { data, error } = await supabase.storage.from("materials").createSignedUrl(m.file_path, 60);
    if (error || !data?.signedUrl) return setMsg({ ok: false, text: "Could not open the file." });
    window.open(data.signedUrl, "_blank");
  }

  async function remove(m) {
    if (!window.confirm(`Delete "${m.title}"? Students will lose access to it.`)) return;
    const { error } = await supabase.from("materials").delete().eq("id", m.id);
    if (error) return setMsg({ ok: false, text: "Could not delete it." });
    if (m.file_path) await supabase.storage.from("materials").remove([m.file_path]);
    load();
  }

  if (s.loading) return <Loading />;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold">Study Materials</h1>
        <p className="text-sm text-slate-500">Upload files for one batch at a time</p>
      </div>
      {s.error && <ErrorBox text={s.error} />}

      {s.batches.length === 0 ? (
        <Empty title="Create a batch first" text="Materials are uploaded to a batch. Open Batches to create one." />
      ) : (
        <form onSubmit={upload} className="card mb-6 space-y-4">
          <h2 className="text-lg font-bold">Upload material</h2>
          <div>
            <label className="mb-1 block text-sm font-semibold">Batch *</label>
            <select className={inputCls} value={f.batch_id} onChange={(e) => pickBatch(e.target.value)}>
              <option value="">Choose a batch</option>
              {s.batches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-semibold">Title *</label>
              <input className={inputCls} value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold">Subject</label>
              <input className={inputCls} value={f.subject} onChange={(e) => setF({ ...f, subject: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold">Description</label>
            <textarea rows={2} className={inputCls} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold">File * (PDF, Word, PowerPoint, PNG, JPG, up to {MAX_MB} MB)</label>
            <input key={fileKey} type="file" accept=".pdf,.png,.jpg,.jpeg,.docx,.pptx" onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-brand-50 file:px-4 file:py-2 file:font-semibold file:text-brand-600" />
          </div>
          {msg && <p className={`rounded-lg p-3 text-sm ${msg.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>{msg.text}</p>}
          <button type="submit" disabled={busy} className="btn-primary w-full disabled:opacity-60">
            {busy ? <><Loader2 className="h-5 w-5 animate-spin" /> Uploading…</> : <><Upload className="h-5 w-5" /> Upload</>}
          </button>
        </form>
      )}

      {!s.error && s.items.length === 0 && s.batches.length > 0 && <Empty title="No materials yet" text="Uploaded files will appear here." />}

      <div className="space-y-3">
        {s.items.map((m) => (
          <div key={m.id} className="card flex flex-wrap items-center justify-between gap-3 !p-4">
            <div className="flex min-w-0 items-start gap-3">
              <span className="rounded-xl bg-brand-50 p-2 text-brand-600"><FileText className="h-5 w-5" /></span>
              <div className="min-w-0">
                <p className="font-semibold text-navy-900">{m.title}</p>
                <p className="text-xs text-slate-500">{[m.batch?.name, m.subject, fmtDate(m.created_at)].filter(Boolean).join(" · ")}</p>
                {!m.file_path && <p className="text-xs text-amber-600">Sample entry: no file attached</p>}
              </div>
            </div>
            <div className="flex gap-2">
              {m.file_path && <button onClick={() => open(m)} className="btn-outline !px-3 !py-2" aria-label="Open"><Download className="h-4 w-4" /></button>}
              <button onClick={() => remove(m)} className="rounded-xl border-2 border-red-200 px-3 py-2 text-red-600 hover:bg-red-50" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
        }
