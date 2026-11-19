"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";

// The student's own active, unexpired enrollments (with batch details)
export function useMyBatches() {
  const { user } = useAuth();
  const [s, setS] = useState({ loading: true, error: "", enrollments: [] });

  useEffect(() => {
    if (!user) return;
    let alive = true;
    (async () => {
      const { data, error } = await supabase
        .from("enrollments")
        .select("id,status,starts_on,expires_on,batch:batches(id,name,course_id,course_title,subject,teacher,timing)")
        .eq("student_id", user.id)
        .eq("status", "active");
      if (!alive) return;
      if (error) return setS({ loading: false, error: "Could not load your batches. Please try again.", enrollments: [] });
      const today = new Date().toISOString().slice(0, 10);
      const ok = (data || []).filter((e) => e.batch && (!e.expires_on || e.expires_on >= today));
      setS({ loading: false, error: "", enrollments: ok });
    })();
    return () => { alive = false; };
  }, [user]);

  return s;
}

// Rows (materials, assignments, announcements) that belong to the student's batches
export function useBatchData(table, { global = false, orderBy = "created_at", ascending = false } = {}) {
  const { enrollments, loading: l1, error: e1 } = useMyBatches();
  const [s, setS] = useState({ loading: true, error: "", rows: [] });
  const ids = enrollments.map((e) => e.batch.id);
  const key = ids.join(",");

  useEffect(() => {
    if (l1) return;
    if (e1) return setS({ loading: false, error: e1, rows: [] });
    let alive = true;
    (async () => {
      let q = supabase.from(table).select("*").order(orderBy, { ascending });
      if (global) {
        q = ids.length ? q.or(`batch_id.is.null,batch_id.in.(${key})`) : q.is("batch_id", null);
      } else {
        if (!ids.length) return setS({ loading: false, error: "", rows: [] });
        q = q.in("batch_id", ids);
      }
      const { data, error } = await q;
      if (!alive) return;
      setS({ loading: false, error: error ? "Could not load this page. Please try again." : "", rows: data || [] });
    })();
    return () => { alive = false; };
  }, [l1, e1, key, table]);

  return { loading: l1 || s.loading, error: s.error, rows: s.rows, enrollments };
}
