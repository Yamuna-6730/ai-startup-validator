from fastapi import APIRouter, UploadFile, File, Form, HTTPException, status
from typing import List, Optional
from models.schemas import IdeaResponse, AIAnalysis
from services.ocr_service import extract_text_by_type
from services.ai_service import analyze_startup_idea
from services.db_service import db_service
from config.settings import get_settings
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/ideas", tags=["Ideas"])
settings = get_settings()

@router.post("/", response_model=IdeaResponse)
async def create_idea(
    title: str = Form(...),
    description: str = Form(...),
    file: Optional[UploadFile] = File(None)
):
    extracted_text = ""
    
    if file:
        # Check file size
        file_content = await file.read()
        if len(file_content) > settings.MAX_FILE_SIZE:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail=f"File too large. Maximum size is {settings.MAX_FILE_SIZE // (1024 * 1024)}MB"
            )
        
        # Extract text
        extracted_text = extract_text_by_type(file.filename, file_content)
        if extracted_text is None:
            logger.warning(f"Could not extract text from file: {file.filename}")
            extracted_text = ""

    # Call AI Service
    ai_report = analyze_startup_idea(title, description, extracted_text)
    
    if not ai_report:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="AI Service failed to generate an analysis. Please try again."
        )

    # Prepare data for Supabase
    db_data = {
        "title": title,
        "description": description,
        "extracted_text": extracted_text,
        "ai_report": ai_report.model_dump()
    }

    # Save to Supabase
    saved_idea = await db_service.create_idea(db_data)
    
    if not saved_idea:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to save idea to database."
        )

    return saved_idea

@router.get("/", response_model=List[IdeaResponse])
async def list_ideas():
    return await db_service.get_ideas()

@router.get("/{id}", response_model=IdeaResponse)
async def get_idea(id: str):
    idea = await db_service.get_idea_by_id(id)
    if not idea:
        raise HTTPException(status_code=404, detail="Idea not found")
    return idea

@router.delete("/{id}")
async def delete_idea(id: str):
    success = await db_service.delete_idea(id)
    if not success:
        raise HTTPException(status_code=404, detail="Idea not found or could not be deleted")
    return {"message": "Idea deleted successfully"}
