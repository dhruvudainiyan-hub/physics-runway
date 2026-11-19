"use client";
import { useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, FileText, ClipboardList, Megaphone, TrendingUp, User, Settings, LogOut, Loader2, UserPlus } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

const items = [
  { label: "Overview", href: "/dashboard/", Icon: LayoutDashboard },
  { label: "My Courses", href: "/dashboard/courses/", Icon: BookOpen },
  { label: "Study Materials", href: "/dashboard/materials/", Icon: FileText },
  { label: "Assignments", href: "/dashboard/assignments/", Icon: ClipboardList },
  { label: "Announcements", href: "/dashboard/announcements/", Icon: Megaphone },
  { label: "My Progress", href: "/dashboard/progress/", Icon: TrendingUp },
  { label: "My Profile", href: "/dashboard/profile/", Icon: User },
  { label: "Settings", href: "/dashboard/settings/", Icon: Settings },
];

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname() || "";
  const { user, profile, loading, signOut } = useAuth();

  useEffect(() => {
    if (!loading && !user) router.replace("/login/");
  }, [loading, user, router]);

  if (loading || !user) {
    return <div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-brand-600" /></div>;
  }

  const here = pathname.endsWith("/") ? pathname : pathname + "/";
  const logout = async () => { await signOut(); router.replace("/"); };
  const linkCls = (active) =>
    `flex shrink-0 items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
      active ? "bg-brand-600 text-white shadow" : "bg-white text-slate-600 hover:bg-brand-50 hover:text-brand-600 lg:bg-transparent"
    }`;

  return (
    <div className="min-h-[80vh] bg-slate-50">
      <div className="container-page grid gap-6 py-6 lg:grid-cols-[250px_1fr]">
        <aside>
          <div className="mb-3 hidden rounded-2xl bg-white p-4 shadow-sm lg:block">
            <p className="truncate font-bold text-navy-900">{profile?.full_name || "Student"}</p>
            <p className="text-xs uppercase text-brand-600">{profile?.role || "student"}</p>
          </div>
          <nav className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 lg:mx-0 lg:flex-col lg:overflow-visible lg:rounded-2xl lg:bg-white lg:p-3 lg:shadow-sm">
            {items.map(({ label, href, Icon }) => (
              <Link key={href} href={href} className={linkCls(here === href)}>
                <Icon className="h-4 w-4" /> {label}
              </Link>
            ))}
            {profile?.role === "admin" && (
              <Link href="/admin/students/new/" className={linkCls(false)}>
                <UserPlus className="h-4 w-4" /> Create Student
              </Link>
            )}
            <button onClick={logout} className={linkCls(false)}>
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </nav>
        </aside>
        <section className="min-w-0">{children}</section>
      </div>
    </div>
  );
              }
