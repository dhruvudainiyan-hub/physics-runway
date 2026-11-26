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
  { subject: "Physics", teaches: ["Physics"], name: "Mr. Ravi Gantholiya", qualification: "M.Sc. Physics", experience: "10+ years experience", bio: "Teaches Physics for Class 11 and Class 12 with a focus on understanding concepts first, then practising numericals step by step. Known for making difficult topics simple and for patiently solving every student's doubts.", image: "/assets/images/physics-teacher.png" },
  { subject: "Biology", teaches: ["Science"], name: "Biology Faculty Name", qualification: "M.Sc. Zoology", experience: "7+ years experience", bio: "Teaches Class 10 Biology with clear explanations, simple diagrams and regular revision. Helps students build a strong base, understand every chapter and score well in their board exams.", image: "/assets/images/biology-teacher.png" },
];

export const testimonials = [
  { name: "Student", detail: "Class 10 student", quote: "Science felt confusing before. The teacher explains every concept with simple examples, and my confidence in the exams has grown a lot.", image: "/assets/images/student-1.png" },
  { name: "Student", detail: "Class 10 student", quote: "The weekly tests helped me find my weak chapters early. Doubts are always solved patiently, even after class.", image: "/assets/images/student-2.png" },
  { name: "Student", detail: "Class 11 student", quote: "Physics used to be my weakest subject. Learning the concept first, then practising numericals, made it enjoyable.", image: "/assets/images/student-3.png" },
  { name: "Student", detail: "Class 11 student", quote: "Small batches mean every student gets attention. The assignments and notes in the portal are very useful for revision.", image: "/assets/images/student-4.png" },
  { name: "Student", detail: "Class 12 student", quote: "The board preparation was well planned, with regular tests and revision of every chapter. I felt fully prepared on exam day.", image: "/assets/images/student-5.png" },
  { name: "Student", detail: "Class 12 student", quote: "Difficult topics like optics and electromagnetism became easy to understand. The teacher is supportive and always approachable.", image: "/assets/images/student-6.png" },
];

export const results = [
  { exam: "Class 10", items: [
    { name: "Student Name", score: "Percentage" },
    { name: "Student Name", score: "Percentage" },
    { name: "Student Name", score: "Percentage" },
  ] },
  { exam: "Class 11", items: [
    { name: "Student Name", score: "Percentage" },
    { name: "Student Name", score: "Percentage" },
    { name: "Student Name", score: "Percentage" },
  ] },
  { exam: "Class 12", items: [
    { name: "Student Name", score: "Percentage" },
    { name: "Student Name", score: "Percentage" },
    { name: "Student Name", score: "Percentage" },
  ] },
];

export const faqs = [
  { q: "How do I join a course?", a: "Fill in the Admission form. The institute will contact you, and you complete admission and pay the fees in person at the institute." },
  { q: "Are study materials public?", a: "No. Study materials are available only inside the dashboard of students enrolled in that specific batch." },
  { q: "Are classes online or offline?", a: "Classes are held offline at the institute. The student portal is for study materials, assignments, announcements and progress." },
  { q: "How do I get my login?", a: "After admission, the institute creates your account and gives you your mobile number and password." },
  { q: "Can I join more than one batch?", a: "Yes. If you are enrolled in several batches, you can access the materials of all of them." },
];
