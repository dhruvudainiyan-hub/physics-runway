// ✏️ EDIT THIS FILE to change homepage text.

export const whyChoose = [
  { icon: "users", title: "Expert Faculty", text: "Experienced teachers who simplify tough concepts." },
  { icon: "video", title: "Offline Classroom Teaching", text: "Learn face to face with expert teachers in small batches." },
  { icon: "book", title: "Batch-wise Study Material", text: "Notes and practice sets for enrolled students only." },
  { icon: "chart", title: "Progress Tracking", text: "Assignments and tests to measure your growth." },
  { icon: "shield", title: "Small, Focused Batches", text: "Personal attention and doubt-solving support." },
  { icon: "phone", title: "Mobile-friendly Learning", text: "Study from your phone, tablet or laptop." },
];

// "teaches" decides which course page shows this teacher
export const faculty = [
  { subject: "Physics", teaches: ["Physics"], name: "Physics Faculty Name", qualification: "M.Sc. Physics", experience: "10+ years experience", bio: "Add the teacher's short biography here.", image: "/assets/images/physics-teacher.png" },
  { subject: "Biology", teaches: ["Science"], name: "Biology Faculty Name", qualification: "M.Sc. Zoology", experience: "7+ years experience", bio: "Add the teacher's short biography here.", image: "/assets/images/biology-teacher.png" },
];

export const testimonials = [
  { name: "Student Name", detail: "Class 10 student", quote: "Add the student's own words here.", image: "/assets/images/student-class-10.png" },
  { name: "Student Name", detail: "Class 11 student", quote: "Add the student's own words here.", image: "/assets/images/student-class-11.png" },
  { name: "Student Name", detail: "Class 12 student", quote: "Add the student's own words here.", image: "/assets/images/student-class-12.png" },
];

export const results = [
  { exam: "Class 10", items: [{ name: "Student Name", score: "Percentage" }, { name: "Student Name", score: "Percentage" }] },
  { exam: "Class 11", items: [{ name: "Student Name", score: "Percentage" }, { name: "Student Name", score: "Percentage" }] },
  { exam: "Class 12", items: [{ name: "Student Name", score: "Percentage" }, { name: "Student Name", score: "Percentage" }] },
];

export const faqs = [
  { q: "How do I join a course?", a: "Fill in the Admission form. The institute will contact you, and you complete admission and pay the fees in person at the institute." },
  { q: "Are study materials public?", a: "No. Study materials are available only inside the dashboard of students enrolled in that specific batch." },
  { q: "Are classes online or offline?", a: "Classes are held offline at the institute. The student portal is for study materials, assignments, announcements and progress." },
  { q: "How do I get my login?", a: "After admission, the institute creates your account and gives you your mobile number and password." },
  { q: "Can I join more than one batch?", a: "Yes. If you are enrolled in several batches, you can access the materials of all of them." },
];
