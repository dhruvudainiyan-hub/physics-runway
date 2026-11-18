import { Atom, FlaskConical, Sigma, Dna } from "lucide-react";

const map = { physics: Atom, chemistry: FlaskConical, mathematics: Sigma, biology: Dna };

export default function SubjectIcon({ subject, className = "h-6 w-6" }) {
  const Icon = map[subject] || Atom;
  return <Icon className={className} />;
}
