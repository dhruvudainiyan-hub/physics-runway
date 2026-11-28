"use client";
import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import ImageBox from "@/components/ImageBox";
import { useContent } from "@/lib/content";

export default function ContactSection() {
  const { site } = useContent();
  const rows = [
    { Icon: Phone, label: "Call us", value: site.phone },
    { Icon: Mail, label: "Email", value: site.email },
    { Icon: MapPin, label: "Visit us", value: site.address },
  ];
  return (
    <section className="bg-white py-16">
      <div className="container-page grid items-center gap-10 lg:grid-cols-2">
        <div>
          <SectionHeading eyebrow="Get in touch" title="Talk to our counsellors" />
          <div className="space-y-4">
            {rows.map(({ Icon, label, value }) => (
              <div key={label} className="flex items-start gap-4">
                <span className="rounded-xl bg-brand-50 p-3 text-brand-600"><Icon className="h-5 w-5" /></span>
                <div className="min-w-0"><p className="text-sm text-slate-500">{label}</p><p className="break-words font-semibold text-navy-900">{value}</p></div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/contact/" className="btn-primary">Contact Us</Link>
            <Link href="/admission/" className="btn-outline">Apply for Admission</Link>
          </div>
        </div>
        <ImageBox src="/assets/images/institute-image.png" alt="Physics Runway institute" label="Institute photo" ratio="aspect-[4/3]" className="shadow-xl" />
      </div>
    </section>
  );
}
