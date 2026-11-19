"use client";
import { useCallback, useEffect, useState } from "react";
import { Phone, Trash2, Check } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Loading, Empty, ErrorBox, fmtDate } from "@/components/DashUI";

export default function MessagesAdmin() {
  const [s, setS] = useState({ loading: true, error: "", rows: [] });
  const [note, setNote] = useState("");

  const load = useCallback(async () => {
    const { data, error } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
    if (error) return setS({ loading: false, error: "Could not load messages. Please refresh.", rows: [] });
    setS({ loading: false, error: "", rows: data || [] });
  }, []);
  useEffect(() => { load(); }, [load]);

  async function toggle(m) {
    const { error } = await supabase.from("contact_messages").update({ is_read: !m.is_read }).eq("id", m.id);
    if (error) return setNote("That did not work. Please try again.");
    setNote(""); load();
  }
  async function remove(m) {
    if (!window.confirm(`Delete the message from ${m.name}?`)) return;
    const { error } = await supabase.from("contact_messages").delete().eq("id", m.id);
    if (error) return setNote("Could not delete it.");
    setNote(""); load();
  }

  if (s.loading) return <Loading />;
  const unread = s.rows.filter((r) => !r.is_read).length;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold">Messages</h1>
        <p className="text-sm text-slate-500">From the Contact Us form · {unread} unread</p>
      </div>
      {s.error && <ErrorBox text={s.error} />}
      {note && <div className="mb-3"><ErrorBox text={note} /></div>}
      {!s.error && s.rows.length === 0 && <Empty title="No messages yet" text="Messages from the Contact Us page will appear here." />}
      <div className="space-y-3">
        {s.rows.map((m) => (
          <div key={m.id} className={`card !p-4 ${m.is_read ? "" : "border-brand-200 bg-brand-50/40"}`}>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-semibold text-navy-900">{m.name} {!m.is_read && <span className="ml-1 rounded-full bg-brand-600 px-2 py-0.5 text-[10px] font-bold uppercase text-white">New</span>}</p>
                <p className="text-xs text-slate-500">+91 {m.phone}{m.email ? ` · ${m.email}` : ""} · {fmtDate(m.created_at)}</p>
              </div>
            </div>
            <p className="mt-2 whitespace-pre-wrap break-words text-sm text-slate-700">{m.message}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <a href={`tel:+91${m.phone}`} className="btn-outline !px-3 !py-2 text-xs"><Phone className="h-4 w-4" /> Call</a>
              <button onClick={() => toggle(m)} className="btn-outline !px-3 !py-2 text-xs"><Check className="h-4 w-4" /> {m.is_read ? "Mark unread" : "Mark read"}</button>
              <button onClick={() => remove(m)} className="rounded-xl border-2 border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"><Trash2 className="inline h-4 w-4" /> Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
