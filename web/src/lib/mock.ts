import type {
  ActionItem,
  ApiAnalysisResponse,
  BreakdownItem,
  Insight,
  JobMatch,
  KeywordCompare,
  ResumeAnalysis,
  SectionScore,
  Severity,
} from "./types";
import { clamp, hashString, nameFromFilename, pick, targetTitleFromJd } from "./utils";

const SKILLS = [
  "React", "TypeScript", "Next.js", "Node.js", "GraphQL", "Tailwind CSS",
  "Docker", "Kubernetes", "AWS", "Terraform", "CI/CD", "Git", "PostgreSQL",
  "MongoDB", "Redis", "REST APIs", "Python", "FastAPI", "Jest", "Testing Library",
  "Playwright", "Framer Motion", "Figma", "System Design", "Microservices",
  "Turborepo", "Vitest", "Storybook", "WebSockets", "LangChain", "Pandas",
  "Scikit-learn", "PyTorch", "TensorFlow", "Spark", "Airflow", "Snowflake",
  "dbt", "GCP", "Azure", "Kafka", "gRPC", "Linux", "NestJS", "Svelte",
  "Vue.js", "Accessibility", "NextAuth", "Zustand", "Knex",
];

const KEYWORDS = [
  "agile", "scrum", "leadership", "mentorship", "code review", "on-call",
  "performance", "scalability", "distributed systems", "test-driven development",
  "pair programming", "design systems", "technical documentation",
  "stakeholder communication", "roadmaps", "incident response", "SLO",
  "APM", "feature flags", "observability", "monorepo", "edge functions",
];

const JOB_CATS = ["Backend", "Frontend", "Data", "ML", "DevOps"];

interface Seed {
  hash: number;
  ats: number;
  skill: number;
  text: number;
  ml: number;
}

function seedFrom(stem: string): Seed {
  const h = hashString(stem);
  const ats = 74 + ((h % 17) * 17) % 22; // 74..95
  const skill = clamp(ats - 6 + ((h >> 3) % 9), 40, 98);
  const text = clamp(ats - 10 + ((h >> 5) % 11), 40, 96);
  const ml = clamp(ats + ((h >> 7) % 7) - 3, 40, 99);
  return { hash: h, ats, skill, text, ml };
}

function buildBreakdown(s: Seed, live?: { ats: number; skill: number; text: number }): BreakdownItem[] {
  const fmt = live
    ? clamp(Math.round(live.ats + 5 - ((s.hash >> 6) % 5)), 40, 97)              // parser friendliness ≈ ATS + 5
    : clamp(s.ats + 4 - ((s.hash >> 6) % 7), 50, 97);
  const exp = live ? clamp(live.ats - 8 + ((s.hash >> 2) % 13), 40, 94)          // anchored to ATS, no fake floor
                  : clamp(s.ats - 6 + ((s.hash >> 2) % 8), 50, 96);
  const edu = live ? clamp(84 + ((s.hash >> 4) % 9), 55, 97)                     // no API source; kept stable
                   : clamp(85 - ((s.hash >> 4) % 9), 60, 97);
  const kw = live ? clamp(Math.round((live.skill + live.text) / 2), 40, 96)      // keyword ≈ blend of real signals
                  : clamp(s.skill - 8 + ((s.hash >> 8) % 12), 40, 94);
  const atsScore = live?.ats ?? s.ats;
  const skillScore = live?.skill ?? s.skill;
  return [
    { id: "ats", category: "ATS Compatibility", score: atsScore, hint: "Parser & structure" },
    { id: "skills", category: "Skills Match", score: skillScore, hint: "Against the JD" },
    { id: "exp", category: "Experience", score: exp, hint: "Years & scope" },
    { id: "edu", category: "Education", score: edu, hint: "Alignment with role" },
    { id: "fmt", category: "Formatting", score: fmt, hint: "Parser friendliness" },
    { id: "kw", category: "Keywords", score: kw, hint: "JD language coverage" },
  ];
}

function buildInsights(s: Seed, missing: string[]): Insight[] {
  const idx = s.hash % 5;
  const strengths: Insight[] = [
    { id: "s1", kind: "strength", title: "Strong technical foundation", description: "Core stack skills appear early and prominently, matching the role's primary requirements.", severity: "good" },
    { id: "s2", kind: "strength", title: "Quantified achievements", description: "Several bullet points use numbers and outcomes, which ATS and recruiters weight heavily.", severity: "good" },
    { id: "s3", kind: "strength", title: "Modern tooling signal", description: "Your toolchain (build systems, testing, containerization) reads as production-ready.", severity: "good" },
  ];
  const weaknesses: Insight[] = [
    { id: "w1", kind: "weakness", title: "Vague role responsibilities", description: "Some bullet points describe duties instead of impact. Lead each line with a measurable outcome.", severity: "warn" },
    { id: "w2", kind: "weakness", title: "Dense paragraph blocks", description: "Long paragraphs are skipped by parsers and skim-readers. Aim for scannable 1-line bullets.", severity: "bad" },
  ];
  const missingSkills: Insight[] = missing.slice(0, 2).map((skill, i) => ({
    id: `ms${i}`,
    kind: "missing-skill",
    title: `Missing: ${skill}`,
    description: `${skill} appears in the target JD but is absent from your resume. Add it with concrete usage evidence.`,
    severity: "bad" as Severity,
  }));
  const missingKeywords: Insight[] = ["agile delivery", "system design", "observability"].slice(0, 1).map((kw, i) => ({
    id: `mk${i}`,
    kind: "missing-keyword",
    title: `Keyword gap: ${kw}`,
    description: `The job description emphasizes "${kw}". Reflect it in achievements, not just a skills list.`,
    severity: "warn" as Severity,
  }));
  const formatting: Insight[] = [
    { id: "f1", kind: "formatting", title: "Single-column layout", description: "Your layout parsed cleanly. Keep it single-column with clear section headers — this is the strongest ATS format.", severity: "good" },
    { id: "f2", kind: "formatting", title: "Missing contact header", description: "A bold, one-line contact header (name, city, email, GitHub, LinkedIn) improves extraction reliability.", severity: "warn" },
  ];
  const recommendations: Insight[] = [
    { id: "r1", kind: "recommendation", title: "Tailor titles to the JD", description: "Mirror the JD's exact phrasing for your headline and section names to raise keyword density.", severity: "accent" },
    { id: "r2", kind: "recommendation", title: "Add a top 3 skills ribbon", description: "A compact highlight row directly under your summary cements the skills the recruiter must notice.", severity: "accent" },
  ];

  return [
    pick(strengths, idx),
    pick(weaknesses, idx + 1),
    pick(strengths, idx + 2),
    ...missingSkills,
    ...missingKeywords,
    ...formatting,
    ...recommendations,
  ];
}

function buildJobMatch(s: Seed): JobMatch {
  const start = s.hash % (SKILLS.length - 6);
  const resume = SKILLS.slice(start, start + 11 + (s.hash % 4));
  const jd = SKILLS.slice(start + 2, start + 15);
  const intersection = jd.filter((x) => resume.includes(x));
  const missing = jd.filter((x) => !resume.includes(x));
  const matchPercent = jd.length ? Math.round((intersection.length / jd.length) * 100) : 0;

  const keywordComparison: KeywordCompare[] = KEYWORDS.slice((s.hash >> 2) % 4, (s.hash >> 2) % 4 + 6).map((kw, i) => ({
    keyword: kw,
    inResume: (s.hash + i) % 3 !== 0,
    importance: (i % 3 === 0 ? "high" : i % 3 === 1 ? "medium" : "low") as KeywordCompare["importance"],
  }));

  return {
    matchPercent,
    matchedSkills: intersection,
    missingSkills: missing.slice(0, 6),
    keywordComparison,
    recommendedSkills: missing.slice(0, 4),
  };
}

function buildSections(s: Seed): SectionScore[] {
  const mk = (id: string, label: string, base: number, present: boolean, notes: string[]): SectionScore => ({
    id,
    label,
    score: clamp(base + ((s.hash % 9) - 4), 30, 99),
    present,
    feedback: notes.slice(0, 2).map((note, i) => ({
      note,
      detail: `Recommendation #${i + 1} for the ${label.toLowerCase()} section of your resume.`,
      severity: note.startsWith("Well") ? "good" : note.startsWith("Add") ? "bad" : "warn",
    })),
  });

  return [
    mk("contact", "Contact Information", 92, true, ["Well formatted — name, email, phone and location all parse correctly.", "Add LinkedIn + GitHub URLs in the same header line."]),
    mk("summary", "Professional Summary", 76, true, ["Good 3-line opening with role keywords.", "Add a measurable top-line achievement to open stronger."]),
    mk("experience", "Work Experience", 71, true, ["Strong reverse-chronological structure.", "Add 1-2 quantified bullets per role; lead with outcomes."]),
    mk("projects", "Projects", 68, true, ["Projects are relevant and current.", "Add a link + 3-4 tech tags per project for skimmability."]),
    mk("education", "Education", 82, true, ["Sections are clear and complete.", "Consider moving education below experience for this role."]),
    mk("skills", "Skills", 74, true, ["Solid skills inventory.", "Group into tiers (core / secondary / familiar) to signal depth."]),
    mk("certifications", "Certifications", 58, false, ["No certifications detected.", "Add a cloud or testing certification if you hold one.", "Consider adding a certification section header (even one row) could help parsing."]),
  ];
}

function buildActionPlan(): ActionItem[] {
  return [
    { step: 1, title: "Add missing technical skills", description: "The JD surfaces skills your resume omits. Fold each into existing bullet points with concrete context.", impact: "high", effort: "low" },
    { step: 2, title: "Rewrite weak bullet points", description: "Replace duty-driven lines with outcome-driven ones: What did you build, for whom, and at what scale?", impact: "high", effort: "medium" },
    { step: 3, title: "Improve keyword alignment", description: "Mirror the JD's exact vocabulary in your summary, skills, and project descriptions.", impact: "medium", effort: "low" },
    { step: 4, title: "Quantify achievements", description: "Attach numbers to outcomes — throughput, adoption, latency, revenue — to move ATS and human signals.", impact: "high", effort: "medium" },
    { step: 5, title: "Fix formatting issues", description: "Standardize headers, bullet glyphs, and spacing so every parser extracts a consistent structure.", impact: "medium", effort: "low" },
  ];
}

function buildRoadmap(missing: string[]): ResumeAnalysis["skillRoadmap"] {
  const titles: Record<string, { why: string; learn: string[]; project: string }> = {
    React: { why: "Primary framework in the target role", learn: ["React docs — thinking in React", "State with Zustand/Redux Toolkit"], project: "Rebuild a dashboard with optimistic UI" },
    TypeScript: { why: "Required for type-safe codebases", learn: ["TypeScript handbook", "Generics & utility types"], project: "Type a legacy module end-to-end" },
    "Node.js": { why: "Runtime powering the backend stack", learn: ["Node streams & event loop", "Express/Fastify patterns"], project: "Build a rate-limited API gateway" },
    Kubernetes: { why: "Deployment platform used by the team", learn: ["K8s basics", "Helm charts"], project: "Deploy a stateless service with probes" },
    GraphQL: { why: "API layer in the job description", learn: ["Apollo Server", "Schema design"], project: "Expose a federated product API" },
    AWS: { why: "Primary cloud provider", learn: ["Solutions Architect track", "CDK"], project: "Provision a serverless data pipeline" },
  };
  return missing.slice(0, 3).map((skill) => {
    const t = titles[skill];
    return {
      skill,
      why: t?.why ?? `Named explicitly in the target job description`,
      learn: t?.learn ?? [`Structured path: ${skill}`, "Practice projects + docs"],
      project: t?.project ?? `Ship a small portfolio project with ${skill}`,
    };
  });
}

function buildJobs(jd: string): ResumeAnalysis["jobRecommendations"] {
  const cat = JOB_CATS[hashString(jd) % JOB_CATS.length];
  const titles: Record<string, { title: string; company: string; location: string; exp: string; salary: string }[]> = {
    Backend: [
      { title: "Senior Backend Engineer", company: "Leverage Labs", location: "Bengaluru · Remote", exp: "4–7 yrs", salary: "₹35–45 LPA" },
      { title: "Backend Platform Engineer", company: "Northstack", location: "Pune · Hybrid", exp: "3–6 yrs", salary: "₹25–35 LPA" },
      { title: "Distributed Systems Engineer", company: "Fathom", location: "Gurugram · On-site", exp: "5–8 yrs", salary: "₹40–55 LPA" },
    ],
    Frontend: [
      { title: "Senior Frontend Engineer", company: "Linear-style UI co.", location: "Bengaluru · Remote", exp: "4–6 yrs", salary: "₹30–42 LPA" },
      { title: "Creative Frontend Engineer", company: "Northstack", location: "Remote", exp: "3–6 yrs", salary: "₹28–38 LPA" },
    ],
    Data: [
      { title: "Data Engineer", company: "Fathom", location: "Hyderabad · Hybrid", exp: "3–6 yrs", salary: "₹22–32 LPA" },
      { title: "Analytics Engineer", company: "Leverage Labs", location: "Bengaluru · Remote", exp: "2–5 yrs", salary: "₹20–28 LPA" },
    ],
    ML: [
      { title: "ML Engineer", company: "Mindwave", location: "Bengaluru · On-site", exp: "4–7 yrs", salary: "₹40–55 LPA" },
      { title: "Applied AI Engineer", company: "Syntril", location: "Remote", exp: "3–6 yrs", salary: "₹35–48 LPA" },
    ],
    DevOps: [
      { title: "DevOps / SRE Engineer", company: "Northstack", location: "Remote", exp: "3–6 yrs", salary: "₹25–38 LPA" },
      { title: "Platform Engineer", company: "Cloudbound", location: "Bengaluru · Hybrid", exp: "4–7 yrs", salary: "₹38–50 LPA" },
    ],
  };
  return (titles[cat] ?? titles.Backend).map((j, i) => ({
    job_title: j.title,
    company: j.company,
    location: j.location,
    experience: j.exp,
    salary: j.salary,
    recommendation_score: Math.round(clamp(76 + ((i * 7) + (hashString(jd) % 10)), 60, 96)),
  }));
}

function keywordComparisonFromApi(res: ApiAnalysisResponse): KeywordCompare[] {
  const matched = (res.matched_skills ?? []).map((keyword) => ({
    keyword,
    inResume: true,
    importance: "high" as const,
  }));
  const missing = (res.missing_skills ?? []).map((keyword) => ({
    keyword,
    inResume: false,
    importance: "high" as const,
  }));
  return [...missing, ...matched].slice(0, 14);
}

function breakdownFromApi(
  res: ApiAnalysisResponse,
): BreakdownItem[] {
  const ats = Math.round(res.final_match_score);
  const skills = Math.round(res.skill_match_score);
  const text = Math.round(res.text_similarity_score);
  const kw = clamp(Math.round(text * 0.62 + skills * 0.38), 20, 99);
  const exp = clamp(Math.round(skills * 0.5 + ats * 0.5), 30, 97);
  const fmt = clamp(Math.round(ats * 0.78 + text * 0.22), 30, 98);
  const edu = clamp(Math.round(ats * 0.55 + skills * 0.45), 35, 97);
  return [
    { id: "ats", category: "ATS Compatibility", score: ats, hint: "Parsing & structure" },
    { id: "skills", category: "Skills Match", score: skills, hint: "Against the JD" },
    { id: "exp", category: "Experience", score: exp, hint: "Years & scope" },
    { id: "edu", category: "Education", score: edu, hint: "Alignment with role" },
    { id: "fmt", category: "Formatting", score: fmt, hint: "Parser friendliness" },
    { id: "kw", category: "Keywords", score: kw, hint: "JD language coverage" },
  ];
}

export function enrichApiResponse(res: ApiAnalysisResponse, filename: string, jd: string): ResumeAnalysis {
  const s = seedFrom(filename + jd);
  const jobMatch: JobMatch = {
    matchPercent: Math.round(res.final_match_score),
    matchedSkills: res.matched_skills ?? [],
    missingSkills: res.missing_skills ?? [],
    keywordComparison: keywordComparisonFromApi(res),
    recommendedSkills: (res.missing_skills ?? []).slice(0, 4),
  };
  return {
    id: "an" + (s.hash % 100000).toString(36) + Date.now().toString(36),
    filename,
    candidateName: nameFromFilename(filename),
    targetTitle: targetTitleFromJd(jd),
    date: new Date().toISOString(),
    atsScore: Math.round(res.final_match_score),
    scoreLabel: "",
    breakdown: breakdownFromApi(res),
    insights: buildInsights(s, res.missing_skills ?? []),
    jobMatch,
    sections: buildSections(s),
    actionPlan: buildActionPlan(),
    resumeSkills: res.resume_skills ?? [],
    jdSkills: res.jd_skills ?? [],
    skillMatchScore: Math.round(res.skill_match_score),
    textSimilarityScore: Math.round(res.text_similarity_score),
    mlPrediction: res.ml_prediction,
    mlMatchScore: Math.round(res.ml_match_score),
    skillRoadmap: (res.skill_roadmap?.length
      ? res.skill_roadmap.map((r) => ({ skill: r.skill, why: r.why, learn: r.learn, project: r.project }))
      : buildRoadmap(res.missing_skills ?? [])),
    jobRecommendations: res.indian_job_recommendations ?? buildJobs(jd),
  };
}


export function generateMockAnalysis(filename: string, jd: string): ResumeAnalysis {
  const s = seedFrom(filename + jd);
  const jobMatch = buildJobMatch(s);
  return {
    id: "an" + (s.hash % 100000).toString(36) + Date.now().toString(36),
    filename,
    candidateName: nameFromFilename(filename),
    targetTitle: targetTitleFromJd(jd || "Senior Frontend Engineer"),
    date: new Date().toISOString(),
    atsScore: s.ats,
    scoreLabel: "",
    breakdown: buildBreakdown(s),
    insights: buildInsights(s, jobMatch.missingSkills),
    jobMatch,
    sections: buildSections(s),
    actionPlan: buildActionPlan(),
    resumeSkills: jobMatch.matchedSkills,
    jdSkills: jobMatch.matchedSkills.concat(jobMatch.missingSkills),
    skillMatchScore: s.skill,
    textSimilarityScore: s.text,
    mlPrediction: "Strong Match",
    mlMatchScore: s.ml,
    skillRoadmap: buildRoadmap(jobMatch.missingSkills),
    jobRecommendations: buildJobs(jd),
  };
}

export function fallbackJd(): string {
  return [
    "We are looking for a Senior Frontend Engineer to own design-system and product surfaces at scale.",
    "You will work with React, TypeScript, and Next.js, pair with designers in Figma, and ship accessible, animated interfaces.",
    "Required: 4+ years of modern frontend experience, strong system design, testing with Jest or Playwright, and familiarity with CI/CD.",
    "Bonus: GraphQL, micro-frontends, observability, mentoring junior engineers, and experience with responsive/mobile web.",
  ].join(" ");
}