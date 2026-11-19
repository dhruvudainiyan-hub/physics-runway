"use client";
import Link from "next/link";
import { Layers, FileText, ClipboardList, Megaphone } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { useBatchData } from "@/lib/useStudentData";
import { Loading, ErrorBox, fmtDate } from "@/components/DashUI";

export default function Overview() {
  const { profile } = useAuth();
  const materials = useBatchData("materials");
  const assignments = useBatchData("assignments", { orderBy: "due_date", ascending: true });
  const announcements = useBatchData("announcements", { global: true });

  if (materials.loading || assignments.loading || announcements.loading) return <Loading />;
  const err = materials.error || assignments.error || announcements.error;

  const today = new Date().toISOString().slice(0, 10);
  const upcoming = assignments.rows.filter((a) => !a.due_date || a.due_date >= today).slice(0, 3);

  const stats = [
    { label: "My batches", value: materials.enrollments.length, Icon: Layers, href: "/dashboard/courses/" },
    { label: "Study materials", value: materials.rows.length, Icon: FileText, href: "/dashboard/materials/" },
    { label: "Assignments", value: assignments.rows.length, Icon: ClipboardList, href: "/dashboard/assignments/" },
    { label: "Announcements", value: announcements.rows.length, Icon: Megaphone, href: "/dashboard/announcements/" },
  ];

  return (
    <div>
      <div className="mb-6 rounded-3xl bg-gradient-to-br from-navy-900 to-brand-700 p-6 text-white">
        <p className="text-sm text-slate-300">Welcome back</p>
        <h1 className="text-2xl font-extrabold !text-white sm:text-3xl">{profile?.full_name || "Student"}</h1>
        <p className="mt-1 text-sm text-slate-300">{[profile?.class_level, profile?.exam_category].filter(Boolean).join(" · ")}</p>
      </div>

      {err && <div className="mb-4"><ErrorBox text={err} /></div>}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(({ label, value, Icon, href }) => (
          <Link key={label} href={href} className="card !p-4">
            <Icon className="h-6 w-6 text-brand-600" />
            <p className="mt-2 font-heading text-3xl font-extrabold text-navy-900">{value}</p>
            <p className="text-xs text-slate-500">{label}</p>
          </Link>
        ))}
      </div>

      {materials.enrollments.length === 0 && (
        <p className="mt-6 rounded-xl bg-accent-400/20 p-4 text-sm text-navy-900">
          You are not enrolled in any batch yet. Please contact the institute to be added to your batch.
        </p>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="card">
          <h2 className="text-lg font-bold">Upcoming assignments</h2>
          {upcoming.length === 0 ? (
            <p className="mt-3 text-sm text-slate-500">Nothing due right now.</p>
          ) : (
            <ul className="mt-3 divide-y divide-slate-100">
              {upcoming.map((a) => (
                <li key={a.id} className="py-3 text-sm">
                  <p className="font-semibold text-navy-900">{a.title}</p>
                  <p className="text-slate-500">{a.due_date ? `Due ${fmtDate(a.due_date)}` : "No due date"}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="card">
          <h2 className="text-lg font-bold">Latest announcements</h2>
          {announcements.rows.length === 0 ? (
            <p className="mt-3 text-sm text-slate-500">No announcements yet.</p>
          ) : (
            <ul className="mt-3 divide-y divide-slate-100">
              {announcements.rows.slice(0, 3).map((a) => (
                <li key={a.id} className="py-3 text-sm">
                  <p className="font-semibold text-navy-900">{a.title}</p>
                  <p className="text-slate-500">{fmtDate(a.created_at)}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
            }
