import Link from "next/link";
import { Youtube } from "lucide-react";
import Logo from "@/components/Logo";
import { site } from "@/lib/siteData";

const cols = [
  { title: "Courses", links: [["Class 11", "/courses/class-11/"], ["Class 12", "/courses/class-12/"], ["JEE", "/courses/jee/"], ["NEET", "/courses/neet/"]] },
  { title: "Institute", links: [["Our Faculty", "/faculty/"], ["Results", "/results/"], ["About Us", "/about/"], ["Contact Us", "/contact/"]] },
  { title: "Students", links: [["Admission", "/admission/"], ["Student Login", "/login/"]] },
];

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-slate-300">
      <div className="container-page grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Logo light />
          <p className="mt-4 max-w-sm text-sm">Premium coaching for Class 11, Class 12, JEE and NEET.</p>
          <div className="mt-5 flex gap-3">
            {[[Youtube, site.social.youtube, "YouTube"]].map(([Icon, href, name]) => (
              <a key={name} href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-2.5 font-semibold text-brand-600 hover:bg-brand-100"><Icon className="h-5 w-5" /> Watch Us on Youtube </a>
            ))}
          </div>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <h4 className="mb-3 font-bold !text-white">{c.title}</h4>
            <ul className="space-y-2 text-sm">
              {c.links.map(([label, href]) => (
                <li key={href}><Link href={href} className="hover:text-accent-400">{label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} Physics Runway. All Rights Reserved.
      </div>
    </footer>
  );
}
