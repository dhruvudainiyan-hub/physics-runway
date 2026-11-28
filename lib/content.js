"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { site as siteDef, courses as coursesDef, stats as statsDef } from "@/lib/siteData";
import { faculty as facultyDef, faqs as faqsDef } from "@/lib/homeData";

// Only safe links and images are ever used on the website
export const safeUrl = (u) => (typeof u === "string" && /^https:\/\//i.test(u.trim()) ? u.trim() : "");
export const safeMapUrl = (u) => (typeof u === "string" && /^https:\/\/www\.google\.com\/maps\/embed/i.test(u.trim()) ? u.trim() : "");
export const safeImage = (u) => (typeof u === "string" && (u.startsWith("/assets/") || /^https:\/\//i.test(u)) ? u : "");

function build(rows) {
  const r = rows || {};
  const saved = r.site || {};
  const site = { ...siteDef, ...saved, social: { ...siteDef.social, ...(saved.social || {}) } };

  const overrides = r.courses || {};
  const courses = coursesDef.map((c) => {
    const o = overrides[c.id] || {};
    const fee = Number(o.fee);
    return {
      ...c,
      ...(o.fee !== undefined && o.fee !== "" && Number.isFinite(fee) ? { fee } : {}),
      ...(o.duration ? { duration: o.duration } : {}),
      ...(o.description ? { description: o.description } : {}),
    };
  });

  const stats = Array.isArray(r.stats) && r.stats.length ? r.stats : statsDef;
  const faculty = Array.isArray(r.faculty) && r.faculty.length ? r.faculty : facultyDef;
  const faqs = Array.isArray(r.faqs) && r.faqs.length ? r.faqs : faqsDef;
  return { site, courses, stats, faculty, faqs };
}

const Ctx = createContext({ ...build({}), loaded: false, loadError: false, reload: async () => {} });

export function ContentProvider({ children }) {
  const [rows, setRows] = useState({});
  const [status, setStatus] = useState("loading");

  const load = useCallback(async () => {
    const { data, error } = await supabase.from("site_content").select("key,value");
    if (error || !data) { setStatus("error"); return; }
    const map = {};
    data.forEach((d) => { map[d.key] = d.value; });
    setRows(map);
    setStatus("ready");
    try { localStorage.setItem("pr_content", JSON.stringify(map)); } catch {}
  }, []);

  useEffect(() => {
    try {
      const cached = localStorage.getItem("pr_content");
      if (cached) setRows(JSON.parse(cached));
    } catch {}
    load();
  }, [load]);

  const value = useMemo(
    () => ({ ...build(rows), loaded: status === "ready", loadError: status === "error", reload: load }),
    [rows, status, load]
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useContent = () => useContext(Ctx);
