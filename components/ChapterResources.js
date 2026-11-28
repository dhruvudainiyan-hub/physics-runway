"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Download, FileText, Presentation, FileQuestion, FileCheck, Video, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Loading, ErrorBox } from "@/components/DashUI";
import { freeCategories, youtubeId } from "@/lib/freeResources";

const items = [
  { col: "notes_path", label: "Notes", Icon: FileText },
  { col: "ppt_path", label: "PPT", Icon: Presentation },
  { col: "questions_path", label: "Chapter Questions", Icon: FileQuestion },
  { col: "answers_path", label: "Answers", Icon: FileCheck },
];

export default function ChapterResources({ category, chapter }) {
  const cat = freeCategories.find((c) => c.slug === category);
  const index = cat.chapters.findIndex((c) => c.slug === chapter);
  const prev = cat.chapters[index - 1];
  const next = cat.chapters[index + 1];
  const [s, setS] = useState({ loading: true, error: "", row: null });

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from("free_resources").select("*").eq("category", category).eq("chapter_slug", chapter).maybeSingle();
      setS({ loading: false, error: error ? "Could not load this chapter. Please try again." : "", row: data });
    })();
  }, [category, chapter]);

  const fileUrl = (path) => supabase.storage.from("free-resources").getPublicUrl(path, { download: true }).data.publicUrl;
  const row = s.row;
  const vid = row?.video_url ? youtubeId(row.video_url) : "";

  if (s.loading) return <Loading />;

  return (
    <div className="space-y-6">
      {s.error && <ErrorBox text={s.error} />}

      <div className="card">
        <h2 className="flex items-center gap-2 text-xl font-bold"><Video className="h-5 w-5 text-brand-600" /> Video lesson</h2>
        {row?.video_url ? (
          <div className="mt-4">
            {vid && (
              <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black">
                <iframe
                  className="h-full w-full"
                  src={`https://www.youtube-nocookie.com/embed/${vid}`}
                  title="Chapter video"
                  allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            )}
            <a href={row.video_url} target="_blank" rel="noreferrer" className="btn-outline mt-3 !py-2 text-sm">
              <ExternalLink className="h-4 w-4" /> Open video link
            </a>
          </div>
        ) : (
          <p className="mt-3 text-sm text-slate-500">The video for this chapter is coming soon.</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {items.map(({ col, label, Icon }) => {
          const path = row?.[col];
          return (
            <div key={col} className="card flex items-center justify-between gap-3 !p-4">
              <div className="flex items-center gap-3">
                <span className="rounded-xl bg-brand-50 p-2.5 text-brand-600"><Icon className="h-5 w-5" /></span>
                <p className="font-semibold text-navy-900">{label}</p>
              </div>
              {path ? (
                <a href={fileUrl(path)} className="btn-primary !px-4 !py-2 text-sm"><Download className="h-4 w-4" /> Download</a>
              ) : (
                <span className="text-xs font-semibold text-slate-400">Coming soon</span>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between gap-3">
        {prev ? (
          <Link href={`/free-resources/${category}/${prev.slug}/`} className="btn-outline !px-4 !py-2 text-sm"><ChevronLeft className="h-4 w-4" /> Previous</Link>
        ) : <span />}
        {next ? (
          <Link href={`/free-resources/${category}/${next.slug}/`} className="btn-outline !px-4 !py-2 text-sm">Next <ChevronRight className="h-4 w-4" /></Link>
        ) : <span />}
      </div>
    </div>
  );
}
