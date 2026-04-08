from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from uuid import UUID

class AIAnalysis(BaseModel):
    problem: str
    customer: str
    market: str
    competitor: List[str] = Field(..., description="Exactly 3 competitors with one-line differentiation")
    tech_stack: List[str] = Field(..., description="4-6 technologies")
    risk_level: str
    profitability_score: int = Field(..., ge=0, le=100)
    justification: str

class IdeaCreate(BaseModel):
    title: str
    description: str

class IdeaResponse(BaseModel):
    id: UUID
    title: str
    description: str
    extracted_text: Optional[str] = None
    ai_report: Optional[AIAnalysis] = None
    created_at: datetime

    class Config:
        from_attributes = True
