import Link from "next/link";
import { ArrowRight, GraduationCap, Trophy } from "lucide-react";
import ImageBox from "@/components/ImageBox";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-navy-900 via-navy-800 to-brand-700 text-white">
      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent-500/20 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-brand-500/30 blur-3xl" />
      <div className="container-page relative grid items-center gap-12 py-14 lg:grid-cols-2 lg:py-20">
        <div className="animate-fadeUp">
          <span className="inline-block rounded-full bg-white/10 px-4 py-1 text-sm font-semibold text-accent-400">
            Class 10 • Class 11 • Class 12
          </span>
          <h1 className="mt-5 text-4xl font-extrabold leading-tight !text-white sm:text-5xl lg:text-6xl">
            Take off towards your <span className="text-accent-400">dream rank</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-slate-300">
            Expert faculty, structured offline batches and a student portal — everything an ambitious
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#courses" className="btn-accent">Explore Courses <ArrowRight className="h-5 w-5" /></a>
            <Link href="/admission/" className="btn-outline !border-white !text-white hover:!bg-white/10">
              Apply for Admission
            </Link>
          </div>
        </div>

        <div className="relative animate-fadeUp">
          <ImageBox
            src="/assets/images/hero-image.png"
            alt="Physics Runway students"
            label="Homepage hero image"
            ratio="aspect-[4/3]"
            className="shadow-2xl ring-4 ring-white/10"
          />
          <div className="absolute -bottom-4 left-3 flex items-center gap-3 rounded-2xl bg-white p-3 text-navy-900 shadow-xl sm:left-6">
            <span className="rounded-xl bg-brand-50 p-2 text-brand-600"><GraduationCap className="h-6 w-6" /></span>
            <div><p className="text-sm font-bold">Classroom Teaching</p><p className="text-xs text-slate-500">Offline batches</p></div>
          </div>
          <div className="absolute -top-4 right-3 flex items-center gap-3 rounded-2xl bg-white p-3 text-navy-900 shadow-xl sm:right-6">
            <span className="rounded-xl bg-accent-400/30 p-2 text-accent-500"><Trophy className="h-6 w-6" /></span>
            <div><p className="text-sm font-bold">Top Faculty</p><p className="text-xs text-slate-500">Expert mentors</p></div>
          </div>
        </div>
      </div>
    </section>
  );
              }
