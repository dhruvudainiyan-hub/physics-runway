"use client";
import { useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard, UserPlus, Users, Layers, FileText, ClipboardList,
  Megaphone, TrendingUp, Inbox, LogOut, Loader2, ShieldAlert,
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

const items = [
  { label: "Overview", href: "/admin/", Icon: LayoutDashboard },
  { label: "Create Student", href: "/admin/students/new/", Icon: UserPlus },
  { label: "Students", href: "/admin/students/", Icon: Users },
  { label: "Batches", href: "/admin/batches/", Icon: Layers },
  { label: "Study Materials", href: "/admin/materials/", Icon: FileText },
  { label: "Assignments", href: "/admin/assignments/", Icon: ClipboardList },
  { label: "Announcements", href: "/admin/announcements/", Icon: Megaphone },
  { label: "Test Results", href: "/admin/results/", Icon: TrendingUp },
  { label: "Admissions", Icon: Inbox, soon: true },
];

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname() || "";
  const { user, profile, loading, signOut } = useAuth();

  useEffect(() => {
    if (!loading && !user) router.replace("/login/");
  }, [loading, user, router]);

  if (loading || !user) {
    return <div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-brand-600" /></div>;
  }

  if (profile?.role !== "admin") {
    return (
      <main className="px-4 py-12">
        <div className="card mx-auto max-w-md text-center">
          <ShieldAlert className="mx-auto h-10 w-10 text-red-500" />
          <p className="mt-3 font-bold">Administrators only</p>
          <p className="text-sm text-slate-500">You do not have access to this area.</p>
          <Link href="/dashboard/" className="btn-primary mt-4 w-full">Go to my dashboard</Link>
        </div>
      </main>
    );
  }

  const here = pathname.endsWith("/") ? pathname : pathname + "/";
  const logout = async () => { await signOut(); router.replace("/"); };
  const base = "flex shrink-0 items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold transition";

  return (
    <div className="min-h-[80vh] bg-slate-100">
      <div className="container-page grid grid-cols-1 gap-6 py-6 lg:grid-cols-[260px_1fr]">
        <aside className="min-w-0">
          <div className="mb-3 hidden rounded-2xl bg-navy-900 p-4 text-white lg:block">
            <p className="text-xs font-bold uppercase tracking-wider text-accent-400">Admin Panel</p>
            <p className="mt-1 truncate font-bold">{profile.full_name || "Administrator"}</p>
          </div>
          <nav className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 lg:mx-0 lg:flex-col lg:overflow-visible lg:rounded-2xl lg:bg-navy-900 lg:p-3">
            {items.map(({ label, href, Icon, soon }) =>
              soon ? (
                <span key={label} className={`${base} cursor-not-allowed bg-white/60 text-slate-400 lg:bg-transparent lg:text-slate-500`}>
                  <Icon className="h-4 w-4" /> {label}
                  <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-500 lg:bg-white/10">Soon</span>
                </span>
              ) : (
                <Link key={label} href={href}
                  className={`${base} ${here === href ? "bg-accent-500 text-navy-900 shadow" : "bg-white text-slate-700 hover:bg-brand-50 lg:bg-transparent lg:text-slate-200 lg:hover:bg-white/10"}`}>
                  <Icon className="h-4 w-4" /> {label}
                </Link>
              )
            )}
            <button onClick={logout} className={`${base} bg-white text-slate-700 hover:bg-brand-50 lg:bg-transparent lg:text-slate-200 lg:hover:bg-white/10`}>
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </nav>
        </aside>
        <section className="min-w-0">{children}</section>
      </div>
    </div>
  );
}
