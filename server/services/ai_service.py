import requests
import json
import logging
import time
from typing import Optional
from config.settings import get_settings
from utils.parser import extract_json_from_ai_response
from models.schemas import AIAnalysis

import re
from openai import OpenAI
from pydantic import ValidationError

logger = logging.getLogger(__name__)
settings = get_settings()

# Initialize the modern HuggingFace Router client
client = OpenAI(
    base_url="https://router.huggingface.co/v1",
    api_key=settings.HUGGINGFACE_API_KEY
)

def patch_json_data(data: Optional[dict]) -> Optional[dict]:
    """Ensures all AIAnalysis fields are present AND type-safe."""
    if not data:
        return None
        
    defaults = {
        "problem": "Analysis pending",
        "customer": "Startup audience research required",
        "market": "Market opportunity identified",
        "competitor": ["Competitor 1", "Competitor 2", "Competitor 3"],
        "tech_stack": ["Next.js", "FastAPI", "PostgreSQL", "Tailwind", "Python"],
        "risk_level": "Medium",
        "profitability_score": 50,
        "justification": "Analysis generated via fail-safe secondary engine."
    }
    
    # 1. Fill missing or empty fields
    for key, value in defaults.items():
        if key not in data or data[key] is None or data[key] == "":
            data[key] = value
    
    # 2. Force Type Casting (Pydantic is strict)
    try:
        if not isinstance(data.get("competitor"), list):
            data["competitor"] = defaults["competitor"]
        if not isinstance(data.get("tech_stack"), list):
            data["tech_stack"] = defaults["tech_stack"]
        
        # Force integer for score
        score = data.get("profitability_score")
        if isinstance(score, str):
            # Try to extract number from string like "75%" or "Score: 75"
            match = re.search(r'\d+', score)
            data["profitability_score"] = int(match.group(0)) if match else defaults["profitability_score"]
        elif not isinstance(score, (int, float)):
            data["profitability_score"] = defaults["profitability_score"]
        else:
            data["profitability_score"] = int(score)
            
        # Bound the score
        data["profitability_score"] = max(0, min(100, data["profitability_score"]))
        
    except Exception as e:
        logger.warning(f"Failed to force types in JSON patching: {e}")
            
    return data

def generate_startup_analysis(title: str, description: str, extracted_text: str = "") -> Optional[dict]:
    """Uses HF Router with few-shot prompting for high-reliability analysis."""
    
    logger.info("Engaging HF Router with Schema-Strict prompting...")
    
    # Few-Shot example to guide the model
    example_json = json.dumps({
        "problem": "Expensive food delivery",
        "customer": "College students",
        "market": "10B student market",
        "competitor": ["Uber", "DoorDash", "Local"],
        "tech_stack": ["React", "Python", "Node"],
        "risk_level": "Low",
        "profitability_score": 85,
        "justification": "Scalable model with low overhead."
    })

    user_input = f"""Analyze this startup:
Title: {title}
Description: {description}
{f'Context: {extracted_text}' if extracted_text else ''}

Return ONLY JSON matching this EXACT schema:
{{
  "problem": "string",
  "customer": "string",
  "market": "string",
  "competitor": ["list of 3"],
  "tech_stack": ["list of 5"],
  "risk_level": "Low/Medium/High",
  "profitability_score": 0-100,
  "justification": "string"
}}"""

    try:
        completion = client.chat.completions.create(
            model="openai/gpt-oss-120b:preferred",
            messages=[
                {"role": "system", "content": f"You are a startup validator. You only output valid JSON. Example: {example_json}"},
                {"role": "user", "content": user_input}
            ],
            response_format={"type": "json_object"}
        )
        
        raw_content = completion.choices[0].message.content
        logger.info(f"Raw AI Response: {raw_content[:200]}...") # Log start for debugging
        
        extracted_data = extract_json_from_ai_response(raw_content)
        return patch_json_data(extracted_data)
        
    except Exception as e:
        logger.error(f"HF Router execution failed: {e}")
        return None

def analyze_startup_idea(title: str, description: str, extracted_text: str = "") -> Optional[AIAnalysis]:
    """Main entry point for backend analysis. Ensures Pydantic validation and fail-safe patching."""
    json_data = generate_startup_analysis(title, description, extracted_text)
    
    if json_data:
        try:
            return AIAnalysis(**json_data)
        except ValidationError as e:
            logger.error(f"AIAnalysis validation error: {e.json()}")
        except Exception as e:
            logger.error(f"Unexpected error in analysis validation: {e}")
            
    return None
