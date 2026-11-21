"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2 } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { supabase, supabaseReady } from "@/lib/supabase";
import { courses } from "@/lib/siteData";

const inputCls = "w-full min-w-0 rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100";
const classes = ["Class 11", "Class 12", "12th pass / Dropper"];
const exams = ["Board exams", "JEE", "NEET"];
const subjectList = ["Physics", "Mathematics", "Biology"];
const empty = {
  full_name: "", phone: "", email: "", current_class: "", exam_category: "", course_id: "",
  subjects: [], previous_academics: "", parent_name: "", parent_phone: "", website: "",
};

export default function AdmissionPage() {
  const [f, setF] = useState(empty);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(null);

  // Pre-fill from "Apply for Admission" on a course page (?course=jee-physics)
  useEffect(() => {
    try {
      const id = new URLSearchParams(window.location.search).get("course");
      const c = courses.find((x) => x.id === id);
      if (!c) return;
      setF((p) => ({
        ...p,
        course_id: c.id,
        subjects: [c.subjectName],
        exam_category: c.category === "jee" ? "JEE" : c.category === "neet" ? "NEET" : "Board exams",
        current_class: c.category === "class-11" ? "Class 11" : c.category === "class-12" ? "Class 12" : p.current_class,
      }));
    } catch {}
  }, []);

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const digits = (k) => (e) => setF({ ...f, [k]: e.target.value.replace(/\D/g, "") });
  const toggle = (s) => setF({ ...f, subjects: f.subjects.includes(s) ? f.subjects.filter((x) => x !== s) : [...f.subjects, s] });

  async function submit(e) {
    e.preventDefault();
    setError("");
    if (!supabaseReady) return setError("The website is not connected to the database yet.");
    if (f.full_name.trim().length < 2) return setError("Please enter the student's full name.");
    if (!/^[6-9]\d{9}$/.test(f.phone)) return setError("Enter a valid 10-digit student mobile number.");
    if (f.email && !/^\S+@\S+\.\S+$/.test(f.email)) return setError("Enter a valid email address, or leave it empty.");
    if (!f.current_class) return setError("Please select the current class.");
    if (!f.exam_category) return setError("Please select the exam category.");
    if (f.parent_name.trim().length < 2) return setError("Please enter the parent or guardian's name.");
    if (!/^[6-9]\d{9}$/.test(f.parent_phone)) return setError("Enter a valid 10-digit parent mobile number.");

    // Spam trap: real people never see or fill this hidden field
    if (f.website) { setDone({ ref: "DEMO0000" }); return; }

    try {
      const last = Number(localStorage.getItem("pr_last_apply") || 0);
      if (Date.now() - last < 30000) return setError("Please wait a few seconds before submitting again.");
    } catch {}

    setBusy(true);
    const id = crypto.randomUUID();
    const { error: err } = await supabase.from("admission_applications").insert({
      id,
      full_name: f.full_name.trim(),
      phone: f.phone,
      email: f.email.trim() || null,
      current_class: f.current_class,
      exam_category: f.exam_category,
      course_id: f.course_id || null,
      preferred_subjects: f.subjects.join(", ") || null,
      previous_academics: f.previous_academics.trim() || null,
      parent_name: f.parent_name.trim(),
      parent_phone: f.parent_phone,
    });
    setBusy(false);
    if (err) return setError("Could not submit the form. Please check your details and try again.");
    try { localStorage.setItem("pr_last_apply", String(Date.now())); } catch {}
    setDone({ ref: id.slice(0, 8).toUpperCase() });
    setF(empty);
  }

  if (done) {
    return (
      <main>
        <PageHeader title="Admission" crumbs={[{ label: "Admission" }]} />
        <section className="bg-slate-50 px-4 py-12">
          <div className="card mx-auto max-w-lg text-center">
            <CheckCircle2 className="mx-auto h-14 w-14 text-green-500" />
            <h2 className="mt-3 text-2xl font-extrabold">Application received</h2>
            <p className="mt-2 text-slate-600">Thank you. The institute will contact you soon to complete your admission. Fees are paid in person at the institute.</p>
            <p className="mt-4 rounded-xl bg-brand-50 p-3 text-sm">Your reference: <b>{done.ref}</b></p>
            <Link href="/" className="btn-primary mt-6 w-full">Back to home</Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      <PageHeader eyebrow="Join Physics Runway" title="Admission Form" subtitle="Fill in the details below. We will call you to confirm your batch." crumbs={[{ label: "Admission" }]} />
      <section className="bg-slate-50 px-4 py-10">
        <form onSubmit={submit} className="card mx-auto max-w-2xl space-y-5">
          <h2 className="text-lg font-bold">Student details</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-semibold">Student full name *</label>
              <input className={inputCls} value={f.full_name} onChange={set("full_name")} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold">Mobile number *</label>
              <input className={inputCls} inputMode="numeric" maxLength={10} value={f.phone} onChange={digits("phone")} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold">Email (optional)</label>
              <input type="email" className={inputCls} value={f.email} onChange={set("email")} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold">Current class *</label>
              <select className={inputCls} value={f.current_class} onChange={set("current_class")}>
                <option value="">Select</option>
                {classes.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold">Exam preparation *</label>
              <select className={inputCls} value={f.exam_category} onChange={set("exam_category")}>
                <option value="">Select</option>
                {exams.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-semibold">Course interested in (optional)</label>
              <select className={inputCls} value={f.course_id} onChange={set("course_id")}>
                <option value="">Not sure yet</option>
                {courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold">Preferred subjects</p>
            <div className="flex flex-wrap gap-2">
              {subjectList.map((s) => (
                <label key={s} className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-semibold ${f.subjects.includes(s) ? "border-brand-600 bg-brand-50 text-brand-600" : "border-slate-300 text-slate-600"}`}>
                  <input type="checkbox" className="hidden" checked={f.subjects.includes(s)} onChange={() => toggle(s)} /> {s}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold">Previous academic information</label>
            <textarea rows={3} className={inputCls} maxLength={1000} value={f.previous_academics} onChange={set("previous_academics")}
              placeholder="Last exam percentage, board, school name…" />
          </div>

          <h2 className="pt-2 text-lg font-bold">Parent / guardian</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-semibold">Name *</label>
              <input className={inputCls} value={f.parent_name} onChange={set("parent_name")} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold">Mobile number *</label>
              <input className={inputCls} inputMode="numeric" maxLength={10} value={f.parent_phone} onChange={digits("parent_phone")} />
            </div>
          </div>

          {/* Hidden spam trap */}
          <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", height: 0, overflow: "hidden" }}>
            <label>Website <input tabIndex={-1} autoComplete="off" value={f.website} onChange={set("website")} /></label>
          </div>

          {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <button type="submit" disabled={busy} className="btn-primary w-full disabled:opacity-60">
            {busy ? <><Loader2 className="h-5 w-5 animate-spin" /> Submitting…</> : "Submit Application"}
          </button>
          <p className="text-center text-xs text-slate-400">Fees are paid in person at the institute after admission is confirmed.</p>
        </form>
      </section>
    </main>
  );
                                               }
