import ImageBox from "@/components/ImageBox";

export default function Home() {
  return (
    <main>
      <section className="bg-gradient-to-br from-navy-900 via-navy-800 to-brand-700 py-16 text-white">
        <div className="container-page grid items-center gap-10 lg:grid-cols-2">
          <div className="animate-fadeUp">
            <span className="rounded-full bg-white/10 px-4 py-1 text-sm text-accent-400">Class 11 • 12 • JEE • NEET</span>
            <h1 className="mt-4 text-4xl font-extrabold !text-white sm:text-5xl">Take off towards your dream rank</h1>
            <p className="mt-4 text-lg text-slate-300">Design system preview. The full homepage comes in Stage 3.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button className="btn-accent">Explore Courses</button>
              <button className="btn-outline !border-white !text-white hover:!bg-white/10">Admission</button>
            </div>
          </div>
          <ImageBox src="/assets/images/hero-image.png" alt="Physics Runway hero" label="Homepage hero image" ratio="aspect-[4/3]" />
        </div>
      </section>
    </main>
  );
}
