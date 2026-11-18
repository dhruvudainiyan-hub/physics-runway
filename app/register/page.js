"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";

const inputCls =
  "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100";
const classes = ["Class 11", "Class 12", "12th pass / Dropper"];
const exams = ["Board exams", "JEE", "NEET"];

export default function RegisterPage() {
  const router = useRouter();
  const { user, profile, loading, refreshProfile } = useAuth();
  const [f, setF] = useState({ full_name: "", email: "", class_level: "", exam_category: "", school: "", city: "", parent_name: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (loading) return;
    if (!user) router.replace("/login/");
    else if (profile?.full_name) router.replace("/dashboard/");
  }, [loading, user, profile, router]);

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setError("");
    if (f.full_name.trim().length < 2) return setError("Please enter your full name.");
    if (f.email && !/^\S+@\S+\.\S+$/.test(f.email)) return setError("Enter a valid email address, or leave it empty.");
    if (!f.class_level) return setError("Please select your class.");
    if (!f.exam_category) return setError("Please select your exam category.");

    setBusy(true);
    const { data, error: err } = await supabase
      .from("profiles")
      .update({
        full_name: f.full_name.trim(),
        email: f.email.trim() || null,
        class_level: f.class_level,
        exam_category: f.exam_category,
        school: f.school.trim() || null,
        city: f.city.trim() || null,
        parent_name: f.parent_name.trim() || null,
      })
      .eq("id", user.id)
      .select();
    if (err || !data || data.length === 0) {
      setBusy(false);
      return setError("Could not save your details. Please try again.");
    }
    await refreshProfile();
    router.replace("/dashboard/");
  }

  if (loading || !user) {
    return <div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-brand-600" /></div>;
  }

  return (
    <main className="bg-gradient-to-br from-brand-50 to-white px-4 py-12">
      <div className="mx-auto w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8">
        <h1 className="text-2xl font-extrabold">Complete your registration</h1>
        <p className="mt-1 text-sm text-slate-500">Mobile verified: +{user.phone}</p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-semibold">Full name *</label>
            <input className={inputCls} value={f.full_name} onChange={set("full_name")} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold">Email (optional)</label>
            <input type="email" className={inputCls} value={f.email} onChange={set("email")} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-semibold">Class *</label>
              <select className={inputCls} value={f.class_level} onChange={set("class_level")}>
                <option value="">Select</option>
                {classes.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold">Exam category *</label>
              <select className={inputCls} value={f.exam_category} onChange={set("exam_category")}>
                <option value="">Select</option>
                {exams.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-semibold">School / college</label>
              <input className={inputCls} value={f.school} onChange={set("school")} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold">City</label>
              <input className={inputCls} value={f.city} onChange={set("city")} />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold">Parent / guardian name</label>
            <input className={inputCls} value={f.parent_name} onChange={set("parent_name")} />
          </div>

          {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <button type="submit" disabled={busy} className="btn-primary w-full disabled:opacity-60">
            {busy ? <><Loader2 className="h-5 w-5 animate-spin" /> Saving…</> : "Complete Registration"}
          </button>
        </form>
      </div>
    </main>
  );
    }
