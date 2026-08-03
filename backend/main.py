import os
import sys
import tempfile
from pathlib import Path

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

PROJECT_ROOT = Path(__file__).resolve().parents[1]
sys.path.append(str(PROJECT_ROOT))

from src.resume_parser import extract_text_from_pdf
from src.matcher import analyze_resume_against_jd
from backend.schemas import ResumeAnalysisResponse


app = FastAPI(
    title="AI Resume-to-Job Analyzer API",
    description=(
        "API for analyzing resume match against a job description, "
        "generating skill gap roadmap, and recommending Indian jobs."
    ),
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "AI Resume-to-Job Analyzer API is running",
        "features": [
            "Resume PDF parsing",
            "Resume-JD match score",
            "Skill extraction",
            "Missing skills detection",
            "Skill gap roadmap",
            "Indian job recommendations",
        ],
        "docs": "/docs",
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
    }


@app.post("/analyze", response_model=ResumeAnalysisResponse)
async def analyze_resume(
    resume_file: UploadFile = File(...),
    job_description: str = Form(...),
):
    """
    Analyze uploaded resume PDF against a job description.

    Input:
    - resume_file: PDF resume
    - job_description: pasted job description text

    Output:
    - final match score
    - skill match score
    - text similarity score
    - resume skills
    - JD skills
    - matched skills
    - missing skills
    - skill roadmap
    - Indian job recommendations
    """

    if not resume_file.filename:
        raise HTTPException(
            status_code=400,
            detail="Resume file is required.",
        )

    if not resume_file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are supported.",
        )

    if not job_description or len(job_description.strip()) < 20:
        raise HTTPException(
            status_code=400,
            detail="Job description is too short. Please provide a valid JD.",
        )

    temp_pdf_path = None

    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
            temp_file.write(await resume_file.read())
            temp_pdf_path = temp_file.name

        resume_text = extract_text_from_pdf(temp_pdf_path)

        if not resume_text or len(resume_text.strip()) < 20:
            raise HTTPException(
                status_code=400,
                detail=(
                    "Could not extract enough text from resume PDF. "
                    "Please upload a text-based resume PDF."
                ),
            )

        result = analyze_resume_against_jd(
            resume_text=resume_text,
            job_description=job_description,
        )

        return ResumeAnalysisResponse(
            final_match_score=result.get("final_match_score", 0.0),
            skill_match_score=result.get("skill_match_score", 0.0),
            text_similarity_score=result.get("text_similarity_score", 0.0),
            ml_prediction=result.get("ml_prediction", "model_not_available"),
            ml_match_score=result.get("ml_match_score", 0.0),
            resume_skills=result.get("resume_skills", []),
            jd_skills=result.get("jd_skills", []),
            matched_skills=result.get("matched_skills", []),
            missing_skills=result.get("missing_skills", []),
            skill_roadmap=result.get("skill_roadmap", []),
            indian_job_recommendations=result.get(
                "indian_job_recommendations",
                [],
            ),
        )

    except HTTPException:
        raise

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(error)}",
        )

    finally:
        if temp_pdf_path and os.path.exists(temp_pdf_path):
            os.remove(temp_pdf_path)