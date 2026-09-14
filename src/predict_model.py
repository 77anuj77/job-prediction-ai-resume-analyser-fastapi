from pathlib import Path

import joblib
import numpy as np

PROJECT_ROOT = Path(__file__).resolve().parents[1]

MODEL_FILE = PROJECT_ROOT / "models/resume_match_model.pkl"
SCALER_FILE = PROJECT_ROOT / "models/scaler.pkl"

# Regression score -> prediction label thresholds
HIGH_MATCH_THRESHOLD = 60.0
MEDIUM_MATCH_THRESHOLD = 25.0

# Order must match train_model.engineer_features() + text similarity
FEATURE_NAMES = [
    "n_resume_skills",
    "n_jd_skills",
    "n_matched",
    "n_missing",
    "matched_ratio",
    "missing_ratio",
    "coverage_of_resume",
    "text_similarity",
]


def _load_artifacts():
    scaler = joblib.load(SCALER_FILE)
    model = joblib.load(MODEL_FILE)
    return scaler, model


def _count_skills(value):
    if not value:
        return 0
    return len([skill for skill in str(value).split(",") if skill.strip()])


def _engineer_features(resume_skills, jd_skills, matched_skills, missing_skills, text_similarity):
    n_resume = _count_skills(resume_skills)
    n_jd = _count_skills(jd_skills)
    n_matched = _count_skills(matched_skills)
    n_missing = _count_skills(missing_skills)

    n_jd_safe = max(n_jd, 1)
    n_resume_safe = max(n_resume, 1)

    feature_vector = np.array(
        [
            n_resume,
            n_jd,
            n_matched,
            n_missing,
            n_matched / n_jd_safe,
            n_missing / n_jd_safe,
            n_matched / n_resume_safe,
            float(text_similarity or 0.0),
        ],
        dtype=np.float64,
    )

    return feature_vector.reshape(1, -1)


def predict_resume_match(
    resume_text: str,
    job_description: str,
    resume_skills: list = None,
    jd_skills: list = None,
    matched_skills: list = None,
    missing_skills: list = None,
    text_similarity: float = None,
):
    """
    Predict resume-job match using a trained gradient boosting regressor
    on engineered skill-coverage features and TF-IDF text similarity.

    Falls back to raw TF-IDF cosine similarity when model artifacts
    are not available (e.g. fresh clone before training).

    Returns:
    - prediction: high_match / medium_match / low_match
    - ml_match_score: predicted relevance score in 0-100
    """
    if not resume_text or not job_description:
        return {
            "prediction": "insufficient_text",
            "ml_match_score": 0.0,
        }

    try:
        scaler, model = _load_artifacts()
    except FileNotFoundError:
        return _cosine_fallback(resume_text, job_description)

    matched = matched_skills or []
    jd = jd_skills or []

    features = _engineer_features(
        resume_skills or [],
        jd,
        matched,
        missing_skills or [],
        text_similarity,
    )
    features_scaled = scaler.transform(features)

    raw_score = float(model.predict(features_scaled)[0])

    # Domain rule: with zero skill overlap and near-zero text similarity,
    # never report even a medium match (guards against out-of-distribution
    # extrapolation when a resume shares no tokens with the JD).
    if len(matched) == 0 and float(text_similarity or 0.0) < 10.0:
        raw_score = min(raw_score, MEDIUM_MATCH_THRESHOLD - 1.0)

    ml_match_score = round(float(np.clip(raw_score, 0.0, 100.0)), 2)

    if ml_match_score >= HIGH_MATCH_THRESHOLD:
        prediction = "high_match"
    elif ml_match_score >= MEDIUM_MATCH_THRESHOLD:
        prediction = "medium_match"
    else:
        prediction = "low_match"

    return {
        "prediction": prediction,
        "ml_match_score": ml_match_score,
    }


def _cosine_fallback(resume_text: str, job_description: str):
    """
    Fallback when trained artifacts are missing.

    Acts as a simple TF-IDF cosine similarity baseline.
    """
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.metrics.pairwise import cosine_similarity

    vec = TfidfVectorizer(
        stop_words="english",
        max_features=5000,
        ngram_range=(1, 2),
    )
    matrix = vec.fit_transform([resume_text, job_description])
    score = cosine_similarity(matrix[0:1], matrix[1:2])[0][0]
    score = round(float(score) * 100, 2)

    if score >= 70:
        pred = "high_match"
    elif score >= 40:
        pred = "medium_match"
    else:
        pred = "low_match"

    return {"prediction": pred, "ml_match_score": score}


if __name__ == "__main__":
    from src.skill_extractor import (
        load_skills,
        extract_skills,
        compare_skills,
    )

    sample_resume = """
    Python developer with machine learning, pandas, SQL, FastAPI and Docker projects.
    """

    sample_jd = """
    Looking for machine learning intern with Python, SQL, FastAPI, Docker and scikit-learn.
    """

    skills_list = load_skills(str(PROJECT_ROOT / "data/processed/tech_skills.csv"))
    r_skills = extract_skills(sample_resume, skills_list)
    j_skills = extract_skills(sample_jd, skills_list)
    cmp = compare_skills(r_skills, j_skills)

    result = predict_resume_match(
        sample_resume,
        sample_jd,
        resume_skills=r_skills,
        jd_skills=j_skills,
        matched_skills=cmp["matched_skills"],
        missing_skills=cmp["missing_skills"],
    )

    print(result)