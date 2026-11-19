"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, Layers, UserCheck, FileText, ClipboardList, UserPlus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Loading, ErrorBox } from "@/components/DashUI";

const count = (q) => q.then(({ count, error }) => { if (error) throw error; return count ?? 0; });

export default function AdminOverview() {
  const [s, setS] = useState({ loading: true, error: "", c: null });

  useEffect(() => {
    (async () => {
      try {
        const head = { count: "exact", head: true };
        const [students, batches, enrolled, materials, assignments] = await Promise.all([
          count(supabase.from("profiles").select("id", head).eq("role", "student")),
          count(supabase.from("batches").select("id", head)),
          count(supabase.from("enrollments").select("id", head).eq("status", "active")),
          count(supabase.from("materials").select("id", head)),
          count(supabase.from("assignments").select("id", head)),
        ]);
        setS({ loading: false, error: "", c: { students, batches, enrolled, materials, assignments } });
      } catch {
        setS({ loading: false, error: "Could not load the overview. Please refresh.", c: null });
      }
    })();
  }, []);

  if (s.loading) return <Loading />;

  const cards = s.c && [
    { label: "Students", value: s.c.students, Icon: Users },
    { label: "Batches", value: s.c.batches, Icon: Layers },
    { label: "Active enrollments", value: s.c.enrolled, Icon: UserCheck },
    { label: "Study materials", value: s.c.materials, Icon: FileText },
    { label: "Assignments", value: s.c.assignments, Icon: ClipboardList },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold">Admin Overview</h1>
        <p className="text-sm text-slate-500">A quick look at your institute</p>
      </div>
      {s.error && <ErrorBox text={s.error} />}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {cards?.map(({ label, value, Icon }) => (
          <div key={label} className="card !p-4">
            <Icon className="h-6 w-6 text-brand-600" />
            <p className="mt-2 font-heading text-3xl font-extrabold text-navy-900">{value}</p>
            <p className="text-xs text-slate-500">{label}</p>
          </div>
        ))}
      </div>
      <div className="card mt-6">
        <h2 className="text-lg font-bold">Quick actions</h2>
        <Link href="/admin/students/new/" className="btn-primary mt-3 w-full sm:w-auto"><UserPlus className="h-5 w-5" /> Create student account</Link>
        <p className="mt-3 text-xs text-slate-400">Batch, material, assignment and announcement tools are built in the next step.</p>
      </div>
    </div>
  );
        }
