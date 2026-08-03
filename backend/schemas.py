from pydantic import BaseModel
from typing import List


class SkillRoadmapItem(BaseModel):
    skill: str
    category: str
    why: str
    learn: List[str]
    project: str


class IndianJobRecommendation(BaseModel):
    job_title: str
    company: str
    location: str
    experience: str
    salary: str
    skills: str
    recommendation_score: float


class ResumeAnalysisResponse(BaseModel):
    final_match_score: float
    skill_match_score: float
    text_similarity_score: float
    ml_prediction: str
    ml_match_score: float
    resume_skills: List[str]
    jd_skills: List[str]
    matched_skills: List[str]
    missing_skills: List[str]
    skill_roadmap: List[SkillRoadmapItem]
    indian_job_recommendations: List[IndianJobRecommendation]