"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Loader2, ShieldCheck } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

export default function DashboardPage() {
  const router = useRouter();
  const { user, profile, loading, signOut } = useAuth();

  useEffect(() => {
    if (!loading && !user) router.replace("/login/");
  }, [loading, user, router]);

  if (loading || !user) {
    return <div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-brand-600" /></div>;
  }

  const logout = async () => { await signOut(); router.replace("/"); };

  if (!profile) {
    return (
      <main className="px-4 py-12">
        <div className="card mx-auto max-w-md text-center">
          <p className="font-semibold">We could not load your profile.</p>
          <p className="mt-1 text-sm text-slate-500">Try again, or log out and log in.</p>
          <button onClick={logout} className="btn-outline mt-4 w-full">Logout</button>
        </div>
      </main>
    );
  }

  const rows = [
    ["Mobile", `+${profile.phone || user.phone}`],
    ["Class", profile.class_level || "Not provided"],
    ["Exam", profile.exam_category || "Not provided"],
    ["Email", profile.email || "Not provided"],
    ["City", profile.city || "Not provided"],
  ];

  return (
    <main className="bg-slate-50 px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <div className="card">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm text-slate-500">Welcome back</p>
              <h1 className="text-2xl font-extrabold">{profile.full_name || "Student"}</h1>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-3 py-1 text-xs font-bold uppercase text-brand-600">
              <ShieldCheck className="h-4 w-4" /> {profile.role}
            </span>
          </div>
          <dl className="mt-5 divide-y divide-slate-100">
            {rows.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 py-3 text-sm">
                <dt className="text-slate-500">{k}</dt>
                <dd className="font-semibold text-navy-900">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 rounded-xl bg-accent-400/20 p-3 text-xs text-navy-900">
            This is a temporary page. Courses, batches, live classes and the full dashboard arrive in Stage 6.
          </p>
          <button onClick={logout} className="btn-outline mt-5 w-full">
            <LogOut className="h-5 w-5" /> Logout
          </button>
        </div>
      </div>
    </main>
  );
}
