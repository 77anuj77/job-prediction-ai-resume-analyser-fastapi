import re
from pathlib import Path

import pdfplumber
import pytesseract
from pdf2image import convert_from_path


def clean_resume_text(text: str) -> str:
    """
    Clean extracted resume text.
    """
    if not text:
        return ""

    text = text.lower()

    # Remove URLs
    text = re.sub(r"http\S+|www\S+", " ", text)

    # Remove emails
    text = re.sub(r"\S+@\S+", " ", text)

    # Remove phone numbers
    text = re.sub(r"\+?\d[\d\s\-()]{7,}\d", " ", text)

    # Keep useful programming symbols like c++, c#, node.js
    text = re.sub(r"[^a-zA-Z0-9+#.\s]", " ", text)

    # Remove extra spaces
    text = re.sub(r"\s+", " ", text).strip()

    return text


def extract_text_with_pdfplumber(pdf_path: str) -> str:
    """
    Extract text from normal/selectable-text PDF using pdfplumber.
    """
    extracted_text = ""

    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()

            if page_text:
                extracted_text += page_text + " "

    return extracted_text


def extract_text_with_ocr(pdf_path: str) -> str:
    """
    Extract text from scanned/image-based PDF using OCR.
    """
    extracted_text = ""

    # Convert PDF pages into images
    pages = convert_from_path(pdf_path, dpi=300)

    for page_number, page_image in enumerate(pages, start=1):
        page_text = pytesseract.image_to_string(page_image)

        if page_text:
            extracted_text += page_text + " "

    return extracted_text


def extract_text_from_pdf(pdf_path: str, min_text_length: int = 100) -> str:
    """
    Extract text from resume PDF.

    First tries pdfplumber.
    If text is too short, it uses OCR fallback.
    """
    pdf_file = Path(pdf_path)

    if not pdf_file.exists():
        raise FileNotFoundError(f"PDF file not found: {pdf_path}")

    # Step 1: Try normal text extraction
    text = extract_text_with_pdfplumber(str(pdf_file))

    # Step 2: If text is too small, use OCR
    if len(text.strip()) < min_text_length:
        print("Normal PDF text extraction failed or extracted very little text.")

        try:
            print("Using OCR fallback...")
            text = extract_text_with_ocr(str(pdf_file))
        except Exception as e:
            print(f"OCR fallback failed: {e}")
            text = text.strip() or ""

    return clean_resume_text(text)


if __name__ == "__main__":
    sample_pdf_path = "data/sample/sample_resume.pdf"

    text = extract_text_from_pdf(sample_pdf_path)

    print("\nExtracted Resume Text:\n")
    print(text[:2000])
