"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";
import { Loading, Empty, ErrorBox, PageTitle, fmtDate } from "@/components/DashUI";

export default function Progress() {
  const { user } = useAuth();
  const [s, setS] = useState({ loading: true, error: "", rows: [] });

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data, error } = await supabase
        .from("test_results")
        .select("*, batch:batches(name)")
        .eq("student_id", user.id)
        .order("test_date", { ascending: false });
      setS({ loading: false, error: error ? "Could not load your results." : "", rows: data || [] });
    })();
  }, [user]);

  if (s.loading) return <Loading />;
  const pct = (r) => Math.round((r.score / r.max_score) * 100);
  const avg = s.rows.length ? Math.round(s.rows.reduce((t, r) => t + pct(r), 0) / s.rows.length) : null;

  return (
    <div>
      <PageTitle title="My Progress" subtitle="Your test results" />
      {s.error && <ErrorBox text={s.error} />}
      {!s.error && s.rows.length === 0 && <Empty title="No results yet" text="Your test scores will appear here." />}
      {avg !== null && (
        <div className="card mb-4 flex items-center justify-between">
          <p className="font-semibold">Average score</p>
          <p className="font-heading text-3xl font-extrabold text-brand-600">{avg}%</p>
        </div>
      )}
      <div className="space-y-3">
        {s.rows.map((r) => (
          <div key={r.id} className="card !p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-semibold text-navy-900">{r.test_name}</p>
                <p className="text-xs text-slate-500">{[r.batch?.name, fmtDate(r.test_date)].filter(Boolean).join(" · ")}</p>
              </div>
              <p className="font-bold">{r.score} / {r.max_score} <span className="text-brand-600">({pct(r)}%)</span></p>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-gradient-to-r from-brand-600 to-brand-500" style={{ width: `${Math.min(100, pct(r))}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
    }
