"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { freeCategories } from "@/lib/freeResources";

const chips = [["video_url", "Video"], ["notes_path", "Notes"], ["ppt_path", "PPT"], ["questions_path", "Questions"], ["answers_path", "Answers"]];

export default function ChapterList({ category }) {
  const cat = freeCategories.find((c) => c.slug === category);
  const [rows, setRows] = useState({});

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("free_resources").select("*").eq("category", category);
      const map = {};
      (data || []).forEach((r) => { map[r.chapter_slug] = r; });
      setRows(map);
    })();
  }, [category]);

  const parts = [...new Set(cat.chapters.map((c) => c.part))];

  return (
    <div className="space-y-10">
      {parts.map((part) => (
        <div key={part}>
          {parts.length > 1 && <h2 className="mb-4 text-xl font-bold">{part}</h2>}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {cat.chapters.filter((c) => c.part === part).map((ch) => {
              const r = rows[ch.slug];
              return (
                <Link key={ch.slug} href={`/free-resources/${category}/${ch.slug}/`} className="card flex items-center justify-between gap-3 !p-4">
                  <div className="min-w-0">
                    <p className="font-semibold text-navy-900">Chapter {ch.number}: {ch.title}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {chips.filter(([k]) => r?.[k]).map(([k, label]) => (
                        <span key={k} className="rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-semibold text-green-700">{label}</span>
                      ))}
                      {!r || !chips.some(([k]) => r?.[k]) ? <span className="text-[11px] text-slate-400">Coming soon</span> : null}
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 shrink-0 text-slate-400" />
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
