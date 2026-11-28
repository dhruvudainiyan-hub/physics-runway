"use client";
import { useState } from "react";
import { Loader2, Plus, Trash2, RotateCcw, Upload } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useContent, safeUrl, safeMapUrl } from "@/lib/content";
import { courses as coursesDef } from "@/lib/siteData";
import ImageBox from "@/components/ImageBox";
import { Loading, ErrorBox } from "@/components/DashUI";

const inputCls = "w-full min-w-0 rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100";
const BUCKET = "site-images";
const TABS = [["contact", "Contact & Social"], ["courses", "Courses & Fees"], ["faculty", "Faculty"], ["faqs", "FAQ"], ["stats", "Numbers"]];

function Field({ label, hint, children }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-semibold">{label}</label>
      {children}
      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

function SaveBar({ sv }) {
  return (
    <div className="space-y-3 pt-2">
      {sv.msg && <p className={`rounded-lg p-3 text-sm ${sv.msg.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>{sv.msg.text}</p>}
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={sv.submit} disabled={sv.busy} className="btn-primary disabled:opacity-60">
          {sv.busy ? <><Loader2 className="h-5 w-5 animate-spin" /> Saving…</> : "Save changes"}
        </button>
        <button type="button" onClick={sv.reset} disabled={sv.busy} className="btn-outline"><RotateCcw className="h-4 w-4" /> Reset to original</button>
      </div>
    </div>
  );
}

function useSaver(storeKey, onSave, onReset) {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  const sv = { busy, msg, submit: () => {}, reset: async () => {} };
  sv.save = async (value, problem) => {
    if (problem) { setMsg({ ok: false, text: problem }); return false; }
    setBusy(true);
    const ok = await onSave(storeKey, value);
    setBusy(false);
    setMsg(ok ? { ok: true, text: "Saved. The website now shows this." } : { ok: false, text: "Could not save. Please try again." });
    return ok;
  };
  sv.reset = async () => {
    if (!window.confirm("Go back to the original text? Your edits in this tab will be lost.")) return;
    setBusy(true);
    const ok = await onReset(storeKey);
    setBusy(false);
    if (!ok) setMsg({ ok: false, text: "Could not reset. Please try again." });
  };
  return sv;
}

/* ---------------- Contact & Social ---------------- */
function ContactTab({ content, onSave, onReset }) {
  const s = content.site;
  const [f, setF] = useState({
    phone: s.phone || "", email: s.email || "", address: s.address || "", map: s.mapEmbedUrl || "",
    instagram: safeUrl(s.social?.instagram), youtube: safeUrl(s.social?.youtube), facebook: safeUrl(s.social?.facebook),
  });
  const sv = useSaver("site", onSave, onReset);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const cleanMap = (v) => { const m = v.match(/src="([^"]+)"/i); return (m ? m[1] : v).trim(); };

  sv.submit = () => {
    const map = cleanMap(f.map);
    let problem = "";
    if (f.phone.trim().length < 5) problem = "Enter the phone number.";
    else if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) problem = "Enter a valid email address.";
    else if (f.address.trim().length < 5) problem = "Enter the address.";
    else if (map && !safeMapUrl(map)) problem = "The map link must be a Google Maps embed link. It starts with https://www.google.com/maps/embed";
    else {
      for (const [k, label] of [["instagram", "Instagram"], ["youtube", "YouTube"], ["facebook", "Facebook"]]) {
        if (f[k].trim() && !safeUrl(f[k])) { problem = `The ${label} link must start with https://`; break; }
      }
    }
    sv.save({
      phone: f.phone.trim(), email: f.email.trim(), address: f.address.trim(), mapEmbedUrl: map,
      social: { instagram: f.instagram.trim(), youtube: f.youtube.trim(), facebook: f.facebook.trim() },
    }, problem);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Phone number"><input className={inputCls} value={f.phone} onChange={set("phone")} /></Field>
        <Field label="Email"><input className={inputCls} value={f.email} onChange={set("email")} /></Field>
      </div>
      <Field label="Address"><textarea rows={2} className={inputCls} value={f.address} onChange={set("address")} /></Field>
      <Field label="Google Maps embed link" hint="In Google Maps: Share, then Embed a map, then Copy HTML. You can paste the whole thing, and the link is picked out automatically.">
        <textarea rows={3} className={inputCls} value={f.map} onChange={set("map")} />
      </Field>
      <Field label="Instagram link" hint="Leave empty to hide the button."><input className={inputCls} placeholder="https://www.instagram.com/..." value={f.instagram} onChange={set("instagram")} /></Field>
      <Field label="YouTube link"><input className={inputCls} placeholder="https://www.youtube.com/@..." value={f.youtube} onChange={set("youtube")} /></Field>
      <Field label="Facebook link"><input className={inputCls} placeholder="https://www.facebook.com/..." value={f.facebook} onChange={set("facebook")} /></Field>
      <SaveBar sv={sv} />
    </div>
  );
}

/* ---------------- Courses & Fees ---------------- */
function CoursesTab({ content, onSave, onReset }) {
  const [f, setF] = useState(() => Object.fromEntries(content.courses.map((c) => [c.id, { fee: String(c.fee), duration: c.duration, description: c.description }])));
  const sv = useSaver("courses", onSave, onReset);
  const set = (id, k, v) => setF((p) => ({ ...p, [id]: { ...p[id], [k]: v } }));

  sv.submit = () => {
    let problem = "";
    const out = {};
    for (const c of content.courses) {
      const x = f[c.id];
      if (!/^\d{1,6}$/.test(String(x.fee).trim())) { problem = `${c.title}: enter the monthly fee as a number, like 1500.`; break; }
      if (x.duration.trim().length < 2 || x.duration.length > 40) { problem = `${c.title}: enter the duration, like 12 months.`; break; }
      if (x.description.trim().length < 10 || x.description.length > 300) { problem = `${c.title}: the description must be 10 to 300 characters.`; break; }
      out[c.id] = { fee: Number(x.fee), duration: x.duration.trim(), description: x.description.trim() };
    }
    sv.save(out, problem);
  };

  return (
    <div className="space-y-6">
      {content.courses.map((c) => (
        <div key={c.id} className="rounded-2xl border border-slate-200 p-4">
          <p className="mb-3 font-bold text-navy-900">{c.title}</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Monthly fee (₹)"><input className={inputCls} inputMode="numeric" value={f[c.id].fee} onChange={(e) => set(c.id, "fee", e.target.value.replace(/\D/g, ""))} /></Field>
            <Field label="Duration"><input className={inputCls} value={f[c.id].duration} onChange={(e) => set(c.id, "duration", e.target.value)} /></Field>
          </div>
          <div className="mt-4">
            <Field label="Description"><textarea rows={3} className={inputCls} value={f[c.id].description} onChange={(e) => set(c.id, "description", e.target.value)} /></Field>
          </div>
        </div>
      ))}
      <SaveBar sv={sv} />
    </div>
  );
}

/* ---------------- Faculty ---------------- */
function FacultyTab({ content, onSave, onReset }) {
  const [list, setList] = useState(() => content.faculty.map((x) => ({ ...x, teaches: [...(x.teaches || [x.subject])] })));
  const [later, setLater] = useState([]);
  const [imgBusy, setImgBusy] = useState(null);
  const [imgMsg, setImgMsg] = useState("");
  const sv = useSaver("faculty", onSave, onReset);
  const subjectNames = [...new Set(coursesDef.map((c) => c.subjectName))];
  const upd = (i, patch) => setList((l) => l.map((x, j) => (j === i ? { ...x, ...patch } : x)));
  const pathOf = (url) => { const i = (url || "").indexOf(`/${BUCKET}/`); return i === -1 ? "" : url.slice(i + BUCKET.length + 2); };

  async function pick(i, file) {
    setImgMsg("");
    if (!file) return;
    const ext = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" }[file.type];
    if (!ext) return setImgMsg("Only JPG, PNG or WebP photos are allowed.");
    if (file.size > 5 * 1024 * 1024) return setImgMsg("The photo is too large. The limit is 5 MB.");
    setImgBusy(i);
    const path = `faculty/${crypto.randomUUID()}.${ext}`;
    const up = await supabase.storage.from(BUCKET).upload(path, file, { contentType: file.type });
    setImgBusy(null);
    if (up.error) return setImgMsg("Upload failed. Please try again.");
    const url = supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
    const old = pathOf(list[i].image);
    if (old) setLater((r) => [...r, old]);
    upd(i, { image: url });
  }

  const toggle = (i, name) => {
    const t = list[i].teaches;
    upd(i, { teaches: t.includes(name) ? t.filter((n) => n !== name) : [...t, name] });
  };
  const removeTeacher = (i) => {
    if (!window.confirm("Remove this teacher from the website?")) return;
    const p = pathOf(list[i].image);
    if (p) setLater((r) => [...r, p]);
    setList((l) => l.filter((_, j) => j !== i));
  };
  const add = () => {
    if (list.length >= 8) return;
    setList([...list, { subject: "", teaches: [], name: "", qualification: "", experience: "", bio: "", image: "" }]);
  };

  sv.submit = async () => {
    let problem = list.length === 0 ? "Add at least one teacher, or use Reset to original." : "";
    for (const [i, t] of list.entries()) {
      if (problem) break;
      const who = `Teacher ${i + 1}`;
      if (t.name.trim().length < 2 || t.name.length > 80) problem = `${who}: enter the name.`;
      else if (t.subject.trim().length < 2 || t.subject.length > 40) problem = `${who}: enter the subject, like Physics.`;
      else if (t.qualification.length > 100) problem = `${who}: the qualification is too long.`;
      else if (t.experience.length > 60) problem = `${who}: the experience text is too long.`;
      else if (t.bio.length > 400) problem = `${who}: the biography must be under 400 characters.`;
    }
    const ok = await sv.save(list.map((t) => ({
      subject: t.subject.trim(), teaches: t.teaches, name: t.name.trim(), qualification: t.qualification.trim(),
      experience: t.experience.trim(), bio: t.bio.trim(), image: t.image || "",
    })), problem);
    if (ok && later.length) { await supabase.storage.from(BUCKET).remove(later); setLater([]); }
  };

  return (
    <div className="space-y-6">
      {imgMsg && <ErrorBox text={imgMsg} />}
      {list.map((t, i) => (
        <div key={i} className="rounded-2xl border border-slate-200 p-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="w-32 shrink-0">
              <ImageBox src={t.image || ""} alt={t.name} label="Photo" ratio="aspect-[4/5]" />
              <label className="btn-outline mt-2 w-full cursor-pointer !px-3 !py-2 text-xs">
                {imgBusy === i ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} Change photo
                <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" disabled={imgBusy === i}
                  onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ""; pick(i, f); }} />
              </label>
            </div>
            <div className="min-w-0 flex-1 space-y-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="Name"><input className={inputCls} value={t.name} onChange={(e) => upd(i, { name: e.target.value })} /></Field>
                <Field label="Subject shown on the card"><input className={inputCls} value={t.subject} onChange={(e) => upd(i, { subject: e.target.value })} /></Field>
                <Field label="Qualification"><input className={inputCls} value={t.qualification} onChange={(e) => upd(i, { qualification: e.target.value })} /></Field>
                <Field label="Experience"><input className={inputCls} value={t.experience} onChange={(e) => upd(i, { experience: e.target.value })} /></Field>
              </div>
              <Field label="Short biography"><textarea rows={3} className={inputCls} value={t.bio} onChange={(e) => upd(i, { bio: e.target.value })} /></Field>
              <div>
                <p className="mb-1 text-sm font-semibold">Shown on these course pages</p>
                <div className="flex flex-wrap gap-2">
                  {subjectNames.map((n) => (
                    <label key={n} className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs font-semibold ${t.teaches.includes(n) ? "border-brand-600 bg-brand-50 text-brand-600" : "border-slate-300 text-slate-600"}`}>
                      <input type="checkbox" className="hidden" checked={t.teaches.includes(n)} onChange={() => toggle(i, n)} /> {n}
                    </label>
                  ))}
                </div>
              </div>
              <button type="button" onClick={() => removeTeacher(i)} className="flex items-center gap-1 text-xs font-semibold text-red-600"><Trash2 className="h-4 w-4" /> Remove teacher</button>
            </div>
          </div>
        </div>
      ))}
      {list.length < 8 && <button type="button" onClick={add} className="btn-outline"><Plus className="h-4 w-4" /> Add teacher</button>}
      <SaveBar sv={sv} />
    </div>
  );
}

/* ---------------- FAQ ---------------- */
function FaqTab({ content, onSave, onReset }) {
  const [list, setList] = useState(() => content.faqs.map((x) => ({ ...x })));
  const sv = useSaver("faqs", onSave, onReset);
  const upd = (i, patch) => setList((l) => l.map((x, j) => (j === i ? { ...x, ...patch } : x)));

  sv.submit = () => {
    let problem = list.length === 0 ? "Add at least one question, or use Reset to original." : "";
    for (const [i, x] of list.entries()) {
      if (problem) break;
      if (x.q.trim().length < 5 || x.q.length > 200) problem = `Question ${i + 1}: write the question (5 to 200 characters).`;
      else if (x.a.trim().length < 5 || x.a.length > 1000) problem = `Question ${i + 1}: write the answer (5 to 1000 characters).`;
    }
    sv.save(list.map((x) => ({ q: x.q.trim(), a: x.a.trim() })), problem);
  };

  return (
    <div className="space-y-4">
      {list.map((x, i) => (
        <div key={i} className="rounded-2xl border border-slate-200 p-4">
          <div className="space-y-3">
            <Field label={`Question ${i + 1}`}><input className={inputCls} value={x.q} onChange={(e) => upd(i, { q: e.target.value })} /></Field>
            <Field label="Answer"><textarea rows={3} className={inputCls} value={x.a} onChange={(e) => upd(i, { a: e.target.value })} /></Field>
            <button type="button" onClick={() => setList((l) => l.filter((_, j) => j !== i))} className="flex items-center gap-1 text-xs font-semibold text-red-600"><Trash2 className="h-4 w-4" /> Remove</button>
          </div>
        </div>
      ))}
      {list.length < 15 && <button type="button" onClick={() => setList([...list, { q: "", a: "" }])} className="btn-outline"><Plus className="h-4 w-4" /> Add question</button>}
      <SaveBar sv={sv} />
    </div>
  );
}

/* ---------------- Numbers (stats strip) ---------------- */
function StatsTab({ content, onSave, onReset }) {
  const [list, setList] = useState(() => content.stats.map((x) => ({ ...x })));
  const sv = useSaver("stats", onSave, onReset);
  const upd = (i, patch) => setList((l) => l.map((x, j) => (j === i ? { ...x, ...patch } : x)));

  sv.submit = () => {
    let problem = list.length === 0 ? "Add at least one number, or use Reset to original." : "";
    for (const [i, x] of list.entries()) {
      if (problem) break;
      if (x.value.trim().length < 1 || x.value.length > 15) problem = `Number ${i + 1}: enter a short value like 250+.`;
      else if (x.label.trim().length < 2 || x.label.length > 40) problem = `Number ${i + 1}: enter a label like Students.`;
    }
    sv.save(list.map((x) => ({ value: x.value.trim(), label: x.label.trim() })), problem);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">Use real, verified figures only. These appear in the strip under the home page banner.</p>
      {list.map((x, i) => (
        <div key={i} className="grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 p-4 sm:grid-cols-[1fr_2fr_auto] sm:items-end">
          <Field label="Number"><input className={inputCls} placeholder="250+" value={x.value} onChange={(e) => upd(i, { value: e.target.value })} /></Field>
          <Field label="Label"><input className={inputCls} placeholder="Students" value={x.label} onChange={(e) => upd(i, { label: e.target.value })} /></Field>
          <button type="button" onClick={() => setList((l) => l.filter((_, j) => j !== i))} className="flex items-center gap-1 pb-3 text-xs font-semibold text-red-600"><Trash2 className="h-4 w-4" /> Remove</button>
        </div>
      ))}
      {list.length < 6 && <button type="button" onClick={() => setList([...list, { value: "", label: "" }])} className="btn-outline"><Plus className="h-4 w-4" /> Add number</button>}
      <SaveBar sv={sv} />
    </div>
  );
}

/* ---------------- Page ---------------- */
export default function EditWebsite() {
  const content = useContent();
  const [tab, setTab] = useState("contact");
  const [ver, setVer] = useState(0);

  if (content.loadError) {
    return <ErrorBox text="Could not load the current website content. Check your connection and refresh. Saving is switched off so nothing gets overwritten." />;
  }
  if (!content.loaded) return <Loading />;

  async function save(key, value) {
    const { error } = await supabase.from("site_content").upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" });
    if (error) return false;
    await content.reload();
    return true;
  }
  async function reset(key) {
    const { error } = await supabase.from("site_content").delete().eq("key", key);
    if (error) return false;
    await content.reload();
    setVer((v) => v + 1);
    return true;
  }
  const common = { content, onSave: save, onReset: reset };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold">Edit Website</h1>
        <p className="text-sm text-slate-500">Changes appear on the live website straight away.</p>
      </div>

      <div className="-mx-4 mb-5 flex gap-2 overflow-x-auto px-4 pb-1">
        {TABS.map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${tab === key ? "bg-navy-900 text-white" : "bg-white text-slate-600"}`}>
            {label}
          </button>
        ))}
      </div>

      <div className="card">
        {tab === "contact" && <ContactTab key={`contact${ver}`} {...common} />}
        {tab === "courses" && <CoursesTab key={`courses${ver}`} {...common} />}
        {tab === "faculty" && <FacultyTab key={`faculty${ver}`} {...common} />}
        {tab === "faqs" && <FaqTab key={`faqs${ver}`} {...common} />}
        {tab === "stats" && <StatsTab key={`stats${ver}`} {...common} />}
      </div>
    </div>
  );
}
