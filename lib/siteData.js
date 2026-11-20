// ✏️ EDIT THIS FILE to change contact details, fees and course text.
// All numbers/fees here are SAMPLE DEMO DATA.

export const site = {
  name: "Physics Runway",
  phone: "+91 9808402137",
  email: "ravigantholiya2021@gmail.com",
  address: "Physics Runway, Jangjeet Nagar, Agra, Uttar Pradesh",
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d221.89903255372178!2d78.03824006805343!3d27.14418940000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3974715a66e82b21%3A0x70b2b0daa454953!2sRavi%20Gantholiya%20Physics%20Teacher!5e0!3m2!1sen!2sin!4v1795136285154!5m2!1sen!2sin", // paste the Google Maps embed link here later (see Contact page note)
  social: { youtube: "https://www.youtube.com/@physicsrunway"},
};

export const subjects = {
  physics: { name: "Physics", blurb: "Concept-first teaching with problem-solving practice." },
  chemistry: { name: "Chemistry", blurb: "Physical, organic and inorganic made simple." },
  mathematics: { name: "Mathematics", blurb: "From fundamentals to advanced problem solving." },
  biology: { name: "Biology", blurb: "Diagram-rich lessons with NCERT-focused revision." },
};

export const categories = [
  { slug: "class-11", title: "Class 11", tagline: "Build rock-solid fundamentals", fee: 18000, duration: "12 months", subjects: ["physics", "chemistry", "mathematics", "biology"] },
  { slug: "class-12", title: "Class 12", tagline: "Board excellence with competitive edge", fee: 20000, duration: "12 months", subjects: ["physics", "chemistry", "mathematics", "biology"] },
  { slug: "jee", title: "JEE", tagline: "Main + Advanced preparation", fee: 45000, duration: "24 months", subjects: ["physics", "chemistry", "mathematics"] },
  { slug: "neet", title: "NEET", tagline: "Targeted medical entrance preparation", fee: 42000, duration: "24 months", subjects: ["physics", "chemistry", "biology"] },
];

export const courses = categories.flatMap((cat) =>
  cat.subjects.map((sub) => ({
    id: `${cat.slug}-${sub}`,
    category: cat.slug,
    categoryTitle: cat.title,
    subject: sub,
    subjectName: subjects[sub].name,
    title: `${cat.title} ${subjects[sub].name}`,
    description: `${cat.tagline}. ${subjects[sub].blurb}`,
    duration: cat.duration,
    fee: cat.fee,
    batch: "Batch A",
    image: `/assets/images/courses/${cat.slug}-${sub}.png`,
  }))
);

export const popularIds = ["jee-physics", "neet-biology", "class-12-physics", "class-11-mathematics"];

// Sample numbers for the demo strip
export const stats = [
  { value: "10,000+", label: "Students (sample)" },
  { value: "50+", label: "Expert teachers (sample)" },
  { value: "95%", label: "Satisfaction (sample)" },
  { value: "4", label: "Exam categories" },
];
