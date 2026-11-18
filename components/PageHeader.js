import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function PageHeader({ eyebrow, title, subtitle, crumbs = [], children }) {
  return (
    <section className="bg-gradient-to-br from-navy-900 via-navy-800 to-brand-700 py-12 text-white">
      <div className="container-page">
        <nav className="mb-4 flex flex-wrap items-center gap-1 text-sm text-slate-300">
          <Link href="/" className="hover:text-white">Home</Link>
          {crumbs.map((c) => (
            <span key={c.label} className="flex items-center gap-1">
              <ChevronRight className="h-4 w-4" />
              {c.href ? <Link href={c.href} className="hover:text-white">{c.label}</Link> : <span className="text-white">{c.label}</span>}
            </span>
          ))}
        </nav>
        {eyebrow && <p className="text-sm font-bold uppercase tracking-wider text-accent-400">{eyebrow}</p>}
        <h1 className="mt-1 text-3xl font-extrabold !text-white sm:text-4xl">{title}</h1>
        {subtitle && <p className="mt-3 max-w-2xl text-lg text-slate-300">{subtitle}</p>}
        {children}
      </div>
    </section>
  );
        }
