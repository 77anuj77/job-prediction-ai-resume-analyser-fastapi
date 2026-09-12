import sys
from pathlib import Path

import pandas as pd

PROJECT_ROOT = Path(__file__).resolve().parents[1]
sys.path.append(str(PROJECT_ROOT))

from src.matcher import analyze_resume_against_jd


INPUT_FILE = "data/processed/final_resume_job_dataset.csv"
OUTPUT_FILE = "data/processed/final_resume_job_dataset_scored.csv"


def list_to_string(items):
    """
    Convert list of skills to comma-separated string.
    """
    if not items:
        return ""

    return ", ".join(items)


def score_dataset(input_file: str = INPUT_FILE, output_file: str = OUTPUT_FILE):
    """
    Apply resume-job matching on the full processed dataset.
    """
    df = pd.read_csv(input_file)

    required_columns = ["resume_text", "job_description"]

    for col in required_columns:
        if col not in df.columns:
            raise ValueError(f"Missing required column: {col}")

    extracted_resume_skills = []
    extracted_jd_skills = []
    matched_skills = []
    missing_skills = []
    match_scores = []
    skill_scores = []
    similarity_scores = []

    for index, row in df.iterrows():
        resume_text = str(row["resume_text"])
        job_description = str(row["job_description"])

        result = analyze_resume_against_jd(
            resume_text,
            job_description,
        )

        extracted_resume_skills.append(list_to_string(result["resume_skills"]))
        extracted_jd_skills.append(list_to_string(result["jd_skills"]))
        matched_skills.append(list_to_string(result["matched_skills"]))
        missing_skills.append(list_to_string(result["missing_skills"]))
        match_scores.append(result["final_match_score"])
        skill_scores.append(result["skill_match_score"])
        similarity_scores.append(result["text_similarity_score"])

        if (index + 1) % 50 == 0:
            print(f"Processed {index + 1} rows...")

    df["extracted_resume_skills"] = extracted_resume_skills
    df["extracted_jd_skills"] = extracted_jd_skills
    df["matched_skills"] = matched_skills
    df["missing_skills"] = missing_skills
    df["match_score"] = match_scores
    df["skill_match_score"] = skill_scores
    df["text_similarity_score"] = similarity_scores

    df.to_csv(output_file, index=False)

    print(f"\nScored dataset saved at: {output_file}")
    print(f"Final shape: {df.shape}")

    return df


if __name__ == "__main__":
    scored_df = score_dataset()
    print(scored_df.head())