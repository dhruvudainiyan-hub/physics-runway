"use client";
import Link from "next/link";
import { Instagram, Youtube, Facebook } from "lucide-react";
import Logo from "@/components/Logo";
import { useContent, safeUrl } from "@/lib/content";

const cols = [
  { title: "Courses", links: [["Class 10", "/courses/class-10/"], ["Class 11", "/courses/class-11/"], ["Class 12", "/courses/class-12/"]] },
  { title: "Institute", links: [["Our Faculty", "/faculty/"], ["About Us", "/about/"], ["Contact Us", "/contact/"], ["Privacy Policy", "/privacy/"]] },
  { title: "Students", links: [["Admission", "/admission/"], ["Student Login", "/login/"]] },
];

export default function Footer() {
  const { site } = useContent();
  const socials = [
    { Icon: Instagram, href: safeUrl(site.social?.instagram), label: "Follow us on Instagram" },
    { Icon: Youtube, href: safeUrl(site.social?.youtube), label: "Watch us on YouTube" },
    { Icon: Facebook, href: safeUrl(site.social?.facebook), label: "Like us on Facebook" },
  ].filter((s) => s.href);

  return (
    <footer className="bg-navy-900 text-slate-300">
      <div className="container-page grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Logo light />
          <p className="mt-4 max-w-sm text-sm">Premium coaching for Class 10, 11 and 12.</p>
          <div className="mt-5 flex flex-col items-start gap-3">
            {socials.map(({ Icon, href, label }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20">
                <Icon className="h-5 w-5" /> {label}
              </a>
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
