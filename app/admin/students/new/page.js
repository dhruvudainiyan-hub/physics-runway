"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Copy, Check, RefreshCw, ShieldAlert } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";

const inputCls =
  "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100";
const classes = ["Class 11", "Class 12", "12th pass / Dropper"];
const exams = ["Board exams", "JEE", "NEET"];
const empty = { full_name: "", phone: "", password: "", email: "", class_level: "", exam_category: "", school: "", city: "", parent_name: "" };

function genPassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  const arr = new Uint32Array(10);
  crypto.getRandomValues(arr);
  return Array.from(arr, (n) => chars[n % chars.length]).join("") + "a7";
}

export default function NewStudentPage() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();
  const [f, setF] = useState(empty);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace("/login/");
  }, [loading, user, router]);

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  if (loading || !user) {
    return <div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-brand-600" /></div>;
  }
  if (profile?.role !== "admin") {
    return (
      <main className="px-4 py-12">
        <div className="card mx-auto max-w-md text-center">
          <ShieldAlert className="mx-auto h-10 w-10 text-red-500" />
          <p className="mt-3 font-bold">Administrators only</p>
          <p className="text-sm text-slate-500">You do not have access to this page.</p>
        </div>
      </main>
    );
  }

  async function submit(e) {
    e.preventDefault();
    setError("");
    if (f.full_name.trim().length < 2) return setError("Enter the student's full name.");
    if (!/^[6-9]\d{9}$/.test(f.phone)) return setError("Enter a valid 10-digit mobile number.");
    if (f.password.length < 8 || !/[A-Za-z]/.test(f.password) || !/\d/.test(f.password))
      return setError("Password needs 8+ characters with a letter and a number.");
    if (f.email && !/^\S+@\S+\.\S+$/.test(f.email)) return setError("Enter a valid email, or leave it empty.");

    setBusy(true);
    const { error: err } = await supabase.functions.invoke("create-student", { body: f });
    setBusy(false);
    if (err) {
      let msg = "Could not create the account.";
      try { const j = await err.context.json(); if (j?.error) msg = j.error; } catch {}
      return setError(msg);
    }
    setDone({ name: f.full_name, phone: f.phone, password: f.password });
    setF(empty);
  }

  async function copy() {
    const text = `Physics Runway login\nName: ${done.name}\nMobile: ${done.phone}\nPassword: ${done.password}`;
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
  }

  return (
    <main className="bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-xl">
        <h1 className="text-2xl font-extrabold">Create student account</h1>
        <p className="mb-6 text-sm text-slate-500">Admin only. Share the login details with the student.</p>

        {done && (
          <div className="card mb-6 border-green-200 bg-green-50">
            <p className="font-bold text-green-800">Account created for {done.name}</p>
            <p className="mt-2 text-sm">Mobile: <b>{done.phone}</b></p>
            <p className="text-sm">Password: <b>{done.password}</b></p>
            <p className="mt-2 text-xs text-slate-500">This password is shown only now. Copy it before leaving.</p>
            <button onClick={copy} className="btn-outline mt-3 !py-2 text-sm">
              {copied ? <><Check className="h-4 w-4" /> Copied</> : <><Copy className="h-4 w-4" /> Copy login details</>}
            </button>
          </div>
        )}

        <form onSubmit={submit} className="card space-y-4">
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
          <div>
            <label className="mb-1 block text-sm font-semibold">Password *</label>
            <div className="flex gap-2">
              <input className={inputCls} value={f.password} onChange={set("password")} placeholder="8+ characters, letter and number" />
              <button type="button" onClick={() => setF({ ...f, password: genPassword() })} className="btn-outline shrink-0 !px-4" aria-label="Generate password">
                <RefreshCw className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-semibold">Class</label>
              <select className={inputCls} value={f.class_level} onChange={set("class_level")}>
                <option value="">Select</option>
                {classes.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold">Exam category</label>
              <select className={inputCls} value={f.exam_category} onChange={set("exam_category")}>
                <option value="">Select</option>
                {exams.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold">Email (optional)</label>
            <input type="email" className={inputCls} value={f.email} onChange={set("email")} />
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
            {busy ? <><Loader2 className="h-5 w-5 animate-spin" /> Creating…</> : "Create Account"}
          </button>
        </form>
      </div>
    </main>
  );
    }
