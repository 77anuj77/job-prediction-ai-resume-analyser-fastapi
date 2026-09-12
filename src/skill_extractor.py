import os
import re
from typing import List, Set, Dict

import pandas as pd


SKILLS_FILE = "data/processed/cleaned_skills.csv"


def clean_text(text: str) -> str:
    """
    Clean text before skill extraction.
    """
    if not text:
        return ""

    text = str(text).lower()
    text = re.sub(r"[^a-zA-Z0-9+#.\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()

    return text

def load_skills(skills_file: str = SKILLS_FILE) -> List[str]:
    """
    Load cleaned skills from CSV.
    """
    if not os.path.exists(skills_file):
        raise FileNotFoundError(f"Skills file not found: {skills_file}")

    skills_df = pd.read_csv(skills_file)

    if "skill" not in skills_df.columns:
        raise ValueError("cleaned_skills.csv must contain a 'skill' column.")

    skills = skills_df["skill"].dropna().astype(str).str.lower().unique().tolist()

    # Remove noisy skills
    skills = [
        skill.strip()
        for skill in skills
        if len(skill.strip()) >= 2
        and not skill.strip().startswith(".")
        and not re.fullmatch(r"[0-9.]+", skill.strip())
    ]

    # Sort longer skills first so "machine learning" matches before "learning"
    skills = sorted(skills, key=len, reverse=True)

    return skills


def extract_skills(text: str, skills_list: List[str]) -> List[str]:
    """
    Extract skills from text using a skill dictionary.

    Example:
    text = "I know python, machine learning and sql"
    output = ["machine learning", "python", "sql"]
    """
    cleaned_text = clean_text(text)
    found_skills: Set[str] = set()

    for skill in skills_list:
        skill = skill.strip().lower()

        if not skill:
            continue

        # Escape special characters like c++, c#, node.js
        escaped_skill = re.escape(skill)

        # Match complete skill phrase
        pattern = r"(?<![a-zA-Z0-9+#.])" + escaped_skill + r"(?![a-zA-Z0-9+#.])"

        if re.search(pattern, cleaned_text):
            found_skills.add(skill)

    return sorted(found_skills)


def compare_skills(resume_skills: List[str], jd_skills: List[str]) -> Dict[str, List[str]]:
    """
    Compare resume skills and job description skills.
    """
    resume_set = set(resume_skills)
    jd_set = set(jd_skills)

    matched_skills = sorted(resume_set.intersection(jd_set))
    missing_skills = sorted(jd_set.difference(resume_set))

    return {
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
    }


def calculate_skill_match_score(resume_skills: List[str], jd_skills: List[str]) -> float:
    """
    Calculate skill match score.

    Formula:
    matched skills / required JD skills * 100
    """
    if not jd_skills:
        return 0.0

    resume_set = set(resume_skills)
    jd_set = set(jd_skills)

    matched_count = len(resume_set.intersection(jd_set))
    total_required = len(jd_set)

    score = (matched_count / total_required) * 100

    return round(score, 2)


if __name__ == "__main__":
    skills_list = load_skills()

    sample_resume = """
    I am a data science student with knowledge of Python, SQL,
    Pandas, NumPy, Machine Learning, GitHub and Streamlit.
    I have built projects using FastAPI.
    """

    sample_jd = """
    We are looking for a Machine Learning Engineer with Python,
    SQL, FastAPI, Docker, AWS, Scikit-learn and Pandas.
    """

    resume_skills = extract_skills(sample_resume, skills_list)
    jd_skills = extract_skills(sample_jd, skills_list)

    result = compare_skills(resume_skills, jd_skills)
    score = calculate_skill_match_score(resume_skills, jd_skills)

    print("\nResume Skills:")
    print(resume_skills)

    print("\nJD Skills:")
    print(jd_skills)

    print("\nMatched Skills:")
    print(result["matched_skills"])

    print("\nMissing Skills:")
    print(result["missing_skills"])

    print("\nSkill Match Score:")
    print(score)  