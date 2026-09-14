import os
from pathlib import Path

import joblib
import numpy as np
import pandas as pd

from sklearn.ensemble import HistGradientBoostingRegressor
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.model_selection import KFold, cross_val_predict
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

PROJECT_ROOT = Path(__file__).resolve().parents[1]

DATA_FILE = (
    PROJECT_ROOT / "data/processed/final_resume_job_dataset_scored.csv"
)
FALLBACK_DATA_FILE = PROJECT_ROOT / "data/processed/final_resume_job_dataset.csv"

MODEL_DIR = PROJECT_ROOT / "models"

ARTIFACTS = {
    "scaler": MODEL_DIR / "scaler.pkl",
    "model": MODEL_DIR / "resume_match_model.pkl",
}


def load_training_data():
    if DATA_FILE.exists():
        print(f"Using dataset: {DATA_FILE}")
        return pd.read_csv(DATA_FILE)

    if FALLBACK_DATA_FILE.exists():
        print(f"Using fallback dataset: {FALLBACK_DATA_FILE}")
        return pd.read_csv(FALLBACK_DATA_FILE)

    raise FileNotFoundError(
        "No training dataset found. Expected one of:\n"
        f"1. {DATA_FILE}\n"
        f"2. {FALLBACK_DATA_FILE}"
    )


def count_skills(value):
    """
    Count skills from a comma-separated skill string.

    Handles NaN, empty strings and single values.
    """
    if pd.isna(value):
        return 0

    value = str(value).strip()

    if not value:
        return 0

    return len([skill for skill in value.split(",") if skill.strip()])


def engineer_features(df):
    """
    Build tabular features from the scored dataset.

    Numeric features describe skill coverage between resume and JD.
    """
    n_resume = df["extracted_resume_skills"].apply(count_skills)
    n_jd = df["extracted_jd_skills"].apply(count_skills)
    n_matched = df["matched_skills"].apply(count_skills)
    n_missing = df["missing_skills"].apply(count_skills)

    features = pd.DataFrame(
        {
            "n_resume_skills": n_resume,
            "n_jd_skills": n_jd,
            "n_matched": n_matched,
            "n_missing": n_missing,
            "matched_ratio": n_matched / n_jd.clip(lower=1),
            "missing_ratio": n_missing / n_jd.clip(lower=1),
            "coverage_of_resume": n_matched / n_resume.clip(lower=1),
        }
    )

    return features


def build_feature_matrix(df):
    """
    Stack engineered skill-coverage features with text similarity.

    text_similarity_score is a TF-IDF cosine overlap — a content signal.
    skill_match_score is deliberately excluded: it directly composes the
    target (match_score), so using it would make the ML score redundant
    with the deterministic heuristic.
    """
    numeric = engineer_features(df).values.astype(np.float64)

    text_sim = df["text_similarity_score"].values.astype(np.float64).reshape(-1, 1)

    return np.hstack([numeric, text_sim])


def build_pipeline():
    """
    Regression pipeline over dense numeric features.

    - engineered skill-count features (coverage ratios)
    - TF-IDF cosine text similarity
    - HistGradientBoostingRegressor on the scaled feature vector
    """
    model = Pipeline(
        steps=[
            ("scale", StandardScaler()),
            (
                "regressor",
                HistGradientBoostingRegressor(
                    max_iter=400,
                    learning_rate=0.06,
                    max_depth=3,
                    min_samples_leaf=2,
                    random_state=42,
                ),
            ),
        ]
    )

    return model


def train_resume_match_model():
    MODEL_DIR.mkdir(parents=True, exist_ok=True)

    df = load_training_data()

    required_columns = ["resume_text", "job_description", "match_score"]

    for col in required_columns:
        if col not in df.columns:
            raise ValueError(f"Missing required column: {col}")

    df = df.dropna(subset=["resume_text", "job_description", "match_score"])

    if df.empty:
        raise ValueError("No valid training rows found.")

    if "text_similarity_score" not in df.columns:
        raise ValueError(
            "Missing text_similarity_score column. "
            "Run batch_matcher.py first to create the scored dataset."
        )

    numeric_df = engineer_features(df)

    X = build_feature_matrix(df)

    y = df["match_score"].astype(float)

    print("\nTarget (match_score) distribution:")
    print(f"mean={y.mean():.2f}  std={y.std():.2f}  min={y.min():.2f}  max={y.max():.2f}")

    print("\nSkill coverage feature correlations with match_score:")
    print(numeric_df.corrwith(y).round(3).to_string())

    pipeline = build_pipeline()

    kfold = KFold(n_splits=5, shuffle=True, random_state=42)

    y_hat = cross_val_predict(pipeline, X, y, cv=kfold, n_jobs=-1)

    rmse = float(np.sqrt(mean_squared_error(y, y_hat)))
    r2 = float(r2_score(y, y_hat))
    pearson = float(np.corrcoef(y, y_hat)[0, 1])

    print("\nCross-validated regression evaluation:")
    print(f"RMSE: {rmse:.4f}")
    print(f"R2:   {r2:.4f}")
    print(f"Pearson r: {pearson:.4f}")

    baseline_rmse = float(np.sqrt(mean_squared_error(y, np.full_like(y, y.mean()))))
    print(f"\nBaseline (predict mean) RMSE: {baseline_rmse:.4f}")

    pipeline.fit(X, y)

    scaler = pipeline.named_steps["scale"]
    regressor = pipeline.named_steps["regressor"]

    joblib.dump(scaler, ARTIFACTS["scaler"])
    joblib.dump(regressor, ARTIFACTS["model"])

    print("\nSaved artifacts:")
    for name, path in ARTIFACTS.items():
        print(f"{name}: {path}")


if __name__ == "__main__":
    train_resume_match_model()