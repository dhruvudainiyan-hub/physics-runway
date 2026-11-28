"use client";
import { useCallback, useEffect, useState } from "react";
import { ChevronDown, Upload, Trash2, Loader2, Eye } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { freeCategories, KINDS, MIME } from "@/lib/freeResources";
import { Loading, ErrorBox } from "@/components/DashUI";

const MAX_MB = 20;
const inputCls = "w-full min-w-0 rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100";
const COLS = ["video_url", "notes_path", "ppt_path", "questions_path", "answers_path"];

export default function FreeResourcesAdmin() {
  const [cat, setCat] = useState("class-11");
  const [rows, setRows] = useState({});
  const [state, setState] = useState({ loading: true, error: "" });
  const [open, setOpen] = useState(null);
  const [video, setVideo] = useState({});
  const [busy, setBusy] = useState("");
  const [msg, setMsg] = useState(null);

  const category = freeCategories.find((c) => c.slug === cat);
  const bucket = () => supabase.storage.from("free-resources");

  const load = useCallback(async () => {
    const { data, error } = await supabase.from("free_resources").select("*").eq("category", cat);
    if (error) return setState({ loading: false, error: "Could not load. Please refresh." });
    const map = {};
    (data || []).forEach((r) => { map[r.chapter_slug] = r; });
    setRows(map);
    setVideo({});
    setState({ loading: false, error: "" });
  }, [cat]);

  useEffect(() => { setState({ loading: true, error: "" }); setOpen(null); setMsg(null); load(); }, [load]);

  const upsertRow = (slug, patch) =>
    supabase.from("free_resources").upsert(
      { category: cat, chapter_slug: slug, ...patch, updated_at: new Date().toISOString() },
      { onConflict: "category,chapter_slug" }
    );

  async function saveVideo(slug) {
    setMsg(null);
    const v = (video[slug] ?? rows[slug]?.video_url ?? "").trim();
    if (v && !/^https:\/\//i.test(v)) return setMsg({ ok: false, text: "The video link must start with https://" });
    setBusy(`${slug}:video`);
    const { error } = await upsertRow(slug, { video_url: v || null });
    setBusy("");
    if (error) return setMsg({ ok: false, text: "Could not save the video link." });
    setMsg({ ok: true, text: v ? "Video link saved." : "Video link removed." });
    load();
  }

  async function uploadFile(slug, kind, file) {
    setMsg(null);
    if (!file) return;
    const ext = (file.name.split(".").pop() || "").toLowerCase();
    if (!kind.exts.includes(ext)) return setMsg({ ok: false, text: `${kind.label}: only ${kind.exts.join(" or ").toUpperCase()} files are allowed.` });
    if (file.size > MAX_MB * 1024 * 1024) return setMsg({ ok: false, text: `File is too large. The limit is ${MAX_MB} MB.` });

    setBusy(`${slug}:${kind.key}`);
    const path = `${cat}/${slug}/${crypto.randomUUID()}/${cat}-${slug}-${kind.key}.${ext}`;
    const up = await bucket().upload(path, file, { contentType: MIME[ext] });
    if (up.error) { setBusy(""); return setMsg({ ok: false, text: "Upload failed. Please try again." }); }

    const { error } = await upsertRow(slug, { [kind.col]: path });
    if (error) {
      await bucket().remove([path]);
      setBusy("");
      return setMsg({ ok: false, text: "Could not save the file. Please try again." });
    }
    const old = rows[slug]?.[kind.col];
    if (old) await bucket().remove([old]);
    setBusy("");
    setMsg({ ok: true, text: `${kind.label} uploaded.` });
    load();
  }

  async function removeFile(slug, kind) {
    const old = rows[slug]?.[kind.col];
    if (!old || !window.confirm(`Remove the ${kind.label} file? Visitors will no longer see it.`)) return;
    setBusy(`${slug}:${kind.key}`);
    const { error } = await upsertRow(slug, { [kind.col]: null });
    if (!error) await bucket().remove([old]);
    setBusy("");
    if (error) return setMsg({ ok: false, text: "Could not remove the file." });
    setMsg({ ok: true, text: `${kind.label} removed.` });
    load();
  }

  const view = (path) => window.open(bucket().getPublicUrl(path).data.publicUrl, "_blank");
  const parts = [...new Set(category.chapters.map((c) => c.part))];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold">Free Resources</h1>
        <p className="text-sm text-slate-500">Public videos, notes, PPTs and questions. Each category has its own uploads.</p>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {freeCategories.map((c) => (
          <button key={c.slug} onClick={() => setCat(c.slug)}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${cat === c.slug ? "bg-navy-900 text-white" : "bg-white text-slate-600"}`}>
            {c.title}
          </button>
        ))}
      </div>

      {state.error && <ErrorBox text={state.error} />}
      {msg && <p className={`mb-4 rounded-lg p-3 text-sm ${msg.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>{msg.text}</p>}
      {state.loading ? <Loading /> : (
        <div className="space-y-8">
          {parts.map((part) => (
            <div key={part}>
              {parts.length > 1 && <h2 className="mb-3 text-lg font-bold">{part}</h2>}
              <div className="space-y-3">
                {category.chapters.filter((c) => c.part === part).map((ch) => {
                  const r = rows[ch.slug];
                  const filled = COLS.filter((k) => r?.[k]).length;
                  const isOpen = open === ch.slug;
                  return (
                    <div key={ch.slug} className="card !p-4">
                      <button onClick={() => setOpen(isOpen ? null : ch.slug)} className="flex w-full items-center justify-between gap-3 text-left">
                        <div className="min-w-0">
                          <p className="font-semibold text-navy-900">Chapter {ch.number}: {ch.title}</p>
                          <p className={`text-xs font-semibold ${filled === 5 ? "text-green-700" : "text-slate-500"}`}>{filled} of 5 added</p>
                        </div>
                        <ChevronDown className={`h-5 w-5 shrink-0 transition ${isOpen ? "rotate-180" : ""}`} />
                      </button>

                      {isOpen && (
                        <div className="mt-4 space-y-4 border-t border-slate-100 pt-4">
                          <div>
                            <label className="mb-1 block text-sm font-semibold">Video link (YouTube or any https link)</label>
                            <div className="flex flex-col gap-2 sm:flex-row">
                              <input className={inputCls} placeholder="https://www.youtube.com/watch?v=..."
                                value={video[ch.slug] ?? r?.video_url ?? ""} onChange={(e) => setVideo({ ...video, [ch.slug]: e.target.value })} />
                              <button onClick={() => saveVideo(ch.slug)} disabled={busy === `${ch.slug}:video`} className="btn-primary !py-2.5 text-sm disabled:opacity-60">
                                {busy === `${ch.slug}:video` ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
                              </button>
                            </div>
                          </div>

                          {KINDS.map((k) => {
                            const has = r?.[k.col];
                            const working = busy === `${ch.slug}:${k.key}`;
                            return (
                              <div key={k.key} className="rounded-xl bg-slate-50 p-3">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                  <div>
                                    <p className="text-sm font-semibold">{k.label}</p>
                                    <p className={`text-xs font-semibold ${has ? "text-green-700" : "text-slate-400"}`}>{has ? "Uploaded" : "Not uploaded"} · {k.exts.join(", ").toUpperCase()}</p>
                                  </div>
                                  <div className="flex flex-wrap items-center gap-2">
                                    {has && <button onClick={() => view(has)} className="btn-outline !px-3 !py-1.5 text-xs"><Eye className="h-4 w-4" /> View</button>}
                                    <label className={`btn-primary cursor-pointer !px-3 !py-1.5 text-xs ${working ? "opacity-60" : ""}`}>
                                      {working ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} {has ? "Replace" : "Upload"}
                                      <input type="file" accept={k.accept} className="hidden" disabled={working}
                                        onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ""; uploadFile(ch.slug, k, f); }} />
                                    </label>
                                    {has && <button onClick={() => removeFile(ch.slug, k)} disabled={working} className="rounded-xl border-2 border-red-200 px-3 py-1.5 text-red-600 hover:bg-red-50" aria-label="Remove"><Trash2 className="h-4 w-4" /></button>}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
