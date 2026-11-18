export default function SectionHeading({ eyebrow, title, subtitle, center = false, light = false }) {
  return (
    <div className={`mb-10 ${center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}`}>
      {eyebrow && <p className="mb-2 text-sm font-bold uppercase tracking-wider text-accent-500">{eyebrow}</p>}
      <h2 className={`text-3xl font-extrabold sm:text-4xl ${light ? "!text-white" : ""}`}>{title}</h2>
      {subtitle && <p className={`mt-3 text-lg ${light ? "text-slate-300" : "text-slate-500"}`}>{subtitle}</p>}
    </div>
  );
}
