import { syllabus } from "@/lib/syllabus";

const c11 = syllabus["class-11-physics"] || [];
const c12 = syllabus["class-12-physics"] || [];

const make = (prefix, list, part) =>
  list.map((title, i) => ({ slug: `${prefix}ch-${i + 1}`, number: i + 1, title, part }));

// JEE Mains and NEET = Class 11 chapters + Class 12 chapters,
// but each has its OWN uploads (nothing is shared with Class 11 or 12).
const combined = () => [...make("c11-", c11, "Class 11 syllabus"), ...make("c12-", c12, "Class 12 syllabus")];

export const freeCategories = [
  { slug: "class-11", title: "Class 11", blurb: "Physics chapters for Class 11", chapters: make("", c11, "Class 11") },
  { slug: "class-12", title: "Class 12", blurb: "Physics chapters for Class 12", chapters: make("", c12, "Class 12") },
  { slug: "jee", title: "JEE Mains", blurb: "Class 11 and Class 12 Physics chapters for JEE Mains", chapters: combined() },
  { slug: "neet", title: "NEET", blurb: "Class 11 and Class 12 Physics chapters for NEET", chapters: combined() },
];

export const KINDS = [
  { key: "notes", label: "Notes", col: "notes_path", exts: ["pdf", "docx"], accept: ".pdf,.docx" },
  { key: "ppt", label: "PPT", col: "ppt_path", exts: ["ppt", "pptx"], accept: ".ppt,.pptx" },
  { key: "questions", label: "Chapter Questions (PDF)", col: "questions_path", exts: ["pdf"], accept: ".pdf" },
  { key: "answers", label: "Answers (PDF)", col: "answers_path", exts: ["pdf"], accept: ".pdf" },
];

export const MIME = {
  pdf: "application/pdf",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ppt: "application/vnd.ms-powerpoint",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
};

export function youtubeId(url) {
  try {
    const u = new URL(url);
    let id = "";
    if (u.hostname === "youtu.be") id = u.pathname.slice(1);
    else if (u.hostname.endsWith("youtube.com")) {
      if (u.pathname === "/watch") id = u.searchParams.get("v") || "";
      else {
        const m = u.pathname.match(/^\/(embed|shorts|live)\/([^/?]+)/);
        id = m ? m[2] : "";
      }
    }
    return /^[A-Za-z0-9_-]{11}$/.test(id) ? id : "";
  } catch {
    return "";
  }
}
