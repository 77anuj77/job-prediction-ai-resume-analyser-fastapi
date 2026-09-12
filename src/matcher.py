import sys
from pathlib import Path
from typing import Dict
from src.predict_model import predict_resume_match
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

PROJECT_ROOT = Path(__file__).resolve().parents[1]
sys.path.append(str(PROJECT_ROOT))

from src.skill_extractor import (
    load_skills,
    extract_skills,
    compare_skills,
    calculate_skill_match_score,
)
from src.skill_roadmap import generate_skill_roadmap
from src.job_recommender import recommend_indian_jobs


def calculate_text_similarity(resume_text: str, job_description: str) -> float:
    """
    Calculate text similarity between resume and job description using TF-IDF.

    Returns score between 0 and 100.
    """
    if not resume_text or not job_description:
        return 0.0

    documents = [resume_text, job_description]

    vectorizer = TfidfVectorizer(
        stop_words="english",
        max_features=5000,
        ngram_range=(1, 2),
    )

    tfidf_matrix = vectorizer.fit_transform(documents)

    similarity = cosine_similarity(
        tfidf_matrix[0:1],
        tfidf_matrix[1:2],
    )[0][0]

    return round(similarity * 100, 2)


def analyze_resume_against_jd(
    resume_text: str,
    job_description: str,
    skills_file: str = "data/processed/tech_skills.csv",
) -> Dict:
    """
    Complete resume-job analysis.

    Returns:
    - resume skills
    - JD skills
    - matched skills
    - missing skills
    - skill match score
    - text similarity score
    - ML prediction
    - ML match score
    - final match score
    - skill roadmap
    - Indian job recommendations
    """
    skills_list = load_skills(skills_file)

    resume_skills = extract_skills(resume_text, skills_list)
    jd_skills = extract_skills(job_description, skills_list)

    skill_comparison = compare_skills(
        resume_skills,
        jd_skills,
    )

    skill_match_score = calculate_skill_match_score(
        resume_skills,
        jd_skills,
    )

    text_similarity_score = calculate_text_similarity(
        resume_text,
        job_description,
    )

    try:
        ml_result = predict_resume_match(
            resume_text=resume_text,
            job_description=job_description,
            resume_skills=resume_skills,
            jd_skills=jd_skills,
            matched_skills=skill_comparison["matched_skills"],
            missing_skills=skill_comparison["missing_skills"],
            text_similarity=text_similarity_score,
        )
    except Exception:
        ml_result = {
            "prediction": "model_not_available",
            "ml_match_score": 0.0,
        }

    final_score = calculate_final_match_score(
        skill_match_score,
        text_similarity_score,
        ml_result["ml_match_score"],
    )

    skill_roadmap = generate_skill_roadmap(skill_comparison["missing_skills"][:10])

    try:
        indian_job_recommendations = recommend_indian_jobs(
            resume_text=resume_text,
            resume_skills=resume_skills,
            top_n=5,
        )
    except Exception:
        indian_job_recommendations = []

    result = {
        "resume_skills": resume_skills,
        "jd_skills": jd_skills,
        "matched_skills": skill_comparison["matched_skills"],
        "missing_skills": skill_comparison["missing_skills"],
        "skill_match_score": skill_match_score,
        "text_similarity_score": text_similarity_score,
        "ml_prediction": ml_result["prediction"],
        "ml_match_score": ml_result["ml_match_score"],
        "final_match_score": final_score,
        "skill_roadmap": skill_roadmap,
        "indian_job_recommendations": indian_job_recommendations,
    }

    return result


def print_analysis_report(result: Dict) -> None:
    """
    Print clean analysis report in terminal.
    """
    print("\n" + "=" * 70)
    print("AI Resume-to-Job Analyzer Report")
    print("=" * 70)

    print(f"\nFinal ATS Match Score: {result['final_match_score']}%")
    print(f"Skill Match Score: {result['skill_match_score']}%")
    print(f"Text Similarity Score: {result['text_similarity_score']}%")

    print("\nResume Skills:")
    print(
        ", ".join(result["resume_skills"])
        if result["resume_skills"]
        else "No skills found"
    )

    print("\nJob Description Skills:")
    print(", ".join(result["jd_skills"]) if result["jd_skills"] else "No skills found")

    print("\nMatched Skills:")
    print(
        ", ".join(result["matched_skills"])
        if result["matched_skills"]
        else "No matched skills"
    )

    print("\nMissing Skills:")
    print(
        ", ".join(result["missing_skills"])
        if result["missing_skills"]
        else "No missing skills"
    )

    print("\nSkill Gap Roadmap:")
    if result["skill_roadmap"]:
        for item in result["skill_roadmap"]:
            print(f"\nSkill: {item['skill']}")
            print(f"Category: {item.get('category', 'general')}")
            print(f"Why: {item['why']}")
            print("Learn:")
            for step in item["learn"]:
                print(f"- {step}")
            print(f"Project: {item['project']}")
    else:
        print("No roadmap needed.")

    print("\nIndian Job Recommendations:")
    if result["indian_job_recommendations"]:
        for index, job in enumerate(result["indian_job_recommendations"], start=1):
            print(f"\n{index}. {job['job_title']}")
            print(f"Company: {job['company']}")
            print(f"Location: {job['location']}")
            print(f"Experience: {job['experience']}")
            print(f"Salary: {job['salary']}")
            print(f"Score: {job['recommendation_score']}%")
            print(f"Skills: {job['skills']}")
    else:
        print("No Indian job recommendations found.")


def calculate_final_match_score(
    skill_match_score: float,
    text_similarity_score: float,
    ml_match_score: float = 0.0,
) -> float:
    """
    Calculate final ATS-style score.

    Weightage:
    - 50% skill match
    - 25% TF-IDF text similarity
    - 25% ML model score
    """
    final_score = (
        0.50 * skill_match_score + 0.25 * text_similarity_score + 0.25 * ml_match_score
    )
    return round(final_score, 2)


if __name__ == "__main__":
    sample_resume = """
    I am an AI ML student with skills in Python, SQL, Pandas, NumPy,
    Machine Learning, Scikit-learn, Streamlit, FastAPI, GitHub and Docker.
    I have built projects in data analysis and machine learning.
    """

    sample_jd = """
    We are hiring a Machine Learning Engineer Intern.
    Required skills include Python, SQL, Pandas, NumPy, Scikit-learn,
    FastAPI, Docker, AWS, Machine Learning and GitHub.
    Experience with deployment and REST API is preferred.
    """

    analysis = analyze_resume_against_jd(
        sample_resume,
        sample_jd,
    )

    print_analysis_report(analysis)
