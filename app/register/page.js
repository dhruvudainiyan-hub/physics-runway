"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, Info } from "lucide-react";
import { supabase, supabaseReady } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";

const inputCls =
  "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100";
const classes = ["Class 11", "Class 12", "12th pass / Dropper"];
const exams = ["Board exams", "JEE", "NEET"];

function friendly(err) {
  const m = (err?.message || "").toLowerCase();
  if (m.includes("already") || m.includes("registered") || m.includes("exists"))
    return "This mobile number is already registered. Please log in instead.";
  if (m.includes("rate") || m.includes("too many") || m.includes("security purposes"))
    return "Too many attempts. Please wait a minute and try again.";
  if (m.includes("password")) return "That password is not accepted. Use at least 8 characters with letters and numbers.";
  if (m.includes("fetch") || m.includes("network")) return "Network problem. Check your internet and try again.";
  return "Could not create the account. Please try again.";
}

export default function RegisterPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [f, setF] = useState({ phone: "", password: "", confirm: "", full_name: "", email: "", class_level: "", exam_category: "", school: "", city: "", parent_name: "" });
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && user) router.replace("/dashboard/");
  }, [loading, user, router]);

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setError("");
    if (!supabaseReady) return setError("The website is not connected to Supabase yet (settings missing).");
    if (f.full_name.trim().length < 2) return setError("Please enter your full name.");
    if (!/^[6-9]\d{9}$/.test(f.phone)) return setError("Enter a valid 10-digit Indian mobile number.");
    if (f.password.length < 8 || !/[A-Za-z]/.test(f.password) || !/\d/.test(f.password))
      return setError("Password must be at least 8 characters and include a letter and a number.");
    if (f.password !== f.confirm) return setError("The two passwords do not match.");
    if (f.email && !/^\S+@\S+\.\S+$/.test(f.email)) return setError("Enter a valid email address, or leave it empty.");
    if (!f.class_level) return setError("Please select your class.");
    if (!f.exam_category) return setError("Please select your exam category.");

    setBusy(true);
    const { data, error: err } = await supabase.auth.signUp({
      phone: `+91${f.phone}`,
      password: f.password,
      options: {
        data: {
          full_name: f.full_name.trim(),
          contact_email: f.email.trim(),
          class_level: f.class_level,
          exam_category: f.exam_category,
          school: f.school.trim(),
          city: f.city.trim(),
          parent_name: f.parent_name.trim(),
        },
      },
    });
    if (err) { setBusy(false); return setError(friendly(err)); }
    if (!data.session) {
      setBusy(false);
      return setError("Account created, but phone confirmation is still ON in Supabase. Turn it off (Authentication → Sign In / Providers → Phone), then log in.");
    }
    router.replace("/dashboard/");
  }

  return (
    <main className="bg-gradient-to-br from-brand-50 to-white px-4 py-12">
      <div className="mx-auto w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8">
        <h1 className="text-2xl font-extrabold">Create your account</h1>
        <p className="mt-1 text-sm text-slate-500">Already registered? <Link href="/login/" className="font-bold text-brand-600">Log in</Link></p>

        <div className="mt-4 flex gap-2 rounded-xl bg-accent-400/20 p-3 text-xs text-navy-900">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <p><b>Demo mode:</b> mobile numbers are not verified by SMS in this demo.</p>
        </div>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-semibold">Full name *</label>
            <input className={inputCls} value={f.full_name} onChange={set("full_name")} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold">Mobile number *</label>
            <div className="flex items-center gap-2">
              <span className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-3">+91</span>
              <input className={inputCls} inputMode="numeric" maxLength={10} value={f.phone}
                onChange={(e) => setF({ ...f, phone: e.target.value.replace(/\D/g, "") })} />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-semibold">Password *</label>
              <div className="relative">
                <input className={`${inputCls} pr-12`} type={show ? "text" : "password"} value={f.password}
                  onChange={set("password")} autoComplete="new-password" />
                <button type="button" onClick={() => setShow(!show)} aria-label="Show or hide password"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                  {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold">Confirm password *</label>
              <input className={inputCls} type={show ? "text" : "password"} value={f.confirm}
                onChange={set("confirm")} autoComplete="new-password" />
            </div>
          </div>
          <p className="-mt-2 text-xs text-slate-500">At least 8 characters, with a letter and a number.</p>
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
            {busy ? <><Loader2 className="h-5 w-5 animate-spin" /> Creating account…</> : "Create Account"}
          </button>
        </form>
      </div>
    </main>
  );
                    }
