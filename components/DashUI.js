import { Loader2, Inbox, AlertTriangle } from "lucide-react";

export const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "";

export function Loading() {
  return <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-brand-600" /></div>;
}
export function Empty({ title, text }) {
  return (
    <div className="card text-center">
      <Inbox className="mx-auto h-10 w-10 text-slate-300" />
      <p className="mt-3 font-bold text-navy-900">{title}</p>
      {text && <p className="mt-1 text-sm text-slate-500">{text}</p>}
    </div>
  );
}
export function ErrorBox({ text }) {
  return (
    <div className="flex items-start gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-700">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /> {text}
    </div>
  );
}
export function PageTitle({ title, subtitle }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-extrabold">{title}</h1>
      {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
    </div>
  );
}
