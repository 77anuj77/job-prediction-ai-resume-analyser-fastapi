export type Severity = "good" | "warn" | "bad" | "accent";

export interface BreakdownItem {
  id: string;
  category: string;
  score: number; // 0-100
  hint?: string;
}

export interface Insight {
  id: string;
  kind: "strength" | "weakness" | "missing-skill" | "missing-keyword" | "formatting" | "recommendation";
  title: string;
  description: string;
  severity: Severity;
}

export interface KeywordCompare {
  keyword: string;
  inResume: boolean;
  importance: "high" | "medium" | "low";
}

export interface JobMatch {
  matchPercent: number;
  matchedSkills: string[];
  missingSkills: string[];
  keywordComparison: KeywordCompare[];
  recommendedSkills: string[];
}

export interface SectionFeedback {
  note: string;
  detail: string;
  severity: Severity;
}

export interface SectionScore {
  id: string;
  label: string;
  score: number; // 0-100
  present: boolean;
  feedback: SectionFeedback[];
}

export interface ActionItem {
  step: number;
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  effort: "low" | "medium" | "high";
}

export interface JobRecommendation {
  job_title: string;
  company: string;
  location: string;
  experience: string;
  salary: string;
  recommendation_score: number;
}

export interface ResumeAnalysis {
  id: string;
  filename: string;
  candidateName: string;
  targetTitle: string;
  date: string; // ISO
  atsScore: number;
  scoreLabel: string;
  breakdown: BreakdownItem[];
  insights: Insight[];
  jobMatch: JobMatch;
  sections: SectionScore[];
  actionPlan: ActionItem[];
  resumeSkills: string[];
  jdSkills: string[];
  skillMatchScore: number;
  textSimilarityScore: number;
  mlPrediction: string;
  mlMatchScore: number;
  skillRoadmap: { skill: string; why: string; learn: string[]; project: string }[];
  jobRecommendations: JobRecommendation[];
}

export interface HistoryEntry {
  id: string;
  filename: string;
  candidateName: string;
  date: string;
  atsScore: number;
  targetTitle: string;
  improvement: number | null;
}

export interface ApiAnalysisResponse {
  final_match_score: number;
  skill_match_score: number;
  text_similarity_score: number;
  ml_prediction: string;
  ml_match_score: number;
  resume_skills: string[];
  jd_skills: string[];
  matched_skills: string[];
  missing_skills: string[];
  skill_roadmap: {
    skill: string;
    category: string;
    why: string;
    learn: string[];
    project: string;
  }[];
  indian_job_recommendations: {
    job_title: string;
    company: string;
    location: string;
    experience: string;
    salary: string;
    skills: string;
    recommendation_score: number;
  }[];
}