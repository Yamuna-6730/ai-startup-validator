import pdfplumber
import docx
from PIL import Image
import pytesseract
import io
import logging
from typing import Optional
from config.settings import get_settings
from utils.parser import clean_text

logger = logging.getLogger(__name__)
settings = get_settings()

def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extracts text from a PDF file using pdfplumber."""
    try:
        text = ""
        with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
        return clean_text(text)[:settings.MAX_OCR_CHARS]
    except Exception as e:
        logger.error(f"Error extracting text from PDF: {e}")
        return ""

def extract_text_from_docx(file_bytes: bytes) -> str:
    """Extracts text from a DOCX file using python-docx."""
    try:
        doc = docx.Document(io.BytesIO(file_bytes))
        text = "\n".join([paragraph.text for paragraph in doc.paragraphs])
        return clean_text(text)[:settings.MAX_OCR_CHARS]
    except Exception as e:
        logger.error(f"Error extracting text from DOCX: {e}")
        return ""

def extract_text_from_image(file_bytes: bytes) -> str:
    """Extracts text from an image using pytesseract."""
    try:
        image = Image.open(io.BytesIO(file_bytes))
        text = pytesseract.image_to_string(image)
        return clean_text(text)[:settings.MAX_OCR_CHARS]
    except Exception as e:
        logger.error(f"Error extracting text from image: {e}")
        return ""

def extract_text_by_type(filename: str, file_bytes: bytes) -> Optional[str]:
    """Helper to route extraction based on file extension."""
    ext = filename.split('.')[-1].lower()
    
    if ext == 'pdf':
        return extract_text_from_pdf(file_bytes)
    elif ext in ['docx', 'doc']:
        return extract_text_from_docx(file_bytes)
    elif ext in ['png', 'jpg', 'jpeg', 'webp', 'bmp']:
        return extract_text_from_image(file_bytes)
    else:
        logger.warning(f"Unsupported file type: {ext}")
        return None
