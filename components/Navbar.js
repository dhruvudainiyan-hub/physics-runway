"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import Logo from "@/components/Logo";

const science = ["Physics", "Chemistry", "Mathematics", "Biology"];
const menus = [
  { label: "Class 11", slug: "class-11", subjects: science },
  { label: "Class 12", slug: "class-12", subjects: science },
  { label: "JEE", slug: "jee", subjects: ["Physics", "Chemistry", "Mathematics"] },
  { label: "NEET", slug: "neet", subjects: ["Physics", "Chemistry", "Biology"] },
];
const links = [
  { label: "Our Faculty", href: "/faculty/" },
  { label: "Results", href: "/results/" },
  { label: "About Us", href: "/about/" },
  { label: "Contact Us", href: "/contact/" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null); // dropdown open (desktop or mobile)
  const close = () => { setMobileOpen(false); setOpenMenu(null); };
  const toggle = (slug) => setOpenMenu(openMenu === slug ? null : slug);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      {openMenu && <div className="fixed inset-0 hidden xl:block" onClick={() => setOpenMenu(null)} />}
      <div className="container-page relative flex h-16 items-center justify-between">
        <Logo />

        {/* Desktop menu */}
        <nav className="hidden items-center gap-1 xl:flex">
          <Link href="/" className="rounded-lg px-3 py-2 text-sm font-semibold hover:bg-brand-50 hover:text-brand-600">Home</Link>
          {menus.map((m) => (
            <div key={m.slug} className="relative">
              <button onClick={() => toggle(m.slug)} className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold hover:bg-brand-50 hover:text-brand-600">
                {m.label} <ChevronDown className={`h-4 w-4 transition ${openMenu === m.slug ? "rotate-180" : ""}`} />
              </button>
              {openMenu === m.slug && (
                <div className="absolute left-0 top-full mt-2 w-52 animate-fadeUp rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                  <Link href={`/courses/${m.slug}/`} onClick={close} className="block rounded-lg px-3 py-2 text-sm font-bold text-brand-600 hover:bg-brand-50">All {m.label} courses</Link>
                  {m.subjects.map((s) => (
                    <Link key={s} href={`/courses/${m.slug}/${s.toLowerCase()}/`} onClick={close} className="block rounded-lg px-3 py-2 text-sm hover:bg-brand-50">{s}</Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="rounded-lg px-3 py-2 text-sm font-semibold hover:bg-brand-50 hover:text-brand-600">{l.label}</Link>
          ))}
          <Link href="/login/" className="btn-primary ml-2 !px-5 !py-2 text-sm">Login / Register</Link>
        </nav>

        {/* Mobile button */}
        <button className="rounded-lg p-2 xl:hidden" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav className="max-h-[80vh] animate-fadeUp overflow-y-auto border-t border-slate-200 bg-white px-4 pb-6 pt-2 xl:hidden">
          <Link href="/" onClick={close} className="block py-3 font-semibold">Home</Link>
          {menus.map((m) => (
            <div key={m.slug} className="border-t border-slate-100">
              <button onClick={() => toggle(m.slug)} className="flex w-full items-center justify-between py-3 font-semibold">
                {m.label} <ChevronDown className={`h-5 w-5 transition ${openMenu === m.slug ? "rotate-180" : ""}`} />
              </button>
              {openMenu === m.slug && (
                <div className="pb-2 pl-3">
                  <Link href={`/courses/${m.slug}/`} onClick={close} className="block py-2 font-bold text-brand-600">All {m.label} courses</Link>
                  {m.subjects.map((s) => (
                    <Link key={s} href={`/courses/${m.slug}/${s.toLowerCase()}/`} onClick={close} className="block py-2">{s}</Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={close} className="block border-t border-slate-100 py-3 font-semibold">{l.label}</Link>
          ))}
          <Link href="/login/" onClick={close} className="btn-primary mt-4 w-full">Login / Register</Link>
        </nav>
      )}
    </header>
  );
            }
