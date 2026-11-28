"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
import Logo from "@/components/Logo";
import { useAuth } from "@/components/AuthProvider";

const menus = [
  { label: "Class 10", key: "class-10", all: { label: "All Class 10 courses", href: "/courses/class-10/" }, items: [{ label: "Science", href: "/courses/class-10/science/" }] },
  { label: "Class 11", key: "class-11", all: { label: "All Class 11 courses", href: "/courses/class-11/" }, items: [{ label: "Physics", href: "/courses/class-11/physics/" }] },
  { label: "Class 12", key: "class-12", all: { label: "All Class 12 courses", href: "/courses/class-12/" }, items: [{ label: "Physics", href: "/courses/class-12/physics/" }] },
  {
    label: "Free Resources", key: "free",
    all: { label: "All free resources", href: "/free-resources/" },
    items: [
      { label: "Class 11", href: "/free-resources/class-11/" },
      { label: "Class 12", href: "/free-resources/class-12/" },
      { label: "JEE Mains", href: "/free-resources/jee/" },
      { label: "NEET", href: "/free-resources/neet/" },
    ],
  },
];
const links = [
  { label: "Our Faculty", href: "/faculty/" },
  { label: "About Us", href: "/about/" },
  { label: "Contact Us", href: "/contact/" },
];

export default function Navbar() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const close = () => { setMobileOpen(false); setOpenMenu(null); };
  const toggle = (key) => setOpenMenu(openMenu === key ? null : key);
  const logout = async () => { await signOut(); close(); router.push("/"); };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      {openMenu && <div className="fixed inset-0 hidden xl:block" onClick={() => setOpenMenu(null)} />}
      <div className="container-page relative flex h-16 items-center justify-between">
        <Logo />

        <nav className="hidden items-center gap-0.5 xl:flex">
          <Link href="/" className="whitespace-nowrap rounded-lg px-2.5 py-2 text-sm font-semibold hover:bg-brand-50 hover:text-brand-600">Home</Link>
          {menus.map((m) => (
            <div key={m.key} className="relative">
              <button onClick={() => toggle(m.key)} className="flex items-center gap-1 whitespace-nowrap rounded-lg px-2.5 py-2 text-sm font-semibold hover:bg-brand-50 hover:text-brand-600">
                {m.label} <ChevronDown className={`h-4 w-4 transition ${openMenu === m.key ? "rotate-180" : ""}`} />
              </button>
              {openMenu === m.key && (
                <div className="absolute left-0 top-full mt-2 w-56 animate-fadeUp rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                  <Link href={m.all.href} onClick={close} className="block rounded-lg px-3 py-2 text-sm font-bold text-brand-600 hover:bg-brand-50">{m.all.label}</Link>
                  {m.items.map((it) => (
                    <Link key={it.href} href={it.href} onClick={close} className="block rounded-lg px-3 py-2 text-sm hover:bg-brand-50">{it.label}</Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="whitespace-nowrap rounded-lg px-2.5 py-2 text-sm font-semibold hover:bg-brand-50 hover:text-brand-600">{l.label}</Link>
          ))}
          {user ? (
            <>
              <Link href="/dashboard/" className="btn-primary ml-2 !px-5 !py-2 text-sm">Dashboard</Link>
              <button onClick={logout} className="rounded-lg px-3 py-2 text-sm font-semibold hover:bg-brand-50">Logout</button>
            </>
          ) : (
            <Link href="/login/" className="btn-primary ml-2 whitespace-nowrap !px-5 !py-2 text-sm">Student Login</Link>
          )}
        </nav>

        <button className="rounded-lg p-2 xl:hidden" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </div>

      {mobileOpen && (
        <nav className="max-h-[80vh] animate-fadeUp overflow-y-auto border-t border-slate-200 bg-white px-4 pb-6 pt-2 xl:hidden">
          <Link href="/" onClick={close} className="block py-3 font-semibold">Home</Link>
          {menus.map((m) => (
            <div key={m.key} className="border-t border-slate-100">
              <button onClick={() => toggle(m.key)} className="flex w-full items-center justify-between py-3 font-semibold">
                {m.label} <ChevronDown className={`h-5 w-5 transition ${openMenu === m.key ? "rotate-180" : ""}`} />
              </button>
              {openMenu === m.key && (
                <div className="pb-2 pl-3">
                  <Link href={m.all.href} onClick={close} className="block py-2 font-bold text-brand-600">{m.all.label}</Link>
                  {m.items.map((it) => (
                    <Link key={it.href} href={it.href} onClick={close} className="block py-2">{it.label}</Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={close} className="block border-t border-slate-100 py-3 font-semibold">{l.label}</Link>
          ))}
          {user ? (
            <div className="mt-4 grid gap-3">
              <Link href="/dashboard/" onClick={close} className="btn-primary w-full">Dashboard</Link>
              <button onClick={logout} className="btn-outline w-full">Logout</button>
            </div>
          ) : (
            <Link href="/login/" onClick={close} className="btn-primary mt-4 w-full">Student Login</Link>
          )}
        </nav>
      )}
    </header>
  );
}
