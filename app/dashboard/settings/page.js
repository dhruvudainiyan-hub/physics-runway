"use client";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";
import { PageTitle } from "@/components/DashUI";

const inputCls = "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100";

export default function Settings() {
  const { user } = useAuth();
  const [cur, setCur] = useState("");
  const [next, setNext] = useState("");
  const [again, setAgain] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);

  async function submit(e) {
    e.preventDefault();
    setMsg(null);
    if (!cur) return setMsg({ ok: false, text: "Enter your current password." });
    if (next.length < 8 || !/[A-Za-z]/.test(next) || !/\d/.test(next))
      return setMsg({ ok: false, text: "New password must be 8+ characters with a letter and a number." });
    if (next !== again) return setMsg({ ok: false, text: "The new passwords do not match." });

    setBusy(true);
    const { error: e1 } = await supabase.auth.signInWithPassword({ phone: `+${user.phone}`, password: cur });
    if (e1) { setBusy(false); return setMsg({ ok: false, text: "Your current password is incorrect." }); }
    const { error: e2 } = await supabase.auth.updateUser({ password: next });
    setBusy(false);
    if (e2) return setMsg({ ok: false, text: "Could not change the password. Try a different one." });
    setCur(""); setNext(""); setAgain("");
    setMsg({ ok: true, text: "Password changed successfully." });
  }

  return (
    <div>
      <PageTitle title="Settings" subtitle="Change your password" />
      <form onSubmit={submit} className="card space-y-4">
        <div><label className="mb-1 block text-sm font-semibold">Current password</label><input type="password" className={inputCls} value={cur} onChange={(e) => setCur(e.target.value)} autoComplete="current-password" /></div>
        <div><label className="mb-1 block text-sm font-semibold">New password</label><input type="password" className={inputCls} value={next} onChange={(e) => setNext(e.target.value)} autoComplete="new-password" /></div>
        <div><label className="mb-1 block text-sm font-semibold">Confirm new password</label><input type="password" className={inputCls} value={again} onChange={(e) => setAgain(e.target.value)} autoComplete="new-password" /></div>
        {msg && <p className={`rounded-lg p-3 text-sm ${msg.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>{msg.text}</p>}
        <button type="submit" disabled={busy} className="btn-primary w-full disabled:opacity-60">
          {busy ? <><Loader2 className="h-5 w-5 animate-spin" /> Updating…</> : "Change password"}
        </button>
      </form>
    </div>
  );
    }
