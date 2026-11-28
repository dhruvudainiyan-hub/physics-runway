import CourseView from "@/components/CourseView";
import { courses } from "@/lib/siteData";

export const dynamicParams = false;

export function generateStaticParams() {
  return courses.map((c) => ({ category: c.category, subject: c.subject }));
}

export function generateMetadata({ params }) {
  const c = courses.find((x) => x.id === `${params.category}-${params.subject}`);
  return { title: `${c?.title} | Physics Runway` };
}

export default function CourseDetails({ params }) {
  return <CourseView courseId={`${params.category}-${params.subject}`} />;
}
