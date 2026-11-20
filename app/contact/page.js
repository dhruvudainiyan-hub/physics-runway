"use client";
import { useState } from "react";
import { Phone, Mail, MapPin, Youtube, Loader2, CheckCircle2, Map } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { supabase, supabaseReady } from "@/lib/supabase";
import { site } from "@/lib/siteData";

const inputCls = "w-full min-w-0 rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100";
const empty = { name: "", phone: "", email: "", message: "", website: "" };

export default function ContactPage() {
  const [f, setF] = useState(empty);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setError("");
    if (!supabaseReady) return setError("The website is not connected to the database yet.");
    if (f.name.trim().length < 2) return setError("Please enter your name.");
    if (!/^[6-9]\d{9}$/.test(f.phone)) return setError("Enter a valid 10-digit mobile number.");
    if (f.email && !/^\S+@\S+\.\S+$/.test(f.email)) return setError("Enter a valid email address, or leave it empty.");
    if (f.message.trim().length < 5) return setError("Please write a short message.");
    if (f.website) { setSent(true); return; } // spam trap

    try {
      const last = Number(localStorage.getItem("pr_last_msg") || 0);
      if (Date.now() - last < 30000) return setError("Please wait a few seconds before sending another message.");
    } catch {}

    setBusy(true);
    const { error: err } = await supabase.from("contact_messages").insert({
      name: f.name.trim(), phone: f.phone, email: f.email.trim() || null, message: f.message.trim(),
    });
    setBusy(false);
    if (err) return setError("Could not send your message. Please try again.");
    try { localStorage.setItem("pr_last_msg", String(Date.now())); } catch {}
    setSent(true);
    setF(empty);
  }

  const rows = [
    { Icon: Phone, label: "Call us", value: site.phone },
    { Icon: Mail, label: "Email", value: site.email },
    { Icon: MapPin, label: "Visit us", value: site.address },
  ];
  const socials = [
    { Icon: Youtube, href: site.social.youtube, name: "YouTube" },
  ];

  return (
    <main>
      <PageHeader eyebrow="Get in touch" title="Contact Us" subtitle="Questions about courses or admission? Send us a message." crumbs={[{ label: "Contact Us" }]} />
      <section className="bg-slate-50 py-12">
        <div className="container-page grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="card space-y-4">
              <p className="text-xs text-slate-400">Placeholder details. Edit them in lib/siteData.js.</p>
              {rows.map(({ Icon, label, value }) => (
                <div key={label} className="flex items-start gap-4">
                  <span className="rounded-xl bg-brand-50 p-3 text-brand-600"><Icon className="h-5 w-5" /></span>
                  <div className="min-w-0"><p className="text-sm text-slate-500">{label}</p><p className="break-words font-semibold text-navy-900">{value}</p></div>
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                {socials.map(({ Icon, href, name }) => (
                  <a key={name} href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-2.5 font-semibold text-brand-600 hover:bg-brand-100"><Icon className="h-5 w-5" /> {name}</a>
                ))}
              </div>
            </div>

            {site.mapEmbedUrl ? (
              <iframe src={site.mapEmbedUrl} title="Institute location" loading="lazy" className="h-72 w-full rounded-2xl border-0 shadow" referrerPolicy="no-referrer-when-downgrade" />
            ) : (
              <div className="flex h-56 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-brand-200 bg-brand-50 p-4 text-center text-brand-600">
                <Map className="h-9 w-9 opacity-70" />
                <p className="font-semibold">Google Maps location</p>
                <p className="text-xs">In Google Maps tap Share, then Embed a map, copy the link inside src="...", and paste it as mapEmbedUrl in lib/siteData.js.</p>
              </div>
            )}
          </div>

          {sent ? (
            <div className="card flex flex-col items-center justify-center text-center">
              <CheckCircle2 className="h-14 w-14 text-green-500" />
              <h2 className="mt-3 text-2xl font-extrabold">Message sent</h2>
              <p className="mt-2 text-slate-600">Thank you. The institute will get back to you soon.</p>
              <button onClick={() => setSent(false)} className="btn-outline mt-5">Send another message</button>
            </div>
          ) : (
            <form onSubmit={submit} className="card space-y-4">
              <h2 className="text-xl font-bold">Send us a message</h2>
              <div><label className="mb-1 block text-sm font-semibold">Your name *</label><input className={inputCls} value={f.name} onChange={set("name")} /></div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div><label className="mb-1 block text-sm font-semibold">Mobile number *</label><input className={inputCls} inputMode="numeric" maxLength={10} value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value.replace(/\D/g, "") })} /></div>
                <div><label className="mb-1 block text-sm font-semibold">Email (optional)</label><input type="email" className={inputCls} value={f.email} onChange={set("email")} /></div>
              </div>
              <div><label className="mb-1 block text-sm font-semibold">Message *</label><textarea rows={5} maxLength={2000} className={inputCls} value={f.message} onChange={set("message")} /></div>
              <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", height: 0, overflow: "hidden" }}>
                <label>Website <input tabIndex={-1} autoComplete="off" value={f.website} onChange={set("website")} /></label>
              </div>
              {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
              <button type="submit" disabled={busy} className="btn-primary w-full disabled:opacity-60">
                {busy ? <><Loader2 className="h-5 w-5 animate-spin" /> Sending…</> : "Send message"}
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
    }
