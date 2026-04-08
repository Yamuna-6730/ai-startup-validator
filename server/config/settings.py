from pydantic_settings import BaseSettings
from functools import lru_cache
import os

class Settings(BaseSettings):
    APP_NAME: str = "Startup Idea Validator"
    DEBUG: bool = True
    
    # API Keys (Optional with defaults to prevent initialization crashes)
    OPENROUTER_API_KEY: str = ""
    HUGGINGFACE_API_KEY: str = ""
    SUPABASE_URL: str = ""
    SUPABASE_KEY: str = ""
    
    # Model Configuration
    HF_MODEL_ID: str = "Qwen/Qwen2.5-7B-Instruct"
    
    # Limits
    MAX_FILE_SIZE: int = 5 * 1024 * 1024  # 5MB
    MAX_OCR_CHARS: int = 2000
    
    # CORS
    ALLOWED_ORIGINS: list[str] = ["*"]
    
    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    return Settings()
