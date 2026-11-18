"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LockKeyhole, Eye, EyeOff, Loader2, Info } from "lucide-react";
import { supabase, supabaseReady } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";

function friendly(err) {
  const m = (err?.message || "").toLowerCase();
  if (m.includes("invalid login") || m.includes("invalid credentials"))
    return "Mobile number or password is incorrect.";
  if (m.includes("rate") || m.includes("too many") || m.includes("security purposes"))
    return "Too many attempts. Please wait a minute and try again.";
  if (m.includes("fetch") || m.includes("network"))
    return "Network problem. Check your internet and try again.";
  return "Could not log in. Please try again.";
}

const inputCls =
  "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-lg outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100";

export default function LoginPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && user) router.replace("/dashboard/");
  }, [loading, user, router]);

  async function submit(e) {
    e.preventDefault();
    setError("");
    if (!supabaseReady) return setError("The website is not connected to Supabase yet (settings missing).");
    if (!/^[6-9]\d{9}$/.test(phone)) return setError("Enter a valid 10-digit Indian mobile number.");
    if (!password) return setError("Enter your password.");
    setBusy(true);
    const { error: err } = await supabase.auth.signInWithPassword({ phone: `+91${phone}`, password });
    if (err) { setBusy(false); setError(friendly(err)); }
    // On success the page redirects automatically.
  }

  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-gradient-to-br from-brand-50 to-white px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8">
        <div className="mb-5 flex items-center gap-3">
          <span className="rounded-xl bg-brand-600 p-3 text-white"><LockKeyhole className="h-6 w-6" /></span>
          <div>
            <h1 className="text-2xl font-extrabold">Student Login</h1>
            <p className="text-sm text-slate-500">Mobile number and password</p>
          </div>
        </div>

        <div className="mb-5 flex gap-2 rounded-xl bg-accent-400/20 p-3 text-xs text-navy-900">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <p><b>Demo mode:</b> mobile numbers are not verified by SMS in this demo.</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-semibold">Mobile number</label>
            <div className="flex items-center gap-2">
              <span className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-3 text-lg">+91</span>
              <input className={inputCls} inputMode="numeric" maxLength={10} placeholder="10-digit number"
                value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))} />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold">Password</label>
            <div className="relative">
              <input className={`${inputCls} pr-12`} type={show ? "text" : "password"} value={password}
                onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
              <button type="button" onClick={() => setShow(!show)} aria-label="Show or hide password"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
          {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <button type="submit" disabled={busy} className="btn-primary w-full disabled:opacity-60">
            {busy ? <><Loader2 className="h-5 w-5 animate-spin" /> Logging in…</> : "Login"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-600">
          New student? <Link href="/register/" className="font-bold text-brand-600">Create an account</Link>
        </p>
        <p className="mt-2 text-center text-xs text-slate-400">Forgot your password? Contact the institute to reset it.</p>
      </div>
    </main>
  );
                  }
