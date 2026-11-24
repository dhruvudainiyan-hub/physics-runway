import Link from "next/link";
import { Clock, Users, ArrowRight } from "lucide-react";
import ImageBox from "@/components/ImageBox";

export default function CourseCard({ course }) {
  return (
    <div className="card flex h-full flex-col overflow-hidden !p-0">
      <ImageBox
        src={course.image}
        alt={`${course.title} thumbnail`}
        label={course.title}
        ratio="aspect-video"
        className="!rounded-none"
      />
      <div className="flex flex-1 flex-col p-5">
        <span className="w-fit rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600">
          {course.subjectName}
        </span>
        <h3 className="mt-3 text-lg font-bold">{course.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-slate-500">{course.description}</p>
        <div className="mt-3 flex gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{course.duration}</span>
          <span className="flex items-center gap-1"><Users className="h-4 w-4" />{course.batch}</span>
        </div>
        <div className="mt-auto flex items-center justify-between pt-4">
          <p className="text-xl font-extrabold text-navy-900">₹{course.fee.toLocaleString("en-IN")}<span className="text-sm font-medium text-slate-500"> / month</span></p>
          <Link
            href={`/courses/${course.category}/${course.subject}/`}
            className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:gap-2"
          >
            View details <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
          }
