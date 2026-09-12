import re


def clean_job_description(text: str) -> str:
    """
    Clean job description text.
    """
    if not text:
        return ""

    text = text.lower()

    # Remove URLs
    text = re.sub(r"http\S+|www\S+", " ", text)

    # Remove emails
    text = re.sub(r"\S+@\S+", " ", text)

    # Keep useful programming symbols like c++, c#, node.js
    text = re.sub(r"[^a-zA-Z0-9+#.\s]", " ", text)

    # Remove extra spaces
    text = re.sub(r"\s+", " ", text).strip()

    return text


def parse_job_description(jd_text: str) -> str:
    """
    Parse and clean job description text.
    """
    return clean_job_description(jd_text)


if __name__ == "__main__":
    sample_jd = """
    We are hiring a Machine Learning Engineer.
    Required skills: Python, Pandas, NumPy, Scikit-learn, FastAPI, Docker, SQL.
    Good to have: AWS, GitHub, Streamlit.
    """

    cleaned_jd = parse_job_description(sample_jd)

    print("\nCleaned Job Description:\n")
    print(cleaned_jd)