"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Smartphone, ShieldCheck, ArrowLeft, Loader2, Info } from "lucide-react";
import { supabase, supabaseReady } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";

function friendly(err) {
  const m = (err?.message || "").toLowerCase();
  if (m.includes("rate") || m.includes("security purposes") || m.includes("too many"))
    return "Too many attempts. Please wait a minute and try again.";
  if (m.includes("expired") || m.includes("invalid") || m.includes("token"))
    return "That code is incorrect or has expired. Check it or request a new one.";
  if (m.includes("sending") || m.includes("provider") || m.includes("sms"))
    return "Real SMS is not connected in this demo. Please use an approved test number.";
  if (m.includes("fetch") || m.includes("network"))
    return "Network problem. Check your internet and try again.";
  return "Something went wrong. Please try again.";
}

const inputCls =
  "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-lg outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100";

export default function LoginPage() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();
  const [step, setStep] = useState("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);

  // Already logged in? Send to the right page.
  useEffect(() => {
    if (!loading && user) router.replace(profile?.full_name ? "/dashboard/" : "/register/");
  }, [loading, user, profile, router]);

  // Resend countdown
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const fullPhone = `+91${phone}`;

  async function sendOtp(e) {
    e?.preventDefault();
    setError("");
    if (!supabaseReady) { setError("The website is not connected to Supabase yet (settings missing)."); return; }
    if (!/^[6-9]\d{9}$/.test(phone)) { setError("Enter a valid 10-digit Indian mobile number."); return; }
    setBusy(true);
    const { error: err } = await supabase.auth.signInWithOtp({ phone: fullPhone });
    setBusy(false);
    if (err) { setError(friendly(err)); return; }
    setStep("otp");
    setOtp("");
    setCooldown(30);
  }

  async function verifyOtp(e) {
    e.preventDefault();
    setError("");
    if (!/^\d{6}$/.test(otp)) { setError("Enter the 6-digit code."); return; }
    setBusy(true);
    const { error: err } = await supabase.auth.verifyOtp({ phone: fullPhone, token: otp, type: "sms" });
    if (err) { setBusy(false); setError(friendly(err)); return; }
    // Success: the page redirects automatically once the session loads.
  }

  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-gradient-to-br from-brand-50 to-white px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8">
        <div className="mb-5 flex items-center gap-3">
          <span className="rounded-xl bg-brand-600 p-3 text-white">
            {step === "phone" ? <Smartphone className="h-6 w-6" /> : <ShieldCheck className="h-6 w-6" />}
          </span>
          <div>
            <h1 className="text-2xl font-extrabold">{step === "phone" ? "Login / Register" : "Enter OTP"}</h1>
            <p className="text-sm text-slate-500">
              {step === "phone" ? "Use your mobile number" : `Code sent to +91 ${phone}`}
            </p>
          </div>
        </div>

        <div className="mb-5 flex gap-2 rounded-xl bg-accent-400/20 p-3 text-xs text-navy-900">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <p><b>Demo mode:</b> real SMS delivery is not connected. Only pre-approved test numbers can sign in.</p>
        </div>

        {step === "phone" ? (
          <form onSubmit={sendOtp} className="space-y-4">
            <label className="block text-sm font-semibold">Mobile number</label>
            <div className="flex items-center gap-2">
              <span className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-3 text-lg">+91</span>
              <input
                className={inputCls}
                inputMode="numeric"
                maxLength={10}
                placeholder="10-digit number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              />
            </div>
            {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
            <button type="submit" disabled={busy} className="btn-primary w-full disabled:opacity-60">
              {busy ? <><Loader2 className="h-5 w-5 animate-spin" /> Sending…</> : "Send OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={verifyOtp} className="space-y-4">
            <label className="block text-sm font-semibold">6-digit OTP</label>
            <input
              className={`${inputCls} text-center tracking-[0.5em]`}
              inputMode="numeric"
              maxLength={6}
              placeholder="••••••"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              autoFocus
            />
            <p className="text-xs text-slate-500">The code expires after 5 minutes.</p>
            {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
            <button type="submit" disabled={busy} className="btn-primary w-full disabled:opacity-60">
              {busy ? <><Loader2 className="h-5 w-5 animate-spin" /> Verifying…</> : "Verify & Continue"}
            </button>
            <div className="flex items-center justify-between text-sm">
              <button type="button" onClick={() => { setStep("phone"); setError(""); }} className="flex items-center gap-1 font-semibold text-slate-600">
                <ArrowLeft className="h-4 w-4" /> Change number
              </button>
              <button type="button" disabled={cooldown > 0 || busy} onClick={sendOtp} className="font-semibold text-brand-600 disabled:text-slate-400">
                {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend OTP"}
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
             }
