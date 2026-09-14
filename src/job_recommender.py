import os
import sys
from pathlib import Path
from typing import Dict, List

import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


PROJECT_ROOT = Path(__file__).resolve().parents[1]
sys.path.append(str(PROJECT_ROOT))


NAUKRI_JOBS_FILE = "data/processed/cleaned_naukri_jobs.csv"


def load_naukri_jobs(file_path: str = NAUKRI_JOBS_FILE) -> pd.DataFrame:
    """
    Load cleaned Indian/Naukri jobs dataset.
    """
    if not os.path.exists(file_path):
        raise FileNotFoundError(
            f"Naukri jobs file not found: {file_path}. "
            "Run the data cleaning script first."
        )

    df = pd.read_csv(file_path)

    if "combined_job_text" not in df.columns:
        raise ValueError("cleaned_naukri_jobs.csv must contain combined_job_text column.")

    return df


def recommend_indian_jobs(
    resume_text: str,
    resume_skills: List[str],
    top_n: int = 5,
    jobs_file: str = NAUKRI_JOBS_FILE,
) -> List[Dict]:
    """
    Recommend top Indian jobs using resume text + extracted resume skills.
    """
    jobs_df = load_naukri_jobs(jobs_file)

    jobs_df = jobs_df.dropna(subset=["combined_job_text"]).copy()

    if jobs_df.empty:
        return []

    resume_profile_text = resume_text + " " + " ".join(resume_skills)

    documents = [resume_profile_text] + jobs_df["combined_job_text"].astype(str).tolist()

    vectorizer = TfidfVectorizer(
        stop_words="english",
        max_features=10000,
        ngram_range=(1, 2),
    )

    tfidf_matrix = vectorizer.fit_transform(documents)

    resume_vector = tfidf_matrix[0:1]
    job_vectors = tfidf_matrix[1:]

    similarity_scores = cosine_similarity(resume_vector, job_vectors).flatten()

    jobs_df["recommendation_score"] = similarity_scores * 100

    top_jobs = jobs_df.sort_values(
        by="recommendation_score",
        ascending=False,
    ).head(top_n)

    recommendations = []

    for _, row in top_jobs.iterrows():
        recommendations.append(
            {
                "job_title": str(row.get("job_title", "")),
                "company": str(row.get("company", "")),
                "location": str(row.get("location", "")),
                "experience": str(row.get("experience", "")),
                "salary": str(row.get("salary", "")),
                "skills": str(row.get("skills", "")),
                "recommendation_score": round(float(row.get("recommendation_score", 0.0)), 2),
            }
        )

    return recommendations


if __name__ == "__main__":
    sample_resume_text = """
    I am an AI ML student skilled in python, sql, pandas, numpy,
    machine learning, fastapi, streamlit, github and docker.
    """

    sample_resume_skills = [
        "python",
        "sql",
        "pandas",
        "numpy",
        "machine learning",
        "fastapi",
        "streamlit",
        "github",
        "docker",
    ]

    jobs = recommend_indian_jobs(
        resume_text=sample_resume_text,
        resume_skills=sample_resume_skills,
        top_n=5,
    )

    print("\nTop Indian Job Recommendations:\n")

    for idx, job in enumerate(jobs, start=1):
        print(f"{idx}. {job['job_title']}")
        print(f"   Company: {job['company']}")
        print(f"   Location: {job['location']}")
        print(f"   Experience: {job['experience']}")
        print(f"   Salary: {job['salary']}")
        print(f"   Score: {job['recommendation_score']}%")
        print(f"   Skills: {job['skills']}")
        print()