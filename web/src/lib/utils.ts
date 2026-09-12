export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export const GITHUB_URL =
  "https://github.com/77anuj77/job-prediction-ai-resume-analyser-fastapi";

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function scoreLabel(score: number): string {
  if (score >= 90) return "Excellent Match";
  if (score >= 78) return "Strong Match";
  if (score >= 62) return "Good Match";
  if (score >= 45) return "Moderate Match";
  return "Needs Work";
}

export function hashString(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function pick<T>(arr: T[], index: number): T {
  return arr[index % arr.length];
}

export function nameFromFilename(filename: string): string {
  const base = filename
    .replace(/\.(pdf|docx?|txt)$/i, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const words = base.split(" ").filter((w) => !/^\d+$/.test(w));
  if (words.length >= 2) return words.slice(0, 2).map(cap).join(" ");
  if (words.length === 1) return cap(words[0]);
  return "Alex Rivera";
}

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function targetTitleFromJd(jd: string): string {
  const j = jd.toLowerCase();
  const signals: [RegExp, string][] = [
    [/machine learning|ml engineer|ai engineer|llm/, "Machine Learning Engineer"],
    [/data scientist|data science/, "Data Scientist"],
    [/data analyst|analytics/, "Data Analyst"],
    [/backend|node\.?js|python developer/, "Backend Engineer"],
    [/frontend|react|front-end/, "Frontend Engineer"],
    [/full ?stack/, "Full Stack Engineer"],
    [/devops|sre|cloud engineer|terraform/, "DevOps Engineer"],
    [/product manager/, "Product Manager"],
    [/ui\/?ux|product designer/, "Product Designer"],
    [/qa|quality|test engineer/, "QA Engineer"],
    [/software engineer|senior developer/, "Software Engineer"],
  ];
  for (const [re, title] of signals) {
    if (re.test(j)) return title;
  }
  return "Software Engineer";
}