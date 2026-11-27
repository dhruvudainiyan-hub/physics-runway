import PageHeader from "@/components/PageHeader";
import { site } from "@/lib/siteData";

export const metadata = { title: "Privacy Policy | Physics Runway" };

const UPDATED = "27 November 2026";

const sections = [
  {
    title: "Who we are",
    text: `${site.name} is a coaching institute for students of Class 10, 11 and 12. This policy explains what information we collect through this website, why we collect it, and how we look after it.`,
  },
  {
    title: "Information we collect",
    items: [
      "Admission form: the student's name, mobile number, email (optional), current class, exam preparation, preferred subjects, previous academic details, and the parent or guardian's name and mobile number.",
      "Contact form: your name, mobile number, email (optional) and message.",
      "Student accounts: name, mobile number, class, exam, school, city, parent or guardian name, batch enrolment, test scores, and a password. Passwords are stored in scrambled form, so nobody at the institute can read them.",
    ],
  },
  {
    title: "How we use it",
    items: [
      "To reply to enquiries and contact you about admission.",
      "To create student accounts and give each student access to the materials of their own batch.",
      "To share announcements and assignments, and to track each student's progress.",
      "We do not use this information for advertising, and we do not sell it.",
    ],
  },
  {
    title: "Who can see it",
    items: [
      "Authorised staff of the institute who manage admissions and batches.",
      "Each student can see only their own details and the content of their own batch.",
      "Service providers that host this website, its database and its files, who process data on our behalf to keep the website running.",
    ],
  },
  {
    title: "Children",
    text: "Many of our students are under 18. We collect their information only for admission and teaching, and with the knowledge of a parent or guardian. We do not show advertising to students or track them for marketing. A parent or guardian can contact us at any time about their child's information.",
  },
  {
    title: "How long we keep it",
    text: "We keep a student's information while they are enrolled and for a reasonable time afterwards. Admission enquiries and messages that do not lead to admission can be deleted on request.",
  },
  {
    title: "Your choices",
    text: "You can ask us to show you the information we hold about you or your child, correct it, or delete it. Contact us using the details below.",
  },
  {
    title: "Security",
    items: [
      "Study materials are available only to students enrolled in the matching batch.",
      "Student accounts are created by the institute, and access can be removed at any time.",
      "No website can be completely secure, so please keep your password private and tell us if you think someone else has used your account.",
    ],
  },
  {
    title: "Browser storage",
    text: "We keep a login session in your browser so you stay signed in, and a small timer on our forms to prevent spam. We do not use advertising cookies.",
  },
  {
    title: "Changes to this policy",
    text: "We may update this policy from time to time. The date at the top shows when it was last changed.",
  },
];

export default function PrivacyPage() {
  return (
    <main>
      <PageHeader title="Privacy Policy" subtitle={`Last updated: ${UPDATED}`} crumbs={[{ label: "Privacy Policy" }]} />
      <section className="bg-white py-12">
        <div className="container-page max-w-3xl space-y-8">
          {sections.map((s) => (
            <div key={s.title}>
              <h2 className="text-xl font-bold">{s.title}</h2>
              {s.text && <p className="mt-2 text-slate-600">{s.text}</p>}
              {s.items && (
                <ul className="mt-2 list-disc space-y-2 pl-5 text-slate-600">
                  {s.items.map((it) => <li key={it}>{it}</li>)}
                </ul>
              )}
            </div>
          ))}
          <div>
            <h2 className="text-xl font-bold">Contact us</h2>
            <p className="mt-2 text-slate-600">
              {site.name}<br />
              {site.address}<br />
              Phone: {site.phone}<br />
              Email: {site.email}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
  }
