"use client";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";
import { PageTitle } from "@/components/DashUI";

const inputCls = "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100";

export default function Profile() {
  const { user, profile, refreshProfile } = useAuth();
  const [f, setF] = useState({
    email: profile?.email || "", school: profile?.school || "", city: profile?.city || "", parent_name: profile?.parent_name || "",
  });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  async function save(e) {
    e.preventDefault();
    setMsg(null);
    if (f.email && !/^\S+@\S+\.\S+$/.test(f.email)) return setMsg({ ok: false, text: "Enter a valid email, or leave it empty." });
    setBusy(true);
    const { data, error } = await supabase.from("profiles").update({
      email: f.email.trim() || null, school: f.school.trim() || null, city: f.city.trim() || null, parent_name: f.parent_name.trim() || null,
    }).eq("id", user.id).select();
    setBusy(false);
    if (error || !data?.length) return setMsg({ ok: false, text: "Could not save. Please try again." });
    await refreshProfile();
    setMsg({ ok: true, text: "Profile updated." });
  }

  const fixed = [["Name", profile?.full_name], ["Mobile", `+${profile?.phone || user?.phone}`], ["Class", profile?.class_level], ["Exam", profile?.exam_category]];

  return (
    <div>
      <PageTitle title="My Profile" />
      <div className="card mb-4">
        <dl className="divide-y divide-slate-100">
          {fixed.map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4 py-3 text-sm">
              <dt className="text-slate-500">{k}</dt><dd className="font-semibold text-navy-900">{v || "Not provided"}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-2 text-xs text-slate-400">To change your name, mobile number, class or exam, please contact the institute.</p>
      </div>
      <form onSubmit={save} className="card space-y-4">
        <h2 className="text-lg font-bold">Update your details</h2>
        <div><label className="mb-1 block text-sm font-semibold">Email</label><input type="email" className={inputCls} value={f.email} onChange={set("email")} /></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="mb-1 block text-sm font-semibold">School / college</label><input className={inputCls} value={f.school} onChange={set("school")} /></div>
          <div><label className="mb-1 block text-sm font-semibold">City</label><input className={inputCls} value={f.city} onChange={set("city")} /></div>
        </div>
        <div><label className="mb-1 block text-sm font-semibold">Parent / guardian name</label><input className={inputCls} value={f.parent_name} onChange={set("parent_name")} /></div>
        {msg && <p className={`rounded-lg p-3 text-sm ${msg.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>{msg.text}</p>}
        <button type="submit" disabled={busy} className="btn-primary w-full disabled:opacity-60">
          {busy ? <><Loader2 className="h-5 w-5 animate-spin" /> Saving…</> : "Save changes"}
        </button>
      </form>
    </div>
  );
                     }
